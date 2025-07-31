export interface IEnvVars {
PORT : string;
DB_URL : string;
NODE_ENV : "development" | "production";
JWT_ACCESS_TOKEN_SECRET : string;
JWT_ACCESS_TOKEN_EXPIRES_IN : string;
JWT_REFRESH_TOKEN_SECRET : string;
JWT_REFRESH_TOKEN_EXPIRES_IN : string;
BYCRYPT_SALT_ROUNDS: number;
SUPER_ADMIN_EMAIL : string;
SUPER_ADMIN_PASSWORD: string;
GOOGLE_CLIENT_ID: string;
GOOGLE_CLIENT_SECRET: string;
GOOGLE_CALLBACK_URL: string;
EXPRESS_SESSION_SECRET: string;
FRONTEND_URL: string;
}