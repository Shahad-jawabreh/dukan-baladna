import favoriteModel from '../../../DB/model/favorite.model.js'; // Update the path as per your project structure
import productModel from '../../../DB/model/product.model.js';

// Add a product to favorites
export const toggleFavorite  = async (req, res) => {

  try {
    const { productId } = req.body; // Extract productId from request body
    const userId = req.user._id; // Assuming `req.user` contains authenticated user info

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Fetch the user's favorite list
    let favorite = await favoriteModel.findOne({ userId });

    if (!favorite) {
      // Create a new favorite list if none exists
      favorite = new favoriteModel({ userId, products: [] });
    }

    // Check if the product is already in the user's favorite list
    const productIndex = favorite.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      // Add product to favorites
      favorite.products.push({ productId });
      // Update product's isFavorite field to true
      await productModel.findByIdAndUpdate(productId, { isFavorite: true });
    } else {
      // Remove product from favorites
      favorite.products.splice(productIndex, 1);
      // Update product's isFavorite field to false
      await productModel.findByIdAndUpdate(productId, { isFavorite: false });
    }

    await favorite.populate({
        path: 'products.productId', // Populate the 'productId' field inside the 'products' array
        select: 'name mainImage.secure_url', // Specify the fields to include from the 'productId' document
      });
    // Save the updated favorite list
    await favorite.save();

    res.status(200).json({
      message: 'Favorite status toggled successfully',
      favorites: favorite.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  };
  
// Remove a product from favorites
export const removeFavorite = async (req, res) => {

    const {  productId } = req.body;
    const userId = req.user._id ;

    const favorite = await favoriteModel.findOne({ userId });
    await productModel.findByIdAndUpdate(productId, { isFavorite: false });
    if (!favorite) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }

    favorite.products = favorite.products.filter(
      (product) => product.productId.toString() !== productId
    );

    await favorite.save();
    res.status(200).json({ message: 'Product removed from favorites', favorite });
  
};

// Get user favorites
export const getFavorites = async (req, res) => {

    try{
        const userId = req.user._id ;

        const favorite = await favoriteModel
        .findOne({ userId })
        .populate({
          path: 'products.productId', // Populate the 'productId' field inside the 'products' array
          select: 'name mainImage.secure_url' // Specify the fields to include from the 'productId' document
        });
      
    if (!favorite) {
      return res.json({ message: 'No favorites found for this user' });
    }
    res.status(200).json(favorite.products);
    }catch (e) {
        return res.json({ e})
    }

};
