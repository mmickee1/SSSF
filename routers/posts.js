'use strict';
const express = require('express');
const router = express.Router();


//this route is https://localhost:3000/posts/:something

router.get('/list', (req, res) => {
  res.send('redirected to /posts/list!!!!');
});

router.get('/add', (req, res) => {
  res.render('add.pug', { title: 'Add equipment', message: 'Here you can add equipment to be sold!' });
});

router.post('/upload', (req, res) => {
  
});


module.exports = router;