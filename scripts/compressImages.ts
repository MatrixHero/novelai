import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CHARACTERS_DIR = path.join(__dirname, '../public/characters');
const OUTPUT_DIR = path.join(__dirname, '../public/characters/compressed');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function compressImage(inputPath: string, outputPath: string) {
    try {
        await sharp(inputPath)
            .resize(800, 1200, {  // 调整尺寸
                fit: 'cover',
                position: 'center'
            })
            .jpeg({  // 转换为 JPEG 格式
                quality: 80,  // 压缩质量
                progressive: true
            })
            .toFile(outputPath);
        
        const originalSize = fs.statSync(inputPath).size;
        const compressedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        
        console.log(`压缩完成: ${path.basename(inputPath)}`);
        console.log(`原始大小: ${(originalSize / 1024).toFixed(2)}KB`);
        console.log(`压缩后: ${(compressedSize / 1024).toFixed(2)}KB`);
        console.log(`压缩率: ${reduction}%\n`);
    } catch (error) {
        console.error(`压缩失败 ${inputPath}:`, error);
    }
}

async function processImages() {
    const files = fs.readdirSync(CHARACTERS_DIR);
    
    for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const inputPath = path.join(CHARACTERS_DIR, file);
            const outputPath = path.join(OUTPUT_DIR, path.parse(file).name + '.jpg');
            await compressImage(inputPath, outputPath);
        }
    }
}

processImages().then(() => {
    console.log('所有图片处理完成！');
}).catch(error => {
    console.error('处理过程中出错:', error);
}); 