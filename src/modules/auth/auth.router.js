import {Router} from 'express'
import * as authController from './auth.controller.js'
import errorHandler from '../../utls/asyncHandler.js';
import validation from '../../utls/validation.js';
import {  signUpSchema } from './auth.validation.js';
const router = Router();

router.post('/login' ,errorHandler(authController.login))
router.post('/signup', validation(signUpSchema),errorHandler(authController.signup))
router.patch('/sendcode', errorHandler(authController.sendCode))
router.patch('/forgetpassword', errorHandler(authController.forgetPassword))

export default router