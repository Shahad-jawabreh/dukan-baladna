import mongoose, { Types,model,Schema } from "mongoose";

const subCategorySchema = new Schema({
    categoryId : {
       type : Types.ObjectId ,
       required : true , 
       ref : 'categories'
    },
    name : {
        type : String , 
        required : true,
        unique : true
    },
    image : {
        type : Object ,
        required : true 
    },
    slug : {
        type : String ,
        required : true
    },
    status : {
        type : String,
        default : 'active',
        enum : ['active', 'not_active']
    },
    createdBy : {
        type : Types.ObjectId ,
        ref : 'users'
    },
    updatedBy : {
        type : Types.ObjectId ,
        ref : 'users'
    },
},{timestamps : true})

const subCategoryModel = model('subcategories',subCategorySchema)
export default subCategoryModel