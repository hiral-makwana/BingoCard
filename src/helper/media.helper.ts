import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const externalDrivePath = global.config.ExternalFileUploadPath;
        const cardId = req.query.card_id;
        if (!cardId) {
            return cb(new Error('card_id is required in the request body'), '');
        }

        const cardImagesPath = `${externalDrivePath}/card_images/${cardId}`;

        if (!fs.existsSync(cardImagesPath)) {
            try {
                fs.mkdirSync(cardImagesPath, { recursive: true });
            } catch (error) {
                return cb(error as Error, '');
            }
        }
        cb(null, cardImagesPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;