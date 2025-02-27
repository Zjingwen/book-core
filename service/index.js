import fs from "fs";
import path from "path";
import { FFCreator, FFScene } from "ffcreator";

const cacheDir = path.join(path.resolve(), "cache/");
const outputDir = path.join(path.resolve(), "output/");
const output = outputDir + "test.mp4";

const creator = new FFCreator({
  cacheDir, // 缓存目录
  outputDir, // 输出目录
  output, // 输出文件名(FFCreatorCenter中可以不设)
  width: 1920, // 影片宽
  height: 1080, // 影片高
  //   cover: "a.jpg", // 设置封面
  //   audioLoop: true, // 音乐循环
  fps: 24, // fps
  threads: 4, // 多线程(伪造)并行渲染
  debug: false, // 开启测试模式
  defaultOutputOptions: null, // ffmpeg输出选项配置
});

const scene1 = new FFScene();
scene1.setBgColor("#00ff00"); // 设置背景色
scene1.setDuration(2); // 设置停留时长
scene1.setTransition("Fat", 1.5); // 设置过渡动画(类型, 时间)
creator.addChild(scene1);

const scene2 = new FFScene();
scene2.setBgColor("#ff00ff"); // 设置背景色
scene2.setDuration(2); // 设置停留时长
creator.addChild(scene2);

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
