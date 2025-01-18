import {Schema,Types,model} from 'mongoose'

const couponSchema = new Schema({
    name  : {
        type : String ,
        unique : true ,
        required : true
    },
    amount : {
        type : Number ,
        required : true ,
    },
    couponType : {
        type : String ,
    },
    usedBy: [{
        userId:{
           type : Types.ObjectId ,
            ref : 'users',
          },
           userName: String,
   
       }],
    usageCount:{
        type: Number,
        default : 0
      },
    expireDate :{
        type : Date , 
        required : true
    },
    createdBy : {
        type : Types.ObjectId ,
        ref : 'users',
        required : true
    }
},
{timestamps : true}
)

const couponModel = model('coupons',couponSchema)

export default couponModel