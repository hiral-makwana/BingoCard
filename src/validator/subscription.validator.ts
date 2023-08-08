import { Segments, Joi, celebrate } from 'celebrate'

export default {
    createSubscription: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_id: Joi.number().integer(),
            order_id: Joi.string(),
            order_type:Joi.number().integer(),
            plan_id: Joi.string(),
            plan_name: Joi.string(),
            subscription_status: Joi.string(),
            purchase_date: Joi.date(),
            next_renewal: Joi.date(),
        })
    }),
    updateSubscription: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_id: Joi.number().integer(),
            order_id: Joi.string(),
            plan_id: Joi.string(),
            order_type:Joi.number().integer(),
            plan_name: Joi.string(),
            subscription_status: Joi.string(),
            purchase_date: Joi.date(),
            next_renewal: Joi.date(),
        })
    }) 
}
