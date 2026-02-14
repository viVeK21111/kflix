// middleware/optionalAuth.js
import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        
        if (!token) {
            // No token, continue without user
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        if (!decoded) {
            req.user = null;
            return next();
        }

        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in optionalAuth middleware: ", error.message);
        req.user = null;
        next();
    }
};