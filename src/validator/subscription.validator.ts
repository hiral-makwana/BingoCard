import { Segments, Joi, celebrate } from 'celebrate'

export default {
    createSubscription: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            subscribe_id: Joi.number().integer().required(),
            order_id: Joi.string().required(),
            purchase_type:Joi.number().integer().required(),
            stripe_plan_id: Joi.string().required(),
            plan_name: Joi.string().required(),
            subscription_status: Joi.string().required().valid('active','Trial','Cancelled'),
            purchase_date: Joi.date().required(),
            next_renewal: Joi.date().required(),
        })
    }),
    updateSubscription: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            subscribe_id: Joi.number().integer().required(),
            order_id: Joi.string().required(),
            stripe_plan_id: Joi.string().required(),
            purchase_type:Joi.number().integer().required(),
            plan_name: Joi.string().required(),
            subscription_status: Joi.string().required().valid('active','Trial','Cancelled'),
            purchase_date: Joi.date().required(),
            next_renewal: Joi.date().required(),
        })
    }),
    cancelSubscription :()=> celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            subscribe_id : Joi.number().integer().required(),
            order_id: Joi.string().required()
        })
    }) 
}
