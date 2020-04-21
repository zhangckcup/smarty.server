const Koa = require("koa");
const Router = require("koa-router");
const static = require('koa-static');
const bodyParser = require("koa-bodyparser");
const passport = require('koa-passport')

const users = require("./api/users");
const articles = require("./api/articles");

// 实例化对象
const app = new Koa();
const router = new Router();

// token 验证
app.use(passport.initialize());
app.use(passport.session());
require("./module/passport")(passport);

// 请求体解析
app.use(bodyParser());

// 静态资源管理
app.use(static("dist"));

// 路由
router.get('/', async ctx => {
  ctx.body = {msg: "Hello world."}
})

// api/users
router.use('/api/users', users);

// api/articles
router.use('/api/articles', articles)

// 配置路由
app.use(router.routes()).use(router.allowedMethods());

// 404
app.use(async (ctx, next) => {
  await next();
  if(parseInt(ctx.status) === 404 ){
    ctx.type = "text/html";
    ctx.body = "<h1>404 -- Not Found</h1>";
  }
})

// 500
app.use(async (ctx, next) => {
  await next();
  if(parseInt(ctx.status) === 500 ){
    ctx.type = "text/html";
    ctx.body = "<h1>500 -- Not Found</h1>";
  }
})

const port = require("./module/port");

app.listen(port, () => {
  console.log(`server run on ${port}`);
})