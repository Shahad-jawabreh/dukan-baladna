import Router from 'express'
import * as couponController from './coupon.controller.js'
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
const router = Router();

router.post('/',authorization([role.saler]),errorHandler(couponController.create))
router.patch('/:couponId',authorization([role.saler]),errorHandler(couponController.updateCoupon))
router.get('/',authorization([role.saler]),errorHandler(couponController.getMyCoupons))
router.delete('/:couponId',authorization([role.saler]),errorHandler(couponController.deleteCoupon))
router.post('/apply',authorization([role.buyer]),errorHandler(couponController.applyCoupon))

export default router