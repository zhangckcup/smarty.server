"use strict";
const mysql = require('mysql');
const mysqlConfig = require('./key.js');
const mysqlPool = mysql.createPool(mysqlConfig);
// 查找全部
async function selectAll(table, cols, callback) {
  // table: 表名 String, cols:列名 Array
  mysqlPool.getConnection((err, connection) => {
    if (err)
      throw err;
    const queryStr = "select ?? from ??";
    connection.query(queryStr, [cols, table], callback);
    connection.release();
  });
}
// 查找带Where的情况
async function select(table, cols, where, callback) {
  // table: 表名 String, cols:列名 Array, where: 条件 对象
  mysqlPool.getConnection((err, connection) => {
    if (err)
      throw err;
    let value = [];
    let query = [];
    Object.keys(where).forEach(i => {
      value.push(i);
      value.push(where[i]);
      query.push('??=?');
    });
    const queryStr = "select ?? from ?? where " + query.join(" and ");
    connection.query(queryStr, [cols, table, value], callback);
    connection.release();
  });
}
// 插入数据
async function insert(table, data, callback) {
  // table: 表名 String, data: 插入的数据 Objcet
  mysqlPool.getConnection((err, connection) => {
    if (err)
      throw err;
    let cols = [];
    let value = [];
    Object.keys(data).forEach(i => {
      cols.push(i);
      value.push(data[i]);
    });
    const queryStr = "INSERT INTO ?? (??) VALUES (?)";
    connection.query(queryStr, [table, cols, value], callback);
    connection.release();
  });
}
// 更新数据 by ID
async function updateById(table, data, idCol, id, callback) {
  mysqlPool.getConnection((err, connection) => {
    if (err)
      throw err;
    let value = [];
    let query = [];
    Object.keys(data).forEach(i => {
      value.push(i);
      value.push(data[i]);
      query.push('??=?');
    });
    const queryStr = `UPDATE ?? SET ${query.join(',')} while ??=?`;
    connection.query(queryStr, [table, value, idCol, id], callback);
    connection.release();
  });
}
// 删除数据 by ID
async function deleteById(table, idCol, id, callback) {
  mysqlPool.getConnection((err, connection) => {
    if (err)
      throw err;
    const queryStr = "DELETE FROM ?? while ??=?";
    connection.query(queryStr, [table, idCol, id], callback);
    connection.release();
  });
}
module.exports = {
  select,
  selectAll,
  insert,
  updateById,
  deleteById
};