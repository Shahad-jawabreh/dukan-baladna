import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
export const getCart = async(req,res) =>{
    const {user_id} = req.params ;
    const cart = await cartModel.find({userId : user_id});
    return res.json({cart})
}
export const addProduct = async (req, res) => {
    try {
      const userId = req.user._id; // Ensure the user is authenticated with a valid token
      const { productId,size,price,notes,addons, quantity = 1 } = req.body; // Default quantity is 1 if not provided
       
       const product = await productModel.findById(productId);
       if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      // Find the user's cart
      let cart = await cartModel.findOne({ userId });
      console.log(cart)
      if (!cart) {
        // If no cart exists, create a new one
        const newCart = await cartModel.create({
          userId, 
          products: [{quantity, salerId : product.createdBy,addons,salerName : product.salerName,productId, quantity ,size,notes,price, productName :product.name, image : product.mainImage.secure_url}],
        });
  
        return res.status(200).json({ message: "تم انشاء السلة واضافة المنتج بنجاح", cart: newCart });
      } else {
        // If cart exists, check if the product is already in the cart
        const existingProduct = cart.products.find(
          (item) => item.productId.toString() === productId
        );
  
        if (existingProduct) {
          // Update quantity if the product already exists in the cart
          existingProduct.quantity += quantity;
    
        } else {
          // Add new product to the cart
          cart.products.push({salerId : product.createdBy,salerName : product.salerName, productId,size,price,notes, quantity , productName :product.name, image : product.mainImage.secure_url });
        }
        let total = 0;
        for(let i = 0 ;i < cart.products.length ; i++) {
          total += cart.products[i].quantity * cart.products[i].price;
        }
        console.log(cart);
        cart.totalPrice = total;
        console.log(cart.totalPrice )
        await cart.save();
  
        return res.status(200).json({ message: ' تمت الاضافة بنجاح', cart });
      }
    } catch (error) {
      // Handle errors
      console.error('Error adding product to cart:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

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
    const {productId} = req.params ; 
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
    const { operator } = req.body;
    const  userId  = req.user._id;
    const { productId } = req.params;
    let {totalPrice} = await cartModel.findOne({userId}).select('totalPrice');
    console.log(totalPrice)
    const {price} = await productModel.findById(productId).select('price');
    const inc = (operator === "+") ? 1 : -1;
    
    if(operator == '+') {
      totalPrice += price ;
    }else {
      totalPrice -= price ;
    }
    const cart = await cartModel.findOneAndUpdate(
        {
            userId,
            'products.productId': productId
        },
        {
            $inc: {
                'products.$.quantity': inc
            },
            totalPrice
        },
        { new: true }
    );

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    return res.json({massege : "success"})
}