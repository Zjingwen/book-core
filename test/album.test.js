import path from "path";
import { FFCreator, FFScene, FFAlbum, FFAudio } from "ffcreator";

const cacheDir = path.join(path.resolve(), "cache/");
const outputDir = path.join(path.resolve(), "output/");
const output = outputDir + "test.mp4";

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

const scene = new FFScene();
scene.setBgColor("#00ff00"); // 设置背景色
scene.setDuration(3.5); // 设置停留时长

const list = [
  path.join(path.resolve(), "resources/1.jpg"),
  path.join(path.resolve(), "resources/2.jpg"),
  path.join(path.resolve(), "resources/3.jpg"),
  path.join(path.resolve(), "resources/4.jpg"),
  path.join(path.resolve(), "resources/5.jpg"),
  path.join(path.resolve(), "resources/6.jpg"),
  path.join(path.resolve(), "resources/7.jpg"),
  path.join(path.resolve(), "resources/8.jpg"),
  path.join(path.resolve(), "resources/9.jpg"),
  path.join(path.resolve(), "resources/10.jpg"),
  path.join(path.resolve(), "resources/11.jpg"),
  path.join(path.resolve(), "resources/12.jpg"),
  path.join(path.resolve(), "resources/13.jpg"),
  path.join(path.resolve(), "resources/14.jpg"),
  path.join(path.resolve(), "resources/15.jpg"),
  path.join(path.resolve(), "resources/16.jpg"),
];
const addSize = 300;
const album = new FFAlbum({
  list, // 相册的图片集合
  x: 1920 / 2,
  y: 1080 / 2,
  width: 270 + addSize,
  height: 391 + addSize,
});
album.setTransition("fadeIn"); // 设置相册切换动画
album.setDuration(0.1); // 设置单张停留时长
album.setTransTime(0.1); // 设置单张动画时长

scene.addChild(album);
const audio1 = new FFAudio({
  ss: "00:00:00", // 开始时间
  to: "00:00:02", // 结束时间
  fadeOut: 2,
  path: path.join(path.resolve(), "resources/a.MP3"),
});

scene.addAudio(audio1);
scene.addAudio({
  path: path.join(path.resolve(), "resources/1.mp3"),
});
scene.addAudio({
  start: 2.5,
  path: path.join(path.resolve(), "resources/2.mp3"),
});

creator.addChild(scene);

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
