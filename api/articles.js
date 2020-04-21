const Router = require("koa-router");
const DB = require("../module/MysqlModule");
const router = new Router();

const table = "articles";
const idCol = "article_id";

/**
 * @description 获取文章列表
 * @interface   GET api/articles/list
 * @access      公开
 */
router.get("/list", async (ctx, next) => {
  await next();
  try {
    ctx.body = await DB.selectAll(table, ["article_title", idCol]);
  } catch (error) {
    console.log(error);
  }
})

/**
 * @description 获取文章内容
 * @interface   GET api/articles/:aid
 * @access      公开
 */
router.get("/:aid", async (ctx, next) => {
  await next();
  let rows = await DB.selectWhere(table, '*', {[idCol]: ctx.params.aid});
  if(rows.length){
    ctx.body = rows[0];
  } else {
    ctx.status = 404;
  }
})

/**
 * @description 提交文章
 * @interface   POST api/articles/submit
 * @access      公开
 */
router.post("/submit", async (ctx, next) => {
  await next();
  const data = {
    article_title   : ctx.request.body.title,
    article_content : ctx.request.body.content,
    user_id         : ctx.request.body.uid
  };
  try {
    await DB.insert(table, data);
    ctx.body = {msg: "提交成功"};
  } catch (error) {
    console.log(error);
    ctx.body = {msg: "提交失败"};
  }
})

/**
 * @description 删除文章
 * @interface   GET api/articles/delete:aid
 */
router.get("/delete:aid", async (ctx, next) => {
  await next();
  try {
    await DB.deleteById(table, idCol, ctx.params.aid);
    ctx.body = {msg: "删除成功"};
  } catch (error) {
    ctx.body = {msg: "删除失败"};
    console.log(error);
  }
})

module.exports = router.routes();
