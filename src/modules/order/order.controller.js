import couponModel from "../../../DB/model/coupon.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import orderModel from "../../../DB/model/order.model.js";
import userModel from "../../../DB/model/user.model.js";


export const create =async (req,res,next)=>{
    let coupon ;
   const cart = await cartModel.findOne({userId : req.user._id}) ;
   if(!cart) { 
     return res.status(400).json({massage : "cart is empty"});
   }
   if(req.body.name){
       coupon = await couponModel.findOne({name : req.body.name}) ;
   if(coupon.expireDate < new Date()) { 
    return res.status(400).json({massege : "coupon expired"})
   }
   if(coupon.usedBy.includes(req.user._id)){
    return res.status(400).json({massege : "coupon aleady used"})
   }
   req.body.coupon = coupon; // add this coupon to order 
   } // end if stmt 
   let finalProductList = [] ;
   let subTotal = 0 ;
   for(let product of cart.products){
      const checkProduct = await productModel.findOne({_id:product.productId , stock :{$gte : product.quantity}})
      if(!checkProduct){
         return res.status(400).json({massege : "the quantity is not available"})
      }
      product = product.toObject() ;
      product.name = checkProduct.name ;
      product.unitPrice = checkProduct.price ;
      product.finalPrice = product.quantity * checkProduct.price ;
      // product.discount = checkProduct.discount ; 
      subTotal += product.finalPrice ;
      finalProductList.push(product)
   }
   console.log(finalProductList)
   const user = await userModel.findById(req.user._id)
    console.log(user)
    const order = await orderModel.create ({
    userId : req.user._id ,
    products : finalProductList ,
    finalPrice : subTotal - (subTotal * (coupon?.amount || 0)/100 ) ,
    address : user.address ,
    phoneNumber : user.phoneNumber
   })

   if(order){
     for(const product of order.products){
         await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc :{
                stock : -product.quantity
            }
         })
     }
     if(req.body.coupon) {
         await couponModel.findByIdAndUpdate({_id:req.body.coupon._id},{
            $addToSet :{
                usedBy : req.user._id
            }
         })
     }
   }
   return res.status(200).json({order})
}
export const getAllOrder = async(req, res) => {
    const orders = await orderModel.find({$or :[
        {status :'pending'},
        {status :'confirmed'},
    ]});
    return res.status(200).json({orders})
}
export const getUserOrder = async(req, res) => {
    const orders = await orderModel.find({userId : req.user._id});
    return res.status(200).json({orders})
}
export const changeStatus = async(req, res) => {
    const orderId=req.params.orderId
    const {status} = req.body
    const order = await orderModel.findById(orderId)
    if(!order){
        return res.status(404).json({massage : "this order not exist"})
    }
    order.status = status
    await order.save()

    return res.status(200).json({massage : "updated"})
}
