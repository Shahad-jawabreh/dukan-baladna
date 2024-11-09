import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import cloudinary from "./../../utls/uploadFile/cloudinary.js";


export const createReview =async (req,res,next)=>{
    const {rating , comment} = req.body ;
    const userId = req.user._id ;
    console.log(req.params)
    const {productId} = req.params;
    const order = await orderModel.findOne({
    userId, 
    status : "delivered",
    "products.productId" : productId ,
    })
    if(!order) {
        return res.status(400).json({massage : "you cannot review this product"})
    }
    const checkRev = await reviewModel.findOne({
     userId, 
    productId ,
    })
    if(checkRev) {
        return res.status(400).json({massage : "you are already reviewed"})
    }
    if(req.file){
        const {secure_url,public_url} = await cloudinary.uploader.upload(req.file.path,{
            folder : `${process.env.appname}/${productId}/reviews`
        })
        req.body.image = {secure_url,public_url}
    }
    const rev = await reviewModel.create({
        comment , rating , userId , productId , image : req.body.image
    })
    return res.json({massage : rev})
}

