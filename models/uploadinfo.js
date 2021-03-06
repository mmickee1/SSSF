'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const uploadSchema = new Schema({
    uploader: String,
    category: String,
    title: String,
    description: String,
    manufacturer: String,
    price: Number,
    imageurl: String,
    imagename: String
});
module.exports = mongoose.model('UploadInfo', uploadSchema);