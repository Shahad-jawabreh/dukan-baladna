import {Router} from 'express'
import * as cartController from './cart.contoller.js'
import authorization from './../../utls/authorization.js'
import {role} from './../../enum/enum.js'
import errorHandler from './../../utls/asyncHandler.js'
const router = Router()

router.post('/',authorization([role.user]),errorHandler(cartController.addProduct));
router.post('/increase',authorization([role.user]),errorHandler(cartController.increaseQuantity));
router.post('/decrease',authorization([role.user]),errorHandler(cartController.decreaseQuantity));
router.delete('/',authorization([role.user]),cartController.deleteItem);
router.delete('/productsClear',authorization([role.user]),errorHandler(cartController.clearCart));
router.put('/updateQuantity/:productId',authorization([role.user]),errorHandler(cartController.updateQuantity));

export default router