import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        const cardId = req.body.card_id;
        // Replace this with the path to the external drive
        //const externalDrivePath = global.config.ExternalFileUploadPath;
        const userId = (req.user as any).user_id;

        //full path for the card_images directory
        const cardImagesPath = `./card_images/${userId}`;

        if (!fs.existsSync(cardImagesPath)) {
            fs.mkdirSync(cardImagesPath, { recursive: true });
        }
        cb(null, cardImagesPath);
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;