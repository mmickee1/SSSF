'use strict';
const User = require('../models/userinfo');

exports.create_user = (data) => {
    //do encrypting..
    /*const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);*/

    return User.create(data.body).then(user => {
        return user
      }).catch(err => {
        return err;
      });
};

//TODO: LOGIN