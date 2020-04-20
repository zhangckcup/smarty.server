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
router.post("/register", async (ctx, next) => {
  next();
  const data = {
    user_name: ctx.request.body.username,
    user_password: ctx.request.body.password
  };
  try {
    let rows = await DB.select('users','user_id', {user_name: data.user_name})
      if (rows.length) {
        ctx.body = {msg: "用户名已存在"};
        return;
      } else {
        await DB.insert("users",data);
      }
      ctx.body = {msg: "注册成功"};
  } catch (err) {
    console.error(err);
  }
})

module.exports = router.routes();
