import couponModel from "../../../DB/model/coupon.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import orderModel from "../../../DB/model/order.model.js";
import userModel from "../../../DB/model/user.model.js";
import { customAlphabet } from 'nanoid/non-secure'

export const create = async (req, res, next) => {
    try {
        let coupon;
        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Validate coupon if provided
        if (req.body.name) {
            coupon = await couponModel.findOne({ name: req.body.name });
            if (!coupon || coupon.expireDate < new Date()) {
                return res.status(400).json({ message: "Coupon expired" });
            }
            if (coupon.usedBy.includes(req.user._id)) {
                return res.status(400).json({ message: "Coupon already used" });
            }
            req.body.coupon = coupon; // Attach coupon to request body
        }

        let finalProductList = [];
        let subTotal = 0;

        for (let product of cart.products) {
            const checkProduct = await productModel.findOne({
                _id: product.productId,
                stock: { $gte: product.quantity },
            });

            if (!checkProduct) {
                return res.status(400).json({ message: "Product stock is insufficient" });
            }

            product = product.toObject();
            product.name = checkProduct.name;
            product.unitPrice = checkProduct.price;
            product.finalPrice = product.quantity * checkProduct.price;
            product.status = "pending"; // Initial status for each product
            subTotal += product.finalPrice;

            finalProductList.push(product);
        }

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 2); // Set deadline to 2 days from now

        const user = await userModel.findById(req.user._id);

        const order = await orderModel.create({
            userId: req.user._id,
            products: finalProductList,
            finalPrice: subTotal - (subTotal * (coupon?.amount || 0)) / 100,
            address: user.address,
            phoneNumber: user.phoneNumber,
            userName: user.userName,
            orderNum: customAlphabet("1234567890abcdef", 4)(),
            deadline: deadline, 
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
            if (req.body.coupon) {
                await couponModel.findByIdAndUpdate(
                    { _id: req.body.coupon._id },
                    {
                        $addToSet: {
                            usedBy: req.user._id,
                        },
                    }
                );
            }
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error });
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
    return res.status(200).json({orders})
}
export const changeOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status , discount } = req.body;

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
    // Save the updated order
    await order.save();

    return res.status(200).json({ message: "order status updated successfully" });
};


