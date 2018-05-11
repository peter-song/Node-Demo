const mysql = require('mysql');
const conf = require('../config');

const cms = mysql.createPool(conf.mysql.cms);

function getCmsConnection() {
  return new Promise((resolve, reject) => {
    cms.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
}

function queryCms(statement, params) {
  return new Promise((resolve, reject) => {
    getCmsConnection()
      .then(connection => {
        connection.query(statement.replace(/\s{1,}/g, ' '), params, (err, result) => {
          connection.release();
          if (err) reject(err);
          else resolve(result);
        });
      });
  });
}

module.exports.queryCms = queryCms;
