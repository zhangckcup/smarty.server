const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const OSS = require("ali-oss");
const ossConfig = require("../config/key").oss;
const DB = require("../module/MysqlModule");

const ossBase = "eco-web/";
const ossUrl = "https://ecoweather-oss-test.oss-cn-beijing.aliyuncs.com/";
const localBase = path.resolve(__dirname, "../temp/");
const client = OSS(ossConfig);

async function imgParse(text, id) {
  try {
    // 获得有base64编码的html
    let $ = cheerio.load(text);
    let imgList = $("img");
    for (let i = 0; i < imgList.length; i++) {
      let base64Img = imgList[i].attribs.src.split(",");
      if (base64Img[1]) {
        let decodeImg = Buffer.from(base64Img[1], "base64");
        let ext = base64Img[0].split(";")[0].split("/")[1];
        const filename =
          new Date().getTime() + parseInt(Math.random() * 1000) + `.` + ext;
        fs.writeFile(localBase + filename, decodeImg, async (err) => {
          if (err) {
            console.log(err);
          }
          let res = await client.put(
            `${ossBase}article/${id}/${filename}`,
            localBase + filename
          );
          if (res) {
            fs.unlink(localBase + filename, (err) => {
              if (err) console.log(err);
            });
          }
        });
        imgList[i].attribs.src = `${ossUrl}${ossBase}article/${id}/${filename}`;
      }
    }
    return {
      content: $.html(),
      desc_img:
        imgList[0].attribs.src ||
        "https://ecoweather-oss-test.oss-cn-beijing.aliyuncs.com/eco-web/article/elogo.png",
    };
  } catch (error) {
    console.log(error);
  }
}

function getDesc(text) {
  let $ = cheerio.load(text);
  let pList = $("p");
  let retText = '';
  for (let i = 0, len = pList.length; i < len; i++) {
    if (pList[i].children[0].type == 'text') {
      retText += pList[i].children[0].data;
    }
    if (retText.length >= 40) {
      return retText;
    }
  }
  return retText;
}

module.exports = { imgParse, getDesc };
