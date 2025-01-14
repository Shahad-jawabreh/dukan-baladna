import express from 'express';
import { toggleFavorite , removeFavorite, getFavorites } from './favorite.controller.js'; // Update the path
import authorization from '../../utls/authorization.js';
import errorHandler from '../../utls/asyncHandler.js';
import { role } from '../../enum/enum.js';

const router = express.Router();

router.post('/', authorization([role.buyer]),errorHandler(toggleFavorite));       // Add a product to favorites
router.delete('/remove',authorization([role.buyer]), errorHandler(removeFavorite)); // Remove a product from favorites
router.get('/list',authorization([role.buyer]) ,errorHandler(getFavorites));       // Get user favorites

export default router;
