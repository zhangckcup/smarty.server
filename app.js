const koa = require("koa");
const Router = require("koa-router");

// 实例化对象

const app = new koa();
const router = new Router();

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