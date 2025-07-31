import dotenv from 'dotenv';
import { IEnvVars } from './envVarInterface';
dotenv.config();

const loadEnvVars = () : IEnvVars => {
    const requiredEnvs:string[] = ['PORT', 'DB_URL', 'NODE_ENV' , 'JWT_ACCESS_TOKEN_SECRET','JWT_ACCESS_TOKEN_EXPIRES_IN','BYCRYPT_SALT_ROUNDS','SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD','JWT_REFRESH_TOKEN_EXPIRES_IN', 'JWT_REFRESH_TOKEN_EXPIRES_IN','GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','GOOGLE_CALLBACK_URL', 'EXPRESS_SESSION_SECRET', 'FRONTEND_URL'
    ];
    requiredEnvs.forEach(envVar =>{
        if(!process.env[envVar]){
            throw new Error(`Missing environment variable ${envVar}`);
        }
    })
    return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    BYCRYPT_SALT_ROUNDS:Number(process.env.BYCRYPT_SALT_ROUNDS),
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
}
}

const envVars:IEnvVars = loadEnvVars();
export default envVars;