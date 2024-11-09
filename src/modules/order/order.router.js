import Router from 'express'
import * as orderController from './order.controller.js'
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
const router = Router();

router.post('/',authorization([role.user]),errorHandler(orderController.create))
router.get('/all',authorization([role.admin]),errorHandler(orderController.getAllOrder))
router.get('/userOrder',authorization([role.user]),errorHandler(orderController.getUserOrder))
router.patch('/changeStatus/:orderId',authorization([role.admin]),errorHandler(orderController.changeStatus))


export default router