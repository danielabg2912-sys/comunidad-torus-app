import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import crypto from 'crypto';
import https from 'https';

const TOKEN = 'nfc_Pt4SnnWhvRs4sPe9b3JFkM7Rtw1gjb3o2937';
const SITE_ID = '2fceda62-8f94-4daf-bf27-27ca6d1cdc02';
const DIST_DIR = './dist';

function sha1(filePath) {
    const content = readFileSync(filePath);
    return crypto.createHash('sha1').update(content).digest('hex');
}

function getAllFiles(dir, baseDir = dir) {
    const files = [];
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            files.push(...getAllFiles(fullPath, baseDir));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

function httpsRequest(method, path, body, contentType = 'application/json') {
    return new Promise((resolve, reject) => {
        const bodyData = body instanceof Buffer ? body : (body ? (typeof body === 'string' ? Buffer.from(body) : Buffer.from(JSON.stringify(body))) : null);
        const options = {
            hostname: 'api.netlify.com',
            path: `/api/v1${path}`,
            method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': contentType,
                ...(bodyData ? { 'Content-Length': bodyData.length } : {}),
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    reject(new Error(`${res.statusCode} ${res.statusMessage}: ${data}`));
                    return;
                }
                resolve(data ? JSON.parse(data) : {});
            });
        });
        req.on('error', reject);
        if (bodyData) req.write(bodyData);
        req.end();
    });
}

console.log('🔍 Scanning dist/ for files...');
const allFiles = getAllFiles(DIST_DIR);
const fileMap = {};
for (const f of allFiles) {
    const relPath = '/' + relative(DIST_DIR, f).replace(/\\/g, '/');
    fileMap[relPath] = sha1(f);
}
console.log(`  Found ${allFiles.length} files`);

console.log('\n📡 Creating deploy on Netlify...');
const deploy = await httpsRequest('POST', `/sites/${SITE_ID}/deploys`, { files: fileMap });
console.log(`  Deploy ID: ${deploy.id}`);
console.log(`  Required files: ${deploy.required?.length ?? 0}`);

if (deploy.required && deploy.required.length > 0) {
    console.log('\n📤 Uploading required files...');
    for (const sha of deploy.required) {
        const relPath = Object.keys(fileMap).find(p => fileMap[p] === sha);
        if (!relPath) { console.log(`  ⚠️ sha not found: ${sha}`); continue; }
        const fullPath = join(DIST_DIR, relPath.replace(/^\//, ''));
        const content = readFileSync(fullPath);
        await httpsRequest('PUT', `/deploys/${deploy.id}/files${relPath}`, content, 'application/octet-stream');
        console.log(`  ✅ ${relPath}`);
    }
} else {
    console.log('  No new files to upload');
}

console.log('\n⏳ Checking deploy status...');
let status = deploy.state;
let attempts = 0;
while (status !== 'ready' && status !== 'error' && attempts < 20) {
    await new Promise(r => setTimeout(r, 3000));
    const updated = await httpsRequest('GET', `/deploys/${deploy.id}`);
    status = updated.state;
    console.log(`  Status: ${status}`);
    attempts++;
}

if (status === 'ready') {
    console.log('\n🎉 ¡Deploy publicado en producción!');
    console.log('🌐 https://celadon-meringue-204cd0.netlify.app');
} else {
    console.log(`\n❌ Estado final: ${status}`);
    process.exit(1);
}
