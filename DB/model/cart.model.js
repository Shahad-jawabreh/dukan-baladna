import {Schema,Types,model} from 'mongoose'

const cartSchema = new Schema({
    userId  : {
        type : Types.ObjectId,
        ref : 'users',
        required : true,
        unique : true
    },
    totalPrice : {
        type : Number,    
    },
    products : [{
        productId : {
            type : Types.ObjectId,
            ref  :'products'
        },
        productName : {
            type : String
        },
        image: {
            type: String
        },
        quantity : {
            type : Number,
            default : 1
        },
        price :{
            type : Number,
        },
    }]
})

const cartModel = model('carts',cartSchema)

export default cartModel