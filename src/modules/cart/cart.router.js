import {Router} from 'express'
import * as cartController from './cart.contoller.js'
import authorization from './../../utls/authorization.js'
import {role} from './../../enum/enum.js'
import errorHandler from './../../utls/asyncHandler.js'
const router = Router()
router.get('/:user_id',authorization([role.buyer]),errorHandler(cartController.getCart));
router.post('/',authorization([role.buyer]),errorHandler(cartController.addProduct));
router.post('/increase',authorization([role.buyer]),errorHandler(cartController.increaseQuantity));
router.post('/decrease',authorization([role.buyer]),errorHandler(cartController.decreaseQuantity));
router.delete('/productsClear',authorization([role.buyer]),errorHandler(cartController.clearCart));
router.delete('/:productId',authorization([role.buyer]),cartController.deleteItem);
router.put('/updateQuantity/:productId',authorization([role.buyer]),errorHandler(cartController.updateQuantity));

export default router