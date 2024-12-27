import {Schema,Types,model} from 'mongoose'

const CookProfitSchema = new Schema({
    cookId: {
        type: Types.ObjectId , // Reference to the Cook collection
        ref: "users",
        required: true,
      },
      orderId: {
        type: Types.ObjectId , // Reference to the Orders collection
        ref: "orders",
        required: true,
      },
      totalProfit: {
        type: Number, // Total profit from the order for this cook
        required: true,
      },
      timestamp: {
        type: Date, // When this profit entry was recorded
        default: Date.now,
      },
})

const CookProfitModel = model('CookProfit',CookProfitSchema)

export default CookProfitModel