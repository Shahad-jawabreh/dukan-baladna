import {Router} from 'express'
import * as projectController from './product.controller.js'
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
import fileUpload, { fileType } from '../../utls/uploadFile/multer.js';
import reviewRouter from './../review/review.router.js'
import errorHandler from '../../utls/asyncHandler.js';
const router = Router();

router.post('/',authorization([role.admin,role.saler]),fileUpload(fileType.image).single('mainImage') ,errorHandler(projectController.addProduct));
router.get('/cooker/:id', projectController.getProductForCooker)
router.patch('/:id', authorization(role.saler),fileUpload(fileType.image).single('image') ,errorHandler(projectController.updateProduct))
router.get('/', projectController.getProduct)

router.get('/info/:_id', projectController.getInfoProduct)

router.use('/:productId/reviews',reviewRouter)

export default router