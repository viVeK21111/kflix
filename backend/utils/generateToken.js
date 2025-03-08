import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
console.log("jwt secret"+process.env.JWT_SECRET)

export const generateToken = (userId,res) => {
    const token = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: "15d"
    });
    res.cookie("token",token,{
    maxAge: 15*24*60*60*1000, // in milliseconds
    httpOnly: true, // prevent xss attacks (cross site scripting)
    secure: true, // send cookie only in https (true in deployment)
    sameSite: 'none',
    });
}