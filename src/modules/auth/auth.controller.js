import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs' 
import SendEmail from "../../utls/sendEmail.js";
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid/non-secure'

export const login =async (req,res,next)=>{
    const {email , password}=req.body
    const user = await userModel.findOne({email}) 
    if(user){
        if(user.status == 'not_active') {
            return res.status(400).json({massege : "you are blocked"})
        }
        if( !user.confirmEmail ) {
            return res.json({massege : "you dont confirm your email"})
        }
        const checkPassword =await bcrypt.compare(password, user.password)
        if(!checkPassword) {
            return res.status(400).json({massege :"password mismatch"})
        }
        const token = jwt.sign({_id:user._id ,role : user.role , email},process.env.secretKeyToken);
        
        return res.status(200).json({massege : "welcom",token,role:user.role})
    }else{
        return res.json({massege : "this email is not exist"})
    }
}

export const signup =async (req,res)=>{
    const {userName, password, email} = req.body; 
    const findUser = await userModel.find({email})
    if(findUser.length == 0){
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
        const user = await userModel.create({userName, password:hashPassword, email})
        const token = jwt.sign({_id:user._id ,role : user.role ,email},process.env.secretKeyToken, { expiresIn: '2h' });
        const subject = "confirm email" ;
        const html = `<a href='${req.protocol}://${req.headers.host}/user/confirmemail/${token}'>confirm email</a>`
        SendEmail(email,subject,html)
        return res.json({massege : "added successfully",user})
    }
    return res.json({massege : "you are already exist"})
}

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
    const {email,password,code} = req.body ;
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).json({massege : "this user not found"})
    
        if (user.sendCode === code) {
            // Update both the password and the sendCode fields in the database
            await userModel.updateOne(
                { email }, 
                { 
                    password: hashPassword,
                    sendCode: null  // Clear sendCode after successful update
                }
            );
            
            return res.json({ message: "Password updated successfully" });
        }
    return res.status(400).json({massege : "code not match"})
}