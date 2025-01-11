import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARS = {
    // khai bao cac bien moi truong
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV
};
