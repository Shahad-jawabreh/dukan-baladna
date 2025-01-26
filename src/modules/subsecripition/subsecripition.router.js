import express from 'express';
import {addSubscribe} from './subsecripition.controller.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
const router = express.Router();

router.post('/',authorization(Object.values(role)) ,errorHandler(addSubscribe));     
export default router;
