const mysql = require('mysql');
const mysqlConfig = require('./key.js')
const mysqlPool  = mysql.createPool(mysqlConfig);

// 查找全部
async function selectAll(table:String, cols:String){
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err:Error, connection:any) => {
      if(err) throw err;
      const queryStr = "select ?? from ??";
      connection.query(queryStr, [cols, table],(err:Error,res:any[]) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    })
  })
}

// 查找带Where的情况
async function selectWhere(table:String, cols:String, where:any){
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err:Error, connection:any) => {
      if(err) throw err;
      let value:any[] = [];
      let query:any[] = [];
      Object.keys(where).forEach(i=>{
        value.push(i);
        value.push(where[i]);
        query.push('??=?');
      })
      const queryStr = "select ?? from ?? where "+ query.join(" and ");
      connection.query(queryStr, [cols, table, ...value],(err:Error,res:any[]) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  })
}

// 插入数据
async function insert(table:String, data:any){
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err:Error, connection:any) => {
      if(err) throw err;
      let cols:any[] = [];
      let value:any[] = [];
      Object.keys(data).forEach(i=>{cols.push(i);value.push(data[i]);});
      const queryStr = "INSERT INTO ?? (??) VALUES (?)";
      connection.query(queryStr, [table, cols, value], (err:Error,res:any[]) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    })
  })
}

// 更新数据 by ID
async function updateById(table:String, data:any, idCol:String, id:Number){
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err:Error, connection:any) => {
      if(err) throw err;
      let value:any[] = [];
      let query:any[] = [];
      Object.keys(data).forEach(i=>{
          value.push(i);
          value.push(data[i]);
          query.push('??=?');
      });
      const queryStr = `UPDATE ?? SET ${query.join(',')} WHERE ??=?`;
      connection.query(queryStr, [table, ...value, idCol, Number(id)], (err:Error,res:any[]) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    });
  });
  
}

// 删除数据 by ID
async function deleteById(table:String, idCol:String, id:Number){
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err:Error, connection:any) => {
      if(err) throw err;
      const queryStr = "DELETE FROM ?? WHERE ??=?";
      connection.query(queryStr, [table, idCol, Number(id)], (err:Error,res:any[]) => {
        connection.release();
        if (err) reject(err);
        else resolve(res);
      });
    })
  });
}

module.exports = {
  selectWhere,
  selectAll,
  insert,
  updateById,
  deleteById
}