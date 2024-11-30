import Router from 'express'
import * as notificationController from './notification.controller.js'
import errorHandler from '../../utls/asyncHandler.js';
import authorization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
const router = Router();

router.post('/',errorHandler(notificationController.createNotification))
router.get('/',authorization(Object.values(role)),errorHandler(notificationController.getNotification))

export default router