'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String
});
module.exports = mongoose.model('User', userSchema);

//TODO: hash pw .. 
//is this needed?:
//_id: mongoose.Schema.Types.ObjectId,