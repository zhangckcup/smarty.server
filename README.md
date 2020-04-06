# smarty.server

## Project Info

smarty.ink 的后端服务代码。

数据库设计参考：[https://blog.csdn.net/chachapaofan/article/details/86571657](https://blog.csdn.net/chachapaofan/article/details/86571657)

### 2020年4月6日

module.js 为 Mysql 数据库封装了Insert, Select, SelectAll 方法。

```js
// 全部选择，SQL: select cols from table
selectAll(table: String, cols: Array|String, callback: (rows: Array))

// 条件选择，SQL: select cols from table where (where)
select(table: String, cols: Array|String, where: Array, callback(rows: Array))
// example:
select("users", "user_password", ["user_name",'=',data.user_name], rows=>{
  // 对取得的数据行进行操作
})

// 插入数据，SQL: INSERT INTO table (data.keys) VALUES (data.values)
insert(table: String, data: Object, callback: (err: MysqlError, res: Arrar))
```

server.js 添加 login, register接口。
server.js 添加 getArticle, getArticleList, upArticle 接口。
