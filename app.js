const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// require api routes
const productsRoutes = require('./routes/api/products');
const ordersRoutes = require('./routes/api/orders');
const userRoutes = require('./routes/api/user');

// database connected to MongoDb Atlas
mongoose.connect('mongodb://node-shop:' + 
    process.env.MONGO_ATLAS_PW +
    '@cluster0-shard-00-00-w1bxc.mongodb.net:27017,cluster0-shard-00-01-w1bxc.mongodb.net:27017,cluster0-shard-00-02-w1bxc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

//  static file
app.use( '/uploads' , express.static('uploads'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Handling CORS - To allow other sites to use API
app.use( (req,res,next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if( req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, DELETE, POST');
        return res.status(200).json({});
    }
    next();
});


// middlewares that handle api routes
app.use('/api/products' , productsRoutes);
app.use('/api/orders' , ordersRoutes);
app.use('/api/user', userRoutes);

/* 
    Error handling
    1- make our own error
    2- catch error 
*/

// 1- make our own error 
app.use( (req,res,next) => {
    const error = new Error("Not Found For this url");
    error.status = 404;
    next(error);
});

// 2- catch error
app.use( (error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});




module.exports = app;

