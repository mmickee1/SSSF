'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const cors = require('cors');
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
const storageinit = require('storage');
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
const postModel = require('./models/uploadinfo');



//USAGES ========================================================================================================================================
//app use listing. general stuff. 
app.use('public', express.static('public'));   //localhost:3000/public/filename.extension
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(helmet());
app.use(cors());


//router listing. first slash is the route. require js file, where is the final path.
app.use('/posts', require('./routers/posts'));
app.use('/users', require('./routers/user'));


//MONGO CONNECTION ==============================================================================================================================
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sssf`).then(() => {
    console.log('Connected successfully.');
    https.createServer(options, app).listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed :( ' + err);
});



//FUNCTIONS AND REAL CODE =======================================================================================================================
//home page. normal path
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    postModel.find().exec().then(all => {
        var myarray = [];
        //var post = Object.keys(all);
        //console.log(all)
        for (var i = 0; i < all.length; i++) {
            myarray.push(all[i].category);      // + "<br>";
            //console.log();
        }
        //res.send(all);
        res.render('index.pug', { title: 'Home', message: myarray, total: 'Total number of posts found: ' + all.length });
    });
});

//example from internet. to show multiple images use for loop and and pics+info to array for example
/*app.get('/images/:imgname', function(req,res) {

    Picture.find({ "picture.path": req.param("imgname") }, function(err,pic) {
        if (err) // checking here

        // Sending response        
        res.set('Content-Type', pic.mime);
        res.send( pic[0].picture.data );
    }); 

})*/


//if request was bad, show this:
app.get('*', (req, res, next) => {
    next(`No matching path was found`);
});
