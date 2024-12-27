import mongoose, { Types,model,Schema } from "mongoose";

const reviewSchema =new Schema({
    comment : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 1 ,
        max : 5 ,
        required : true
    },
    userId : {
        type : Types.ObjectId ,
        ref : 'users',
        required : true
    },
    userName : {
        type : String
    },
    productName : {
        type : String
    },
    productId : {
        type : Types.ObjectId ,
        ref : 'products',
        required : true
    },
    reply : {
        type : String
    },
    image : {
        type : Object
    }
   
   
},{timestamps : true})


const reviewModel = model('reviews',reviewSchema)
export default reviewModel