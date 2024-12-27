import Router from 'express'
import * as orderController from './order.controller.js'
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
const router = Router();

router.post('/',authorization([role.buyer]),errorHandler(orderController.create))
router.get('/',authorization([role.saler]),errorHandler(orderController.getOrder))
router.get('/userOrder',authorization([role.buyer]),errorHandler(orderController.getUserOrder))
router.patch('/:orderId',authorization([role.saler]),errorHandler(orderController.changeOrderStatus))


export default router