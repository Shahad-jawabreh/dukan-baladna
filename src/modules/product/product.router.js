import {Router} from 'express'
import * as projectController from './product.controller.js'
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
import fileUpload, { fileType } from '../../utls/uploadFile/multer.js';
import reviewRouter from './../review/review.router.js'
import errorHandler from '../../utls/asyncHandler.js';
const router = Router();

router.post('/',authorization([role.admin]),fileUpload(fileType.image).fields([
    {name :'mainImage' , maxCount : 1},
    {name :'subImage' ,  maxCount : 5}
]),errorHandler(projectController.addProduct));

router.get('/',authorization([role.buyer]), projectController.getProduct)
router.use('/:productId/reviews',reviewRouter)

export default router
