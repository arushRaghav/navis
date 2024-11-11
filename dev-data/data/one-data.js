const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');
const tours = require('./../../models/tourModel');
const users = require('./../../models/userModel');
const reviews = require('./../../models/reviewModel');

const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DB_PASSWORD);

mongoose.connect(DB).then((con) => {
    console.log('connected to database');
});

console.log(process.argv);

async function deleteData() {
    try {
        await tours.deleteMany();
        // await users.deleteMany();
        // await reviews.deleteMany();
        console.log('Data deleted');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

async function insertData() {
    try {
        await tours.insertMany(tour);
        //await users.insertMany(user, { validateBeforeSave: false });
        //await reviews.insertMany(review);
        console.log('Data inserted');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

if (process.argv[2] === '--delete-data') {
    deleteData();
} else if (process.argv[2] === '--insert-data') {
    insertData();
}

// process.exit();
