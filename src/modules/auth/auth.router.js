import {Router} from 'express'
import * as authController from './auth.controller.js'
import errorHandler from '../../utls/asyncHandler.js';
const router = Router();


router.post('/login' ,errorHandler(authController.login));
router.post('/loginFirebase' ,errorHandler(authController.loginFirebase));
router.post('/signup',errorHandler(authController.signup))
router.post('/signup-driver',errorHandler(authController.signupDriver))
router.patch('/sendcode', errorHandler(authController.sendCode))
router.patch('/verifycode', errorHandler(authController.verifycode))
router.post('/chatGPT', errorHandler(authController.GPT))
router.patch('/resetpassword', errorHandler(authController.forgetPassword))

export default router