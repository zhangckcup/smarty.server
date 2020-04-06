const mysql = require('mysql');
const mysqlConfig = require('./key.js')
const pool  = mysql.createPool(mysqlConfig);

module.exports = pool;