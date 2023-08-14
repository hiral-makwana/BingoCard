import { Request, Response, NextFunction } from 'express';
import { Op, where, Sequelize } from 'sequelize'
import { subscription, subscription_status } from '../models/subscription';
import moment from 'moment';

const createSubscription: any = async (req: Request, res: Response) => {
    try {
        let body: any = req.body
        const finduser: any = await subscription.findOne({ where: { user_id: body.user_id }, order: [['createdAt', 'DESC']] })
        if (finduser != null) {
            if (finduser.subscription_status == subscription_status.ACTIVE) {
                return res.status(200).send({ message: res.__('SUBSCRIPTION_ALREADY') });
            }
            if (moment(body.purchase_date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                return res.status(200).send({ message: res.__('SUBSCRIPTION_DATE_NOT_PAST') });
            }
            if (moment(body.next_renewal).format('YYYY-MM-DD') <= moment(body.purchase_date).format('YYYY-MM-DD')) {
                return res.status(200).send({ message: res.__('RENEWAL_DATE_NOT_PAST') });
            }
        }
        const createSubscription = await subscription.create(body)
        if (createSubscription) {
            return res.status(200).send({ message: res.__('SUCCESSFULLUY_SUBSCIBED') });
        } else {
            return res.status(401).send({ status: 401, message: res.__('NOT_SUBSCRIBE') });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};
const updateSubscription: any = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const us_id = req.params.id
        const { user_id, subscription_status } = req.body
        const findSubscription = await subscription.findOne({ where: { us_id, user_id } })
        if (!findSubscription) {
            return res.status(404).send({ status: 404, message: res.__('SUBSCRIPTION_NOT_FOUND') });
        }
        else {
            if (subscription_status == 'active') {
                const findPlan: any = await subscription.findOne({ where: { user_id: body.user_id, subscription_status: 'active', order_id: body.order_id }, order: [['createdAt', 'DESC']] })
                if (findPlan != null) {
                    return res.status(200).send({ message: res.__('SUBSCRIPTION_ALREADY') });
                }
            }
            if (moment(body.purchase_date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                return res.status(200).send({ message: res.__('SUBSCRIPTION_DATE_NOT_PAST') });
            }
            if (moment(body.next_renewal).format('YYYY-MM-DD') <= moment(body.purchase_date).format('YYYY-MM-DD')) {
                return res.status(200).send({ message: res.__('RENEWAL_DATE_NOT_PAST') });
            }
        }
        const updateSubscription: any = await subscription.update(body, { where: { us_id, user_id } })
        if (updateSubscription > 0) {
            const updatedRecord = await subscription.findOne({ where: { us_id, user_id } });
            return res.status(200).send({ message: res.__('SUBSCRIPTION_UPDATE_SUCCESFULLY') });
        } else {
            return res.status(401).send({ status: 401, message: res.__('SUBSCRIPTION_NOT_UPDATE') });
        }
    } catch (e) {
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}

const cancelSubscription: any = async (req: Request, res: Response) => {
    try {
        const us_id = req.params.id
        const { user_id, subscribe_id, order_id } = req.body
        const findSubscription = await subscription.findOne({ where: { us_id, subscribe_id, user_id, order_id } })
        if (!findSubscription) {
            return res.status(404).send({ status: 404, message: res.__('SUBSCRIPTION_NOT_FOUND') });
        }
        if (findSubscription.subscription_status == subscription_status.CANCELLED) {
            return res.status(404).send({ status: 404, message: res.__('SUBSCRIPTION_ALREADY_CANCELLED') });
        }
        const cancelSubscription: any = await subscription.update({ subscription_status: subscription_status.CANCELLED }, { where: { us_id, subscribe_id, user_id, order_id } });
        if (cancelSubscription > 0) {
            return res.status(200).send({ message: res.__('SUBSCRIPTION_CANCEL_SUCCESS') });;
        } else {
            return res.status(401).send({ status: 401, message: res.__('SUBSCRIPTION_NOT_CANCEL') });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
}

const getSubscriptionList: any = async (req: Request, res: Response) => {
    try {
        let { user_id, stripe_plan_id, purchase_type, subscription_status, start_date, end_date }: any = req.body
        start_date = start_date ? moment(start_date).startOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
        end_date = end_date ? moment(end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
        let query: any = { where: {} }
        if (user_id && user_id !== undefined) {
            query.where.user_id = user_id
        }
        if (stripe_plan_id && stripe_plan_id !== undefined) {
            query.where.stripe_plan_id = stripe_plan_id
        }
        if (purchase_type && purchase_type !== undefined) {
            query.where.purchase_type = purchase_type
        }
        if (subscription_status && subscription_status !== undefined) {
            query.where.subscription_status = subscription_status
        }
        if (moment(start_date).format('YYYY-MM-DD') > moment(end_date).format('YYYY-MM-DD')) {
            return res.status(200).send({ message: res.__('END_DATE_SHOULD_BE_GREATER') });
        }
        if (start_date && end_date) {
            query.where.purchase_date = {
                [Op.and]: [Sequelize.literal(`purchase_date BETWEEN '${start_date}' AND '${end_date}'`)]
            }
        } else if (start_date && !end_date) {
            query.where.purchase_date = { [Op.gte]: start_date }
        } else if (!start_date && end_date) {
            query.where.purchase_date = { [Op.lte]: end_date }
        }

        let subscriptionDetail: any = await subscription.findAll(query)
        if (subscriptionDetail.length == 0) {
            return res.status(200).send({ status: 200, message: res.__('SUBSCRIPTION_NOT_FOUND') });
        } else {
            return res.status(200).send({ message: res.__('SUBSCRIPTION_FOUND'), data: subscriptionDetail });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: res.__('SOMETHING_WENT_WRONG') });
    }
};

export = { createSubscription, updateSubscription, cancelSubscription, getSubscriptionList } 