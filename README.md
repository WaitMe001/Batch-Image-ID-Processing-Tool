# - Batch-Image-ID-Processing-Tool

## 启动设置

1. 安装 Node.js（建议 16.x 或以上）。
2. 在项目目录下打开命令行，执行依赖安装：
   ```bash
   yarn install
   ```
   或
   ```bash
   npm install
   ```

## 启动项目

在命令行中运行：
```bash
yarn start
```
或
```bash
npm start
```

## 工具使用说明

1. 将底图（如 `2折.jpg`、`3折.jpg`、`5折.jpg`）放入 `images` 文件夹。
2. 将条形码内容（每行一个，支持逗号分隔或带引号）放入 `txt` 文件夹下对应的 txt 文件（如 `2折.txt`）。
3. 启动项目后，生成的图片会输出到 `output` 文件夹，每种底图一个子文件夹。
4. 控制台会输出每个生成图片的路径。
