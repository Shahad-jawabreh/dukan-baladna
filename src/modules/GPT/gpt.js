import Router from 'express'
import errorHandler from '../../utls/asyncHandler.js';
import * as gptController from './gpt.controller.js';
const router = Router();

router.post('/',errorHandler(gptController.gpt))


export default router