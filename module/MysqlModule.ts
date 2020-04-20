const mysql = require('mysql');
const mysqlConfig = require('./key.js')
const mysqlPool  = mysql.createPool(mysqlConfig);

// 查找全部
async function selectAll(table:String, cols:String, callback?:any){
  // table: 表名 String, cols:列名 Array
  mysqlPool.getConnection((err:Error, connection:any) => {
    if(err) throw err;
    const queryStr = "select ?? from ??";
    connection.query(queryStr, [cols, table],callback);
    connection.release();
  })
}

// 查找带Where的情况
async function select(table:String, cols:String, where:any, callback?:any){
  // table: 表名 String, cols:列名 Array, where: 条件 对象
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
    connection.query(queryStr, [cols, table, value],callback);
    connection.release();
  });
}

// 插入数据
async function insert(table:String, data:any, callback?:any){
  // table: 表名 String, data: 插入的数据 Objcet
  mysqlPool.getConnection((err:Error, connection:any) => {
    if(err) throw err;
    let cols:any[] = [];
    let value:any[] = [];
    Object.keys(data).forEach(i=>{cols.push(i);value.push(data[i]);});
    const queryStr = "INSERT INTO ?? (??) VALUES (?)";
    connection.query(queryStr, [table, cols, value], callback);
    connection.release();
  })
}

// 更新数据 by ID
async function updateById(table:String, data:any, idCol:String, id:Number, callback?:any){
  mysqlPool.getConnection((err:Error, connection:any) => {
    if(err) throw err;
    let value:any[] = [];
    let query:any[] = [];
    Object.keys(data).forEach(i=>{
        value.push(i);
        value.push(data[i]);
        query.push('??=?');
    });
    const queryStr = `UPDATE ?? SET ${query.join(',')} while ??=?`;
    connection.query(queryStr, [table, value, idCol, id], callback);
    connection.release();
  })
}

// 删除数据 by ID
async function deleteById(table:String, idCol:String, id:Number, callback?:any){
  mysqlPool.getConnection((err:Error, connection:any) => {
    if(err) throw err;
    const queryStr = "DELETE FROM ?? while ??=?";
    connection.query(queryStr, [table, idCol, id], callback);
    connection.release();
  })
}

module.exports = {
  select,
  selectAll,
  insert,
  updateById,
  deleteById
}