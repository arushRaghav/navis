const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception. Shutting down...');
    console.log(err.name, err.message);
    //console.log(err);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DB_PASSWORD);

////////
//connecting to database
mongoose.connect(DB, {}).then((con) => {
    //console.log(con.connections);
    console.log('connected to databse');
});

// const testTour = new Tour({
//     name: 'The forest Hikerr',
//     rating: 4.7,
//     price: 497,
// });

// testTour
//     .save()
//     .then((doc) => {
//         console.log(doc);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

/////
// printing env varriables
//console.log(process.env);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandles Rejection. Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
