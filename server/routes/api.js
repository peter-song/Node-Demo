/**
 * Created by songzhongkun on 2018/5/7.
 */
import express from 'express';
import responseTime from 'response-time';
const router = express.Router();

import controllers from '../controllers';

router.use(function timeLog(req, res, next) {
  console.log(`API:${req.url}, API-TIME-START:${new Date()}`);
  next();
});

router.use(responseTime(function (req, res, time) {
  console.log(`API_METHOD : ${req.method} : ${req.url} : ${time}`);
}));

router.get('/book/getBooks', controllers.book.getBooks);

module.exports = router;