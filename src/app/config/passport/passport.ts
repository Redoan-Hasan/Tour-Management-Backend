import bycrypt from "bcryptjs";
import { User } from "./../../modules/user/user.model";
import passport from "passport";
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";

import envVars from "../env";
import { IsActive, Role } from "../../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, {
            message: "Email not found in Google profile",
          });
        }
        let isUserExist = await User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "Please verify your email" });
        }
        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `Your account is ${isUserExist.isActive}`,
          });
        }
        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "Your account is deleted" });
        }
        if (!isUserExist) {
          isUserExist = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                providerId: profile.id,
                provider: "google",
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          // return done( "user does not exist" );
          return done(null, false, { message: "user does not exist" });
        }
        if (!isUserExist.isVerified) {
          return done(null, false, { message: "Please verify your email" });
        }
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, {
            message: `Your account is ${isUserExist.isActive}`,
          });
        }
        if (isUserExist.isDeleted) {
          return done(null, false, { message: "Your account is deleted" });
        }
        // const isGoogleAuthenticated = isUserExist.auths[0]?.provider === "google";
        const isGoogleAuthenticated = isUserExist.auths.some(
          (auth) => auth.provider === "google"
        );
        if (isGoogleAuthenticated && !isUserExist.password) {
          // return done("Please login using google");
          return done(null, false, { message: "Please login using google" });
        }
        const isPasswordMatched = await bycrypt.compare(
          password,
          isUserExist.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});
passport.deserializeUser(
  async (
    id: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
