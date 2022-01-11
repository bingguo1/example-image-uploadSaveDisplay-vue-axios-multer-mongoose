var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
  
var fs = require('fs');
var path = require('path');
const cors = require('cors');
app.use(cors({
    ////// NOTE: after 8080, don't add a slash "/", or you'll run into cors error
    origin: 'http://localhost:8080'
}));


//require('dotenv').config();
require('dotenv/config');
mongoose.connect(process.env.MONGO_URL,
		 { useNewUrlParser: true, useUnifiedTopology: true }, err => {
		     console.log('connected')
		 });


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
// Set EJS as templating engine 
app.set("view engine", "ejs");


var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

var imgModel = require('./model');


app.get('/', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
});});

//this get is only for sending json data to frontend, but if you view it in browser, you will see very interesting content.
app.get('/listimages', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
//	    var data64=Buffer.from(items[0].img.data,"binary").toString('base64');
//	    console.log(data64);
//	    console.log("after base64-->");
	    //	    console.log(items[0].img.data.data.toString('base64'));
            res.json(items);
        }
    });
});
/////Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
//// 1st step: Multer will upload the image to /uploads folder (and changes the name)
//// 2nd step: mongoose will save the image data from uploads folder to mongoDB database
app.post('/', upload.single('image'), (req, res, next) => {
    console.log("a post request happend!!!!!");
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    console.log("__dirname:"+__dirname);
    console.log("req.file.filename:"+req.file.filename);
    // there are two ways to save data into mongodb 1, Model.create("data", function)  2. model_instance.save()
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})
