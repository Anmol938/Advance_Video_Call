require('dotenv').config();

const express = require('express');
const app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/video-call-app');

app.listen(3000, ()=>{
    console.log('Server is running');
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('public'));

const userRoute = require('./routes/userRoute');
app.use('/',userRoute);