'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const picController = require('../controllers/picController');

// get all cats
router.get('/all', (req, res) => {
  picController.pic_list_get().then((result) => {
    res.send(result);
  });
});

router.post('/new', bodyParser.urlencoded({extended: true}), (req, res) => {
  const data = req.body;
  console.log(data);
  picController.pic_create_post(data).then((result) => {
    res.send(result);
  });
});

router.get('/number', (req, res) => {
  picController.pic_number_get().then((result) => {
    res.send(`Got ${result} pics`);
  });
});

router.get('/sort', (req, res) => {
  picController.pic_sort_get().then((result) => {
    let text = '';
    result.forEach((pic) => {
      text += pic.title + '<br>';
    });
    res.send(text);
  });
});

module.exports = router;
