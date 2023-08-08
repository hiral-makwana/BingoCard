import multer from 'multer';
import fs from 'fs';
import { Request } from 'express';

const storage = (cardId: number) => multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: any) => {
        const externalDrivePath = 'E:\\BingoCard_imgs'; // Double backslashes for Windows paths
        const cardImagesPath = `${externalDrivePath}/card_images/${cardId}`;

        if (!fs.existsSync(cardImagesPath)) {
            fs.mkdirSync(cardImagesPath, { recursive: true });
        }

        cb(null, cardImagesPath);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, file.originalname);
    }
});

export const configureUpload = (cardId: number) => multer({ storage: storage(cardId) });
