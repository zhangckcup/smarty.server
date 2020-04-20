const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const users = require("./api/users");

// 实例化对象

const app = new koa();
const router = new Router();

app.use(bodyParser());

// /api/users
router.use('api/users', users);

// 路由
router.get('/', async ctx => {
  ctx.body = {msg: "Hello world."}
})

// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server run on ${port}`);
})