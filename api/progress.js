const { Pool } = require('pg');

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_EQGY2xSohVX8@ep-tiny-cake-axmeyi99-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

let isTableReady = false;

async function ensureTable() {
  if (isTableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS soyun_roblox_racer_save (
      player_id VARCHAR(64) PRIMARY KEY DEFAULT 'soyun_vip',
      player_name VARCHAR(100) DEFAULT '이소윤',
      current_stage INT DEFAULT 1,
      max_stage_reached INT DEFAULT 1,
      stage_progress INT DEFAULT 0,
      total_score INT DEFAULT 0,
      high_score INT DEFAULT 0,
      max_speed INT DEFAULT 36,
      speed_multiplier NUMERIC(4,2) DEFAULT 1.0,
      total_solved INT DEFAULT 0,
      total_correct INT DEFAULT 0,
      total_wrong INT DEFAULT 0,
      math_correct INT DEFAULT 0,
      english_correct INT DEFAULT 0,
      bosses_defeated INT DEFAULT 0,
      pocket_money_count INT DEFAULT 0,
      ashley_count INT DEFAULT 0,
      paid_pocket_count INT DEFAULT 0,
      paid_ashley_count INT DEFAULT 0,
      paid_jackpot_count INT DEFAULT 0,
      bonus_name_pocket VARCHAR(120) DEFAULT '용돈 3,000원',
      bonus_name_ashley VARCHAR(120) DEFAULT '애슐리 외식',
      bonus_name_jackpot VARCHAR(120) DEFAULT '10판 보스 만원 상금',
      bonus_target_pocket INT DEFAULT 100,
      bonus_target_ashley INT DEFAULT 1000,
      bonus_target_jackpot INT DEFAULT 10,
      subject_mode VARCHAR(32) DEFAULT 'mixed',
      wrong_answer_queue JSONB DEFAULT '[]'::jsonb,
      review_history JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS paid_pocket_count INT DEFAULT 0;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS paid_ashley_count INT DEFAULT 0;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS paid_jackpot_count INT DEFAULT 0;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_name_pocket VARCHAR(120) DEFAULT '용돈 3,000원';
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_name_ashley VARCHAR(120) DEFAULT '애슐리 외식';
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_name_jackpot VARCHAR(120) DEFAULT '10판 보스 만원 상금';
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_target_pocket INT DEFAULT 100;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_target_ashley INT DEFAULT 1000;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS bonus_target_jackpot INT DEFAULT 10;
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS live_url VARCHAR(255) DEFAULT '';
    ALTER TABLE soyun_roblox_racer_save ADD COLUMN IF NOT EXISTS build_id VARCHAR(64) DEFAULT '';
  `);
  isTableReady = true;
}

function rowToState(row) {
  if (!row) return null;
  return {
    currentStage: Math.max(1, parseInt(row.current_stage, 10) || 1),
    maxStageReached: Math.max(1, parseInt(row.max_stage_reached, 10) || 1),
    stageProgress: Math.max(0, parseInt(row.stage_progress, 10) || 0),
    totalScore: Math.max(0, parseInt(row.total_score, 10) || 0),
    highScore: Math.max(0, parseInt(row.high_score, 10) || 0),
    maxSpeed: Math.max(36, parseInt(row.max_speed, 10) || 36),
    speedMultiplier: parseFloat(row.speed_multiplier) || 1.0,
    totalSolved: Math.max(0, parseInt(row.total_solved, 10) || 0),
    totalCorrect: Math.max(0, parseInt(row.total_correct, 10) || 0),
    totalWrong: Math.max(0, parseInt(row.total_wrong, 10) || 0),
    mathCorrect: Math.max(0, parseInt(row.math_correct, 10) || 0),
    englishCorrect: Math.max(0, parseInt(row.english_correct, 10) || 0),
    bossesDefeated: Math.max(0, parseInt(row.bosses_defeated, 10) || 0),
    pocketMoneyCount: Math.max(0, parseInt(row.pocket_money_count, 10) || 0),
    ashleyCount: Math.max(0, parseInt(row.ashley_count, 10) || 0),
    paidPocketCount: parseInt(row.paid_pocket_count, 10) || 0,
    paidAshleyCount: parseInt(row.paid_ashley_count, 10) || 0,
    paidJackpotCount: parseInt(row.paid_jackpot_count, 10) || 0,
    bonusNamePocket: row.bonus_name_pocket || '용돈 3,000원',
    bonusNameAshley: row.bonus_name_ashley || '애슐리 외식',
    bonusNameJackpot: row.bonus_name_jackpot || '10판 보스 만원 상금',
    bonusTargetPocket: Math.max(1, parseInt(row.bonus_target_pocket, 10) || 100),
    bonusTargetAshley: Math.max(1, parseInt(row.bonus_target_ashley, 10) || 1000),
    bonusTargetJackpot: Math.max(1, parseInt(row.bonus_target_jackpot, 10) || 10),
    liveUrl: row.live_url || '',
    buildId: row.build_id || '',
    subjectMode: row.subject_mode || 'mixed',
    wrongAnswerQueue: Array.isArray(row.wrong_answer_queue) ? row.wrong_answer_queue : [],
    reviewHistory: Array.isArray(row.review_history) ? row.review_history : [],
    lastPlayedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  };
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string' && req.body.length > 0) {
      try {
        return resolve(JSON.parse(req.body));
      } catch (_e) {
        return resolve({});
      }
    }
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const existing = await pool.query(
        `SELECT * FROM soyun_roblox_racer_save WHERE player_id = $1 LIMIT 1`,
        ['soyun_vip']
      );

      if (existing.rows.length === 0) {
        const inserted = await pool.query(
          `INSERT INTO soyun_roblox_racer_save (player_id, player_name)
           VALUES ('soyun_vip', '이소윤')
           ON CONFLICT (player_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
           RETURNING *`
        );
        res.statusCode = 200;
        return res.end(JSON.stringify({ ok: true, source: 'neon-db', state: rowToState(inserted.rows[0]) }));
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({ ok: true, source: 'neon-db', state: rowToState(existing.rows[0]) }));
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const s = (body && body.state) ? body.state : body || {};
      const forceReset = Boolean(body && body.forceReset);

      if (forceReset) {
        const resetRes = await pool.query(
          `INSERT INTO soyun_roblox_racer_save (
            player_id, player_name, current_stage, max_stage_reached, stage_progress,
            total_score, high_score, max_speed, speed_multiplier,
            total_solved, total_correct, total_wrong, math_correct, english_correct,
            bosses_defeated, pocket_money_count, ashley_count, subject_mode,
            wrong_answer_queue, review_history, updated_at
          ) VALUES (
            'soyun_vip', '이소윤', 1, 1, 0,
            0, 0, 36, 1.0,
            0, 0, 0, 0, 0,
            0, 0, 0, 'mixed',
            '[]'::jsonb, '[]'::jsonb, CURRENT_TIMESTAMP
          )
          ON CONFLICT (player_id) DO UPDATE SET
            current_stage = 1,
            max_stage_reached = 1,
            stage_progress = 0,
            total_score = 0,
            high_score = 0,
            max_speed = 36,
            speed_multiplier = 1.0,
            total_solved = 0,
            total_correct = 0,
            total_wrong = 0,
            math_correct = 0,
            english_correct = 0,
            bosses_defeated = 0,
            pocket_money_count = 0,
            ashley_count = 0,
            paid_pocket_count = 0,
            paid_ashley_count = 0,
            paid_jackpot_count = 0,
            subject_mode = 'mixed',
            wrong_answer_queue = '[]'::jsonb,
            review_history = '[]'::jsonb,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *`
        );
        res.statusCode = 200;
        return res.end(JSON.stringify({ ok: true, source: 'neon-db', state: rowToState(resetRes.rows[0]) }));
      }

      const currentStage = Math.max(1, parseInt(s.currentStage, 10) || 1);
      const maxStageReached = Math.max(currentStage, parseInt(s.maxStageReached, 10) || 1);
      const stageProgress = Math.max(0, parseInt(s.stageProgress, 10) || 0);
      const totalScore = Math.max(0, parseInt(s.totalScore, 10) || 0);
      const highScore = Math.max(totalScore, parseInt(s.highScore, 10) || 0);
      const maxSpeed = Math.max(36, parseInt(s.maxSpeed, 10) || 36);
      const speedMultiplier = Math.max(0.4, Math.min(2.0, parseFloat(s.speedMultiplier) || 1.0));
      const totalSolved = Math.max(0, parseInt(s.totalSolved, 10) || 0);
      const totalCorrect = Math.max(0, parseInt(s.totalCorrect, 10) || 0);
      const totalWrong = Math.max(0, parseInt(s.totalWrong, 10) || 0);
      const mathCorrect = Math.max(0, parseInt(s.mathCorrect, 10) || 0);
      const englishCorrect = Math.max(0, parseInt(s.englishCorrect, 10) || 0);
      const bossesDefeated = Math.max(0, parseInt(s.bossesDefeated, 10) || 0);
      const bonusTargetPocket = Math.max(1, parseInt(s.bonusTargetPocket, 10) || 100);
      const bonusTargetAshley = Math.max(1, parseInt(s.bonusTargetAshley, 10) || 1000);
      const bonusTargetJackpot = Math.max(1, parseInt(s.bonusTargetJackpot, 10) || 10);
      const gaugePoints = Math.max(0, totalCorrect - totalWrong + (bossesDefeated * 10));
      const pocketMoneyCount = Math.floor(gaugePoints / bonusTargetPocket);
      const ashleyCount = Math.floor(gaugePoints / bonusTargetAshley);
      const paidPocketCount = parseInt(s.paidPocketCount, 10) || 0;
      const paidAshleyCount = parseInt(s.paidAshleyCount, 10) || 0;
      const paidJackpotCount = parseInt(s.paidJackpotCount, 10) || 0;
      const bonusNamePocket = (typeof s.bonusNamePocket === 'string' && s.bonusNamePocket.trim()) ? s.bonusNamePocket.trim().slice(0, 100) : '용돈 3,000원';
      const bonusNameAshley = (typeof s.bonusNameAshley === 'string' && s.bonusNameAshley.trim()) ? s.bonusNameAshley.trim().slice(0, 100) : '애슐리 외식';
      const bonusNameJackpot = (typeof s.bonusNameJackpot === 'string' && s.bonusNameJackpot.trim()) ? s.bonusNameJackpot.trim().slice(0, 100) : '10판 보스 만원 상금';
      const subjectMode = ['mixed', 'math', 'english'].includes(s.subjectMode) ? s.subjectMode : 'mixed';
      const wrongQueueJson = JSON.stringify(Array.isArray(s.wrongAnswerQueue) ? s.wrongAnswerQueue.slice(0, 60) : []);
      const reviewHistoryJson = JSON.stringify(Array.isArray(s.reviewHistory) ? s.reviewHistory.slice(0, 120) : []);

      const upsertRes = await pool.query(
        `INSERT INTO soyun_roblox_racer_save (
          player_id, player_name, current_stage, max_stage_reached, stage_progress,
          total_score, high_score, max_speed, speed_multiplier,
          total_solved, total_correct, total_wrong, math_correct, english_correct,
          bosses_defeated, pocket_money_count, ashley_count,
          paid_pocket_count, paid_ashley_count, paid_jackpot_count,
          bonus_name_pocket, bonus_name_ashley, bonus_name_jackpot,
          bonus_target_pocket, bonus_target_ashley, bonus_target_jackpot,
          subject_mode, wrong_answer_queue, review_history, updated_at
        ) VALUES (
          'soyun_vip', '이소윤', $1, $2, $3,
          $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18,
          $19, $20, $21,
          $22, $23, $24,
          $25, $26::jsonb, $27::jsonb, CURRENT_TIMESTAMP
        )
        ON CONFLICT (player_id) DO UPDATE SET
          current_stage = CASE
            WHEN EXCLUDED.total_solved >= soyun_roblox_racer_save.total_solved THEN EXCLUDED.current_stage
            ELSE soyun_roblox_racer_save.current_stage
          END,
          max_stage_reached = GREATEST(soyun_roblox_racer_save.max_stage_reached, EXCLUDED.max_stage_reached),
          stage_progress = CASE
            WHEN EXCLUDED.total_solved >= soyun_roblox_racer_save.total_solved THEN EXCLUDED.stage_progress
            ELSE soyun_roblox_racer_save.stage_progress
          END,
          total_score = GREATEST(soyun_roblox_racer_save.total_score, EXCLUDED.total_score),
          high_score = GREATEST(soyun_roblox_racer_save.high_score, EXCLUDED.high_score),
          max_speed = GREATEST(soyun_roblox_racer_save.max_speed, EXCLUDED.max_speed),
          speed_multiplier = EXCLUDED.speed_multiplier,
          total_solved = GREATEST(soyun_roblox_racer_save.total_solved, EXCLUDED.total_solved),
          total_correct = GREATEST(soyun_roblox_racer_save.total_correct, EXCLUDED.total_correct),
          total_wrong = GREATEST(soyun_roblox_racer_save.total_wrong, EXCLUDED.total_wrong),
          math_correct = GREATEST(soyun_roblox_racer_save.math_correct, EXCLUDED.math_correct),
          english_correct = GREATEST(soyun_roblox_racer_save.english_correct, EXCLUDED.english_correct),
          bosses_defeated = GREATEST(soyun_roblox_racer_save.bosses_defeated, EXCLUDED.bosses_defeated),
          pocket_money_count = GREATEST(soyun_roblox_racer_save.pocket_money_count, EXCLUDED.pocket_money_count),
          ashley_count = GREATEST(soyun_roblox_racer_save.ashley_count, EXCLUDED.ashley_count),
          paid_pocket_count = EXCLUDED.paid_pocket_count,
          paid_ashley_count = EXCLUDED.paid_ashley_count,
          paid_jackpot_count = EXCLUDED.paid_jackpot_count,
          bonus_name_pocket = EXCLUDED.bonus_name_pocket,
          bonus_name_ashley = EXCLUDED.bonus_name_ashley,
          bonus_name_jackpot = EXCLUDED.bonus_name_jackpot,
          bonus_target_pocket = EXCLUDED.bonus_target_pocket,
          bonus_target_ashley = EXCLUDED.bonus_target_ashley,
          bonus_target_jackpot = EXCLUDED.bonus_target_jackpot,
          subject_mode = EXCLUDED.subject_mode,
          wrong_answer_queue = CASE
            WHEN EXCLUDED.total_solved >= soyun_roblox_racer_save.total_solved THEN EXCLUDED.wrong_answer_queue
            ELSE soyun_roblox_racer_save.wrong_answer_queue
          END,
          review_history = CASE
            WHEN EXCLUDED.total_solved >= soyun_roblox_racer_save.total_solved THEN EXCLUDED.review_history
            ELSE soyun_roblox_racer_save.review_history
          END,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          currentStage,
          maxStageReached,
          stageProgress,
          totalScore,
          highScore,
          maxSpeed,
          speedMultiplier,
          totalSolved,
          totalCorrect,
          totalWrong,
          mathCorrect,
          englishCorrect,
          bossesDefeated,
          pocketMoneyCount,
          ashleyCount,
          paidPocketCount,
          paidAshleyCount,
          paidJackpotCount,
          bonusNamePocket,
          bonusNameAshley,
          bonusNameJackpot,
          bonusTargetPocket,
          bonusTargetAshley,
          bonusTargetJackpot,
          subjectMode,
          wrongQueueJson,
          reviewHistoryJson
        ]
      );

      res.statusCode = 200;
      return res.end(JSON.stringify({ ok: true, source: 'neon-db', state: rowToState(upsertRes.rows[0]) }));
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
  } catch (err) {
    console.error('[Neon DB API Error]:', err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ ok: false, error: err.message }));
  }
};
