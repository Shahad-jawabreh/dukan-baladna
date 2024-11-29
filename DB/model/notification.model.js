import {Schema,Types,model} from 'mongoose'

const notificationSchema = new Schema({
    email : {
        type : String ,
        required : true
    },
    userName :{ 
        type : String ,
    },
    subject  : {
        type : String ,
        required : true
    },
    details : {
        type : String
    },
    status : {
            type: String,
            enum: ['resolve','pending'],
            default: 'pending' // Default to 'buyer' based on the second schema       
    }
},
{timestamps : true})

const notificationModel = model('notification',notificationSchema)

export default notificationModel