import slugify from "slugify";
import productModel from "../../../DB/model/product.model.js"
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/uploadFile/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import userModel from "../../../DB/model/user.model.js";

export const addProduct = async (req, res) => {
  const { name, price, categoryId } = req.body;

  try {
    // Check if the product already exists
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "This product already exists" });
    }

    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "This category does not exist" });
    }

    // Prepare the product data
    req.body.slug = slugify(name, { lower: true });  // Ensure the slug is lowercase and URL-friendly
    req.body.createdBy = req.user._id; // Use the logged-in user's ID

    // Add seller information if the user is a seller
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

    // Handle sub-images upload
    req.body.subImage = [];
    for (const file of req.files.subImage) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `${process.env.appname}/products/${name}/subimage`
      });
      req.body.subImage.push({ secure_url, public_id });
    }

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

