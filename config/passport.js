'use strict';
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Load User model
const User = require('../models/userinfo');

module.exports = function (passport) {
    console.log('ACCESSING PASSPORT.JS');
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            console.log('USER FINDINGS ' + email);
            User.findOne({
                email: email
            }).then(user => {
                console.log('USER FOUND PASSPORT.JS FILE ' + user);
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log('FOUND A MATCH WITH CORRECT PW!!');
                        return done(null, user);
                    } else {
                        console.log('WRONG PW');
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        console.log('SERIALIZING USER ' +user.id);
        done(null, user.id); 
    });

    passport.deserializeUser(function (id, done) {
        console.log('DEserializing USER ' + id + user.email);
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};