import { Request, Response, NextFunction } from 'express';
import { Op, where, Sequelize } from 'sequelize'
import { card } from '../models/card';
import moment from 'moment';
import cardFormDataValidate from '../validator/card.validator';
import { isJSONString } from '../helper/utils';


const upsertCard: any = async (req: Request, res: Response) => {
    try {
        let body: any = req.body
        body.card_logo = isJSONString(body.card_logo) ? JSON.parse(body.card_logo) : body.card_logo
        body.card_settings = isJSONString(body.card_settings) ? JSON.parse(body.card_settings) : body.card_settings
        body.card_items = isJSONString(body.card_items) ? JSON.parse(body.card_items) : body.card_items
        body.card_style = isJSONString(body.card_style) ? JSON.parse(body.card_style) : body.card_style
        const { error, value } = await cardFormDataValidate.validate(body);
        if (error) {
            return res.status(400).json({ status: false, message: error.details[0].message });
        }
        let card_id: any = req.params.id
        body.user_id = req.user.user_id
        body.card_logo = JSON.stringify(body.card_logo)
        body.card_settings = JSON.stringify(body.card_settings)
        body.card_items = JSON.stringify(body.card_items)
        body.card_style = JSON.stringify(body.card_style)

        if (card_id && card_id !== null) {
            let findCard = await card.findOne({ where: { card_id: card_id } })
            if (!findCard) {
                return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') })
            }
            let updateCard: any = await card.update(body, { where: { card_id: card_id } })
            if (updateCard > 0) {
                const updatedRecord: any = await card.findOne({ where: { card_id: card_id } });
                updatedRecord.card_logo = value.card_logo
                updatedRecord.card_settings = value.card_settings
                updatedRecord.card_style = value.card_style
                updatedRecord.card_items = value.card_items
                return res.status(200).send({ message: res.__('BINGO_CARD_UPDATED_SUCCESS'), data: updatedRecord });
            } else {
                return res.status(401).send({ status: 401, message: res.__('CARD_NOT_UPDATED') });
            }
        }
        let createCard: any = await card.create(body)
        if (createCard) {
            createCard.card_logo = value.card_logo
            createCard.card_settings = value.card_settings
            createCard.card_style = value.card_style
            createCard.card_items = value.card_items
            return res.status(200).send({ message: res.__('BINGO_CARD_CREATED_SUCCESS'), data: createCard });
        } else {
            return res.status(401).send({ status: 401, message: res.__('CARD_NOT_CREATED') });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};
const getCardDetail: any = async (req: Request, res: Response) => {
    try {
        let { user_id, card_title, card_type, card_grid, start_date, end_date }: any = req.body
        start_date = start_date ? moment(start_date, "YYYY-MM-DD").startOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
        end_date = end_date ? moment(end_date, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
        let query: any = { where: {}, raw: true }
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
                [Op.and]: [Sequelize.literal(`createdAt BETWEEN '${start_date}' AND '${end_date}'`)]
            }
        } else if (start_date && !end_date) {
            query.where.createdAt = { [Op.gte]: start_date }
        } else if (!start_date && end_date) {
            query.where.createdAt = { [Op.lte]: end_date }
        }
        let cardDetail: any = await card.findAll(query)
        if (cardDetail.length == 0) {
            return res.status(200).send({ status: 200, message: res.__('NO_CARD_FOUND_FOR_SEARCH') });
        } else {
            cardDetail.map((data: any) => {
                data.card_logo = isJSONString(data.card_logo) ? JSON.parse(data.card_logo) : data.card_logo
                data.card_settings = isJSONString(data.card_settings) ? JSON.parse(data.card_settings) : data.card_settings
                data.card_style = isJSONString(data.card_style) ? JSON.parse(data.card_style) : data.card_style
                data.card_items = isJSONString(data.card_items) ? JSON.parse(data.card_items) : data.card_items
                return data
            });
            return res.status(200).send({ message: res.__('BINGO_CARD_FOUND'), data: cardDetail });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}
const getCardDetailById: any = async (req: Request, res: Response) => {
    try {
        const card_id = req.params.id
        const cardDetail: any = await card.findOne({ where: { card_id: card_id } })
        if (!cardDetail) {
            return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') });
        } else {
            cardDetail.card_logo = JSON.parse(cardDetail.card_logo)
            cardDetail.card_settings = JSON.parse(cardDetail.card_settings)
            cardDetail.card_style = JSON.parse(cardDetail.card_style)
            cardDetail.card_items = JSON.parse(cardDetail.card_items)
            return res.status(200).send({ message: res.__('BINGO_CARD_FOUND'), data: cardDetail });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}
const deleteCard: any = async (req: Request, res: Response) => {
    try {
        const card_id = req.params.id
        const cardDetail = await card.destroy({ where: { card_id: card_id } })
        if (!cardDetail) {
            return res.status(404).send({ status: 404, message: res.__('BINGO_CARD_NOT_FOUND') });
        } else {
            return res.status(200).send({ message: res.__('BINGO_CARD_DELETE_SUCCESSFULLY') });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}

export = { upsertCard, getCardDetail, getCardDetailById, deleteCard } 