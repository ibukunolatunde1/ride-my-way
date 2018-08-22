import express from 'express';
import auth from '../middleware/auth';
import { userSignUpValidator, userSignInValidator, rideOfferValidator } from '../middleware/validate';
import { signUp, logIn } from '../controller/userController';
import { createRide, getAllRides, getRideAtId } from '../controller/rideOfferController';
import { getRequests, createRequest, verifyRequest } from '../controller/rideRequestController';

const router = express.Router();

router.post('/user/signup', userSignUpValidator, signUp);
router.post('/user/login', userSignInValidator, logIn);
router.post('/rides', auth, rideOfferValidator, createRide);
router.get('/rides', auth, getAllRides);
router.get('/rides/:id', auth, getRideAtId);
router.post('/rides/:id/requests', auth, createRequest);
router.get('/users/rides/:id/requests', auth, getRequests);
router.put('/users/rides/:rideId/requests/:requestId', auth, verifyRequest);

export default router;
