import slugify from "slugify";
import productModel from "../../../DB/model/product.model.js"
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/uploadFile/cloudinary.js";
import { pagination } from "../../utls/pagination.js";

export const addProduct = async (req , res) =>{
   const {name,price,categoryId} = req.body ;
   const product = await productModel.findOne({name});
   if(product) {
    return res.status(400).json({massege : "this product already exists"});
   }
 
   const categoryM = await categoryModel.find({ _id : categoryId});
   req.body.slug = slugify(name);
   if( !categoryM.length ) {
    return res.status(400).json({massege : "this category not exists"});
   }
    req.body.createdBy = req.user._id;
   if(req.body.discount) {
      req.body.priceAfterDiscount = price - ((price * (req.body.discount || 0)) / 100)
   }
   const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.appname}+'/products/${name}'`})
   req.body.mainImage = {secure_url,public_id} ;

   req.body.subImage = []
   for(const file of req.files.subImage) {
      const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.appname}+'/products/${name}/subimage'`})
      req.body.subImage.push({secure_url,public_id})
   }
   const addProduct = await productModel.create(req.body);
   return res.json({massege : addProduct})
}

export const getProduct = async (req, res) => {
   try {
     const page = req.query.page || 1;
     const { limit, skip } = pagination(page, req.query.limit || 12);
 
     // Build query object
     const queryObj = { ...req.query };
     const excludeFields = ['limit', 'page', 'sort', 'search'];
     excludeFields.forEach((field) => delete queryObj[field]);
 
     if (req.query.search) {
       queryObj.name = { $regex: `^${req.query.search}` };
     }
     // Execute query
     const products = await productModel
       .find(queryObj)
       .sort(req.query.sort || queryObj.name)
       .skip(skip)
       .limit(limit)
       .populate({
         path: 'reviews',
         populate: {
           path: 'userId',
           select: 'userName -_id',
         },
       });
 
     return res.json({ message: "Products retrieved successfully", data: products });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Internal server error", error: error.message });
   }
 };

 export const getInfoProduct = async (req, res) => {
   const {_id} = req.params ;
   const product = await productModel.findById(_id)
   return res.json({product})

 }

