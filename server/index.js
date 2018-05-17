/**
 * Created by songzhongkun on 2018/5/7.
 */
const express = require('express');

const api = require('./routes/api');

const app = express();

// set view directory
app.set('views', path.join(__dirname, 'views'));

// use pug as view engine
app.set('view engine', 'pug');

app.use('/', api);

// 404
app.use(function (req, res, next) {
  res.status(404).end();
});

// 500
app.use(function (err, req, res, next) {
  res.status(500).json(err);
});

app.listen(3003, function () {
  console.log('Express server started on port 3003.');
});
