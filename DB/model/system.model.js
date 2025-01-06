import { Schema, model } from 'mongoose';

const systemSchema = new Schema(
  {
    driverCommission: {
      type: Number,
      required: true, // التأكد من وجود العمولة
      default: 15,    
      min: [0, 'العمولة يجب أن تكون قيمة موجبة'], 
    },
    cookCommission: {
      type: Number,
      required: true,
      default: 20,    
      min: [0, 'العمولة يجب أن تكون قيمة موجبة'],
    },
  },
  { timestamps: true }
);

const systemModel = model('system', systemSchema);

export default systemModel;
