'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const sharp = require('sharp');
const multer = require('multer');
const uploads = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');
const jsonfile = require('jsonfile');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');
const file = './data.json';
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const http = require('http');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectID;
const lang = require('./languages/lang');
const pug = require('pug');


const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage
}).single('image');


function loadImg() {
    var mydata = JSON.parse('data.json');
    alert(mydata.length);

    var div = document.getElementById('data');

    for (var i = 0; i < mydata.length; i++) {
        div.innerHTML = div.innerHTML + "<p class='inner' id=" + i + ">" + mydata[i].name + "</p>" + "<br>";
    }
}

//not yet used anywhere
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image.png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.static('public'));
app.set('view-engine', 'pug');



const Schema = mongoose.Schema;
const picSchema = new Schema({
    fieldname: String,
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
});

const Picture = mongoose.model('Picture', picSchema);
const uploadSchema = new Schema({
    category: String,
    title: String,
    description: String,
});
const UploadInfo = mongoose.model('UploadInfo', uploadSchema);

//when posting file.... put these to schema
/*const file = req.file;
req.body.thumbnail = 'thumb/' + file.filename;
req.body.image = 'img/' + file.filename;
req.body.original = 'original/' + file.filename;
req.body.time = new Date().getTime(); */


//security stuff
const bcrypt = require('bcrypt');
const saltRound = 12; //okayish in 2018
const myPwd = 'Secret123';

const session = require('express-session');
const MemcachedStore = require('connect-memcached')(session);

const helmet = require('helmet');
app.use(helmet());
const cors = require('cors');
app.use(cors());

app.enable('trust proxy');

/*
bcrypt.hash(myPwd, saltRound, (err, hash) => {
    // Store hash in the database
});

// Load hash from your database
bcrypt.compare(myPwd, hash, (err, res) => {
    // res == true (hopefully)
});*/


// Connect to mongodb
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/sssf`).then(() => {
    console.log('Connected successfully.');
    // app.listen(process.env.APP_PORT);
    https.createServer(options, app).listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed :( ' + err);
});


//main view. 
app.get('/', (req, res) => {
    res.render('index.pug', lang[req.query.lang])
});

app.get('/home', (req, res) => {
    res.render('index.pug', lang[req.query.lang])
});



//returns everything from database in json.
app.get('/all', (req, res) => {
    Picture.find().then(all => {
        console.log(all);
        res.send(all);
    });
});


app.get('/view', (req, res) => {
    jsonfile.readFile(file)
        .then(obj => console.dir(obj))
        .catch(error => console.error(error))

});


// Middleware for thumbnails
app.post('/upload', bodyParser.urlencoded({ extended: true }), (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(400);
        } else {
            if (req.file == undefined) {
                res.send('no file selected');
            } else {
                console.log(req.file);
                //res.send(req.file);
                //jsonfile.writeFile(file, req.file, { flag: 'a' })
                next();
            }
        }
    });
});


app.use('/upload', (req, res, next) => {
    // do small 200x200 thumbnail
    sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/img/out200x200.jpg', (err) => {
        });
    next();
});

app.use('/upload', (req, res, next) => {
    // do medium 400x400 thumbnail
    sharp(req.file.path)
        .resize(400, 400)
        .toFile('public/img/out400x400.jpg', (err) => {
        });
    next();
});

app.use('/upload', (req, res, next) => {
    UploadInfo.create({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description
    }).then(c => {
        res.send('Imagefile uploaded: ' + c.id);
    }, err => {
        res.send('Error: ' + err);
    });
});

app.get('/add', function (req, res) {
    res.render('add.pug', { title: 'Hey', message: 'Hello there!' })
});


//Deleting a file
app.post('/delete', bodyParser.urlencoded({ extended: true }), (req, res) => {
    console.log('reqbody: ' + req.body);
    const deletedImage = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
    };

    UploadInfo.find()
        .where('title').equals(req.body.title)
        .then(
            d => {
                console.log('THIS IS THE D' + d);
                //UploadInfo.deleteOne({ _id: req.params.id }).then(c => {
                UploadInfo.deleteOne({ title: req.body.title }).then(c => {
                    res.send('File deleted: ' + req.body.title);
                }, err => {
                    res.send('Error: ' + err);
                });
            },
            err => {
                res.send('Error: ' + err);
            });

});


//editing an existing file's info
app.post('/update', bodyParser.urlencoded({ extended: true }), (req, res) => {
    console.log('reqbody: ' + req.body);
    const editedFile = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description
    };

    UploadInfo.find()
        .where('title').equals(req.body.title)
        .then(
            d => {
                console.log('THIS IS THE D' + d);
                UploadInfo.updateOne({ title: req.body.title }, {
                    category: req.body.category,
                    title: req.body.title,
                    description: req.body.description

                }).then(c => {
                    res.send('File edited: ' + req.body.title);
                }, err => {
                    res.send('Error: ' + err);
                });
            },
            err => {
                res.send('Error: ' + err);
            });

});



//searching
//getting file by title
app.get('/picture/title/:title', (req, res) => {
    UploadInfo.find()
        .where('title').equals(req.params.title)
        .then(
            d => {
                console.log(d);
                res.send(d);
            },
            err => {
                res.send('Error: ' + err);
            });
});



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
);

app.get('/test', (req, res) => {
    res.send('login fail');
});
*/

const picRouter = require('./routers/picRouter');
app.use('/pics', picRouter);