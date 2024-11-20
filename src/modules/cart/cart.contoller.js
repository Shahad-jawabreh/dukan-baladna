import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
export const getCart = async(req,res) =>{
    const {user_id} = req.params ;
    const cart = await cartModel.find({userId : user_id});
    return res.json({cart})
}
export const addProduct = async(req,res)=>{
  const userId = req.user._id ;
  const {productId} = req.body ;


  const cart = await cartModel.findOne({userId}) ;
  if(!cart) { 
    const newCart = await cartModel.create({
        products: [{
          productId,
          quantity: req.body?.quantity || 1 // Add quantity here
        }],
        userId
      });
      
     return res.status(200).json({massege : "success" , newCart})
  }
  // Check if the product already exists in the cart
  const productExists = cart.products.some(element => element.productId == productId);
  if (productExists) {
    return res.status(400).json({ message: "this product already exists" });
  }
  cart.products.push({
    productId: productId,
    quantity: req.body?.quantity || 1 // Add the quantity when pushing the product
  });
  await cart.save()
  // if not exist we will add it to cart
  return res.json({massege : "added successfully"})
}

export const increaseQuantity = async (req,res)=>{
   const {quantity} = req.body ;
   const cart = await cartModel.findOneAndUpdate({userId: req.user._id, 
    "products.productId":req.params.productId},
     {
          $inc:{
             "products.$.quantity" : quantity
          }
     },
     {
        new:true
     })
     return res.json({massege: "success",cart})
}
export const decreaseQuantity = async (req,res)=>{
    const {quantity} = req.body ;
    const cart = await cartModel.findOneAndUpdate({userId: req.user._id, 
     "products.productId":req.params.productId},
      {
           $inc:{
              "products.$.quantity" : -quantity
           }
      },
      {
         new:true
      })
      return res.json({massege: "success",cart})
 }
export const deleteItem = async (req, res) => {
    const {productId} = req.body ; 
    const userId = req.user._id ;
    const cart = await cartModel.findOneAndUpdate({userId},{
        $pull : {
            products: {
                productId: productId
            }
        }
    },{new: true})
    
    
    return res.json({massege : "deleted",cart})

}
export const clearCart = async (req, res) => {
    const userId = req.user._id ;

    const clearCart = await cartModel.findOneAndUpdate({userId},
        {products : []},
        {new :true}
    )
    return res.json({massege : "success"})
}

export const updateQuantity = async (req,res) =>{
    const { quantity, operator } = req.body;
    const  userId  = req.user._id;
    const { productId } = req.params;
    const inc = (operator === "+") ? quantity : -quantity;

    const cart = await cartModel.findOneAndUpdate(
        {
            userId,
            'products.productId': productId
        },
        {
            $inc: {
                'products.$.quantity': inc
            }
        },
        { new: true }
    );

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    return res.json({massege : "success"})
}