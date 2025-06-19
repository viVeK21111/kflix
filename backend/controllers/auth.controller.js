import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Google Auth0 login: redirect to Auth0 authorize URL
globalThis.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
globalThis.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
globalThis.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
globalThis.AUTH0_CALLBACK_URL = process.env.AUTH0_CALLBACK_URL;
globalThis.FRONTEND_URL = process.env.FRONTEND_URL;

export async function signin(req,res) {
    try {
        const {email,password} = req.body;
        if(!email || !password) {
            return res.status(400).json({success:false,message:"fields can't be empty"});
        }
        const user = await User.findOne({email:email});
        if(!user) {
            return res.status(400).json({success:false,message:"email not found"});
        }
        const ispasswordcorrect = await bcrypt.compare(password,user.password);
        if(!ispasswordcorrect) {
            return res.status(400).json({success:false,message:"password incorrect"});
        }
        generateToken(user._id,res);
        return res.status(200).json({success:true,user:user,message:`Welcome back ${user.username}`});
    }
    catch(error) {
        console.log("Error in signing in: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }
}

export async function signup(req,res) {
    try {
        const {username,email,password} = req.body;  
        if(!email || !password || !username) {
            return res.status(400).json({success:false,message:"fields can't be empty"});
        }
        const userexistemail = await User.findOne({email:email})
        if(userexistemail) {
            return res.status(400).json({success:false,message:"user with this email already exists"});
        }
        const userexistusername = await User.findOne({username:username})
        if(userexistusername) {
            return res.status(400).json({success:false,message:"username already exists"});
        }
        const pics = ['/a1.jpg'];
        const image = pics[0];
        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = User({
            email,
            password:hashedPassword,
            username,
            image,
            created:new Date(),
        })
        
        await newUser.save();
        generateToken(newUser._id,res);
        res.status(201).json({success:true,user:{
            ...newUser._doc,password:" ",
        }});
      
    }    
    catch(error) {
        console.log("Error in creating new account: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }

}

export async function logout(req,res) {
    try {
        res.clearCookie("token");
        res.status(200).json({success:true,message:"logged out successfully"});
    }  
    catch {
        console.log("error in logout",error.message)
        res.status(500).json({success:false,message:"error in logging out"});
    }
}

export async function authCheck(req,res) {
    try {
        res.status(200).json({success:true,user:req.user});
    }
    catch(error) {
        console.log("error in authentication",error.message);
        res.status(500).json({success:false,message:"internal server error"});
    }
}

export async function changePassword(req,res) {
    const {password} = req.body;
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    try {
      
        await User.findByIdAndUpdate(req.user._id,{
          password:hashedPassword,
        });
       
        res.json({success:true,message:"password updated"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}
export async function changePasswordH(req,res) { // password change from forgot password
    const {password,email} = req.body;
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    try {
        
            const user = await User.findOne({email:email});
            user.password = hashedPassword;
            await user.save();
       
        res.json({success:true,message:"password updated"});
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export async function checkAccount(req,res) {   
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user) {
            return res.status(400).json({success:false,message:"Account not found"});
       }
       else {
        return res.status(200).json({success:true,message:"Account found"});
       }
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export async function userdetails(req,res) {   
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user) {
            return res.status(400).json({success:false,message:"Account not found"});
       }
       else {
        return res.status(200).json({success:true,user:user,message:"Account found"});
       }
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}
export async function allusersdetails(req,res) {
    try {
        const users = await User.find();
        if(!users) {
            return res.status(400).json({success:false,message:"No users found"});
       }
       else {
        return res.status(200).json({success:true,users:users,message:"Users found"});
       }
    }
    catch(error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export async function deleteAccount(req,res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if(!deletedUser) {
            return res.status(404).json({sucess:false,message:"account not found"});
        }
        return res.status(200).json({success:true,message:"account deleted"});
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteUserAccount(req,res) {
    try {
        const email = req.body.email;
        const user = await User.findOne({email:email});
        const deletedUser = await User.findByIdAndDelete(user._id);
        if(!deletedUser) {
            return res.status(404).json({sucess:false,message:"account not found"});
        }
        return res.status(200).json({success:true,message:"account deleted"});
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Google Auth0 login: redirect to Auth0 authorize URL
export function googleAuth(req, res) {
    const authorizeUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(process.env.AUTH0_CALLBACK_URL)}` +
        `&scope=openid%20profile%20email&` +
        `connection=google-oauth2&` +
        `prompt=select_account`;
    res.redirect(authorizeUrl);
}

// Google Auth0 callback handler
export async function googleAuthCallback(req, res) {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ success: false, message: 'No code provided' });
    }
    try {
        // Exchange code for tokens
        const tokenRes = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: process.env.AUTH0_CALLBACK_URL,
        }, {
            headers: { 'content-type': 'application/json' }
        });
        const { id_token } = tokenRes.data;
        // Decode id_token to get user info
        const decoded = jwt.decode(id_token);
        const { sub, email, name, picture } = decoded;
        // sub is like 'google-oauth2|1234567890'
        const googleId = sub.split('|')[1];
        // Find user by googleId or email
        let user = await User.findOne({ $or: [ { googleId }, { email } ] });
        if (user) {
            // If user exists but not linked, link googleId
            if (!user.googleId) {
                user.googleId = googleId;
                user.provider = 'google';
                user.picture = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                username: name || email.split('@')[0],
                email,
                googleId,
                provider: 'google',
                picture,
                image: picture,
                created: new Date(),
                password: ' ', // Not used for Google users
            });
            await user.save();
        }
        // Generate JWT and set cookie
        generateToken(user._id, res);
        // Redirect to frontend homepage
        res.redirect(process.env.FRONTEND_URL || '/');
    } catch (error) {
        console.error('Google Auth0 callback error:', error.message);
        res.status(500).json({ success: false, message: 'Google authentication failed' });
    }
}