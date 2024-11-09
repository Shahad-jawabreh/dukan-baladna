import mongoose, { Types,model,Schema } from "mongoose";

const categorySchema = new Schema({
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
},{timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
}
)

categorySchema.virtual('subcategory',{
    localField : "_id" ,
    foreignField : "categoryId",
    ref : "subcategories"
})
const categoryModel = model('categories',categorySchema)
export default categoryModel