import {Schema,Types,model} from 'mongoose'

const notificationSchema = new Schema({
    sender : {
        type : String ,
        required : true
    },
    receiver :{ 
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
    },
    type : {
        type: String
    },
    senderImage :{
        type: String
    }
},
{timestamps : true})

const notificationModel = model('notification',notificationSchema)

export default notificationModel