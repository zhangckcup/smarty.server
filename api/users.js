const Router = require("koa-router");
const DB = require("../module/MysqlModule");
const router = new Router();
const table = 'users';
const idCol = 'user_id';

/** 
  @description  检查用户名接口
  @interface    GET api/users/username
  @access       公开
*/ 
router.get('/username', async (ctx, next) => {
  await next();
  let rows = await DB.selectWhere(table, idCol, {user_name:ctx.request.body.username});
  ctx.body = rows.length ? {msg: "exist"}: {msg: "OK"};
})

/** 
  @description  检查Email接口
  @interface    GET api/users/email
  @access       公开
*/ 
router.get('/email', async (ctx, next) => {
  await next();
  let rows = await DB.selectWhere(table, idCol, {user_email:ctx.request.body.email});
  ctx.body = rows.length ? {msg: "exist"}: {msg: "OK"};
})

/**
 * @description 用户注册接口
 * @interface   POST api/users/register
 * @access      公开
 */
router.post("/register", async (ctx, next) => {
  await next();
  const data = {
    user_name: ctx.request.body.username,
    user_password: ctx.request.body.password
  };
  try {
    let rows = await DB.selectWhere(table, idCol, {user_name: data.user_name});
    if (rows.length) {
      ctx.status = 400;
      ctx.body = {msg: "用户名已存在"};
      return;
    }
    await DB.insert(table,data);
    ctx.body = {msg: "注册成功"};
  } catch (err) {
    ctx.status = 400;
    ctx.body = {msg: "注册失败"};
    console.error(err);
  }
})

/**
 * @description 用户登录接口
 * @interface   POST api/users/login
 * @access      公开
 */
router.post("/login", async (ctx, next) => {
  await next();
  const data = {
    user_name: ctx.request.body.username,
    user_password: ctx.request.body.password
  };
  const rows = await DB.selectWhere(table, "user_password", {user_name: data.user_name});
  if(rows.length === 0){
    ctx.body = { message: "用户不存在" };
  }
  else if(rows[0].user_password !== data.user_password){
    ctx.body = { message: "密码错误" };
  }
  else{
    ctx.body = { message: "登陆成功" };
  }
})

/**
 * @description 用户修改个人信息接口
 * @interface   POST api/users/updateProfile
 * @access      公开
 */
router.post("/updateProfile", async (ctx, next) => {
  await next();
  ctx.body = {msg: "接口施工中"};
})

module.exports = router.routes();
