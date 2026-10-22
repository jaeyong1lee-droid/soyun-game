/**
 * 🔄 자동 푸시(배포) 감시 데몬 (auto-push.js)
 * 게임 폴더 내 파일(index.html, css/*, js/*, api/*, manifest.json, sw.js 등)이 수정되면
 * 원본 '안티' 프로젝트와 100% 분리된 독립 서버 2곳:
 * 1) 독립 영구 서버 (GitHub Pages): https://jaeyong1lee-droid.github.io/soyun-game/
 * 2) 독립 실시간 서버 (Vercel): https://spry-tungsten-t76b1pb.tmp.now
 * 양쪽에 자동으로 즉시 푸시(배포)합니다.
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const PERM_URL = 'https://jaeyong1lee-droid.github.io/soyun-game/';

const WATCH_TARGETS = [
  'index.html',
  'manifest.json',
  'sw.js',
  'vercel.json',
  'server.js',
  'css',
  'js',
  'api'
];

let debounceTimer = null;
let isDeploying = false;
let pendingDeploy = false;
let ignoreWatchUntil = 0;

function isSourceIntact() {
  try {
    const idxPath = path.join(ROOT, 'index.html');
    const gameJsPath = path.join(ROOT, 'js', 'game.js');
    if (!fs.existsSync(idxPath) || !fs.existsSync(gameJsPath)) return false;
    return fs.statSync(idxPath).size > 10000 && fs.statSync(gameJsPath).size > 70000;
  } catch (_e) {
    return false;
  }
}

function cleanVercelOutputHardlinks() {
  try {
    const outDir = path.join(ROOT, '.vercel', 'output');
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  } catch (_e) {}
}

function pushToStandaloneGitHub() {
  try {
    if (!isSourceIntact()) {
      console.warn('⚠️ [보호 작동] 원본 파일 크기가 비정상(0바이트 등)이어서 GitHub 푸시를 중단합니다.');
      return;
    }
    exec(
      'git add index.html manifest.json sw.js vercel.json server.js package.json css js assets api && git commit -m "Auto-deploy Soyun game" && git push origin main',
      { cwd: ROOT },
      () => {}
    );
  } catch (_e) {}
}

function runDeploy(reason) {
  if (isDeploying) {
    pendingDeploy = true;
    return;
  }
  if (!isSourceIntact()) {
    console.warn('⚠️ [보호 작동] 원본 파일 손상 방지를 위해 배포를 건너뜁니다.');
    return;
  }

  isDeploying = true;
  ignoreWatchUntil = Date.now() + 30000;
  console.log(`\n🚀 [독립 자동 푸시 시작] 변경 감지 (${reason}) -> 독립 영구 서버(soyun-game) & Vercel 서버 배포 중...`);

  // CRITICAL: Remove .vercel/output BEFORE running vercel deploy so HardLinks never truncate source files!
  cleanVercelOutputHardlinks();

  // 1. Push to standalone GitHub Pages repo (https://jaeyong1lee-droid.github.io/soyun-game/)
  pushToStandaloneGitHub();

  // 2. Deploy to standalone Vercel live edge
  exec('cmd.exe /c "npx vercel deploy --temporary --yes"', { cwd: ROOT }, (err, stdout, stderr) => {
    cleanVercelOutputHardlinks();
    const out = String(stdout || '') + '\n' + String(stderr || '');
    if (out.includes('Your temporary deployment has expired') || out.includes('This project was claimed successfully')) {
      try {
        fs.rmSync(path.join(ROOT, '.vercel'), { recursive: true, force: true });
      } catch (_e) {}
      exec('cmd.exe /c "npx vercel deploy --temporary --yes"', { cwd: ROOT }, (_err2, stdout2) => {
        cleanVercelOutputHardlinks();
        finishDeploy(stdout2);
      });
    } else {
      finishDeploy(stdout);
    }
  });
}

function finishDeploy(stdout) {
  isDeploying = false;
  ignoreWatchUntil = Date.now() + 4000;
  const match = String(stdout || '').match(/https:\/\/[a-z0-9-]+\.tmp\.now/i);
  const buildId = String(Date.now());

  if (match && match[0]) {
    const url = match[0];
    console.log(`✅ [독립 자동 푸시 완료] 영구 주소: ${PERM_URL} | 즉시 주소: ${url} (${new Date().toLocaleTimeString()})`);
    try {
      fs.writeFileSync(path.join(ROOT, 'LIVE_URL.txt'), `${PERM_URL}\n${url}\n`, 'utf8');
    } catch (_e) {}
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString:
          process.env.DATABASE_URL ||
          'postgresql://neondb_owner:npg_EQGY2xSohVX8@ep-tiny-cake-axmeyi99-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
        ssl: { rejectUnauthorized: false }
      });
      pool
        .query(
          `ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS live_url VARCHAR(255) DEFAULT '';
           ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS build_id VARCHAR(64) DEFAULT '';`
        )
        .then(() =>
          pool.query(
            `UPDATE soyun_roblox_racer_save SET live_url = $1, build_id = $2 WHERE player_id = 'soyun_vip'`,
            [url, buildId]
          )
        )
        .catch(() => {})
        .finally(() => pool.end().catch(() => {}));
    } catch (_e) {}
  } else {
    console.log(`✅ [독립 자동 푸시 완료] 영구 주소: ${PERM_URL} (${new Date().toLocaleTimeString()})`);
  }

  if (pendingDeploy) {
    pendingDeploy = false;
    scheduleDeploy('추가 변경사항 반영');
  }
}

function scheduleDeploy(filename) {
  if (isDeploying || Date.now() < ignoreWatchUntil) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runDeploy(filename || '파일 수정');
  }, 2500);
}

if (require.main === module) {
  if (process.argv.includes('--once')) {
    runDeploy('즉시 배포 실행');
  } else {
    cleanVercelOutputHardlinks();
    WATCH_TARGETS.forEach((target) => {
      const fullPath = path.join(ROOT, target);
      if (!fs.existsSync(fullPath)) return;
      try {
        fs.watch(fullPath, { recursive: fs.statSync(fullPath).isDirectory() }, (eventType, filename) => {
          const name = filename || target;
          if (String(name).endsWith('~') || String(name).endsWith('.tmp')) return;
          scheduleDeploy(`${target}/${name}`);
        });
      } catch (err) {
        console.warn(`[감시 경고] ${target}:`, err.message);
      }
    });
    console.log('👀 [독립 자동 푸시 감시 데몬 가동 중] 파일이 수정되면 독립 서버(soyun-game & Vercel)에 자동 푸시됩니다.');
  }
}
