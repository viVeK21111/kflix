import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId,res) => {
    const token = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: "15d"
    });
    res.cookie("token",token,{
    maxAge: 15*24*60*60*1000, // in milliseconds
    httpOnly: true, // prevent xss attacks (cross site scripting)
    secure: true,
    sameSite: 'none',
    path : '/',
    });
    
    const cookieOptions = `Max-Age=${15*24*60*60}; Path=/; HttpOnly; Secure; SameSite=None`;
    res.setHeader('Set-Cookie', [`token=${token}; ${cookieOptions}`]);
}