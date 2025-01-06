import {Router} from 'express'
import { role } from '../../enum/enum.js';
import authorization from '../../utls/authorization.js';
import * as systemController from './system.controller.js'
const router = Router({mergeParams: true});

router.put('/',authorization([role.admin]),systemController.updateCommission)
router.get('/',authorization([role.admin]),systemController.getCommission)

export default router