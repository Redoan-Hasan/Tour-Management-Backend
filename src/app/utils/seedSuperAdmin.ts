import bycrypt  from 'bcryptjs';
import envVars from "../config/env";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface';

/* eslint-disable no-console */
export const seedSuperAdmin = async() =>{
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("super admin already exist");
            return;
        }
        const hashedPassword = await bycrypt. hash(envVars.SUPER_ADMIN_PASSWORD, envVars.BYCRYPT_SALT_ROUNDS);
        const authProvider : IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        const payload : IUser = {
            name:"Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auths: [authProvider]
        }
        await User.create(payload);
        console.log('super admin seeded');
    } catch (error) {
        console.log(error);
    }
}