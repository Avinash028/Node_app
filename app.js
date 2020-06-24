var express = require('express');
var bodyParser = require('body-parser');
var mycontroller = require('./controller/my-controller');

var app= express();


app.set('view engine', 'ejs');

mycontroller(app);

app.listen(3000);

console.log("hello");