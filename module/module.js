const mysql = require('mysql');
const mysqlConfig = require('./key.js')
const mysqlPool  = mysql.createPool(mysqlConfig);

// 查找全部
async function selectAll(table, cols, callback){
  // table: 表名 String, cols:列名 Array
  mysqlPool.getConnection((err, connection) => {
    if(err) throw err;
    const queryStr = "select ?? from ??";
    connection.query(queryStr, [cols, table],(err, rows) => {
      if(err) throw err;
      connection.release();
      callback(rows);
    })
  })
}

// 查找带Where的情况
async function select(table, cols, where, callback){
  // table: 表名 String, cols:列名 Array, where: 条件 String
  mysqlPool.getConnection((err, connection) => {
    if(err) throw err;
    const whereStr = where[0] + ' ' + where[1] + ' ?';
    const queryStr = "select ?? from ?? where " + whereStr;
    connection.query(queryStr, [cols, table, where[2]],(err, rows) => {
      if(err) throw err;
      connection.release();
      callback(rows);
    })
  })
}

// 插入数据
async function insert(table, data, callback){
  // table: 表名 String, data: 插入的数据 Objcet
  mysqlPool.getConnection((err, connection) => {
    if(err) throw err;
    let cols = [];
    let value = [];
    for(let i in data){
      cols.push(i);
      value.push(data[i]);
    }
    const queryStr = "INSERT INTO ?? (??) VALUES (?)";
    connection.query(queryStr, [table, cols, value],(err, res) => {
      connection.release();
      callback(err, res);
    })
  })
}

module.exports = {
  select,
  selectAll,
  insert
}