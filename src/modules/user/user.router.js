import Router from 'express'
import * as userController from './user.controller.js'
import authorization from '../../utls/authorization.js';
import fileUpload, { fileType } from '../../utls/uploadFile/multer.js';
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
const router = Router();

router.get('/confirmemail/:token', userController.confirmEmail)
router.get('/profile', authorization(Object.values(role)) , errorHandler(userController.getUserProfile))
router.get('/profile/:id',  errorHandler(userController.getCook))
router.patch('/profile/:id', authorization(Object.values(role)),fileUpload(fileType.image).single('image') ,errorHandler(userController.updateProfile))
router.get('/allusers', authorization(Object.values(role)) , errorHandler(userController.getAllUser))
router.get('/activeuser', errorHandler(userController.getActiveUser))

router.get('/cookproduct', errorHandler(userController.cookproduct))
router.get('/bestCook', errorHandler(userController.bestCook))
router.patch('/allusers/:id', authorization([role.admin]) , errorHandler(userController.changeUserStatus))
 
export default router

