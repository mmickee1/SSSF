const express = require('express');
const app = express();
const sharp = require('sharp');
const multer = require('multer');
const uploads = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');
const jsonfile = require('jsonfile');
const router = express.Router();
const path = require('path');

const file = './data.json';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage
}).single('image');


function loadImg() {
    var mydata = JSON.parse('data.json');
    alert(mydata.length);

    var div = document.getElementById('data');

    for (var i = 0; i < mydata.length; i++) {
        div.innerHTML = div.innerHTML + "<p class='inner' id=" + i + ">" + mydata[i].name + "</p>" + "<br>";
    }
}

//not yet used anywhere
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image.png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.static('public'));


const Schema = mongoose.Schema;
const picSchema = new Schema({
  fieldname:  String,
  originalname: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
});


const Picture = mongoose.model('Picture', picSchema);

//part2 

// Connect to mongodb
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/admin`).then(() => {
    console.log('Connected successfully.');
    app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});


app.get('/all', (req, res) => {
    Picture.find().then(all => {
        console.log(all);
        res.send(all);
    });
});

/*
app.get('/gallery', (req, res) => {
    Picture.create().then(post => {
        console.log(post.id);
        res.send('Uploaded.');
      });
});*/


app.get('/view', (req, res) => {
    jsonfile.readFile(file)
  .then(obj => console.dir(obj))
  .catch(error => console.error(error))
    
});


//needed?
app.get('/add', (req, res) => {
    res.sendStatus(200);
    console.log(req, res);
});

// Middleware for thumbnails
app.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(400);
        } else {
            if (req.file == undefined) {
                res.send('no file selected');
            } else {
                console.log(req.file);
                res.send(req.file);
                jsonfile.writeFile(file, req.file, { flag: 'a' })
                next();
            }
        }
    });
});


app.use('/upload', (req, res, next) => {
    // do small 200x200 thumbnail
    sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/img/out200x200.jpg', (err) => {
        });
    next();
});

app.use('/upload', (req, res, next) => {
    // do medium 400x400 thumbnail
    sharp(req.file.path)
        .resize(400, 400)
        .toFile('public/img/out400x400.jpg', (err) => {
        });
});


//const port = process.env.PORT || 3000;
//app.listen(port, () => console.log(`Listening on port ${port}...`));