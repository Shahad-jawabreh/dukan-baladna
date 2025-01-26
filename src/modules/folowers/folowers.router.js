import express from 'express';
import {addUser ,getCookers} from './folowers.controller.js'; // Update the path
import authorization from '../../utls/authorization.js';
import errorHandler from '../../utls/asyncHandler.js';
import { role } from '../../enum/enum.js';

const router = express.Router();

router.post('/:cookerId', errorHandler(addUser));     
router.get('/' ,authorization([role.buyer,role.saler]),errorHandler(getCookers));       
export default router;
