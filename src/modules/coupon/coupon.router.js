import Router from 'express'
import * as couponController from './coupon.controller.js'
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
const router = Router();

router.post('/',authorization([role.admin]),errorHandler(couponController.create))

export default router