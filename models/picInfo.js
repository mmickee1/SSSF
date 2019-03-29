'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const picSchema = new Schema({
    fieldname: String,
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
});

//const Picture = mongoose.model('Picture', picSchema);
module.exports = mongoose.model('Picture', picSchema);