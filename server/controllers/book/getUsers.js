/**
 * Created by songzhongkun on 2018/5/7.
 */
const mysql = require('../../persistent/mysql');

const SELECT_BOOK = 'select * from user';

module.exports = (req, res, next) => {

  mysql.queryCms(SELECT_BOOK)
    .then(users => res.json({
      code: 200,
      msg: 'success',
      body: {users}
    }))
    .catch(err => res.json(err));
};