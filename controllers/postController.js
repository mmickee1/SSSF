'use strict';
const Pic = require('./models/uploadinfo');


//go this through... needs editing. I think.
exports.create_post = (data) => {
    return Pic.create(data).then((item) => {
        return { status: 'Save OK: ' + item.id };
    }).catch((err) => {
        console.log(err);
        return err;
    });
};