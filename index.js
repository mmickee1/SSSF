'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const uploads = multer({ dest: './public/uploads/' });
const path = require('path');
const mongoose = require('mongoose');
const storageinit = require('storage');
const passport = require('passport');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
require('./config/passport')(passport);
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
const postController = require('./controllers/postController');


//USAGES ========================================================================================================================================
//app use listing. general stuff. 
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(helmet());
app.use(cors());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//router listing. first slash is the route. require js file, where is the final path.
app.use('/posts', require('./routers/posts'));
app.use('/users', require('./routers/user'));



// NOT USED WITH JELASTIC!!
/*
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')
const options = {
    key: sslkey,
    cert: sslcert
};*/


//MONGO CONNECTION ==============================================================================================================================
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sssf`, { useNewUrlParser: true }).then(() => {
    console.log('Connected successfully.');
    //https.createServer(options, app).listen(process.env.APP_PORT);  //not w jelastic
    app.listen(process.env.APP_PORT);     //yes w jelastic
}, err => {
    console.log('Connection to db failed :( ' + err);
});
app.use((req, res, next) => {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

//FUNCTIONS AND REAL CODE =======================================================================================================================
app.get('/', forwardAuthenticated, (req, res) => {
    res.render('index.pug', {title: 'Home', message: 'Hello!'});
});

app.get('/home', ensureAuthenticated, (req, res) => {
    console.log('USER BEING HOME SCREEN: ' + req.user);
    res.render('index.pug', { title: 'Home', message: 'Hello ' + req.user.email, user: req.user});
});

