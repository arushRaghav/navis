const express = require('express');
// const fs = require('fs');
const morgan = require('morgan');

const port = 3000;

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//middleware start

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//middleware end

// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

////
//////////////
//route handlers part of method 1-3
/////////////

// const getAllTours = (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours: tours,
//         },
//     });
// };

// const getTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find((el) => el.id === id);

//     // if (id >= tours.length) {
//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID',
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: tour,
//         },
//     });
// };

// const createTour = (req, res) => {
//     const newID = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newID }, req.body);

//     tours.push(newTour);

//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
//         if (err) {
//             res.status(500).send('error');
//         }
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour,
//             },
//         });
//     });
// };

// const updateTour = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const deleteTour = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not Implemented',
//     });
// };

//
//
//routes
//method 1
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);

//method 2
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).dalete(deleteUser);

//method 3
// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

//////
//method 4 , made new files so that all code is not in a single file so that it is easy to read
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
