'use strict';
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        console.log('user is authenticated!');
        return next();
      }
      console.log('user not authenticated, please log in ');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        console.log('not auth, but its ok');
        return next();
      }
      console.log('all is good, goign home!');
      res.redirect('/home');      
    }
  };