/**
 * 👑 이소윤의 로블록스 오비 레이서 3D (Soyun's Roblox Obby Racer 3D)
 * Game Configuration, Infinite Stage Definitions, Speed Presets & Roblox Pet Evolution System
 */
(function (window) {
  'use strict';

  const STAGES = [
    {
      stage: 1,
      title: '🏞️ 에메랄드 강변 & 알프스 대자연 숲',
      subtitle: '이소윤의 기초 연산·구구단 밖 곱셈·나눗셈 & 기초 영단어·생활영어!',
      questionsToBoss: 15, // 15문제 풀어야 보스 출현
      bossName: '블록 골렘 렉스 (Blocky Rex)',
      bossTitle: '1단계 대자연 강변 수문장',
      bossHp: 9, // 보스 체력 9
      baseSpeed: 36, // 문제 풀이 시간 약 9.5초
      gateSolveSeconds: 9.5,
      themeColor: '#00e676',
      roadColor: '#1f2e3d',
      skyColor: '#0d47a1',
      fogColor: '#1d4d4f',
      bossColor: 0xff3366
    },
    {
      stage: 2,
      title: '☁️ 천공의 구름 왕국 · 하늘 위 무지개 길',
      subtitle: '구구단 밖 곱셈·나눗셈 & 초등 필수 생활영어 회화!',
      questionsToBoss: 18,
      bossName: '알파벳 빌런 눕킹 (Noob King)',
      bossTitle: '2단계 하늘 구름왕국 보스',
      bossHp: 10,
      baseSpeed: 36.5, // 단계별 미세 가속 (+0.5)
      gateSolveSeconds: 9.4,
      themeColor: '#00e5ff',
      roadColor: '#1e3a5f',
      skyColor: '#0277bd',
      fogColor: '#3a7bd5',
      bossColor: 0xff9900
    },
    {
      stage: 3,
      title: '🐠 신비한 바닷속 산호초 & 아틀란티스 해저월드',
      subtitle: '곱셈·나눗셈·두자리 연산 & 실전 생활영어 마스터!',
      questionsToBoss: 16,
      bossName: '코블록스 스핑크스 (Korblox Sphinx)',
      bossTitle: '3단계 해저 아틀란티스 보스',
      bossHp: 10,
      baseSpeed: 37.0, // 단계별 미세 가속 (+0.5)
      gateSolveSeconds: 9.2,
      themeColor: '#00f5d4',
      roadColor: '#06283d',
      skyColor: '#001233',
      fogColor: '#003554',
      bossColor: 0x00ffcc
    },
    {
      stage: 4,
      title: '🌋 불타는 화산 용암지대 & 마그마 협곡',
      subtitle: '심화 곱셈·나눗셈 & 필수 생활영어 스피드 배틀!',
      questionsToBoss: 17,
      bossName: '밴해머 레드 드래곤 (Ban-Hammer Dragon)',
      bossTitle: '4단계 화산 용암 드래곤',
      bossHp: 11,
      baseSpeed: 37.5, // 단계별 미세 가속 (+0.5)
      gateSolveSeconds: 9.1,
      themeColor: '#ff6d00',
      roadColor: '#240905',
      skyColor: '#1a0000',
      fogColor: '#2d0604',
      bossColor: 0xff2200
    }
  ];

  // 무한 스테이지(STAGE 5 ~ ∞)를 위한 다채로운 배경 월드 템플릿 (상상의 나라·벚꽃 호수·설산 오로라·환상의 세계 등)
  const EXTRA_STAGE_TEMPLATES = [
    {
      titlePrefix: '🎠 상상의 나라 · 마법 동화 & 캔디 원더랜드',
      bossName: '마시멜로 골렘 킹 (Marshmallow King)',
      bossRole: '상상의 나라 마법 보스',
      themeColor: '#ff70a6',
      roadColor: '#311442',
      skyColor: '#3c096c',
      fogColor: '#2b0f42',
      bossColor: 0xff66cc
    },
    {
      titlePrefix: '🌸 벚꽃 호수 & 봄날의 산악 계곡',
      bossName: '도미누스 타이탄 (Dominus Titan)',
      bossRole: '벚꽃 호수 수호신',
      themeColor: '#ff8fab',
      roadColor: '#281c2d',
      skyColor: '#2b193d',
      fogColor: '#361f32',
      bossColor: 0xff8fab
    },
    {
      titlePrefix: '❄️ 알래스카 설산 & 빙하 강 오로라 월드',
      bossName: '아이스 프로스트 드래곤 (Frost Dragon)',
      bossRole: '설산 빙하 오로라 지배자',
      themeColor: '#64ffda',
      roadColor: '#102538',
      skyColor: '#021124',
      fogColor: '#0d2b45',
      bossColor: 0x00f5ff
    },
    {
      titlePrefix: '🌈 사이버 은하수 & 네온 환상의 세계',
      bossName: '오메가 발키리 (Omega Valkyrie)',
      bossRole: '환상의 세계 지배자',
      themeColor: '#00f3ff',
      roadColor: '#16092c',
      skyColor: '#040112',
      fogColor: '#0d041d',
      bossColor: 0xc084fc
    },
    {
      titlePrefix: '🏞️ 에메랄드 대자연 협곡 & 폭포 숲',
      bossName: '메카 티라노 렉스 (Mecha T-Rex)',
      bossRole: '대자연 아일랜드 챔피언',
      themeColor: '#22c55e',
      roadColor: '#0f2918',
      skyColor: '#06140b',
      fogColor: '#0c2113',
      bossColor: 0x22c55e
    },
    {
      titlePrefix: '☁️ 천공의 무지개 아일랜드 & 구름 신전',
      bossName: '포세이돈 스카이 메카 (Sky Mecha)',
      bossRole: '하늘 신전 수호자',
      themeColor: '#06b6d4',
      roadColor: '#082530',
      skyColor: '#031217',
      fogColor: '#071f29',
      bossColor: 0x06b6d4
    },
    {
      titlePrefix: '🐠 아틀란티스 산호초 & 심해 보물 해협',
      bossName: '인피니티 엠페러 (Infinity Emperor)',
      bossRole: '바닷속 심해 마스터',
      themeColor: '#00f5d4',
      roadColor: '#06283d',
      skyColor: '#001233',
      fogColor: '#003554',
      bossColor: 0x00f5d4
    },
    {
      titlePrefix: '🌋 마그마 볼케이노 & 불꽃 드래곤 밸리',
      bossName: '갤럭시 오버로드 (Galaxy Overlord)',
      bossRole: '용암 협곡 챔피언',
      themeColor: '#facc15',
      roadColor: '#2b230c',
      skyColor: '#141004',
      fogColor: '#261e09',
      bossColor: 0xfacc15
    }
  ];

  // 속도 조절 프리셋 (기본 1.0x = 이전 속도의 절반인 55 KM/H 기준!)
  const SPEED_MULTIPLIERS = [
    { mult: 0.6, label: '🐢 0.6x 아주 천천히', shortLabel: '0.6x' },
    { mult: 0.8, label: '🐣 0.8x 천천히', shortLabel: '0.8x' },
    { mult: 1.0, label: '🚗 1.0x 기본 (추천)', shortLabel: '1.0x' },
    { mult: 1.3, label: '🚀 1.3x 약간 빠르게', shortLabel: '1.3x' },
    { mult: 1.6, label: '⚡ 1.6x 빠르게', shortLabel: '1.6x' }
  ];

  const ROBLOX_PETS = [
    {
      level: 1,
      minScore: 0,
      minStage: 1,
      icon: '🐣',
      name: '🐣 블록 병아리 펫 (Blocky Chick)',
      shortName: '🐣 블록 병아리 펫',
      cheerTag: '병아리펫',
      unlockDesc: '기본 파트너 (0+ R$)'
    },
    {
      level: 2,
      minScore: 500,
      minStage: 2,
      icon: '🐱',
      name: '🐱 네온 고양이 펫 (Neon Cat)',
      shortName: '🐱 네온 고양이 펫',
      cheerTag: '네온고양이펫',
      unlockDesc: '500+ R$ 또는 STAGE 2 달성'
    },
    {
      level: 3,
      minScore: 1500,
      minStage: 3,
      icon: '🦄',
      name: '🦄 레인보우 유니콘 펫 (Rainbow Unicorn)',
      shortName: '🦄 레인보우 유니콘 펫',
      cheerTag: '유니콘펫',
      unlockDesc: '1,500+ R$ 또는 STAGE 3 달성'
    },
    {
      level: 4,
      minScore: 3000,
      minStage: 4,
      icon: '🐉',
      name: '🐉 갤럭시 드래곤 펫 (Galaxy Dragon)',
      shortName: '🐉 갤럭시 드래곤 펫',
      cheerTag: '드래곤펫',
      unlockDesc: '3,000+ R$ 또는 STAGE 4 달성'
    },
    {
      level: 5,
      minScore: 5000,
      minStage: 5,
      icon: '👑',
      name: '👑 로블록스 여왕 발키리 펫 (Queen Valkyrie)',
      shortName: '👑 여왕 발키리 펫',
      cheerTag: '발키리펫',
      unlockDesc: '5,000+ R$ 또는 STAGE 5 달성'
    }
  ];

  const GameConfig = {
    STORAGE_KEY: 'run_and_learn_racer_save_v1',
    PLAYER_NAME: '이소윤',
    PLAYER_BADGE: '👑 VIP 플레이어: 이소윤',
    MAIN_TITLE: '👑 이소윤의 로블록스 오비 레이서 3D',
    SUB_TITLE: '이소윤 전용 VIP 에디션 · 무한 스테이지 · 연산·곱셈·나눗셈 & 영단어·생활영어 마스터!',

    LANES: [-4.5, 0, 4.5],
    LANE_NAMES: ['LEFT (1)', 'CENTER (2)', 'RIGHT (3)'],
    LANE_LABELS_KR: ['왼쪽 (1)', '중앙 (2)', '오른쪽 (3)'],

    MAX_HP: 5,
    MAX_PAUSE_CHANCES: 2, // 일시정지 기회는 2번!
    BOSS_SPEED_MULTIPLIER: 1.5, // 보스 출현 시 속도가 1.5배 빨라짐!
    BOSS_REWARD_GAUGE_BONUS: 10, // 일반 문제는 +1, 보스 격파 시 상금 게이지 +10 상승!
    JACKPOT_BOSS_INTERVAL: 10, // 10판째 보스마다 10,000원(만원) 상금!
    JACKPOT_BOSS_PRIZE_WON: 10000,

    BASE_SPEED: 36,
    MIN_SPEED_CAP: 18,
    MAX_SPEED_CAP: 45, // 단계가 올라가도 최대 속도 상한선(45) 유지 (충분한 풀이 시간 보장!)
    SPEED_INCREMENT_PER_CORRECT: 0.08, // 문제 정답 시 아주 미세하게만 가속
    SPEED_STAGE_BONUS: 0.5, // 스테이지 상승 시 +0.5씩 아주 미세하게만 가속
    SPEED_STEP_BUTTON: 6, // [ - / + ] 속도 조절 버튼 클릭 시 증감 폭
    SPEED_MULTIPLIERS: SPEED_MULTIPLIERS,

    GATE_SPAWN_Z: -74, // 처음부터 중앙 전광판이 큼직하게 보이도록 스폰 위치 최적화
    GATE_PASS_Z: 8,
    PLAYER_Z: 8,

    SCORE_PER_CORRECT: 100,
    SCORE_COMBO_BONUS: 25,
    SCORE_REVIEW_BONUS: 60,
    SCORE_BOSS_HIT: 150,
    SCORE_BOSS_CLEAR: 500,

    STAGES: STAGES,
    ROBLOX_PETS: ROBLOX_PETS,

    /**
     * Returns the highest unlocked Roblox Pet for Soyun based on cumulative Robux (totalScore) and stage.
     * Supports infinite pet mastery bonus levels for stage >= 6!
     */
    getCurrentPet: function (totalScore, maxStage) {
      const score = Math.max(0, parseInt(totalScore, 10) || 0);
      const stg = Math.max(1, parseInt(maxStage, 10) || 1);
      let current = ROBLOX_PETS[0];
      let nextPet = null;

      for (let i = 0; i < ROBLOX_PETS.length; i++) {
        const pet = ROBLOX_PETS[i];
        if (score >= pet.minScore || stg >= pet.minStage) {
          current = pet;
        } else if (!nextPet) {
          nextPet = pet;
        }
      }

      if (stg > 5 && current.level === 5) {
        current = Object.assign({}, current, {
          level: stg,
          name: `👑 신화 발키리 펫 ★${stg - 4} (Mythic Valkyrie)`
        });
      }

      return {
        current: current,
        next: nextPet
      };
    },

    /**
     * Computes Soyun's Real-Life Reward Gauges:
     * - 일반 문제 정답 시 +1, 오답 시 -1 차감, 보스 격파 시 +10 상금 게이지 상승!
     * 1) 💵 용돈 3,000원 (기본 목표 100판, 보호자 창에서 수정 가능)
     * 2) 🍓 애슐리 외식 (기본 목표 1,000판, 보호자 창에서 수정 가능)
     * 3) 💴 10단계 보스 상금 (기본 목표 10단계, 보호자 창에서 수정 가능)
     * @param {number} [totalCorrect]
     * @param {number} [bossesDefeated]
     * @param {number} [maxStageReached]
     * @param {number} [totalWrong]
     */
    getRewardStatus: function (totalCorrect, bossesDefeated, maxStageReached, totalWrong) {
      const saveState = (window.SaveManager && typeof window.SaveManager.getState === 'function')
        ? window.SaveManager.getState()
        : {};

      const rawCorrect = totalCorrect !== undefined
        ? Math.max(0, parseInt(totalCorrect, 10) || 0)
        : Math.max(0, parseInt(saveState.totalCorrect, 10) || 0);
      const rawWrong = totalWrong !== undefined
        ? Math.max(0, parseInt(totalWrong, 10) || 0)
        : Math.max(0, parseInt(saveState.totalWrong, 10) || 0);
      const bosses = bossesDefeated !== undefined
        ? Math.max(0, parseInt(bossesDefeated, 10) || 0)
        : Math.max(0, parseInt(saveState.bossesDefeated, 10) || 0);
      const maxStg = maxStageReached !== undefined
        ? Math.max(1, parseInt(maxStageReached, 10) || 1)
        : Math.max(1, parseInt(saveState.maxStageReached, 10) || 1);

      const bossBonusPoints = bosses * 10;
      // 오답일 경우 -1점씩 보너스 게이지 점수 차감 (최소 0점)
      const gaugePoints = Math.max(0, rawCorrect - rawWrong + bossBonusPoints);

      // 1. 보너스 1 (기본: 용돈 3,000원 · 목표 100판)
      const pocketTarget = Math.max(1, parseInt(saveState.bonusTargetPocket, 10) || 100);
      const pocketEarned = Math.floor(gaugePoints / pocketTarget);
      const pocketCurrent = gaugePoints % pocketTarget;
      const pocketPhaseLabel = `(0→${pocketTarget}판 반복 · 오답 -1)`;
      const pocketPct = Math.min(100, Math.round((pocketCurrent / pocketTarget) * 100));

      // 2. 보너스 2 (기본: 애슐리 외식 · 목표 1,000판)
      const ashleyTarget = Math.max(1, parseInt(saveState.bonusTargetAshley, 10) || 1000);
      const ashleyEarned = Math.floor(gaugePoints / ashleyTarget);
      const ashleyCurrent = gaugePoints % ashleyTarget;
      const ashleyPct = Math.min(100, Math.round((ashleyCurrent / ashleyTarget) * 100));
      const ashleyPhaseLabel = `(0→${ashleyTarget.toLocaleString()}판 반복 · 오답 -1)`;

      // 3. 10단계 보스 보너스 (기본: 목표 10단계)
      const jackpotTarget = Math.max(1, parseInt(saveState.bonusTargetJackpot, 10) || 10);
      const effectiveBossClears = Math.max(bosses, Math.max(0, maxStg - 1));
      const jackpotEarned = Math.floor(effectiveBossClears / jackpotTarget);
      const jackpotCurrent = effectiveBossClears % jackpotTarget;
      const jackpotPct = Math.min(100, Math.round((jackpotCurrent / jackpotTarget) * 100));
      const nextJackpotStage = (jackpotEarned + 1) * jackpotTarget;
      const jackpotPhaseLabel = `(0→${jackpotTarget}단계 반복)`;

      // 지급 완료(삭제) 반영 -> 현재 미지급 달성 보너스 개수 계산
      const paidPocket = parseInt(saveState.paidPocketCount, 10) || 0;
      const paidAshley = parseInt(saveState.paidAshleyCount, 10) || 0;
      const paidJackpot = parseInt(saveState.paidJackpotCount, 10) || 0;

      const unpaidPocket = Math.max(0, pocketEarned - paidPocket);
      const unpaidAshley = Math.max(0, ashleyEarned - paidAshley);
      const unpaidJackpot = Math.max(0, jackpotEarned - paidJackpot);
      const totalUnpaidBonuses = unpaidPocket + unpaidAshley + unpaidJackpot;

      const namePocket = (saveState.bonusNamePocket && String(saveState.bonusNamePocket).trim()) || '용돈 3,000원';
      const nameAshley = (saveState.bonusNameAshley && String(saveState.bonusNameAshley).trim()) || '애슐리 외식';
      const nameJackpot = (saveState.bonusNameJackpot && String(saveState.bonusNameJackpot).trim()) || '10판 보스 만원 상금';

      return {
        totalCorrect: rawCorrect,
        totalWrong: rawWrong,
        bossesDefeated: bosses,
        bossBonusPoints: bossBonusPoints,
        gaugePoints: gaugePoints,
        totalUnpaidBonuses: totalUnpaidBonuses,
        pocketMoney: {
          key: 'pocket',
          icon: '💵',
          customName: namePocket,
          title: `💵 ${namePocket}`,
          earnedCount: pocketEarned,
          paidCount: Math.max(0, paidPocket),
          unpaidCount: unpaidPocket,
          totalWon: unpaidPocket * 3000,
          current: pocketCurrent,
          target: pocketTarget,
          unit: '판',
          remaining: pocketTarget - pocketCurrent,
          percent: pocketPct,
          phaseLabel: pocketPhaseLabel
        },
        ashley: {
          key: 'ashley',
          icon: '🍓',
          customName: nameAshley,
          title: `🍓 ${nameAshley}`,
          earnedCount: ashleyEarned,
          paidCount: Math.max(0, paidAshley),
          unpaidCount: unpaidAshley,
          current: ashleyCurrent,
          target: ashleyTarget,
          unit: '판',
          remaining: ashleyTarget - ashleyCurrent,
          percent: ashleyPct,
          phaseLabel: ashleyPhaseLabel
        },
        bossJackpot: {
          key: 'jackpot',
          icon: '💴',
          customName: nameJackpot,
          title: `💴 ${nameJackpot}`,
          earnedCount: jackpotEarned,
          paidCount: Math.max(0, paidJackpot),
          unpaidCount: unpaidJackpot,
          totalWon: unpaidJackpot * 10000,
          current: jackpotCurrent,
          target: jackpotTarget,
          unit: '단계',
          remaining: jackpotTarget - jackpotCurrent,
          nextJackpotStage: nextJackpotStage,
          percent: jackpotPct,
          phaseLabel: jackpotPhaseLabel
        }
      };
    },

    /**
     * Always returns a valid stage configuration object for ANY stageNum (1 ~ ∞ Infinite Stages!).
     * Every 10th stage (STAGE 10, 20, 30...) is a 10,000원 (만원) Jackpot Boss Stage!
     * @param {number} stageNum
     * @returns {Object}
     */
    getStageConfig: function (stageNum) {
      const parsed = parseInt(stageNum, 10);
      const s = (!isNaN(parsed) && parsed >= 1) ? parsed : 1;
      const isJackpotStage = (s % 10 === 0);

      if (s <= STAGES.length) {
        return Object.assign({}, STAGES[s - 1], {
          isJackpotStage: isJackpotStage,
          jackpotPrizeWon: isJackpotStage ? 10000 : 0
        });
      }

      const extraIdx = (s - 5) % EXTRA_STAGE_TEMPLATES.length;
      const tpl = EXTRA_STAGE_TEMPLATES[extraIdx];
      const tier = s - 4;

      const baseTitle = isJackpotStage
        ? `💴 [만원 상금] ${tpl.titlePrefix} (STAGE ${s})`
        : `${tpl.titlePrefix} (STAGE ${s})`;
      const baseBossName = isJackpotStage
        ? `💴 황금 만원 보스 · ${tpl.bossName} Mk-${tier}`
        : `${tpl.bossName} Mk-${tier}`;
      const baseBossTitle = isJackpotStage
        ? `💴 ${s}판째 만원(10,000원) 상금 보스 · ${tpl.bossRole}`
        : `${s}단계 ${tpl.bossRole}`;
      const baseSubtitle = isJackpotStage
        ? `💴 대박 찬스! ${s}판째 보스 격파 시 [만원(10,000원) 상금] + 상금 게이지 +10 획득!`
        : `${s}단계 무한 오비 · 곱셈·나눗셈·연산 & 실전 생활영어 챌린지`;

      return {
        stage: s,
        title: baseTitle,
        subtitle: baseSubtitle,
        questionsToBoss: Math.min(24, 15 + Math.floor((s - 1) * 0.6)),
        bossName: baseBossName,
        bossTitle: baseBossTitle,
        bossHp: Math.min(18, 9 + Math.floor((s - 1) * 0.5)),
        baseSpeed: Math.min(45, +(36 + (s - 1) * 0.5).toFixed(1)),
        gateSolveSeconds: Math.max(7.6, +(9.5 - (s - 1) * 0.1).toFixed(1)),
        themeColor: isJackpotStage ? '#ffd700' : tpl.themeColor,
        roadColor: tpl.roadColor,
        skyColor: tpl.skyColor,
        fogColor: tpl.fogColor,
        bossColor: isJackpotStage ? 0xffd700 : tpl.bossColor,
        isJackpotStage: isJackpotStage,
        jackpotPrizeWon: isJackpotStage ? 10000 : 0
      };
    },

    /**
     * Returns World Country / Kingdom Summary info for the Sky-Ascending Stage Tree Map ("1단계는 어느나라 - 2단계는 어느나라")
     * @param {number} stageNumber
     */
    getStageWorldInfo: function (stageNumber) {
      const s = Math.max(1, parseInt(stageNumber, 10) || 1);
      const isJackpot = (s % 10 === 0);
      const worlds = [
        {
          icon: '🏞️',
          country: '에메랄드 대자연의 나라',
          summary: '알프스 만년설 산맥 · 에메랄드 강변 · 푸른 소나무 숲',
          zone: '대자연 지구 (1,000m)',
          color: '#00e676',
          bg: 'linear-gradient(135deg, rgba(13,71,161,0.55) 0%, rgba(27,94,32,0.75) 100%)'
        },
        {
          icon: '☁️',
          country: '천공의 구름 왕국',
          summary: '하늘 위 뭉게구름 바다 · 쌍무지개 다리 · 황금 구름 신전',
          zone: '구름 하늘층 (2,000m)',
          color: '#00e5ff',
          bg: 'linear-gradient(135deg, rgba(2,119,189,0.6) 0%, rgba(0,229,255,0.45) 100%)'
        },
        {
          icon: '🐠',
          country: '신비한 바닷속 해저왕국',
          summary: '아틀란티스 산호초 · 둥실 해파리 · 바닷속 물방울 길',
          zone: '신비의 해저층 (3,000m)',
          color: '#00f5d4',
          bg: 'linear-gradient(135deg, rgba(0,29,61,0.75) 0%, rgba(0,180,216,0.55) 100%)'
        },
        {
          icon: '🌋',
          country: '불타는 화산 용암의 나라',
          summary: '끓어오르는 마그마 협곡 · 폭발 화산섬 · 불꽃 크리스탈',
          zone: '마그마 화산층 (4,000m)',
          color: '#ff6d00',
          bg: 'linear-gradient(135deg, rgba(60,9,0,0.8) 0%, rgba(255,61,0,0.55) 100%)'
        },
        {
          icon: '🎠',
          country: '상상의 마법 동화나라',
          summary: '캔디 원더랜드 · 거대 마법버섯 · 롤리팝 사탕성',
          zone: '동화 마법층 (5,000m)',
          color: '#ff70a6',
          bg: 'linear-gradient(135deg, rgba(60,9,108,0.75) 0%, rgba(255,112,166,0.55) 100%)'
        },
        {
          icon: '🌸',
          country: '분홍빛 벚꽃 호수의 나라',
          summary: '봄날의 산악 계곡 · 거울 호수 · 흩날리는 분홍 벚꽃길',
          zone: '하늘 정원층 (6,000m)',
          color: '#ff8fab',
          bg: 'linear-gradient(135deg, rgba(59,28,50,0.75) 0%, rgba(255,143,171,0.55) 100%)'
        },
        {
          icon: '❄️',
          country: '오로라 얼음 설산의 나라',
          summary: '알래스카 눈 덮인 설산 · 빙하 강물 · 밤하늘 오로라',
          zone: '성층권 오로라 (7,000m)',
          color: '#64ffda',
          bg: 'linear-gradient(135deg, rgba(2,17,36,0.8) 0%, rgba(0,150,199,0.55) 100%)'
        },
        {
          icon: '🌈',
          country: '사이버 은하수 환상의 나라',
          summary: '네온 별빛 은하수 · 레트로 태양 · 사이버 미래도시',
          zone: '은하수 환상층 (8,000m)',
          color: '#e040fb',
          bg: 'linear-gradient(135deg, rgba(25,5,53,0.8) 0%, rgba(255,0,127,0.5) 100%)'
        }
      ];

      const base = worlds[(s - 1) % worlds.length];
      if (isJackpot) {
        return {
          stage: s,
          icon: '👑',
          country: `황금 천공 제국 · 만원 보스 왕국 (${base.country})`,
          shortCountry: `👑 황금 천공 만원 보스 왕국`,
          summary: `💴 ${s}단계 보스 격파 시 [10,000원 만원 상금] 보너스 달성! (${base.summary})`,
          altitudeMeters: s * 1000,
          altitudeLabel: `☁️ 상공 ${(s * 1000).toLocaleString()}m · 💴 만원 보스 정상!`,
          color: '#ffd700',
          bg: 'linear-gradient(135deg, rgba(80,45,0,0.88) 0%, rgba(217,119,6,0.72) 100%)',
          isJackpot: true
        };
      }

      return {
        stage: s,
        icon: base.icon,
        country: base.country,
        shortCountry: `${base.icon} ${base.country}`,
        summary: base.summary,
        altitudeMeters: s * 1000,
        altitudeLabel: `☁️ 상공 ${(s * 1000).toLocaleString()}m`,
        color: base.color,
        bg: base.bg,
        isJackpot: false
      };
    }
  };

  window.GameConfig = GameConfig;
})(window);
