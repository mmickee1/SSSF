'use strict';
const express = require('express');
const router = express.Router();

//this route is https://localhost:3000/myUsers/:something

router.get('/users', (req, res) => {
    res.send('redirected to /myUsers/users!!!!');
  });

module.exports = router;