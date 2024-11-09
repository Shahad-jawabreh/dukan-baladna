import slugify from "slugify";
import productModel from "../../../DB/model/product.model.js"
import subCategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../utls/uploadFile/cloudinary.js";
import { pagination } from "../../utls/pagination.js";

export const addProduct = async (req , res) =>{
   const {name,price,categoryId,subCategoryId} = req.body ;
   const product = await productModel.findOne({name});
   if(product) {
    return res.status(400).json({massege : "this product already exists"});
   }
 
   const subcategory = await subCategoryModel.find({_id:subCategoryId , categoryId : categoryId});
   req.body.slug = slugify(name);
   if( !subcategory.length ) {
    return res.status(400).json({massege : "this category not exists"});
   }
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
   const page = req.query.page  ;
   let {limit,skip} = pagination(page,req.query.limit)
   const queryObj = {...req.query}
   const execQuery = ['limit','page','sort','search']

   execQuery.map((ele)=>{
      delete queryObj[ele]
   });
      const pro = productModel.find(queryObj).sort(req.query.sort).skip(skip).limit(limit).populate(
      {path :'reviews' ,
         populate : {
           path : 'userId',
           select : 'userName -_id'
         }
      })
      const product = await pro.find({name : {$regex :req.query.search}})
   return res.json({massege : product})
}  