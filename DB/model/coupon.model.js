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
    usedBy : [{
        type : Types.ObjectId ,
        ref : 'users',
    }],
    expireDate :{
        type : Date , 
        required : true
    },
    createdBy : {
        type : Types.ObjectId ,
        ref : 'users',
        required : true
    }
})

const couponModel = model('coupons',couponSchema)

export default couponModel