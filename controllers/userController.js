'use strict';
const User = require('../models/userinfo');


exports.create_user = (req) => {
    return User.create(req).then(user => {
        return user
      }).catch(err => {
        return err;
      });
};

//TODO: LOGIN