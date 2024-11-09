import {Router} from 'express'
import * as categoryController from './subCategory.controller.js'
import fileUpload, { fileType } from '../../utls/uploadFile/multer.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';

const router = Router({mergeParams: true});
router.get('/information',authorization([role.admin]), categoryController.getAllCategory)
router.get('/', categoryController.getActiveCategory)
router.patch('/:_id',authorization([role.admin]),fileUpload(fileType.image).single('image'),errorHandler(categoryController.updateCategory))
router.delete('/:_id',authorization([role.admin]), categoryController.destroy)
router.post('/',authorization([role.admin]),fileUpload(fileType.image).single('image'),errorHandler(categoryController.createCategory))
export default router