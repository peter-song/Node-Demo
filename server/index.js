/**
 * Created by songzhongkun on 2018/5/7.
 */
const express = require('express');

const api = require('./routes/api');

const app = express();

app.use('/', api);

// 404
app.use(function (req, res, next) {
  res.status(404).end();
});

// 500
app.use(function (err, req, res, next) {
  res.status(500).json(err);
});

app.listen(3000, function () {
  console.log('Express server started on port 3000.');
});
