const express = require("express");
const app = express();
const DB = require("./module/module");
const port = 3000;

app.use(express.static('dist'));
app.use(express.json())

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
      console.log(rows);
    })
    return res.send({
      message: "注册成功"
    })
  } catch (err) {
    return res.status(422).send({
      message: "注册失败"
    })
  }
  
})

app.listen(port, () => console.log(`Server run in port ${port}`))