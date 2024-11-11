const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const app = express();

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');

///

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// global middleware start
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    'https://api.mapbox.com',
                    'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
                    '*',
                ],
                styleSrc: ["'self'", 'https://api.mapbox.com', 'https://fonts.googleapis.com'],
                imgSrc: ["'self'", 'https://api.mapbox.com', 'data:'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                connectSrc: [
                    "'self'",
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                    '*',
                    'ws://127.0.0.1:*',
                ],
                workerSrc: ["'self'", 'blob:'],
            },
        },
    })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});

//made new files so that all code is not in a single file so that it is easy to read
//mounting routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//error handling middleware
app.use(globalErrorHandler);
//////
////middleware end

module.exports = app;
