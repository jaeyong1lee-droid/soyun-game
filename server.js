const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const progressHandler = require('./api/progress');
const healthHandler = require('./api/health');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent((req.url || '/').split('?')[0]);

  if (cleanUrl === '/api/progress') {
    return progressHandler(req, res);
  }
  if (cleanUrl === '/api/health') {
    return healthHandler(req, res);
  }

  const relPath = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const filePath = path.join(ROOT, relPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

function getLocalIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  Object.keys(nets).forEach((name) => {
    (nets[name] || []).forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    });
  });
  return ips;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 이소윤의 로블록스 오비 레이서 3D 프론트엔드 서버 가동 중:`);
  console.log(`   💻 PC 접속 주소: http://localhost:${PORT}`);
  const ips = getLocalIps();
  ips.forEach((ip) => {
    console.log(`   📱 스마트폰(같은 Wi-Fi) 접속 주소: http://${ip}:${PORT}`);
  });
});
