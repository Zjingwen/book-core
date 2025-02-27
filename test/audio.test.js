import fs from "fs";
import path from "path";
import { FFCreator, FFScene, FFText, FFImage } from "ffcreator";
import ffmpeg from "fluent-ffmpeg";
import CryptoJS from "crypto-js";

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
const p = path.join(path.resolve(), "/audio/");
const resources = path.join(path.resolve(), "/resources/");
const creator = createScene();
creator.addAudio({
  path: `${resources}output_audio.mp3`,
  volume: "20dB",
  bg: true,
});

for (let i = 0; i < textList.length; i++) {
  const name = getMd5(textList[i]);
  const filePath = `${p}${name}.mp3`;
  const duration = await getDuration(filePath);

  const scene = new FFScene();

  scene.setDuration(duration + 1);
  scene.setBgColor("#919191");
  scene.addAudio({
    path: `${p}${getMd5(textList[i])}.mp3`,
    volume: "20dB",
  });

  const text = new FFText({ text: textList[i], x: 1980 / 2, y: 1080 / 2 });
  text.setColor("#ffffff"); // 文字颜色
  text.addEffect(["fadeIn", "fadeOut"], duration + 1, 1); // 动画
  text.alignCenter(); // 文字居中
  text.setFont(`${resources}douyuFont-2.ttf`);
  text.setStyle({
    fontSize: 85,
    color: "#eeeeee",
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 1200,
  }); // 设置样式object

  const title = new FFText({ text: "《白夜行》", x: 1980 / 2, y: 1080 / 2 });
  title.setColor("#ffffff"); // 文字颜色
  title.alignCenter(); // 文字居中
  title.setFont(`${resources}hwmct.ttf`);
  title.setStyle({
    fontSize: 400,
    color: "#ff0000",
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    breakWords: true,
  }); // 设置样式object
  title.setOpacity(0.3);

  const fimage = new FFImage({
    path: `${resources}pexels-philippedonn-1169754.jpg`,
    width: 1920 * 2,
    height: 1080 * 2,
    x: 0,
    y: 0,
  });
  fimage.addEffect(["fadeIn", "fadeOut"], duration + 1, 1); // 动画
  scene.addChild(fimage);
  scene.addChild(title);
  scene.addChild(text);
  creator.addChild(scene);
}

creator.start(); // 开始加工
creator.closeLog(); // 关闭log(包含perf)
creator.on("start", () => {
  console.log(`FFCreator start`);
});
creator.on("error", (e) => {
  console.log(`FFCreator error: ${JSON.stringify(e)}`);
});
creator.on("progress", (e) => {
  console.log(`FFCreator progress: ${e.state} ${(e.percent * 100) >> 0}%`);
});
creator.on("complete", (e) => {
  console.log(
    `FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `
  );
});

function createScene() {
  const cacheDir = path.join(path.resolve(), "cache/");
  const outputDir = path.join(path.resolve(), "output/");
  const output = outputDir + "test-2.mp4";
  return new FFCreator({
    cacheDir, // 缓存目录
    outputDir, // 输出目录
    output, // 输出文件名(FFCreatorCenter中可以不设)
    width: 1920, // 影片宽
    height: 1080, // 影片高
    fps: 24, // fps
    threads: 4, // 多线程(伪造)并行渲染
    debug: false, // 开启测试模式
    defaultOutputOptions: null, // ffmpeg输出选项配置
  });
}

// 获取时长
async function getDuration(file) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(file, function (err, metadata) {
      if (err) {
        console.error(err);
        new Error("getDuration error");
      }
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
}

function getMd5(inputString) {
  // 使用crypto-js的MD5方法计算哈希值
  const hash = CryptoJS.MD5(inputString);
  // 将WordArray对象转换为十六进制字符串并返回
  return hash.toString(CryptoJS.enc.Hex);
}
