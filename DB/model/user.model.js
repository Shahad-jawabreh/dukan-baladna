import mongoose, { Schema, model } from "mongoose";

// Combined User Schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  image: {
    type: Object
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: Object,
     address: {
       type : String
     },
    latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      }
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'not_active']
  },
  role: {
    type: String,
    enum: ['saler', 'buyer', 'admin', 'driver'],
    default: 'buyer' // Default to 'buyer' based on the second schema
  },
  sendCode: {
    type: String,
    default: null
  },
  avaliable : { // for driver
    type: Boolean,
    default: true 
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0, // Default rating
    required: function() {
      return this.role === 'saler'; // Only required if the user is a "saler"
    }
  },
  commission: {
    type: Number,
  },
  carNumber : {
    type: String
  },
  specialization: { // for cooker
    type: String, 
  }
}, { timestamps: true });



const userModel = model('users', userSchema);
export default userModel;
