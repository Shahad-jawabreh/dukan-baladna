import mongoose, { Types,model,Schema } from "mongoose";

const specialSchema = new Schema({
    productName: { type: String},
    quantity: { type: String},
    finalProduct: { type: String },
    note: { type: String },
    deliveryDateTime: { type: String },
    chefId: { type: String },
    chefName: { type: String },
    userId: { type : String},
    status: {
        // حالة الصنف
        type: String,
        enum: ['معلق', 'ملغي', 'تم التأكيد', 'في الطريق', 'تم التوصيل', 'تم ارسالة للتوصيل'],
        default: 'معلق',
      },
      deliveryOption : {type: String}
},{timestamps : true}) 

const specialModel = model('special',specialSchema)
export default specialModel   