import {Schema,Types,model} from 'mongoose'

const favoriteSchema = new Schema({
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
        image: {
            type: String
        },
    }]
})

const favoriteModel = model('favorite',favoriteSchema)

export default favoriteModel