'use strict';
const Uif = require('../models/uploadinfofinal');

exports.pic_list_get = () => {
  return Uif.find().then((pics) => {
    return pics;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

exports.pic_create_post = (data) => {
  return Uif.create(data).then((item) => {
    return {status: 'Save OK: ' + item.id};
  }).catch((err) => {
    console.log(err);
    return err;
  });
};

exports.pic_number_get = () => {
  return Uif.find().exec().then((pics) => {
    console.log(pics.length);
    return pics.length;
  }).catch((err) => {
    console.log(err);
    return err;
  });
};
