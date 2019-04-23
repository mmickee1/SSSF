'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const session = require('express-session');
const MemcachedStore = require('connect-memcached')(session);
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const uploads = multer({ dest: './public/uploads/' });
const path = require('path');
const mongoose = require('mongoose');
// NOT USED WITH JELASTIC!!
/*
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')
const options = {
    key: sslkey,
    cert: sslcert
};
*/
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
const postController = require('./controllers/postController');


//router listing. first slash is the route. require js file, where is the final path.
app.use('/posts', require('./routers/posts'));
app.use('/users', require('./routers/user'));


//USAGES ========================================================================================================================================
//app use listing. general stuff. 
app.use(express.static('public'));   //localhost:3000/public/filename.extension
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(helmet());
app.use(cors());


//TODO: http redir to https
//MONGO CONNECTION ==============================================================================================================================
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sssf`, { useNewUrlParser: true }).then(() => {
    console.log('Connected successfully.');
    //https.createServer(options, app).listen(process.env.APP_PORT);
    https.createServer(app).listen(process.env.APP_PORT);
    //app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed :( ' + err);
});
app.use((req, res, next) => {
    if (req.secure) {
        // request was via https, so do no special handling
        //console.log('https was already in use, great!');
        next();
    } else {
        // request was via http, so redirect to https
       // console.log('redirection to https was used!!!');
        res.redirect('https://' + req.headers.host + req.url);
    }
});

//FUNCTIONS AND REAL CODE =======================================================================================================================
//home page. normal path
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('index.pug', { title: 'Home', message: 'Hello!' });
});


//if request was bad, show this: 
/*
app.get('*', (req, res, next) => {
    next(`No matching path was found`);
});*/


/*
//loggings
app.use(session({
    secret: 'CatOnKeyboard'
    , key: 'test'
    , proxy: 'true'
    , store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
        secret: '123, easy as ABC. ABC, easy as 123'
    })
}));
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || !bcrypt.compareSync(password, process.env.password)) {
            done(null, false, { message: 'Incorrect credentials.' });
            return;
        }
        return done(null, { user: username }); // returned object usally contains something to identify the user
    }
));
app.use(passport.initialize());
// data put in passport cookies needs to be serialized
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(session({
    secret: 'some s3cr3t value',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true, // only over https
        maxAge: 2 * 60 * 60 * 1000
    } // 2 hours
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/all',
        failureRedirect: '/test'
    })
);*/