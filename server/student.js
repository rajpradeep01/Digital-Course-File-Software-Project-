var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
const { urlencoded } = require('express');
const url = require('url');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "digitalcoursefile_db"
  });

const mongoURI='mongodb://127.0.0.1:27017';
const conn = mongoose.createConnection("mongodb://localhost:27017/test", { useNewUrlParser: true });
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('Questionpaper');
  gfs.collection('ProjectMaterials');
  gfs.collection('ClassMaterials');
  gfs.collection('Grades');
});



var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());
app.use(methodOverride('_method'));


const storage1 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    console.log("raj");
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'Questionpaper'
        };
        resolve(fileInfo);
    });
  }
});
const storage2 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    // console.log("hi");
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'ProjectMaterials'
        };
        resolve(fileInfo);
    });
  }
});
const storage3 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    // console.log("hi");
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'ClassMaterials'
        };
        resolve(fileInfo);
    });
  }
});
const storage4 = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    // console.log("hi");
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'Grades'
        };
        resolve(fileInfo);
    });
  }
});
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2});
const upload3 = multer({ storage: storage3});
const upload4 = multer({ storage: storage4});


module.exports = function(app){



}