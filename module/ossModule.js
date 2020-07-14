const OSS = require("ali-oss");
const ossConfig = require("../config/key").oss;
const client = OSS(ossConfig);

async function handleDel(name) {
  try {
    await client.delete(name);
  } catch (error) {
    error.failObjectName = name;
    return error;
  }
}

/**
 * 删除指定前缀的文件
 * @param {前缀} prefix
 */
async function deletePrefix(prefix) {
  const list = await client.list({
    prefix,
  });
  list.objects = list.objects || [];
  const result = await Promise.all(list.objects.map((v) => handleDel(v.name)));
  return result;
}

module.exports = {
  deletePrefix,
};
