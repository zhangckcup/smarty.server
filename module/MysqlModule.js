"use strict";
const mysql = require("mysql");
const mysqlConfig = require("../config/key.js").mysql;
const mysqlPool = mysql.createPool(mysqlConfig);

// 查找全部
async function selectAll(table, cols) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      const queryStr = "select ?? from ??";
      connection.query(queryStr, [cols, table], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

/**
 * 带where和limit分页的select
 * @param {String:表名} table
 * @param {String:需要查询的列名} cols
 * @param {...where: where子句中的查询条件, like: { cols: value }} where
 * @param {page: 页码数, pageSize: 页码大小} limit
 */
async function selectWhereLimit(table, cols, where, limit) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let queryStr = "SELECT ?? from ??";
      let value = [];
      let query = [];
      if (where) {
        queryStr += " where ";
        Object.keys(where).forEach((i) => {
          if (i != "like" && where[i]) {
            value.push(i);
            value.push(where[i]);
            query.push("??=?");
          }
        });
        if (where.like) {
          Object.keys(where.like).forEach((i) => {
            value.push(i);
            value.push(where.like[i]);
            query.push("?? like ?");
          });
        }
      }
      queryStr += query.join(" and ");
      if (limit) {
        queryStr += ` LIMIT ${parseInt(
          limit.pageSize * (limit.page - 1)
        )},${parseInt(limit.pageSize)}`;
      }
      connection.query(queryStr, [cols, table, ...value], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

/**
 * 通过表名查询表中记录总数
 * @param {表名} table
 */
async function selectCount(table, where) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let queryStr = "SELECT COUNT(*) FROM ??";
      let value = [];
      let query = [];
      if (where) {
        queryStr += " where ";
        Object.keys(where).forEach((i) => {
          if (i != "like" && where[i]) {
            value.push(i);
            value.push(where[i]);
            query.push("??=?");
          }
        });
        if (where.like) {
          Object.keys(where.like).forEach((i) => {
            value.push(i);
            value.push(where.like[i]);
            query.push("?? like ?");
          });
        }
      }
      queryStr += query.join(" and ");
      connection.query(queryStr, [table, ...value], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res[0]["COUNT(*)"]);
      });
    });
  });
}

// 查找带Where的情况 where 为需要查询的对象
async function selectWhere(table, cols, where) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let value = [];
      let query = [];
      Object.keys(where).forEach((i) => {
        value.push(i);
        value.push(where[i]);
        query.push("??=?");
      });
      const queryStr = "select ?? from ?? where " + query.join(" and ");
      connection.query(queryStr, [cols, table, ...value], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

// 通过like查询
async function selectLike(table, cols, like) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let value = [];
      let query = [];
      Object.keys(like).forEach((i) => {
        value.push(i);
        value.push(like[i]);
        query.push("?? like ?");
      });
      const queryStr = "select ?? from ?? where " + query.join(" and ");
      connection.query(queryStr, [cols, table, ...value], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

// 通过limit实现分页查询
async function selectLimit(table, cols, page, pageSize) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      const queryStr = `SELECT ?? from ?? LIMIT ${parseInt(
        pageSize * (page - 1)
      )},${parseInt(pageSize)}`;
      connection.query(queryStr, [cols, table], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

// 插入数据
async function insert(table, data) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let cols = [];
      let value = [];
      Object.keys(data).forEach((i) => {
        cols.push(i);
        value.push(data[i]);
      });
      const queryStr = "INSERT INTO ?? (??) VALUES (?)";
      connection.query(queryStr, [table, cols, value], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

// 更新数据 by ID
async function updateById(table, data, idCol, id) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      let value = [];
      let query = [];
      Object.keys(data).forEach((i) => {
        value.push(i);
        value.push(data[i]);
        query.push("??=?");
      });
      const queryStr = `UPDATE ?? SET ${query.join(",")} WHERE ??=?`;
      connection.query(
        queryStr,
        [table, ...value, idCol, Number(id)],
        (err, res) => {
          connection.release();
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  });
}

// 删除数据 by ID
async function deleteById(table, idCol, id) {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;
      const queryStr = "DELETE FROM ?? WHERE ??=?";
      connection.query(queryStr, [table, idCol, Number(id)], (err, res) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
}

module.exports = {
  selectWhere,
  selectAll,
  selectLike,
  selectLimit,
  insert,
  updateById,
  deleteById,
  selectWhereLimit,
  selectCount,
};
