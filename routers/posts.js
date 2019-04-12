'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postModel = require('../models/uploadinfo');
const multer = require('multer');
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



//this route is https://localhost:3000/posts/:something

router.get('/list', (req, res) => {
  res.send('redirected to /posts/list!!!!');
});

router.get('/add', (req, res) => {
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});


//POST========================================================================================================================
//router.post('/uploadnew', postController.create_post);
router.post('/upload', (req, res) => {
  //postController.create_post(req.body);
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


//DEFINE THESE HERE: 
/* uploader: String,
    category: String,
    title: String,
    description: String,
    manufacturer: String,
    price: Number,
    imageurl: String,
    imagename: String*/
router.use('/upload', (req, res, next) => {
  UploadInfo.create({
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    price: req.body.price
  }).then(c => {
    res.send('Imagefile uploaded: ' + c.id);
  }, err => {
    res.send('Error: ' + err);
  });
});

//============================================================================================================================


module.exports = router;