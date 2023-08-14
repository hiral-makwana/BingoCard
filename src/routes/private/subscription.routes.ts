import express, { Router } from 'express';
import subscriptionController from '../../controller/subscription.controller'
import subscriptionValidator from '../../validator/subscription.validator';

const router: Router = Router();


/** Routers  */
router.post('/create',subscriptionValidator.createSubscription(),subscriptionController.createSubscription)
router.post('/update/:id',subscriptionValidator.updateSubscription(),subscriptionController.updateSubscription)
router.post('/cancel/:id',subscriptionValidator.cancelSubscription(),subscriptionController.cancelSubscription)
router.get('/',subscriptionController.getSubscriptionList)

export default router;