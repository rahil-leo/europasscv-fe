const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, 'public', 'images');

async function compressImage(filename, maxWidth, quality) {
    const inputPath = path.join(imagesDir, filename);
    const backupPath = path.join(imagesDir, `${filename}.original`);
    const tempPath = path.join(imagesDir, `${filename}.tmp`);
    
    if (!fs.existsSync(inputPath)) {
        console.log(`  SKIP: ${filename} not found`);
        return;
    }

    const originalSize = fs.statSync(inputPath).size;
    
    // Backup original
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
        console.log(`  Backed up original to ${filename}.original`);
    }

    // Read into buffer first, then process (avoids file lock issues on Windows)
    const inputBuffer = fs.readFileSync(inputPath);
    const ext = path.extname(filename).toLowerCase();
    let sharpInstance = sharp(inputBuffer).resize({ width: maxWidth, withoutEnlargement: true });
    
    if (ext === '.jpg' || ext === '.jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
    } else if (ext === '.png') {
        sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
    }

    // Write to temp file, then rename (safe on Windows)
    await sharpInstance.toFile(tempPath);
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);
    
    const newSize = fs.statSync(inputPath).size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`  ${filename}: ${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB (${reduction}% smaller)`);
}

async function main() {
    console.log('Compressing images...\n');
    
    // hero-bg.jpg: used as background with dark overlay, 1920px max width is plenty
    await compressImage('hero-bg.jpg', 1920, 75);
    
    // template1.jpg: used as background with white overlay, 1920px max width is plenty  
    await compressImage('template1.jpg', 1920, 75);
    
    console.log('\nDone! Originals backed up as .original files.');
}

main().catch(console.error);
