import { request } from "express";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import cloudinary from "./../../utls/uploadFile/cloudinary.js";
import userModel from "../../../DB/model/user.model.js";


export const createReview =async (req,res,next)=>{
    const {rating , comment} = req.body ;
    const userId = req.user._id ;
    
    const {userName} = await userModel.findById(userId).select('userName')
    console.log(userName)
    const {productId} = req.params;

    const {name} = await productModel.findById(productId).select('name')
    console.log(name)
    const order = await orderModel.findOne({
    userId, 
    status : "تم التوصيل",
    "products.productId" : productId ,
    })
    console.log(order)
    if(!order) {
        return res.status(400).json({massage : "لا يمكنك إضافة تقييم إلا بعد استلام المنتج."})
    }
    const checkRev = await reviewModel.findOne({
     userId, 
    productId 
    })
    if(checkRev) {
        return res.status(400).json({massage : "تم التعليق سابقا"})
    }
    if(req.file){
        const {secure_url,public_url} = await cloudinary.uploader.upload(req.file.path,{
            folder : `${process.env.appname}/${productId}/reviews`
        })
        req.body.image = {secure_url,public_url}
    }
    
    const rev = await reviewModel.create({
        comment , rating , userId , productId , image : req.body.image,  userName , productName : name
    })
    return res.status(200).json({massage : rev})
}

export const replyToReview = async (req, res) => {
     const {id} = req.params ; // id review
     const {reply} = req.body ;
     const rep = await reviewModel.findByIdAndUpdate(id,{reply}) ;
     if(rep) { 
        return res.json({massage : "added successfully"});
     }
     return res.status(400).json({massage : "error added"});

}


export const editReview = async(req, res) => {
    const {rating , comment} = req.body ;
    const {reviewId} = req.params ;
    const rev = await reviewModel.findByIdAndUpdate(reviewId,{rating,comment}) ;
   if(rev){
    return res.status(200).json({message : 'success'})
   }
   return res.status(400).json({message : 'error'})
}
