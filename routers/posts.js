'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


//this route is https://localhost:3000/posts/:something

router.get('/list', (req, res) => {
  res.send('redirected to /posts/list!!!!');
});

router.get('/add', (req, res) => {
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});

router.post('/upload', (req, res) => {
  //postController.create_post(req.body);
});
//router.post('/uploadnew', postController.create_post);


module.exports = router;