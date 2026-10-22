const progressHandler = require('./progress');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      status: 'ok',
      service: 'Soyun Roblox Obby Racer 3D (Neon PostgreSQL + Vercel)',
      player: '이소윤',
      timestamp: new Date().toISOString()
    })
  );
};
