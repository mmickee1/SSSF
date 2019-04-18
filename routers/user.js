'use strict';
const express = require('express');
const router = express.Router();
const userModel = require('../models/userinfo');
const userController = require('../controllers/userController');


//this route is https://localhost:3000/users/:something

router.get('/users', (req, res) => {
  res.send('redirected to /users/users!!!!');
});

router.get('/login', (req, res) => {
  res.render('login.pug', { title: 'Login', message: 'Log in please!' });
});

router.post('/login', (req, res) => {
  //give req.body.username + pw and salt/hash it and see if it's right one. IN CONTROLLER PART
  //TODO : 
  userController.login_user(req, res).then((result) => {
    res.send(result);
  });
});

router.get('/signup', (req, res) => {
  res.render('signup.pug', { title: 'Signup', message: 'Signup please!' });
});

router.post('/signup', (req, res) => {
  userModel.findOne({username: req.body.username}).then(user => {
    if (user) {
      res.send('User with that name already exists!');
    }
    else {
     userController.create_user(req).then((user) => {
        res.send('User: ' + user.username + ' has been created!');
      });
    }
  });
});

module.exports = router;