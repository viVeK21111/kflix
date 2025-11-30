import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = async (req,res,next) => {
    const token = req.cookies['token'];
    try{
        if(!token) {
            return res.status(401).json({success:false,message:"not authorized"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({success:false,message:"token not valid"});
        }
        const currentUser = await User.findById(decoded.id).select('-password');
        if(!currentUser) {
            return res.status(401).json({success:false,message:"user not found"});
        }
        req.user = currentUser;
        next();
    }
    catch(error) {
        console.log("Error in protectRoute middleware: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}