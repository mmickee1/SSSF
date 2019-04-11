'use strict';
const express = require('express');
const router = express.Router();

//this route is https://localhost:3000/users/:something

router.get('/users', (req, res) => {
  res.send('redirected to /users/users!!!!');
});

router.get('/login', (req, res) => {
  res.render('login.pug', { title: 'Login', message: 'Log in please!' });
});

router.post('/login', (req, res) => {
  //give req.body.username + pw and salt/hash it and see if it's right one.
});

router.get('/signup', (req, res) => {
  res.render('signup.pug', { title: 'Signup', message: 'Signup please!' });
});

router.post('/signup', (req, res) => {
  //give req.body.username + pw and salt/hash it and see if it's right one.
});

module.exports = router;