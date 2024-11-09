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
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  image: {
    type: Object
  },
  phone: {
    type: String
  },
  address: {
    type: String
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
  avaliable : {
    type: Boolean,
    default: true 
  }
}, { timestamps: true });



const userModel = model('users', userSchema);
export default userModel;
