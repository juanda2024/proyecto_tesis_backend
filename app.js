var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
mu = require('./lib/utils/mongo.js');

var usersRouter = require('./routes/users');
var getDataRouter = require('./routes/getdata');
var proyectsRouter = require('./routes/proyects')

var app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/users", usersRouter);
app.use("/getdata", getDataRouter);
app.use("/proyects", proyectsRouter);

module.exports = app;