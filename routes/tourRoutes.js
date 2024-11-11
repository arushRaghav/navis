const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

module.exports = router;

//////////////////
//////////////////
// const express = require('express');
// const tourControllers = require('./../controllers/tourController');
// const authController = require('./../controllers/authController');
// const reviewRouter = require('./../routes/reviewRoutes');

// const router = express.Router();

// //router.param('id', tourControllers.checkID);
// // router.route('/').get(tourControllers.getAllTours).post(tourControllers.checkBody, tourControllers.createTour);

// router.use('/:tourId/reviews', reviewRouter);

// //alias
// router.route('/top-5-cheap').get(tourControllers.getTopFiveCheap, tourControllers.getAllTours);

// //aggregation pipeline
// router.route('/tour-stats').get(tourControllers.getTourStats);
// router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

// //routes
// router
//     .route('/')
//     .get(authController.protect, tourControllers.getAllTours)
//     .post(tourControllers.createTour);
// router
//     .route('/:id')
//     .get(tourControllers.getTour)
//     .patch(tourControllers.updateTour)
//     .delete(
//         authController.protect,
//         authController.restrictTo('admin', 'lead-guide'),
//         tourControllers.deleteTour
//     );

// module.exports = router;
