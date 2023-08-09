import { Joi } from 'celebrate'

const cardFormDataValidate = Joi.object({
    card_logo: Joi.object().required(),
    card_title: Joi.string().required(),
    card_type: Joi.string().required().valid('text', 'images', 'emojis', 'numbers', 'combo'),
    card_grid: Joi.number().integer().required(),
    card_settings: Joi.object().required(),
    card_items: Joi.object().required(),
    card_style: Joi.object().required()
})

export = cardFormDataValidate

// export default {
//     createCard: () => celebrate({
//         [Segments.BODY]: Joi.object().keys({
//             card_logo : Joi.object(),
//             card_title  :Joi.string().required(),
//             card_type : Joi.string().required().valid('text','images','emojis','numbers','combo'),
//             card_grid : Joi.number().integer().required(),
//             card_settings: Joi.object().required(),
//             card_items : Joi.object().required(),
//             card_style :Joi.object().required(),
//             card_image : Joi.when('card_type', {
//                 is: Joi.exist().valid('images','combo'),
//                 then: Joi.object().required(),
//                 otherwise: Joi.object().allow(null, "")
//               }),
//         })
//     })
// }
