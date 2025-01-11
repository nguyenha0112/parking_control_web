import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenandsetcookie = (userid,res) =>{
    // generate token
    const token = jwt.sign({id: userid}, ENV_VARS.JWT_SECRET, {
        expiresIn: '15d',

    });
    res.cookie("jwt-netflix", token, {
        maxAge: 15*24*60*60*1000 ,// in 15 day
        httpOnly: true, // prevent xss attack
        sameSite: "strict",// csrf attack
        secure: ENV_VARS.NODE_ENV !== 'development' // https,
    });
    return token;
}