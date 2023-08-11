import express, { Router, Request, Response } from 'express';
import upload from '../../helper/media.helper';
import cardController from '../../controller/card.controller'
const router: Router = Router();
import fs from 'fs';
import multer from 'multer';
//const storage = multer.memoryStorage();
const uploadText = multer();
import path from 'path';
const tempStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const cardImagesPath = path.join(__dirname, 'card_images');

        if (!fs.existsSync(cardImagesPath)) {
            try {
                fs.mkdirSync(cardImagesPath, { recursive: true });
            } catch (error) {
                console.error('Error creating directory:', error);
                //return cb(error, '');
            }
        }

        cb(null, cardImagesPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.originalname);
    }
});


const uploadLogo = multer({ storage: tempStorage });

router.post('/create/:id?', cardController.upsertCard)
router.get('/', cardController.getCardDetail);
router.get('/:id', cardController.getCardDetailById);
router.delete('/:id', cardController.deleteCard);
router.post('/fileUpload', cardController.uploadFile);

export default router;