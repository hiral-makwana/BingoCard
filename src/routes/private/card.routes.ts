import express, { Router } from 'express';
import cardValidator from '../../validator/card.validator';
import cardController from '../../controller/card.controller'
import upload from '../../helper/media.helper';

const router: Router = Router();
/** Routers  */

router.post('/create', upload.array('card_image'),cardController.upsertCard)
//router.route('/create/:id').post(cardValidator.updateCard(),cardController.upsertCard)

router.get('/',cardController.getCardDetail)
router.get('/:id',cardController.getCardDetailById)
router.delete('/:id',cardController.deleteCard)
export default router;