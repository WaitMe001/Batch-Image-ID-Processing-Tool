const bwipjs = require('bwip-js');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const baseImagePaths = [
    path.resolve(__dirname, './images/2折.jpg'),
    path.resolve(__dirname, './images/3折.jpg'),
    path.resolve(__dirname, './images/5折.jpg'),
]; // 多个底图

const barcodesTxtPaths = [
    path.resolve(__dirname, './txt/2折.txt'),
    path.resolve(__dirname, './txt/3折.txt'),
    path.resolve(__dirname, './txt/5折.txt'),
];

const outputDir = path.resolve(__dirname, 'output'); // 输出文件夹

// 从txt文件读取条形码内容，支持每行以逗号分隔或带引号
function getBarcodesFromTxt(txtPath) {
    const content = fs.readFileSync(txtPath, 'utf-8');
    // 匹配所有 "数字" 或 '数字' 或裸数字，忽略逗号和空白
    const matches = content.match(/["']?(\d+)["']?/g);
    return matches ? matches.map(s => s.replace(/["',]/g, '').trim()).filter(Boolean) : [];
}

async function generateBarcodePng(text) {
    return bwipjs.toBuffer({
        bcid:        'code128',       // 条形码类型
        text:        text,            // 条形码内容
        scale:       3,               // 缩放
        height:      20,              // 条形码高度 单位 px
        width:     70,                // 条形码宽度 单位 px
        includetext: true,            // 显示文本
        textxalign:  'center',        // 文本居中
        textyoffset: 2,              // 文本向下偏移2像素
    });
}

async function mergeBarcodeToImage(barcodeBuffer, baseImagePath, outputPath) {

    const base = sharp(baseImagePath); //处理底图颜色
    const baseMeta = await base.metadata();
    const barcode = sharp(barcodeBuffer);
    const barcodeMeta = await barcode.metadata();

    // 合成条形码到底图下方
    await base
        .composite([{
            input: barcodeBuffer,
            top: 10, // 
            left: Math.floor((baseMeta.width - barcodeMeta.width) / 2),
        }])
        .toColourspace('srgb') // 明确指定色彩空间
        .withMetadata()        // 保留原图元数据（含色彩信息）
        .toFile(outputPath);
}

async function main() {
    await fs.ensureDir(outputDir);
    for (let i = 0; i < baseImagePaths.length; i++) {
        const baseImagePath = baseImagePaths[i];
        const barcodesTxtPath = barcodesTxtPaths[i];
        const barcodes = getBarcodesFromTxt(barcodesTxtPath);
        const baseName = path.basename(baseImagePath, path.extname(baseImagePath));
        const bgOutputDir = path.join(outputDir, baseName); // 每个底图单独文件夹
        await fs.ensureDir(bgOutputDir);
        for (const code of barcodes) {
            const barcodeBuffer = await generateBarcodePng(code);
            const outputPath = path.join(bgOutputDir, `${baseName}_${code}.jpg`);
            await mergeBarcodeToImage(barcodeBuffer, baseImagePath, outputPath);
            console.log(`生成: ${outputPath}`);
        }
    }
}

main().catch(console.error);
