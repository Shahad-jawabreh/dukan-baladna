import {Schema,Types,model} from 'mongoose'

const cartSchema = new Schema({
    userId  : {
        type : Types.ObjectId,
        ref : 'users',
        required : true,
        unique : true
    },
    products : [{
        productId : {
            type : Types.ObjectId,
            ref  :'products'
        },
        productName : {
            type : String
        },
        quantity : {
            type : Number,
            default : 1
        },
        totalPrice : {
            type : Number,    
        }
    }]
})

const cartModel = model('carts',cartSchema)

export default cartModel