import e from 'express';
import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';


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
        return res.status(200).json({success:true,user:user,message:"signed in successfully"});
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
            image
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
