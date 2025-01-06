import userModel from "../../../DB/model/user.model.js";
import jwt from 'jsonwebtoken' ;
import cloudinary from "./../../utls/uploadFile/cloudinary.js";
import bcrypt from 'bcryptjs' 

export const confirmEmail =async (req,res,next)=>{
    const token = req.params.token ;
    const decode = jwt.verify(token, process.env.secretKeyToken); 
    const user = await userModel.findByIdAndUpdate( decode._id,
      {confirmEmail:true}) ;
   
   return res.json({massege : "confirm email successfully"})
}
export const getUserProfile = async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user.status == "not_active") {
        return res.status(400).json({massega : "you are blocked"})
    }
    return res.status(200).json(user)
 }

 export const updateProfile = async (req, res) => {
    const {id} = req.params ;
    if(req.file){
      const {secure_url,public_url} = await cloudinary.uploader.upload(req.file.path,{
          folder : `${process.env.appname}/user`
      })
      req.body.image = {secure_url,public_url}
  }
  if(req.body.email) {
     const userExist = await userModel.findOne({email:req.body.email, _id :{$ne:id} })
     if(userExist)return res.status(400).json({message:'email is already exists'});
  }
   // Handle address object
   if (req.body.address) {
    const { address, longitude, latitude } = JSON.parse(req.body.address);
    console.log(req.body.address);
    console.log(latitude);
    console.log(address);
    console.log(longitude);
    // Ensure all address fields are provided
    if (!address || !longitude || !latitude) {
        return res.status(400).json({ message: 'Incomplete address information' });
    }

    // Validate that longitude and latitude are numbers
    if (isNaN(parseFloat(longitude)) || isNaN(parseFloat(latitude))) {
        return res.status(400).json({ message: 'Invalid latitude or longitude values' });
    }

    // Assign parsed values back to req.body
    req.body.address = {
        address: address,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
    };
}

  if(req.body.password) {
    const userExist = await userModel.findById(id).select('password')
    const checkPassword =await bcrypt.compare(req.body.pastPassword, userExist.password)
            if(!checkPassword) {
                return res.status(400).json({massege :"password mismatch"})
            }
    req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT))
 }
  console.log({...req.body});

    const update = await userModel.findByIdAndUpdate(id , {...req.body},{ new: true });
    if(!update) { 
         return res.status(400).json({message: update})
    }
    return res.status(200).json({message: "update successfully"})
}
export const getAllUser = async (req, res) => {
    const user = await userModel.find({ role: { $ne: "admin" } })
    .select('image.secure_url phoneNumber rating userName status email _id role address');
   return res.json({user})
}

export const getActiveUser = async (req, res) => {
    const user = await userModel.find({status : 'active'}).select('image.secure_url userName status email -_id');
    return res.json({user})
}

export const changeUserStatus = async (req, res) => {
   const {id} = req.params ;
   const {status} = req.body ;
   const user = await userModel.findByIdAndUpdate(id , {status});
   if (!user) {
       return res.status(404).json({massege  : " user not found"});
   }
   return res.status(200).json({massege  : "success"});
}

