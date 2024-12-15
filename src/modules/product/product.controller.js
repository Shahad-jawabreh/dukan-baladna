import slugify from "slugify";
import productModel from "../../../DB/model/product.model.js"
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/uploadFile/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import userModel from "../../../DB/model/user.model.js";

// Function to detect the category
export const addProduct = async (req, res) => {
  const { name, price, detectedCategory , deliveryStatus , addOns} = req.body;

  try {
    // Check if the product already exists
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "This product already exists" });
    }

    if (deliveryStatus == "فوري") {
      req.body.deliveryStatus = deliveryStatus;
      req.body.stock = parseInt(stock, 10); // Ensure stock is a number
      if (isNaN(req.body.stock) || req.body.stock < 0) {
        return res.status(400).json({ message: "Invalid stock value" });
      }
    } else {
      req.body.deliveryStatus = "حسب الطلب";
    }

   if (addOns) {
      req.body.addOns = addOns.map((addOn) => ({
        name: addOn.name,
        price: addOn.price,
      }));
    }
    // Add the detected category to the product
    req.body.category = detectedCategory;

    // Prepare the product data
    req.body.slug = slugify(name, { lower: true });  // Ensure the slug is lowercase and URL-friendly
    req.body.createdBy = req.user._id; // Use the logged-in user's ID

    const user = await userModel.findById(req.user._id);
    if (user.role === 'saler') {
      req.body.salerName = user.userName;
    }

    // Calculate price after discount, if applicable
    if (req.body.discount) {
      req.body.priceAfterDiscount = price - ((price * (req.body.discount || 0)) / 100);
    }

    // Handle main image upload
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
      folder: `${process.env.appname}/products/${name}`
    });
    req.body.mainImage = { secure_url, public_id };

    

    // Create the product in the database
    const addedProduct = await productModel.create(req.body);

    // Return a success response with the added product
    return res.json({ message: "Product added successfully", data: addedProduct });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while adding the product" });
  }
};


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
       .populate({
         path: 'reviews',
         populate: {
           path: 'userId',
           select: 'userName -_id',
         },
       });
 
     return res.json({ message: "Products retrieved successfully", data: products });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Internal server error", error: error.message });
   }
 };

 export const getInfoProduct = async (req, res) => {
   const {_id} = req.params ;
   const product = await productModel.findById(_id)
   return res.json({product})

 }

