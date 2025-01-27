import e from 'express';
import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export async function signin(req,res) {
    res.send('singin page');
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
        res.status(201).json({success:true,message:"user created successfully"});
    }    
    catch(error) {
        console.log("Error in creating new account: "+error.message);
        res.status(500).json({success:false,message:error.message});
    }

}

export async function logout(req,res) {
    res.send("logout page");    
}
