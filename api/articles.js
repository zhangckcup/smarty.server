const Router = require("koa-router");
const DB = require("../module/MysqlModule");
const passport = require("koa-passport");

const router = new Router();

const table = "articles";
const idCol = "article_id";

/**
 * @description 获取文章列表
 * @interface   GET api/articles/list
 * @access      public
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
 * @access      public
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
 * @access      private
 */
router.post(
  "/submit",
  passport.authenticate('jwt', { session: false }),
  async (ctx, next) => {
    await next();
    const data = {
      user_id: ctx.state.user.user_id,
      ...ctx.request.body
    };
    try {
      await DB.insert(table, data);
      ctx.body = {msg: "提交成功"};
    } catch (error) {
      console.log(error);
      ctx.body = {msg: "提交失败"};
    }
  }
)

/**
 * @description 删除文章
 * @interface   GET api/articles/delete:aid
 * @access      private
 */
router.get(
  "/delete:aid", 
  passport.authenticate('jwt', { session: false }),
  async (ctx, next) => {
    await next();
    try {
      const uid = await DB.selectWhere(table, "user_id", {[idCol]: ctx.params.aid});
      if (ctx.state.user.user_id === uid[0].user_id){
        const res = await DB.deleteById(table, idCol, ctx.params.aid);
        if(res){
          ctx.body = {msg: true};
        } else{
          ctx.body = {msg: "删除失败"};
        }
      }
    } catch (error) {
      ctx.body = {msg: "删除失败"};
      console.log(error);
    }
  }
)

module.exports = router.routes();
