import path from "path";
import { FFCreator, FFVideo, FFScene, FFVideoAlbum, FFText } from "ffcreator";

const cacheDir = path.join(path.resolve(), "cache/");
const outputDir = path.join(path.resolve(), "output/");
const output = outputDir + "test3.mp4";

const creator = new FFCreator({
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

const scene1 = new FFScene();
// scene.setBgColor("#fff"); // 设置背景色
// scene.setDuration(3.5); // 设置停留时长

const fvideo1 = new FFVideo({
  path: path.join(path.resolve(), "output/test1.mp4"),
  width: 1920 * 2,
  height: 1080 * 2,
  x: 0,
  y: 0,
});
scene1.addChild(fvideo1);
scene1.setDuration(4); // 设置停留时长
scene1.setTransition("Fat", 1.5);
creator.addChild(scene1);

const scene2 = new FFScene();
scene2.setDuration(68); // 设置停留时长
const fvideo2 = new FFVideo({
  path: path.join(path.resolve(), "output/test2.mp4"),
  width: 1920 * 2,
  height: 1080 * 2,
  x: 0,
  y: 0,
});
scene2.addChild(fvideo2);
creator.addChild(scene2);

creator.start(); // 开始加工
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
