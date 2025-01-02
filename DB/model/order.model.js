import {Schema,Types,model} from 'mongoose'
 
const orderSchema = new Schema({
    userId :{
       type : Types.ObjectId ,
       ref : 'users',
       required : true
    },
    orderNum : {
        type : String
    },
    userName :{
        type : String ,
        required : true
    },
    products :[{
        name :{
            type :String
        },
        productId :{
           type : Types.ObjectId,
           ref : 'products',
           required : true
        },
        quantity :{
            type : Number,
            required : true
        }, 
        unitPrice : {
            type : Number,
            required : true
        }, // سعر الحبه بعد الخصم
        finalPrice :{
            type : Number,
            required : true
        },
        extraAdding : {
            type : String
        },
        size : {
            type : String
        },
    }],
    cookerId :{ 
       type : String ,
       required : true
    },
    finalPrice :{
        type : Number,
        required : true   
    } ,// سعر الطلب كامل
    address :{
      type : String,
      required : true
    },
    phoneNumber :{
        type : String,
        required : true
    },
    paymentType :{
        type : String ,
        enum : ['cash', 'cart'],
        default : 'cash'
    },
    status: { // حالة الصنف
        type: String,
        enum: ['معلق','ملغي','تم التأكيد','في الطريق','تم التوصيل','تم ارسالة للتوصيل'],
        default: 'معلق'
    },
    rejectReson : {
        type : String
    },
    couponId : {
        type : Types.ObjectId
    },
    deadline: { // الموعد النهائي
        type: Date,
    }
},
{timestamps : true}
)

const orderModel = model('orders',orderSchema)
export default orderModel