import { Request, Response, NextFunction } from 'express';
import { Op, where } from 'sequelize'
import { card } from '../models/card';
import moment from 'moment';
import {configureUpload} from '../helper/media.helper';

const upsertCard: any = async (req: Request, res: Response) => {
    try {
        const body: any = req.body
        let card_id: any = req.params.id
        body.user_id = req.user.user_id
        console.log("body data",body.card_image)
        body.card_settings = JSON.stringify(body.card_settings)
        body.card_items = JSON.stringify(body.card_items)
        body.card_style =JSON.stringify(body.card_style)
        if (card_id && card_id !== null) {
            let findcardCard = await card.findOne({ where: { card_id: card_id } })
            if (!findcardCard)
                return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') });
        }
        if (card_id && card_id !== null) {
            let updateCard : any = await card.update(body, { where: { card_id: card_id } })
            if(updateCard > 0){                
                const updatedRecord = await card.findOne({ where: { card_id: card_id } });
                if(updatedRecord != null){
                    if (body.card_type === 'images' || body.card_type === 'combo') {
                        uploadImages(updatedRecord.card_id, body.card_image);
                    }
                    return res.status(200).send({ message: res.__('BINGO_CARD_UPDATED_SUCCESS'), data: updatedRecord });
                }                
            }else{
                return res.status(401).send({status : 401, message: res.__('CARD_NOT_UPDATED') });
            }
        }
        let createCard = await card.create(body)
        if (createCard) {
            const upload = configureUpload(card_id);    
    try {
        await uploadImages(upload, req);
        next();
    } catch (err) {
        console.error('Error uploading images:', err);
        // Handle the error and send a response to the client
    }
            return res.status(200).send({ message: res.__('BINGO_CARD_CREATED_SUCCESS'), data: createCard });
        }
        return res.status(401).send({ status: 401, message: res.__('CARD_NOT_CREATED') });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};

function uploadImages(cardId: number, images: any[]) {
    console.log(cardId)
    const uploadMiddleware = upload.array('card_images');
    uploadMiddleware(images, null, (err: any) => {
      if (err) {
        console.error('Error uploading images:', err);
      } else {
        console.log('Images uploaded successfully');
      }
    });
}  
const getCardDetail: any = async (req: Request, res: Response) => {
    try {
        let {user_id,card_title,card_type,card_grid,start_date,end_date} : any = req.query
        start_date = moment.utc(start_date,"YYYY-MM-DD").format('YYYY-MM-DD')
        end_date = moment.utc(end_date,'YYYY-MM-DD').format('YYYY-MM-DD')
        let query: any = {where :{}}
        if (user_id && user_id !== undefined) {
            query.where.user_id = user_id
        }
        if (card_title && card_title !== undefined) {
            query.where.card_title = {
                [Op.like]: `%${card_title}%`
            }
        }
        if (card_type && card_type !== undefined) {
            query.where.card_type = card_type
        }
        if (card_grid && card_grid !== undefined) {
            query.where.card_grid = card_grid
        }
        if (start_date && end_date) {
            query.where.createdAt = {
                [Op.between]: [
                    start_date, end_date]
            };
        } else if (start_date) {
            query.where.createdAt = { [Op.gte]: start_date }
        } else if (end_date) {
            query.where.createdAt = { [Op.lte]:end_date }
        }

        const cardDetail = await card.findAll(query)
        if (cardDetail.length == 0) {
            return res.status(200).send({ status: 200, message: res.__('NO_CARD_FOUND_FOR_SEARCH') });
        }
        return res.status(200).send({ message: res.__('BINGO_CARD_FOUND'), data: cardDetail });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};
const getCardDetailById: any = async (req: Request, res: Response) => {
    try {
        const card_id = req.params.id
        const cardDetail = await card.findOne({ where: { card_id: card_id } })
        if (!cardDetail) {
            return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') });
        }
        return res.status(200).send({ message: res.__('BINGO_CARD_FOUND'), data: cardDetail });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};
const deleteCard: any = async (req: Request, res: Response) => {
    try {
        const card_id = req.params.id
        const cardDetail = await card.destroy({ where: { card_id: card_id } })
        if (!cardDetail) {
            return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') });
        }
        return res.status(200).send({ message: res.__('SUBSCRIPTION_CANCEL_SUCCESS') });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};

export = { upsertCard, getCardDetail, getCardDetailById, deleteCard } 