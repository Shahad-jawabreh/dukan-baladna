import {Schema,Types,model} from 'mongoose'

const folowingSchema = new Schema({
    
    salerId :{
        type : Types.ObjectId,
        ref : 'users',
        required : true,
    },
    salerName : {
        type : String
    },
    folowers :[{
        userId  : {
            type : Types.ObjectId,
            ref : 'users',
            required : true,
        },
        userName : {
            type : String
        }
    }]
})

const folowingModel = model('folow',folowingSchema)

export default folowingModel