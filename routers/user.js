'use strict';
const express = require('express');
const router = express.Router();
const userModel = require('../models/userinfo');
const userController = require('../controllers/userController');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
//this route is https://localhost:3000/users/:something

router.get('/users', (req, res) => {
  res.send('redirected to /users/users!!!!');
});

router.get('/login', (req, res) => {
  res.render('login.pug', { title: 'Login', message: 'Log in please!' });
});


router.post('/login', (req, res) => {
  userModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, respo) {
        console.log(respo);
        if (respo === true) {
          const token = jwt.sign({id: user.email}, 'secretkey', {expiresIn: '1h'});
          console.log(token);
          console.log('logged in ok');
          res.redirect('/home');
        } else {
          console.log('logged in failed');
          res.render('login.pug', { title: 'Login', message: 'Wrong username or password!' });
        }
      });
    }
    else {
      res.render('login.pug', { title: 'Login', message: 'User with that email does NOT exist!' });
    }
  });
});

router.get('/signup', (req, res) => {
  res.render('signup.pug', { title: 'Signup', message: 'Sign up please!' });
});

router.post('/signup', (req, res) => {
  userModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.send('User with that email already exists!');
    }
    else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const hashedpw = hash;
        const hasheduser = {
          email: req.body.email,
          password: hashedpw
        };
        userController.create_user(hasheduser).then((user) => {
          res.redirect('/users/login');
        });
      });
    }
  });
});

module.exports = router;