import express from 'express';
import {addspecialOrder,getspecialOrder} from './specialOrder.controller.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
const router = express.Router();

router.post('/',errorHandler(addspecialOrder));     
router.get('/',authorization([role.buyer,role.saler]),errorHandler(getspecialOrder));     

export default router;
