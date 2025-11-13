const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const gameDir = path.join(repoRoot, 'Game');
const outFile = path.join(repoRoot, 'games.json');

function findPreview(dir) {
    const candidates = ['preview.png','preview.jpg','preview.jpeg','screenshot.png','screenshot.jpg','thumb.png','thumb.jpg','icon.png','icon.jpg'];
    for (const c of candidates) {
        const p = path.join(dir, c);
        if (fs.existsSync(p)) return path.relative(repoRoot, p).replace(/\\/g, '/');
    }
    // look into TemplateData or StreamingAssets
    const dirs = ['TemplateData','StreamingAssets'];
    for (const d of dirs) {
        const dd = path.join(dir, d);
        if (!fs.existsSync(dd)) continue;
        const files = fs.readdirSync(dd);
        for (const f of files) {
            if (/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) return path.relative(repoRoot, path.join(dd, f)).replace(/\\/g, '/');
        }
    }
    return null;
}

function findEntryLink(dir, folderName) {
    // prefer index.html in folder
    const idx = path.join(dir, 'index.html');
    if (fs.existsSync(idx)) return `./Game/${folderName}/index.html`;

    // else try top-level htmls
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (/\.html$/i.test(f)) return `./Game/${folderName}/${f}`;
    }

    // else look for Build loader or framework
    const buildDir = path.join(dir, 'Build');
    if (fs.existsSync(buildDir)) {
        const bf = fs.readdirSync(buildDir).find(x => /loader|framework/i.test(x));
        if (bf) return `./Game/${folderName}/index.html`;
    }

    // fallback to folder path
    return `./Game/${folderName}/`;
}

function scanGameFolders() {
    if (!fs.existsSync(gameDir)) {
        console.error('Game 目录不存在：', gameDir);
        process.exit(1);
    }
    const entries = fs.readdirSync(gameDir, { withFileTypes: true });
    const games = [];
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        const name = e.name;
        const dir = path.join(gameDir, name);
        // skip hidden/system
        if (name.startsWith('.')) continue;

        const preview = findPreview(dir);
        const link = findEntryLink(dir, name);

        const gameObj = {
            id: games.length + 1,
            title: name,
            folder: name,
            link: link,
        };
        if (preview) gameObj.image = preview;
        games.push(gameObj);
    }
    return games;
}

function writeOut(games) {
    fs.writeFileSync(outFile, JSON.stringify(games, null, 2), 'utf8');
    console.log(`生成 ${outFile}，包含 ${games.length} 个条目`);
}

// 执行
try {
    const games = scanGameFolders();
    writeOut(games);
} catch (err) {
    console.error('生成 games.json 出错：', err);
    process.exit(2);
}

/*
Usage:
  node scripts/generate_games_json.js

这会在仓库根目录生成或覆盖 games.json。然后打开 index.html，页面会尝试加载此文件并渲染游戏卡片。
*/
