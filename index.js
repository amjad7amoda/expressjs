//============= Environemnt Setup ==============//
const env = require('dotenv');
env.config();

//============== Server Setup =================//
const express = require('express');
const app = express();
app.listen(process.env.PORT, process.env.HOSTNAME, () =>{
    console.log(`Working on http://localhost:${process.env.PORT}`);
});

// Cors Settings
const cors = require('cors');
app.use(cors());

//============== Database Setup ==================//
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/").then(() => {
    console.log('Database server started');
});

//================== Imports ======================//
const router = express.Router();
const path = require('path');
const apiRouter = require('./routers/api');
const {FAIL, SUCESS, ERROR} = require(path.join(__dirname, 'utlis', 'httpStatus.js'));
const multer = require('multer');
//================== App Use ===================//
// Request Body Parser Middleware
app.use(express.json()); // We can use [ bodyParser.json() ] instead of express.json().
app.use('/api/uploads', express.static(path.join(__dirname,'uploads')));
// Setup Api Router
app.use('/api', apiRouter);



// Middleware to handle the asyncWrapper Function
app.use( (error, req, res, next) => {
    if([400, 401].includes(error.statusCode)){
        res.status(error.statusCode).json({
            status: error.statusText,
            status_code: error.statucCode,
            data: {errors: error.message}
        })
    }else
    {res.status(error.statusCode || 500).json({status: error.statusText || ERROR ,
         message: error.message,
         status_code : error.statusCode || 500,
          data: null} )}
})

// Fall Down Middleware
app.all('*', (req, res, next) => {
    res.status(404).send({status: ERROR, message: "Not Found"})
});
