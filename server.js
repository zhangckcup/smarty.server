const express = require("express");
const DB = require("./module/module");
const port = require("./module/port");
const app = express();

app.use(express.static('dist'));
app.use(express.json());

// 获取所有用户
app.get("/api/getUserAll", async (req, res) => {
  await DB.selectAll("users", ['user_name'], rows => {
    return res.send(rows);
  });
})

// 用户登录
app.post("/api/login", async (req, res) => {
  const data = {
    user_name: req.body.username,
    user_password: req.body.password
  }
  await DB.select("users", "user_password", ["user_name",'=',data.user_name], rows=>{
    if(rows.length == 0){
      res.send({ message: "用户不存在" })
    }
    else if(rows[0].user_password != data.user_password){
      res.send({ message: "密码错误" })
    }
    else{
      res.send({ message: "登陆成功" })
    }
  })
})

// 用户注册
app.post("/api/register", async (req, res) => {
  const data = {
    user_name: req.body.username,
    user_password: req.body.password
  }
  console.log(data);
  try {
    await DB.insert("users",data, (err, rows) => {
      if(err) throw err;
    })
    return res.send({ message: "注册成功" });
  } catch (err) {
    console.error(err);
    return res.status(422).send({ message: "注册失败" });
  }
})

// 获取文章内容
app.get("/api/getArticle/:aid", async (req, res) => {
  await DB.select("articles", "*", ["article_id", "=", req.params.aid], rows => {
    if(rows.length == 0){
      res.status(422).send({ message: "文章不存在" })
    } else {
      res.send(rows[0]);
    }
  })
})

// 获取文章列表
app.get("/api/getArticleList", async (req, res) => {
  await DB.selectAll("articles", ["article_title", "article_id"], rows => {
    res.send(rows);
  });
})

// 插入提交文章
app.post("/api/upArticle", async (req, res) => {
  const data = {
    article_title   : req.body.title,
    article_content : req.body.content,
    user_id         : req.body.uid
  }
  await DB.insert("articles", data, (err, rows) => {
    try {
      if(err) throw err;
      res.send({ message: "提交成功" });
    } catch (err) {
      console.error(err);
      res.status(422).send({ message: "提交失败" });
    }
  })
})

// 定制404页面
app.use((req, res) => {
  res.type('text/html');
  res.status(404);
  res.send('<h1><center>404 - Not Found</center></h1>');
})

// 定制500界面
app.use((err, req, res, next) => {
  console.err(err.stack)
  res.type('text/html')
  res.status(500)
  res.send('<h1><center>500 - Server Error</center></h1>')
})

// 开启服务并监听端口
app.listen(port, () => console.log(`Server run in port ${port}`))