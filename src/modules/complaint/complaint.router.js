import Router from 'express'
import * as complaintController from './complaint.controller.js'
import { role } from '../../enum/enum.js';
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';

const router = Router();

router.post('/',authorization([role.saler,role.buyer]),errorHandler(complaintController.create))
router.get('/',authorization([role.admin]),errorHandler(complaintController.getAllComplaints))

export default router