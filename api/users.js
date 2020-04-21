const Router = require("koa-router");
const DB = require("../module/MysqlModule");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("koa-passport");

const router = new Router();

const table = 'users';
const idCol = 'user_id';

/** 
  @description  检查用户名接口
  @interface    GET api/users/username
  @access       public
*/ 
router.get('/username', async (ctx, next) => {
  await next();
  let rows = await DB.selectWhere(table, idCol, {user_name:ctx.request.body.user_name});
  ctx.body = rows.length ? {msg: "exist"}: {msg: true};
})

/** 
  @description  检查Email接口
  @interface    GET api/users/email
  @access       public
*/ 
router.get('/email', async (ctx, next) => {
  await next();
  let rows = await DB.selectWhere(table, idCol, {user_email:ctx.request.body.email});
  ctx.body = rows.length ? {msg: "exist"}: {msg: true};
})

/**
 * @description 用户注册接口
 * @interface   POST api/users/register
 * @access      public
 */
router.post("/register", async (ctx, next) => {
  await next();
  let data = ctx.request.body;
  for (let i in data){
    if(data[i].length <6 || data[i].length >20){
      ctx.status = 400;
      ctx.body = {msg: "非法输入"};
      return;
    }
  }
  try {
    let rows = await DB.selectWhere(table, idCol, {user_name: data.user_name});
    if (rows.length) {
      ctx.status = 400;
      ctx.body = {msg: "用户名已存在"};
    } else{
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {throw err}
        bcrypt.hash(data.user_password, salt, async (err, hash) => {
          if (err) {throw err}
          // Store hash in your password DB.
          data.user_password = hash;
          await DB.insert(table, data);
        });
      });
      ctx.body = {msg: true};
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {msg: "注册失败"};
    console.error(err);
  }
})

/**
 * @description 用户登录接口 返回token
 * @interface   POST api/users/login
 * @access      public
 */
router.post("/login", async (ctx, next) => {
  await next();
  const data = ctx.request.body;
  try {
    const rows = await DB.selectWhere(table, "user_password", {user_name: data.user_name});
    if(rows.length === 0){
      ctx.status = 400;
      ctx.body = { msg: "用户不存在" };
    } else {
      const res = await bcrypt.compare(data.user_password, rows[0].user_password);
      if(res){
        const payload = {
          name: data.user_name
        }
        const token = jwt.sign(payload, "secret", {expiresIn: 604800});
        ctx.status = 200;
        ctx.body = { 
          msg: true,
          token: "Bearer " + token
        };
      } else {
        ctx.status = 400;
        ctx.body = { msg: "密码错误" };
      }
    }
  } catch (error) {
    ctx.status = 502;
    ctx.body = { msg: "服务器错误" };
  }
})

/**
 * @description 用户信息接口  返回用户信息
 * @interface   GET api/users/current
 * @access      private
 */
router.get("/current", 
  passport.authenticate('jwt', { session: false }), 
  async (ctx, next) => {
    await next();
    ctx.body = ctx.state.user;
  })

/**
 * @description 用户修改个人信息接口
 * @interface   POST api/users/updateProfile
 * @access      private
 */
router.post("/updateProfile:id",
  passport.authenticate('jwt', { session: false }), 
  async (ctx, next) => {
    await next();
    const data = ctx.request.body;
    try {
      await DB.updateById(table, data, idCol, ctx.state.user.id);
      ctx.body = {msg: true};
    } catch (error) {
      console.log(error);
      ctx.body = {msg: "更新失败"};
    }
})

module.exports = router.routes();
