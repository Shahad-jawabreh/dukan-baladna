import mongoose, { Types,model,Schema } from "mongoose";

const productSchema = new Schema({
    name : {
        type : String , 
        required : true,
    },
    mainImage : {
        type : Object 
    },
    preparationTime: { 
        type :Date
    },
    sizeOfProduct : 
        [{
            size : {
                type : String,
                enum : ["صغير","وسط","كبير"]
            },
            price : {
                type : Number
            },
            minNumberOfpeople : { 
                type : Number
            },
           maxNumberOfpeople : { 
                type : Number
            }

        }]
    ,
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
    isFavorite : {
        type : Boolean,
        default : false
    },
    salerName : {
        type : String,
        required : true
    },
    secure_url :{ 
        type : String,
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