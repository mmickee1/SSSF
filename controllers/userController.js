'use strict';
const User = require('../models/userinfo');

exports.login_user = (req) => {
  return User.find(req).then(user => {
      return user.email;
    }).catch(err => {
      return err;
    });
};



exports.create_user = (req) => {
    return User.create(req).then(user => {
        return user
      }).catch(err => {
        return err;
      });
};

//TODO: LOGIN