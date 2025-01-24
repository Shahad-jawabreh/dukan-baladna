import slugify from "slugify";
import productModel from "../../../DB/model/product.model.js"
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/uploadFile/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import userModel from "../../../DB/model/user.model.js";
import orderModel from "../../../DB/model/order.model.js";
export const addProduct = async (req, res) => {
  const {
    name,
    detectedCategory,
    deliveryStatus,
    addOns,
    stock,
    preparationTime,
    sizes // Get sizes data from request
  } = req.body;

  try {
    // Check if the product already exists
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "This product already exists" });
    }

    // Handle delivery status and stock
    if (deliveryStatus === "فوري") {
      req.body.deliveryStatus = deliveryStatus;
      req.body.stock = parseInt(stock, 10); // Ensure stock is a number
      if (isNaN(req.body.stock) || req.body.stock < 0) {
        return res.status(400).json({ message: "Invalid stock value" });
      }
    } else {
      req.body.deliveryStatus = "حسب الطلب";
      const parsedPreparationTime =  typeof preparationTime === 'string' ? JSON.parse(preparationTime) : preparationTime;
      req.body.preparationTime = parsedPreparationTime;
    }

    // Handle addOns if they exist
    if (addOns) {
      try {
        // In case the data is received as a string, parse it
        const parsedAddOns = Array.isArray(addOns) ? addOns : JSON.parse(addOns);
        req.body.addOns = parsedAddOns.map((addOn) => ({
          name: addOn.name,
          price: addOn.price,
        }));
      } catch (error) {
        console.error("Error parsing addOns:", error);
        return res.status(400).json({ message: "Invalid addOns format" });
      }
    }

   // Handle sizes with min/max number of people
  if (sizes) {
    try {
      const parsedSizes = JSON.parse(sizes); // Parse the sizes string
       if (typeof parsedSizes !== 'object' || parsedSizes === null || Array.isArray(parsedSizes)) {
          return res.status(400).json({ message: "Invalid sizes format" });
        }
      req.body.sizeOfProduct = Object.entries(parsedSizes).map(([size, details]) => ({
         size: size,
         price: details.price,
          minNumberOfpeople: details.minNumberOfpeople, 
 maxNumberOfpeople: details.maxNumberOfpeople,
      }));
    } catch (error) {
      console.error("Error parsing sizes:", error);
      return res.status(400).json({ message: "Invalid sizes format" });
    }
  }


    // Add the detected category to the product
    req.body.category = detectedCategory;

    // Generate slug from the name
    req.body.slug = slugify(name || 'default-name', { lower: true });  // Ensure name is not null or undefined

    req.body.createdBy = req.user._id; // Use the logged-in user's ID

    const user = await userModel.findById(req.user._id);
    if (user.role === 'saler') {
      req.body.salerName = user.userName;
      req.body.secure_url = user.image.secure_url;
    }

    // Calculate price after discount, if applicable
    if (req.body.discount) {
      req.body.priceAfterDiscount = price - ((price * (req.body.discount || 0)) / 100);
    }

        if(req.file){
           console.log("req.file");

             const {secure_url,public_url} = await cloudinary.uploader.upload(req.file.path,{
                 folder : `${process.env.appname}/product`
             })
             req.body.mainImage = { secure_url, public_url };
         }

    // Create the product in the database
    const addedProduct = await productModel.create(req.body);

    // Return a success response with the added product
    return res.json({ message: "Product added successfully", data: addedProduct });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getNewProduct = async (req, res) => {
  const date = new Date();
    date.setDate(date.getDate() - 7);  // Subtract days from today
    const newProducts = await productModel.find({
      createdAt: { $gte: date }, //Find documents with createdAt >= date
    }).sort({createdAt: -1}); // Sort by most recent first
       
      return res.json({newProducts});
}
export const getProduct = async (req, res) => {
   try {
     const page = req.query.page || 1;
     const { limit, skip } = pagination(page, req.query.limit || 12);
 
     // Build query object
     const queryObj = { ...req.query };
     const excludeFields = ['limit', 'page', 'sort', 'search'];
     excludeFields.forEach((field) => delete queryObj[field]);
 
     if (req.query.search) {
       queryObj.name = { $regex: `^${req.query.search}` };
     }
     // Execute query
     const products = await productModel
       .find(queryObj)
       .sort(req.query.sort || queryObj.name)
       .skip(skip)
       .limit(limit)
     
     return res.json({ message: "Products retrieved successfully", data: products });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Internal server error", error: error.message });
   }
 };
 export const getProductForCooker = async (req, res) => {
  try {
    const count =  0 ;
    const page = req.query.page || 1;
    const { limit, skip } = pagination(page, req.query.limit || 12);

    // Build query object
    const queryObj = { ...req.query };
    const excludeFields = ['limit', 'page', 'sort', 'search'];
    excludeFields.forEach((field) => delete queryObj[field]);
     

    if (req.query.search) {
      queryObj.name = { $regex: `^${req.query.search}` };
    }
    // Execute query
    const products = await productModel
    .find({ createdBy: req.params.id })
    .select('name price mainImage status') // Only select name and price
    .sort(req.query.sort || 'name') // Sort products based on query or default to name
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'userName _id',
      },
    });
  
  // Fetch all orders with the productId
  const numberOfOrders = await orderModel.find().select('products.productId');
  
  for (let product of products) {
    let productCount = 0;
  
    // Count how many orders contain this product
    numberOfOrders.forEach(order => {
      order.products.forEach(item => {
        if (item.productId.toString() === product._id.toString()) {
          productCount++;
        }
      });
    });
  
    // Add the order count directly to each product object
    product.orderCount = productCount;
  }
  
  const productsWithAvgRating = products.map(product => {
    let rating = 0;
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    }
    return {
      _id: product._id,
      name: product.name,
      status: product.status,
      price: product.price,
      orderCount: product.orderCount, 
      rating,  // Add the calculated average rating
      reviews : product.reviews,
      mainImage :product.mainImage
    };
  });

    return res.json({ message: "Products retriev successfully", data: productsWithAvgRating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 export const getInfoProduct = async (req, res) => {
   const {_id} = req.params ;
   const product = await productModel.findById(_id).populate({
    path: 'reviews',
    populate: {
      path: 'userId',
      select: 'userName userId -_id',
    },
  });
  
   return res.json({product})
 }

 export const updateProduct = async(req, res) =>{
    const {id} = req.params ;
    if(req.file){
      const {secure_url,public_url} = await cloudinary.uploader.upload(req.file.path,{
          folder : `${process.env.appname}/product`
      })
      console.log(secure_url);
           req.body.mainImage = {secure_url,public_url}
  }
  if(req.body.name) {
     const productExist = await productModel.findOne({name:req.body.name, _id :{$ne:id} , createdBy : req.user._id })
     if(productExist)return res.status(400).json({message:'هذا المنتج موجود بالفعل'});
  }
  console.log({...req.body});

    const update = await productModel.findByIdAndUpdate(id , {...req.body},{ new: true });
    if(!update) { 
         return res.status(400).json({message: "error updating"})
    }
    return res.status(200).json({message: "update successfully"})

 }
