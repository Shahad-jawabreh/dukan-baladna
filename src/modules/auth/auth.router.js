import {Router} from 'express'
import * as authController from './auth.controller.js'
import errorHandler from '../../utls/asyncHandler.js';
import validation from '../../utls/validation.js';
import {  signUpSchema } from './auth.validation.js';
const router = Router();

router.post('/login' ,errorHandler(authController.login))
router.post('/signup',errorHandler(authController.signup))
router.post('/signup-driver',errorHandler(authController.signupDriver))
router.patch('/sendcode', errorHandler(authController.sendCode))
router.patch('/forgetpassword', errorHandler(authController.forgetPassword))

export default router