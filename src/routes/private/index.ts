import express, { Router } from 'express'
import cardRoute from './card.routes'
import subscriptionRoute from '../../routes/private/subscription.routes'

const routes: Router = express.Router()

routes.use('/cards', cardRoute)
routes.use('/subscriptions',subscriptionRoute)

export default routes