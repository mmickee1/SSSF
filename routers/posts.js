'use strict';
const express = require('express');
const router = express.Router();
const methodOverride = require('method-override')
const postController = require('../controllers/postController');
const postModel = require('../models/uploadinfo');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const multer = require('multer');
const jsonfile = require('jsonfile');
const fs = require('fs');
const uploadinfojson = './uploadinfos.json';
const mongoose = require('mongoose');
const path = require('path');
const checkAuth = require('../middlewares/auth');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
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
router.get('/allpics', (req, res) => {
  postController.get_all_files().then((result) => {
    res.send(result);
  });
});
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
//router.use('public', express.static('public'));
router.use(express.static('public'));
router.use(methodOverride('_method'))  //for overriding post to get patch and delete 
router.use(methodOverride('X-HTTP-Method'))
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
  }
}));
router.use(flash());
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true, // only over https
        maxAge: 2 * 60 * 60 * 1000
    } // 2 hours
}));
router.use(passport.initialize());
router.use(passport.session());

//this router's route is https://localhost:3000/posts/:something

//PUG FILE GETTERS
router.get('/add', ensureAuthenticated, (req, res) => {
  console.log('hi ! ' + req.user);
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});

router.get('/edit/:id', (req, res) => {
  postModel.findById(req.params.id).then(post => {
    console.log(post);
    res.render('edit.pug', { title: 'Edit post', message: 'Here you can edit your items!', post: post });
  });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('index.pug', {
    user: req.user.name
  });
});

router.get('/delete/:id', (req, res) => {
  postModel.findById(req.params.id).then(post => {
    console.log(post);
    res.render('delete.pug', { title: 'Delete post', message: 'Are you sure you want to delete this post?', post: post });
  });
});

//POST========================================================================================================================
router.post('*', (req, res, next) => {
  console.log('router post any accessed');
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(400);
    } else {
      if (req.file == undefined) {
        res.render('add.pug', { title: 'Add equipment', message: 'No image selected, adding was not successful!' });
      } else {
        console.log(req.file);
        next();
      }
    }
  });
});

router.post('/', (req, res, next) => {
  console.log('router post accessed');
  postModel.create({
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    price: req.body.price,
    imageurl: req.file.path,
    imagename: req.file.filename
  }).then(c => {
    res.redirect('/home');
  }, err => {
    res.render('add.pug', { title: 'Add equipment', message: 'Unexpected error, please try again!' });
  });
});


//============================================================================================================================
//UPDATE
router.patch('/', (req, res) => {
  console.log('ready to patch');
  console.log(req.body);
  const id = req.body._id;
  console.log(id);
  postModel.findOneAndUpdate({ _id: id }, {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    price: req.body.price
  }).then(c => {
    res.redirect('/home');
  }, err => {
    res.send('Error: ' + err);
  });
});


//============================================================================================================================
//DELETE
router.delete('/', (req, res) => {
  console.log('ready to delete');
  console.log(req.body);
  const id = req.body._id;
  console.log(id);
  postModel.findOneAndDelete({ _id: id }).then(c => {
    res.redirect('/home');
  }, err => {
    res.send('Error: ' + err);
  });
});

//===========================================================================================================================

module.exports = router;
