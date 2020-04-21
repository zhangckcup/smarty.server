"use strict";
const mysql = require('mysql');
const mysqlConfig = require('./key.js');
const mysqlPool = mysql.createPool(mysqlConfig);
// 查找全部
async function selectAll(table, cols) {
    return new Promise((resolve, reject) => {
        mysqlPool.getConnection((err, connection) => {
            if (err)
                throw err;
            const queryStr = "select ?? from ??";
            connection.query(queryStr, [cols, table], (err, res) => {
                connection.release();
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
}
// 查找带Where的情况
async function selectWhere(table, cols, where) {
    return new Promise((resolve, reject) => {
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
            connection.query(queryStr, [cols, table, ...value], (err, res) => {
                connection.release();
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
}
// 插入数据
async function insert(table, data) {
    return new Promise((resolve, reject) => {
        mysqlPool.getConnection((err, connection) => {
            if (err)
                throw err;
            let cols = [];
            let value = [];
            Object.keys(data).forEach(i => { cols.push(i); value.push(data[i]); });
            const queryStr = "INSERT INTO ?? (??) VALUES (?)";
            connection.query(queryStr, [table, cols, value], (err, res) => {
                connection.release();
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
}
// 更新数据 by ID
async function updateById(table, data, idCol, id) {
    return new Promise((resolve, reject) => {
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
            const queryStr = `UPDATE ?? SET ${query.join(',')} WHERE ??=?`;
            connection.query(queryStr, [table, ...value, idCol, Number(id)], (err, res) => {
                connection.release();
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
}
// 删除数据 by ID
async function deleteById(table, idCol, id) {
    return new Promise((resolve, reject) => {
        mysqlPool.getConnection((err, connection) => {
            if (err)
                throw err;
            const queryStr = "DELETE FROM ?? WHERE ??=?";
            connection.query(queryStr, [table, idCol, Number(id)], (err, res) => {
                connection.release();
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    });
}
module.exports = {
    selectWhere,
    selectAll,
    insert,
    updateById,
    deleteById
};
