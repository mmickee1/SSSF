'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const uploads = multer({ dest: './public/uploads/' });
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')
const options = {
    key: sslkey,
    cert: sslcert
};


//USAGES ========================================================================================================================================
//app use listing. general stuff. 
app.use('public', express.static('public'));   //localhost:3000/public/filename.extension
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug');
app.enable('trust proxy');



//router listing. first slash is the route. require js file, where is the final path.
app.use('/posts', require('./routers/posts'));
app.use('/myUsers', require('./routers/user'));


//MONGO CONNECTION ==============================================================================================================================
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sssf`).then(() => {
    console.log('Connected successfully.');
    https.createServer(options, app).listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed :( ' + err);
});


//HELPER FUNCTIONS AND CONSTANTS
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback=cb
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('image');


//FUNCTIONS AND REAL CODE =======================================================================================================================
//home page. normal path
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/home', (req, res) => {
    res.render('index.pug', { title: 'Page title', message: 'Message!' });
});



//if request was bad, show this:
app.get('*', (req, res, next) => {
    next(`No matching path was found`);
});

