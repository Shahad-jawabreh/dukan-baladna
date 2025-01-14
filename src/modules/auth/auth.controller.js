import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs' 
import SendEmail from "../../utls/sendEmail.js";
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid/non-secure'
import axios from 'axios';
import admin from "./firebaseClient.js";
import mongoose from "mongoose";

export const login = async (req, res, next) => {
    const { email, password, phoneNumber } = req.body;

    let user = null;

    // Find user by email or phone number
    if (email) {
        user = await userModel.findOne({ email });
    } else if (phoneNumber) {
        user = await userModel.findOne({ phoneNumber });
    }

    // If user doesn't exist
    if (!user) {
        return res.status(400).json({ message: "Invalid email or phone number" });
    }

    // Check if the user is active
    if (user.status === 'not_active') {
        return res.status(400).json({ message: "You are blocked" });
    }

    // Check if the email is confirmed (only applicable if email login)
    if (email && !user.confirmEmail) {
        return res.status(400).json({ message: "You have not confirmed your email" });
    }

    // Check password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(400).json({ message: "Password mismatch" });
    }

    // Generate JWT token
    const token = jwt.sign(
        { _id: user._id, role: user.role, email: email || null, phoneNumber: phoneNumber || null },
        process.env.secretKeyToken
    );


        // Generate Firebase Custom Token
        const customToken = await admin.auth().createCustomToken(user._id.toString(), {
            role: user.role,
            email: user.email || null,
            phoneNumber: user.phoneNumber || null,
        });
    
    // Respond with success
    return res.status(200).json({ message: "Welcome", token,firebaseToken :customToken, role :user.role });
};

export const loginFirebase = async (req, res) => {
    console.log(req.id)
    const token = jwt.sign(
        { _id: req.body.id, role: req.role, email: req.body.email || null, phoneNumber: req.body.phoneNumber || null },
        process.env.secretKeyToken
    );
    console.log(token)
    return res.json({token})

}

export const signup =async (req,res)=>{
    const {userName, password, email,specialization,address} = req.body; 
    const findUser = await userModel.find({email})
    if(findUser.length == 0){
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
        const user = await userModel.create({userName, password:hashPassword, email,specialization,address})
        const token = jwt.sign({_id:user._id ,role : user.role ,email},process.env.secretKeyToken, { expiresIn: '2h' });
        const subject = "confirm email" ;
        const html = `<a href='${req.protocol}://${req.headers.host}/user/confirmemail/${token}'>confirm email</a>`
        SendEmail(email,subject,html)
        return res.json({massege : "added successfully",user})
    }
    return res.json({massege : "you are already exist"})
}

export const signupDriver =async (req,res)=>{
    const {userName, password, carNumber, address , phoneNumber} = req.body; 
    const findUser = await userModel.find({phoneNumber})
    if(findUser.length == 0){
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
        const user = await userModel.create({userName, password:hashPassword, phoneNumber,address,carNumber,confirmEmail:true,role : "driver"})
        return res.json({massege : "added successfully",user})
    }
    return res.json({massege : "you are already exist"})
}
//
export const sendCode = async (req,res)=>{
    const {email} = req.body; 
    if((await userModel.find({email})).length !=0){
        const nanoid = customAlphabet('1234567890abcdef', 4)()

        await userModel.findOneAndUpdate({email},{sendCode :nanoid})
        SendEmail(email,"send code" , `<h2>${nanoid}</h2>`)
        return res.json({massege : "send successfully"})
    }
    return res.json({massege : "you are not signup"})
}

export const forgetPassword = async (req, res) => {
    const {email,password} = req.body ;
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).json({massege : "this user not found"})

            await userModel.updateOne(
                { email }, 
                { 
                    password: hashPassword,
                    sendCode: null  // Clear sendCode after successful update
                }
            );
            
            return res.json({ message: "Password updated successfully" });
}

export const verifycode = async (req, res) => {
    const {email,code} = req.body ;
    const user = await userModel.findOne({email})
    if (user.sendCode === code) {
        return res.status(200).json({massege : "success"});
    }
    return res.status(400).json({massege : "code not match"})
}


export const GPT = async (req, res) => {
    const requestBody = req.body;

    const options = {
        method: 'POST',
        url: 'https://chatgpt-api8.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '0f376ee3a1msh35eb8d384d222e9p136bb8jsncaa1998c71f8',
            'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
        },
        data: requestBody,
    };

    try {
        const response = await axios(options);
        res.json(response.data);
    } catch (error) {
        console.error('Error sending request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
