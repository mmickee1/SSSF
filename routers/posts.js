'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postModel = require('../models/uploadinfo');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const multer = require('multer');
const jsonfile = require('jsonfile');
const fs = require('fs');
const uploadinfojson = './uploadinfos.json';
const path = require('path');
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
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
//router.use('public', express.static('public'));


//this route is https://localhost:3000/posts/:something

router.get('/list', (req, res) => {
  res.send('redirected to /posts/list!!!!');
});

router.get('/add', (req, res) => {
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});


//POST========================================================================================================================
//router.post('/uploadnew', postController.create_post);
router.post('/upload', (req, res, next) => {
  //postController.create_post(req.body);
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(400);
    } else {
      if (req.file == undefined) {
        res.send('no file selected');
      } else {
        console.log(req.file);
        //jsonfile.writeFile(file, req.file, { flag: 'a' })
        next();
      }
    }
   });
});


//DEFINE THESE HERE: 
/* uploader: String,
    category: String,
    title: String,
    description: String,
    manufacturer: String,
    price: Number,
    imageurl: String,
    imagename: String*/
router.post('/upload', (req, res, next) => {
  console.log(req.body);
  console.log(req.body.path + req.body.filename);
  postModel.create({
    //img: fs.readFileSync(req.file.path), 
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    price: req.body.price,
    imageurl: req.file.path,
    imagename: req.file.filename
  }).then(c => {
    jsonfile.writeFile(uploadinfojson, req.file);
    res.send('Imagefile uploaded: ' + c.id);
  }, err => {
    res.send('Error: ' + err);
  }); 
});

//============================================================================================================================


module.exports = router;