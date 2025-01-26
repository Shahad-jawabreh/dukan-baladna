import {Schema,Types,model} from 'mongoose'

const subscriptionsSchema = new Schema({
    customerId  : {
        type: Types.ObjectId , // Reference to the Cook collection
        ref: "users",
        required: true,
    },
    cookId : {
        type: Types.ObjectId , // Reference to the Cook collection
        ref: "users",
        required: true,
    },
    customerName : String,
    meal : {
        type : String ,
    },
    price :{
        type : Number
    },
    schedule: [{
         schadule: {
            type : String ,
            enum : ['اسبوعياً','شهرياَ']
         },
         day :{
            type : String ,
         },
         time : [{
            hour : Number ,
            min : Number ,
         }]
   
       }],
    note:{
        type: String
      },
    
},
{timestamps : true}
)

const subscriptionsModel = model('subscriptionss',subscriptionsSchema)

export default subscriptionsModel