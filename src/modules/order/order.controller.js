import couponModel from "../../../DB/model/coupon.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import orderModel from "../../../DB/model/order.model.js";
import userModel from "../../../DB/model/user.model.js";
import { customAlphabet } from 'nanoid/non-secure'

export const create = async (req, res, next) => {
  try {
      const {
          products,
          finalPrice,
          phoneNumber,
          paymentType,
           cookerId,
           couponName
         } = req.body;
          

    if (!products || products.length === 0) {
          return res.status(400).json({ message: "Products is required" });
      }

       
        if (!phoneNumber) {
          return res.status(400).json({ message: "Phone number is required" });
      }
       if (!cookerId) {
        return res.status(400).json({ message: "Cooker ID is required" });
        }
        const cookAddress = await userModel.findById(cookerId).select('address')
        const userAddress = await userModel.findById({_id:req.user._id}).select('address')
       console.log(cookAddress)
        const user = await userModel.findById(req.user._id);
 
          if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
          const orderNum = customAlphabet("1234567890abcdef", 4)()


    const order = await orderModel.create({
            userId: req.user._id,
            products: products.map(product => ({
                 productId : product.productId,
                 productName : product.productName,
                 image : product.image,
                quantity: product.quantity,
                price: product.price,
                size : product.size,
                salerName: product.salerName,
                salerId : product.salerId,
                 notes : product.notes,
                 addons: product.addons,
                
            })),
            finalPrice: finalPrice,
            userAddress:userAddress.address,
            cookAddress:cookAddress.address,
            phoneNumber: phoneNumber,
            paymentType: paymentType,
            userName: user.userName,
            orderNum: orderNum,
             cookerId: cookerId,
             couponName,
    });

     if (order) {
        for (const product of order.products) {
          await productModel.findByIdAndUpdate(
              { _id: product.productId },
                {
                   $inc: {
                       stock: -product.quantity,
                   },
               }
            );
         }
      }


    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getOrder = async (req, res) => {
    try {
        const { _id } = req.user;
        const orders = await orderModel.find({cookerId : _id });
        return res.status(200).json({ orders: orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error });
    }
};

export const getallOrder = async (req, res) => {
    try {
        const orders = await orderModel.find();
        return res.status(200).json({ orders: orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error });
    }
}
export const getUserOrder = async(req, res) => {
    const orders = await orderModel.find({userId : req.user._id});
    if(!orders){
        return res.status(400).json({massge : "error"})
    }
    return res.status(200).json({orders})
}
export const changeOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status , discount , driverId} = req.body;

    // Find the order by orderId
    const order = await orderModel.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "This order does not exist" });
    }
    
    // Update the product's status
    if(status) {
        order.status = status;
    }
     
    if(discount) {
        order.finalPrice = order.finalPrice * (100 - discount)/100;
    }
    if(driverId) {
        order.driverId = driverId ;
        order.cookAdress = cookAdress;
    }
    // Save the updated order
    await order.save();

    return res.status(200).json({ message: "order status updated successfully" });
};


