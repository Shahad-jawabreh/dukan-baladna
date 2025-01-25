import { Schema, Types, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'users',
      required: true,
    },
    orderNum: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: 'products',
        },
        productName: {
          type: String,
        },
        image: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        size: {
          type: String,
          enum: ['صغير', 'وسط', 'كبير'],
        },
        notes: {
          type: String,
        },
        addons: [
          {
            name: { type: String },
            price: { type: Number },
          },
        ],
      },
    ],
    cookerId: {
      type: String,
      required: true,
    },
    cookAddress: { // Modified to an object
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    finalPrice: {
      type: Number,
      required: true,
    }, // سعر الطلب كامل
    userAddress: { // user add
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['cash', 'online'],
      default: 'cash',
    },
    status: {
      // حالة الصنف
      type: String,
      enum: ['معلق', 'ملغي', 'تم التأكيد', 'في الطريق', 'تم التوصيل', 'تم ارسالة للتوصيل'],
      default: 'معلق',
    },
    rejectReson: {
      type: String,
    },
    driverId: {
      type: Types.ObjectId,
      ref: 'users',
    },
    couponName: {
      type: String,
    },
  },
  { timestamps: true }
);

const orderModel = model('orders', orderSchema);
export default orderModel;