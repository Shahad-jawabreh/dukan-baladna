import categoryModel from "../../../DB/model/category.model.js"
import userModel from "../../../DB/model/user.model.js"
import cloudinary from "../../utls/uploadFile/cloudinary.js"
import slugify from 'slugify'

export const getAllCategory =async (req,res,next)=>{

    const category = await categoryModel.find({}).populate([{path : 'createdBy', select : "userName"},{path : 'subcategory'}])
    return res.status(200).json({category})
 }
 export const getDetails =async (req,res,next)=>{

  const category = await categoryModel.findById(req.params.id)
  return res.status(200).json({category})
}
 export const getActiveCategory =async (req,res,next)=>{
    const category = await categoryModel.find({status:'active'}).select("name image.secure_url")
    return res.status(200).json({category})
 }

 export const updateCategory = async (req,res,next)=>{
       const _id = req.params ;

       const category = await categoryModel.findById(_id);
       
       if(!category) {
          return next(new Error("this category is not exist"))
       } 
       if(await categoryModel.findOne({name :req.body.name , _id :{$ne:_id} })) {
         return res.status(400).json({massege : "this category is already exist" }) ;
       }
       category.name= req.body.name ;
       category.status= req.body.status ;
       category.slug=  slugify(req.body.name, '-') ;
       category.updatedBy = req.user._id;
       if(req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.appname+'/Category'}`})
        category.image = {secure_url,public_id}
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = {secure_url,public_id}

      }
       await category.save() ;
       return res.status(200).json({massege : "updated sucessfully" }) ;

 }

 export const destroy = async (req, res) => {
  const {_id} = req.params;
  const destroyCat = await categoryModel.findByIdAndDelete({_id})
  if(!destroyCat){
    return res.status(404).json({massege : "category not found"})
  }
  await cloudinary.uploader.destroy(destroyCat.image.public_id)
  return res.status(200).json({massege : "delete successfully"})
 }
 
 export const createCategory =async (req,res,next)=>{
      const name = req.body.name.toLowerCase()
      const findCategory = await categoryModel.find({name})
      if(findCategory.length>0){
        return res.status(409).json({massege : "this name is already exist"})
      }
      else {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.appname+'/Category'}`})
      
          req.body.slug = slugify(name, '-')
          req.body.image = {secure_url,public_id};
          req.body.name= name ;
          req.body.createdBy= req.user._id
          req.body.updatedBy= req.user._id
          const category= await categoryModel.create(req.body)
          return res.json({massege : "added successfully" , category})
      }
 }