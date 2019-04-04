'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const uploadSchemaFinal = new Schema({
    category: String,
    title: String,
    description: String,
    imageurl: String,
    imagename: String
});
//const UploadInfo = mongoose.model('UploadInfo', uploadSchema);
module.exports = mongoose.model('UploadInfoFinal', uploadSchemaFinal);