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

//this router's route is https://localhost:3000/posts/:something

//PUG FILE GETTERS
router.get('/list', (req, res) => {
  res.send('redirected to /posts/list!!!!');
});

router.get('/add', (req, res) => {
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});

router.get('/edit', (req, res) => {
  res.render('edit.pug', { title: 'Edit post', message: 'Here you can edit your items!' });
});

router.get('/delete', (req, res) => {
  res.render('delete.pug', { title: 'Delete post', message: 'Here you can delete your items!' });
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
        //message no file ..  instead of res send! use rendering.
      } else {
        console.log(req.file);
        //jsonfile.writeFile(file, req.file, { flag: 'a' })
        next();
      }
    }
  });
});


router.use('/upload', (req, res, next) => {
  console.log(req.body);
  console.log(req.body.path + req.body.filename);
  postModel.create({
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    price: req.body.price,
    imageurl: req.file.path,
    imagename: req.file.filename
  }).then(c => {
    jsonfile.writeFile(uploadinfojson, req.file);
    res.redirect('/home');
  }, err => {
    res.send('Error: ' + err);
  });
});


//============================================================================================================================
//UPDATE
router.patch('/edit', (req, res) => {
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
router.delete('/delete', (req, res) => {
  /*$.ajax({
    method: "PATCH"
  });*/
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
