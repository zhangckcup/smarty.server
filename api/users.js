const Router = require("koa-router");
const DB = require("../module/MysqlModule.js");
const router = new Router();

/** 
  @router Get api/users/test
  @desc   测试接口
  @access 公开
*/ 
router.get('/test', async (ctx) => {
  ctx.status = 200;
  ctx.body = {msg: 'users work'};
})

/**
 * @router POST api/users/register
 * @desc    用户注册接口
 * @access  公开
 */
router.post("/register", async (ctx) => {
  const data = {
    user_name: ctx.request.body.username,
    user_password: ctx.request.body.password
  }
  try {
    await DB.select('users','user_name', data, async (err, rows) => {
      if (err) throw err;
      if (rows.length){
        ctx.status = 400;
        ctx.body = {msg: "用户名已存在"};
        return false;
      } else {
        await DB.insert("users",data,(err, rows) => {
          if (err) throw err;
          ctx.body = {msg: "注册成功"}
        })
      }
    })
  } catch (err) {
    console.error(err);
  }
})

module.exports = router.routes();
