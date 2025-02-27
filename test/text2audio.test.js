import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import querystring from "querystring";
import CryptoJS from "crypto-js";

const AK = "DDvTOtd3mFNVoXWOspAs0S23";
const SK = "zYjkVm6VLoa4AQ3TZFu5LlI4Ba8IiUtg";

function getMd5(inputString) {
  // 使用crypto-js的MD5方法计算哈希值
  const hash = CryptoJS.MD5(inputString);
  // 将WordArray对象转换为十六进制字符串并返回
  return hash.toString(CryptoJS.enc.Hex);
}

async function downloadMP3(buff, name = "test") {
  const p = path.join(path.resolve(), `audio/${getMd5(name)}.mp3`);
  fs.writeFile(p, buff, (err) => {
    if (err) throw err;
    console.log("File has been saved!");
  });
}

async function main(text = null) {
  if (text === null) new Error("text 不能为null");
  const url = "https://tsn.baidu.com/text2audio";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
    },
    body: querystring.stringify({
      tex: text,
      tok: await getAccessToken(),
      cuid: "hfCewRaf0oBLvsyd9JtOvNBEPu4tx76w",
      ctp: "1",
      lan: "zh",
      spd: "5",
      pit: 3,
      vol: 4,
      per: "4105",
      aue: "3",
    }),
  };
  const respones = await fetch(url, options);
  const buff = await respones.buffer();
  await downloadMP3(buff, text);
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
async function getAccessToken() {
  try {
    const options = {
      method: "POST",
    };
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;
    const respones = await fetch(url, options);
    const { access_token } = await respones.json();
    return access_token;
  } catch (error) {
    console.error(error);
    new Error("getAccessToken 异常");
  }
}

const textList = [
  "一天当中",
  "有太阳升起的时候",
  "也有下沉的时候",
  "人生也一样",
  "有白天和黑夜",
  "只是不会像真正的太阳那样",
  "有定时的日出和日落",
  "有些人一辈子都活在太阳的照耀下",
  "也有些人不得不一直活在漆黑的深夜里",
  "人害怕的",
  "就是本来一直存在的太阳落下不再升起",
  "也就是非常害怕原本照在身上的光芒消失。",
  "我的天空里没有太阳",
  "总是黑夜",
  "但并不暗",
  "因为有东西代替了太阳",
  "虽然没有太阳那么明亮",
  "但对我来说已经足够",
  "凭借着这份光",
  "我便能把黑夜当成白天",
  "你明白吗",
  "我从来就没有太阳",
  "所以不怕失去",
];

for (let i of textList) {
  await main(i);
}
