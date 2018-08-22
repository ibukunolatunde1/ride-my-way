import express from 'express';

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
