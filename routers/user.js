'use strict';
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.send('redirected to /myUsers/users!!!!');
  });

module.exports = router;