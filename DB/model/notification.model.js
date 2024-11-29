import {Schema,Types,model} from 'mongoose'

const notificationSchema = new Schema({
    from : {
        type : String ,
        required : true
    },
    to :{ 
        type : String ,
    },
    title  : {
        type : String ,
        required : true
    },//
    body : {
        type : String
    },
    status : {
            type: String,
            enum: ['seen','unseen'],
            default: 'unseen' // Default to 'buyer' based on the second schema       
    }
},
{timestamps : true})

const notificationModel = model('notification',notificationSchema)

export default notificationModel