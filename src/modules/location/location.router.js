import Router from 'express'
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
import * as locationController  from './location.controller.js';
const router = Router();

router.post('/',errorHandler(locationController.storeLocation))


export default router