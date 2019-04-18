'use strict';
const UploadInfo = require('../models/uploadinfo');



exports.get_all_files = () => {
    console.log('accessing postcontroller all files');
    return UploadInfo.find().exec().then((file) => {
        console.log('got some filesssss' + file);
        return file;
    }).catch((err) => {
        console.log(err);
        return err;
    });
};


//go this through... needs editing. I think.
exports.create_post = (data) => {
    return UploadInfo.create(data).then((item) => {
        //res.json({status:"SAVE OK", message: "item posted!", data: {post: item}});
        return { status: 'Save OK: ' + item.id };
    }).catch((err) => {
        console.log(err);
        return err;
    });
};

