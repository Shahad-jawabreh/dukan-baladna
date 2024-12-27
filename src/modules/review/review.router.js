import {Router} from 'express'
import autherization from '../../utls/authorization.js';
import { role } from '../../enum/enum.js';
import authorization from '../../utls/authorization.js';
import * as reviewController from './review.controller.js'
import fileUpload, { fileType } from '../../utls/uploadFile/multer.js';
const router = Router({mergeParams: true});

router.post('/',authorization([role.buyer]),fileUpload(fileType.image).single('image') ,reviewController.createReview)
router.post('/:id',authorization([role.saler]),reviewController.replyToReview)

export default router