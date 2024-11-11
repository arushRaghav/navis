const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    });
});

/////////////////
/////////////////
////////////////
// const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// /// ./ in many places like here mean the location of the starting file
// /// which is app.js in this case. to access present working directory we use
// /// __dirname, but that is not the case with require

// //middleware for alias
// exports.getTopFiveCheap = catchAsync(async (req, res, next) => {
//     req.query.limit = 5;
//     req.query.sort = 'price';
//     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//     next();
// });

// //for routes middleware
// exports.getAllTours = catchAsync(async (req, res, next) => {
//     //Build query
//     //Filtering
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // //Advanced Filtering
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     // let query = Tour.find(JSON.parse(queryStr));

//     //sorting
//     // if (req.query.sort) {
//     //     const order = JSON.stringify(req.query.sort).replace(/,/g, ' ');
//     //     query = query.sort(JSON.parse(order));
//     // } else {
//     //     query = query.sort('createdAt');
//     // }

//     // //field limiting
//     // if (req.query.fields) {
//     //     const fields = req.query.fields.replace(/,/g, ' ');
//     //     query = query.select(fields);
//     // } else {
//     //     query = query.select('-__v');
//     // }

//     // //Pagination

//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // query = query.skip((page - 1) * limit).limit(limit);

//     // if (req.query.page) {
//     //     const numTours = await Tour.countDocuments();
//     //     if (numTours <= (page - 1) * limit) {
//     //         throw new Error('This page does not exist');
//     //     }
//     // }

//     //Execute query
//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;

//     //Send Response
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours: tours,
//         },
//     });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour,
//         },
//     });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour,
//         },
//     });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: tour,
//         },
//     });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null,
//     });
// });

// //mongoDB aggregation pipeline
// exports.getTourStats = catchAsync(async (req, res, next) => {
//     const stats = await Tour.aggregate([
//         {
//             $match: { ratingsAverage: { $gte: 4.5 } },
//         },
//         {
//             $group: {
//                 _id: { $toUpper: '$difficulty' },
//                 num: { $sum: 1 },
//                 numRatings: { $sum: '$ratingsQuantity' },
//                 avgRating: { $avg: '$ratingsAverage' },
//                 avgPrice: { $avg: '$price' },
//                 minPrice: { $min: '$price' },
//                 maxPirce: { $max: '$price' },
//             },
//         },
//         {
//             $sort: { avgPrice: -1 },
//         },
//     ]);
//     res.status(200).json({
//         status: 'success',
//         data: {
//             stats,
//         },
//     });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//     const year = req.params.year * 1;

//     const plan = await Tour.aggregate([
//         {
//             $unwind: '$startDates',
//         },
//         {
//             $match: {
//                 startDates: {
//                     $gte: new Date(`${year}-01-01`),
//                     $lte: new Date(`${year}-12-31`),
//                 },
//             },
//         },
//         {
//             $group: {
//                 _id: { $month: '$startDates' },
//                 numTourStarts: { $sum: 1 },
//                 tours: { $push: '$name' },
//             },
//         },
//         {
//             $addFields: { month: '$_id' },
//         },
//         {
//             $project: {
//                 _id: 0,
//             },
//         },
//         {
//             $sort: { numTourStarts: -1 },
//         },
//         {
//             $limit: 12,
//         },
//     ]);

//     res.status(200).json({
//         status: 'success',
//         data: {
//             plan,
//         },
//     });
// });
