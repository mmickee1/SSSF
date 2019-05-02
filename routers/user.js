'use strict';
const express = require('express');
const router = express.Router();
const userModel = require('../models/userinfo');
const userController = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))



router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

//this route is https://localhost:3000/users/:something


router.get('/login', (req, res) => {
  res.render('login.pug', { title: 'Login', message: 'Log in please!' });
});


/*router.post('/login', (req, res, next) => {
  userModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, respo) {
        console.log(respo);
        if (respo === true) {
          const token = jwt.sign({ id: user.email }, 'secretkey', { expiresIn: '1h' });
          console.log(token);
          console.log('logged in ok');
          console.log('user acc: ' + user);
          //user.save().then(answer => {
          //  console.log('user saved! ' + answer);
          //res.redirect('/home');
          //});
          passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/users/login'
          })(req, res, next);
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
});*/
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
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

router.get('/logout', (req, res) => {
  req.logout();
  console.log('logged out!');
  res.redirect('/');
});


module.exports = router;