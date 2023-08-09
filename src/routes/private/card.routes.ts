import express, { Router } from 'express';
import upload from '../../helper/media.helper';
import cardController from '../../controller/card.controller'
const router: Router = Router();
/** Routers  */

router.route('/create/:id?').post(upload.array('card_image'),cardController.upsertCard)

router.get('/',cardController.getCardDetail)
router.get('/:id',cardController.getCardDetailById)
router.delete('/:id',cardController.deleteCard)

export default router;