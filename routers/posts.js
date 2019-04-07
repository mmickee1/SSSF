'use strict';
const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
    res.send('redirected to /posts/list!!!!');
  });

module.exports = router;