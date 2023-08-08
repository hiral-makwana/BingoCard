import { Request, Response, NextFunction } from 'express';
import { Op, where } from 'sequelize'
import { subscription } from '../models/subscription';
import moment from 'moment';

const createSubscription: any = async (req: Request, res: Response) => {
    try {
        let body: any = req.body
        const createSubscription = await subscription.create(body)
        if (createSubscription) {
            return res.status(200).send({ message: res.__('SUCCESSFULLUY_SUBSCIBED') });
        }
        return res.status(401).send({ status: 401, message: res.__('NOT_SUBSCRIBE') });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};
const updateSubscription: any = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const subscription_id = req.params.id
        const findSubscription = await subscription.findOne({ where: { us_id: subscription_id } })
        if (!findSubscription) {
            return res.status(404).send({ status: 404, message: res.__('SUBSCRIPTION_NOT_FOUND') });
        }
        const updateSubscription: any = await subscription.update(body, { where: { us_id: subscription_id } })
        if (updateSubscription > 0) {
            const updatedRecord = await subscription.findOne({ where: { us_id: subscription_id } });
            return res.status(200).send({ message: res.__('SUBSCRIPTION_UPDATE_SUCCESFULLY') });
        } else {
            return res.status(401).send({ status: 401, message: res.__('SUBSCRIPTION_NOT_UPDATE') });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}
const cancelSubscription: any = async (req: Request, res: Response) => {
    try {
        const subscription_id = req.params.id
        const findSubscription = await subscription.findOne({ where: { us_id: subscription_id } })
        if (!findSubscription) {
            return res.status(404).send({ status: 404, message: res.__('SUBSCRIPTION_NOT_FOUND') });
        }
        const cancelSubscription = await subscription.destroy({ where: { us_id: subscription_id } })
        if (!cancelSubscription) {
            return res.status(401).send({ status: 401, message: res.__('SUBSCRIPTION_NOT_CANCEL') });
        }
        return res.status(200).send({ message: res.__('SUBSCRIPTION_CANCEL_SUCCESS') });;
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}

export = { createSubscription, updateSubscription, cancelSubscription }