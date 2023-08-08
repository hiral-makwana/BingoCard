import { Segments, Joi, celebrate } from 'celebrate'

export default {
    createCard: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            card_logo : Joi.object(),
            card_title  :Joi.string(),
            card_type : Joi.string(),
            card_grid : Joi.number().integer(),
            card_settings: Joi.object(),
            card_items : Joi.object(),
            card_style :Joi.object(),
            card_image: Joi.array()
        })
    }),
    updateCard: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            card_logo : Joi.object(),
            card_title  :Joi.string(),
            card_type : Joi.string(),
            card_grid : Joi.number().integer(),
            card_settings: Joi.object(),
            card_items : Joi.object(),
            card_style :Joi.object()
        })
    })

}
