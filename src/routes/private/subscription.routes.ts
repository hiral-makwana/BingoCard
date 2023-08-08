import express, { Router } from 'express';
import subscriptionController from '../../controller/subscription.controller'
import subscriptionValidator from '../../validator/subscription.validator';

const router: Router = Router();


/** Routers  */
router.post('/create',subscriptionValidator.createSubscription(),subscriptionController.createSubscription)
router.post('/update/:id',subscriptionValidator.updateSubscription(),subscriptionController.updateSubscription)
router.post('/cancel/:id',subscriptionController.cancelSubscription)



export default router;