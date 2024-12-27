import mongoose, { Types,model,Schema } from "mongoose";

const productSchema = new Schema({
    name : {
        type : String , 
        required : true,
    },
    mainImage : {
        type : Object 
    },
    slug : {
        type : String ,
        required : true
    },
    stock : {
        type : Number , 
        required : true,
        default : 1
    },
    price : {
        type : Number , 
        required : true
    },
    discount : {
        type : Number ,
        default : 0
    },
    priceAfterDiscount : {
        type : Number 
    },
    category : {
        type : String ,
         required : true
    },
    deliveryStatus : {
        type : String ,
        enum  : ['فوري', 'حسب الطلب'],
    },
    description : {
        type : String
    },
    
    status : {
        type : String , 
        enum  : ['مفعل', 'غير مفعل'],
        default : 'مفعل'
    },
    createdBy : {
        type : Types.ObjectId,
        ref : 'users',
        required : true
    },
    salerName : {
        type : String,
        required : true
    },
    addOns: [
        {
            name: { type: String }, 
            price: { type: Number}, 
        }
    ],

},{timestamps : true,
    toJSON : {virtuals : true} ,
    toObject : {virtuals : true}

}
)
productSchema.virtual('reviews',
   { ref : 'reviews',
    localField : '_id' ,
    foreignField : 'productId'
   }

)
const productModel = model('products',productSchema)
export default productModel