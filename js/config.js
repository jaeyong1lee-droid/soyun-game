/**
 * 👑 이소윤의 로블록스 오비 레이서 3D (Soyun's Roblox Obby Racer 3D)
 * Game Configuration, Infinite Stage Definitions, Speed Presets & Roblox Pet Evolution System
 */
(function (window) {
  'use strict';

  const STAGES = [
    {
      stage: 1,
      biome: 'river_nature',
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
      biome: 'jungle_safari',
      title: '🌴 아마존 정글 & 황금 사자 사파리',
      subtitle: '갈기 사자와 원숭이가 반기는 정글! 구구단 밖 곱셈·나눗셈 & 생활영어!',
      questionsToBoss: 16,
      bossName: '정글 킹 라이온 메카 (Lion Mecha)',
      bossTitle: '2단계 아마존 정글 수호신',
      bossHp: 10,
      baseSpeed: 39.0, // 단계별 점진적 가속 (+3.0, 최대 1단계의 2.5배=90까지)
      gateSolveSeconds: 8.8,
      themeColor: '#84cc16',
      roadColor: '#292514',
      skyColor: '#14532d',
      fogColor: '#1a3a1e',
      bossColor: 0xf59e0b
    },
    {
      stage: 3,
      biome: 'desert_pyramid',
      title: '🏜️ 황금 사막 피라미드 & 낙타 오아시스',
      subtitle: '쌍봉 낙타와 사막여우가 돌아다니는 사막! 곱셈·나눗셈 & 생활영어!',
      questionsToBoss: 16,
      bossName: '코블록스 스핑크스 (Korblox Sphinx)',
      bossTitle: '3단계 황금 피라미드 파라오 보스',
      bossHp: 10,
      baseSpeed: 42.0, // 단계별 점진적 가속 (+3.0, 최대 1단계의 2.5배=90까지)
      gateSolveSeconds: 8.1,
      themeColor: '#fbbf24',
      roadColor: '#3d2814',
      skyColor: '#7c2d12',
      fogColor: '#5c3415',
      bossColor: 0xfbbf24
    },
    {
      stage: 4,
      biome: 'glacier_ice',
      title: '🧊 남극 크리스탈 빙하 & 얼음 대륙',
      subtitle: '뒤뚱뒤뚱 펭귄과 북극곰의 빙하 나라! 심화 곱셈·나눗셈 & 생활영어!',
      questionsToBoss: 17,
      bossName: '아이스 프로스트 드래곤 (Frost Dragon)',
      bossTitle: '4단계 크리스탈 빙하 지배자',
      bossHp: 11,
      baseSpeed: 45.0, // 단계별 점진적 가속 (+3.0, 최대 1단계의 2.5배=90까지)
      gateSolveSeconds: 7.6,
      themeColor: '#38bdf8',
      roadColor: '#0f2942',
      skyColor: '#082f49',
      fogColor: '#0c4a6e',
      bossColor: 0x00f5ff
    }
  ];

  // 무한 스테이지(STAGE 5 ~ ∞)를 위한 다채로운 배경 월드 템플릿 (공룡시대·하늘왕국·바닷속·화산용암·상상의나라·벚꽃호수 등)
  const EXTRA_STAGE_TEMPLATES = [
    {
      biome: 'dino_jurassic',
      titlePrefix: '🦖 쥬라기 공룡시대 & 원시 화산 밀림',
      bossName: '메카 티라노 렉스 (Mecha T-Rex)',
      bossRole: '공룡시대 원시 밀림 지배자',
      themeColor: '#22c55e',
      roadColor: '#262114',
      skyColor: '#3f2e18',
      fogColor: '#2c351d',
      bossColor: 0x22c55e
    },
    {
      biome: 'sky_heaven',
      titlePrefix: '☁️ 천공의 구름 왕국 · 하늘 위 무지개 길',
      bossName: '알파벳 빌런 눕킹 (Noob King)',
      bossRole: '하늘 구름왕국 수호자',
      themeColor: '#00e5ff',
      roadColor: '#1e3a5f',
      skyColor: '#0277bd',
      fogColor: '#3a7bd5',
      bossColor: 0xff9900
    },
    {
      biome: 'underwater_ocean',
      titlePrefix: '🐠 신비한 바닷속 산호초 & 아틀란티스',
      bossName: '포세이돈 심해 메카 (Poseidon Mecha)',
      bossRole: '바닷속 아틀란티스 지배자',
      themeColor: '#00f5d4',
      roadColor: '#06283d',
      skyColor: '#001233',
      fogColor: '#003554',
      bossColor: 0x00f5d4
    },
    {
      biome: 'molten_lava',
      titlePrefix: '🌋 불타는 화산 용암지대 & 마그마 협곡',
      bossName: '밴해머 레드 드래곤 (Ban-Hammer Dragon)',
      bossRole: '용암 협곡 화산 드래곤',
      themeColor: '#ff6d00',
      roadColor: '#240905',
      skyColor: '#1a0000',
      fogColor: '#2d0604',
      bossColor: 0xff2200
    },
    {
      biome: 'wonderland_magic',
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
      biome: 'cherry_lake',
      titlePrefix: '🌸 벚꽃 호수 & 황금 신전 계곡',
      bossName: '도미누스 타이탄 (Dominus Titan)',
      bossRole: '벚꽃 호수 수호신',
      themeColor: '#ff8fab',
      roadColor: '#281c2d',
      skyColor: '#2b193d',
      fogColor: '#361f32',
      bossColor: 0xff8fab
    },
    {
      biome: 'river_nature',
      titlePrefix: '🏞️ 에메랄드 대자연 협곡 & 폭포 숲',
      bossName: '에메랄드 포레스트 타이탄 (Forest Titan)',
      bossRole: '대자연 폭포 아일랜드 챔피언',
      themeColor: '#10b981',
      roadColor: '#0f2918',
      skyColor: '#06140b',
      fogColor: '#0c2113',
      bossColor: 0x10b981
    },
    {
      biome: 'jungle_safari',
      titlePrefix: '🦁 황금 사자 정글 & 고대 밀림 사파리',
      bossName: '골든 라이온 오버로드 (Lion Overlord)',
      bossRole: '정글 사파리 챔피언',
      themeColor: '#84cc16',
      roadColor: '#292514',
      skyColor: '#14532d',
      fogColor: '#1a3a1e',
      bossColor: 0xf59e0b
    },
    {
      biome: 'desert_pyramid',
      titlePrefix: '🐪 파라오 황금 사막 & 오아시스 신전',
      bossName: '아누비스 골드 메카 (Anubis Mecha)',
      bossRole: '사막 오아시스 수호신',
      themeColor: '#fbbf24',
      roadColor: '#3d2814',
      skyColor: '#7c2d12',
      fogColor: '#5c3415',
      bossColor: 0xfbbf24
    },
    {
      biome: 'glacier_ice',
      titlePrefix: '🐧 오로라 빙하 대륙 & 북극 얼음 왕국',
      bossName: '글레이셔 엠페러 (Glacier Emperor)',
      bossRole: '빙하 오로라 지배자',
      themeColor: '#38bdf8',
      roadColor: '#0f2942',
      skyColor: '#082f49',
      fogColor: '#0c4a6e',
      bossColor: 0x38bdf8
    }
  ];

  // 속도 조절 프리셋 (1.3x ~ 2.5x)
  const SPEED_MULTIPLIERS = [
    { mult: 1.3, label: '🚗 1.3x 기본', shortLabel: '1.3x' },
    { mult: 1.6, label: '🚀 1.6x 약간 빠르게', shortLabel: '1.6x' },
    { mult: 1.9, label: '⚡ 1.9x 빠르게', shortLabel: '1.9x' },
    { mult: 2.2, label: '🔥 2.2x 아주 빠르게', shortLabel: '2.2x' },
    { mult: 2.5, label: '👑 2.5x 초고속', shortLabel: '2.5x' }
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
    MAX_SPEED_CAP: 90, // 1단계 속도(36)의 2.5배(90)가 최대 속도 상한선! 그 이후 단계는 단어·문제 난이도만 상승!
    SPEED_INCREMENT_PER_CORRECT: 0.15, // 문제 정답 시 소폭 가속 (최대 90 상한선 준수)
    SPEED_STAGE_BONUS: 3.0, // 단계 상승 시 +3.0씩 점진 가속 (1단계 속도의 2.5배인 90 도달 후 속도 고정)
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

      const parseUnitWon = function (rawName, fallbackWon) {
        const s = String(rawName || '');
        const manMatch = s.match(/([0-9][0-9,]*)\s*만\s*원/);
        if (manMatch) {
          return (parseInt(manMatch[1].replace(/,/g, ''), 10) || 1) * 10000;
        }
        if (s.includes('만원')) {
          return 10000;
        }
        const cheonMatch = s.match(/([0-9][0-9,]*)\s*천\s*원/);
        if (cheonMatch) {
          return (parseInt(cheonMatch[1].replace(/,/g, ''), 10) || 1) * 1000;
        }
        const wonMatch = s.match(/([0-9][0-9,]*)\s*원/);
        if (wonMatch) {
          return parseInt(wonMatch[1].replace(/,/g, ''), 10) || fallbackWon;
        }
        return fallbackWon;
      };

      const buildCumulativeDisplayName = function (rawName, unpaidCount, unitWon) {
        const s = String(rawName || '').trim();
        const count = Math.max(0, parseInt(unpaidCount, 10) || 0);
        const cumulativeWon = count * unitWon;
        const formattedWon = `${cumulativeWon.toLocaleString()}원`;
        if (/([0-9][0-9,]*)\s*(만\s*원|천\s*원|원)/.test(s)) {
          return s.replace(/([0-9][0-9,]*)\s*(만\s*원|천\s*원|원)/, formattedWon);
        }
        if (s.includes('만원') && count >= 2) {
          return s.replace('만원', formattedWon);
        }
        return s;
      };

      const pocketUnitWon = parseUnitWon(namePocket, 2000);
      const pocketTotalWon = unpaidPocket * pocketUnitWon;
      const displayPocketName = buildCumulativeDisplayName(namePocket, unpaidPocket, pocketUnitWon);

      const jackpotUnitWon = parseUnitWon(nameJackpot, 10000);
      const jackpotTotalWon = unpaidJackpot * jackpotUnitWon;
      const displayJackpotName = buildCumulativeDisplayName(nameJackpot, unpaidJackpot, jackpotUnitWon);

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
          displayName: displayPocketName,
          title: `💵 ${displayPocketName}`,
          earnedCount: pocketEarned,
          paidCount: Math.max(0, paidPocket),
          unpaidCount: unpaidPocket,
          unitWon: pocketUnitWon,
          totalWon: pocketTotalWon,
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
          displayName: displayJackpotName,
          title: `💴 ${displayJackpotName}`,
          earnedCount: jackpotEarned,
          paidCount: Math.max(0, paidJackpot),
          unpaidCount: unpaidJackpot,
          unitWon: jackpotUnitWon,
          totalWon: jackpotTotalWon,
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
        biome: tpl.biome || 'dino_jurassic',
        title: baseTitle,
        subtitle: baseSubtitle,
        questionsToBoss: Math.min(24, 15 + Math.floor((s - 1) * 0.6)),
        bossName: baseBossName,
        bossTitle: baseBossTitle,
        bossHp: Math.min(18, 9 + Math.floor((s - 1) * 0.5)),
        baseSpeed: Math.min(90, +(36 + (s - 1) * 3.0).toFixed(1)),
        gateSolveSeconds: Math.max(3.8, +(9.5 / (Math.min(90, 36 + (s - 1) * 3.0) / 36)).toFixed(1)),
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
     * Returns World Country / Kingdom Summary info for the Stage Adventure Map
     * @param {number} stageNumber
     */
    getStageWorldInfo: function (stageNumber) {
      const s = Math.max(1, parseInt(stageNumber, 10) || 1);
      const isJackpot = (s % 10 === 0);
      const worlds = [
        {
          biome: 'river_nature',
          icon: '🏞️',
          country: '에메랄드 강변 숲',
          summary: '알프스 만년설 · 에메랄드 폭포 · 사슴과 산토끼',
          zone: '대자연 숲 (1,000m)',
          color: '#00e676',
          bg: 'linear-gradient(135deg, rgba(13,71,161,0.55) 0%, rgba(27,94,32,0.75) 100%)'
        },
        {
          biome: 'jungle_safari',
          icon: '🦁',
          country: '황금 사자 정글',
          summary: '아마존 야자수 밀림 · 갈기 사자 & 원숭이 사파리',
          zone: '정글 사파리 (2,000m)',
          color: '#84cc16',
          bg: 'linear-gradient(135deg, rgba(20,83,45,0.8) 0%, rgba(132,204,22,0.55) 100%)'
        },
        {
          biome: 'desert_pyramid',
          icon: '🐪',
          country: '황금 사막 오아시스',
          summary: '피라미드 모래언덕 · 쌍봉 낙타 & 사막여우',
          zone: '황금 사막 (3,000m)',
          color: '#fbbf24',
          bg: 'linear-gradient(135deg, rgba(124,45,18,0.8) 0%, rgba(251,191,36,0.55) 100%)'
        },
        {
          biome: 'glacier_ice',
          icon: '🧊',
          country: '크리스탈 빙하 대륙',
          summary: '남극 얼음 빙하 · 뒤뚱 펭귄 & 북극곰',
          zone: '빙하 대륙 (4,000m)',
          color: '#38bdf8',
          bg: 'linear-gradient(135deg, rgba(8,47,73,0.82) 0%, rgba(56,189,248,0.55) 100%)'
        },
        {
          biome: 'dino_jurassic',
          icon: '🦖',
          country: '쥬라기 공룡시대',
          summary: '원시 화산 밀림 · 티라노사우루스 & 브라키오 공룡',
          zone: '공룡시대 (5,000m)',
          color: '#22c55e',
          bg: 'linear-gradient(135deg, rgba(63,46,24,0.82) 0%, rgba(34,197,94,0.55) 100%)'
        },
        {
          biome: 'sky_heaven',
          icon: '☁️',
          country: '천공의 구름 왕국',
          summary: '하늘 위 쌍무지개 다리 · 날개 유니콘 페가수스',
          zone: '구름 하늘층 (6,000m)',
          color: '#00e5ff',
          bg: 'linear-gradient(135deg, rgba(2,119,189,0.6) 0%, rgba(0,229,255,0.45) 100%)'
        },
        {
          biome: 'underwater_ocean',
          icon: '🐠',
          country: '신비한 바닷속 왕국',
          summary: '아틀란티스 산호초 · 바다거북 & 돌고래',
          zone: '신비의 해저층 (7,000m)',
          color: '#00f5d4',
          bg: 'linear-gradient(135deg, rgba(0,29,61,0.75) 0%, rgba(0,180,216,0.55) 100%)'
        },
        {
          biome: 'molten_lava',
          icon: '🌋',
          country: '불타는 화산 용암지대',
          summary: '마그마 용암 협곡 · 불꽃 아기 드래곤',
          zone: '마그마 화산층 (8,000m)',
          color: '#ff6d00',
          bg: 'linear-gradient(135deg, rgba(60,9,0,0.8) 0%, rgba(255,61,0,0.55) 100%)'
        },
        {
          biome: 'wonderland_magic',
          icon: '🎠',
          country: '상상의 마법 동화나라',
          summary: '캔디 원더랜드 · 마법 버섯 & 동화 토끼',
          zone: '동화 마법층 (9,000m)',
          color: '#ff70a6',
          bg: 'linear-gradient(135deg, rgba(60,9,108,0.75) 0%, rgba(255,112,166,0.55) 100%)'
        },
        {
          biome: 'cherry_lake',
          icon: '🌸',
          country: '벚꽃 호수 & 황금 신전',
          summary: '흩날리는 벚꽃 호수 · 귀여운 판다 & 만원 보스',
          zone: '천공 정상 (10,000m)',
          color: '#ff8fab',
          bg: 'linear-gradient(135deg, rgba(59,28,50,0.75) 0%, rgba(255,143,171,0.55) 100%)'
        }
      ];

      const base = worlds[(s - 1) % worlds.length];
      if (isJackpot) {
        return {
          stage: s,
          biome: base.biome,
          icon: '👑',
          country: `황금 보스 신전 (${base.country})`,
          shortCountry: `👑 ${base.country}`,
          summary: `💴 ${s}단계 보스 격파 시 [10,000원 상금]! (${base.summary})`,
          altitudeMeters: s * 1000,
          altitudeLabel: `☁️ ${(s * 1000).toLocaleString()}m · 💴 만원 보스`,
          color: '#ffd700',
          bg: 'linear-gradient(135deg, rgba(80,45,0,0.88) 0%, rgba(217,119,6,0.72) 100%)',
          isJackpot: true
        };
      }

      return {
        stage: s,
        biome: base.biome,
        icon: base.icon,
        country: base.country,
        shortCountry: `${base.icon} ${base.country}`,
        summary: base.summary,
        altitudeMeters: s * 1000,
        altitudeLabel: `☁️ ${(s * 1000).toLocaleString()}m`,
        color: base.color,
        bg: base.bg,
        isJackpot: false
      };
    }
  };

  // 🏎️ 이소윤의 캐릭터 & 라이딩 변경 10종 (카트라이더 차량, 자전거, 오토바이 소녀, 킥보드 소녀 등 10종!)
  const CHARACTER_VEHICLES = [
    {
      id: 'kart_saber',
      icon: '🏎️',
      name: '카트라이더 세이버 프로',
      shortName: '세이버 프로',
      tag: '⚡ 카트라이더 전설',
      desc: '날렵한 레드&화이트 에어로 바디와 4연장 부스터를 장착한 카트라이더 대표 레이싱 카트!',
      primaryColor: '#ff1744',
      secondaryColor: '#ffffff',
      accentColor: '#ffe600'
    },
    {
      id: 'kart_cotton',
      icon: '☁️',
      name: '카트라이더 코튼 V1',
      shortName: '코튼 V1',
      tag: '💨 부드러운 드리프트',
      desc: '구름처럼 부드러운 주행감과 스카이블루 유선형 바디를 자랑하는 카트라이더 코튼 시리즈!',
      primaryColor: '#00b4d8',
      secondaryColor: '#f8fafc',
      accentColor: '#ffd166'
    },
    {
      id: 'kart_burst',
      icon: '🔥',
      name: '카트라이더 버스트 Z7',
      shortName: '버스트 Z7',
      tag: '🚀 폭발적 부스터',
      desc: '거대한 V8 슈퍼차저 엔진과 6연장 제트 머플러가 달린 오렌지 머슬 카트라이더 차량!',
      primaryColor: '#ff6d00',
      secondaryColor: '#22223b',
      accentColor: '#ffe600'
    },
    {
      id: 'girl_bicycle',
      icon: '🚲',
      name: '자전거 타는 소녀',
      shortName: '자전거 소녀',
      tag: '🌸 상큼 꽃바구니',
      desc: '예쁜 꽃바구니가 달린 민트&핑크 두발 자전거 페달을 신나게 밟으며 달리는 소윤이!',
      primaryColor: '#2ec4b6',
      secondaryColor: '#ff70a6',
      accentColor: '#ffe600'
    },
    {
      id: 'girl_motorcycle',
      icon: '🏍️',
      name: '오토바이 타는 소녀',
      shortName: '오토바이 소녀',
      tag: '⚡ 슈퍼바이크 질주',
      desc: '네온 핑크&사이언 레이싱 슈퍼바이크 오토바이를 타고 멋지게 도로를 가르는 라이더 소윤이!',
      primaryColor: '#ff2a85',
      secondaryColor: '#00f5ff',
      accentColor: '#ffe600'
    },
    {
      id: 'girl_kickboard',
      icon: '🛴',
      name: '킥보드 타는 소녀',
      shortName: '킥보드 소녀',
      tag: '✨ 네온 전동킥보드',
      desc: 'LED 불빛이 반짝이는 터보 전동 킥보드를 서서 타며 상쾌하게 바람을 가르는 소윤이!',
      primaryColor: '#00f5d4',
      secondaryColor: '#7209b7',
      accentColor: '#ffe600'
    },
    {
      id: 'girl_roller',
      icon: '🛼',
      name: '롤러스케이트 타는 소녀',
      shortName: '롤러 소녀',
      tag: '🎵 리듬 스케이터',
      desc: '반짝이는 네온 롤러스케이트와 헤드폰을 쓰고 트랙 위를 신나게 미끄러지는 소윤이!',
      primaryColor: '#ff70a6',
      secondaryColor: '#00bbf9',
      accentColor: '#fee440'
    },
    {
      id: 'girl_hoverboard',
      icon: '🛸',
      name: '호버보드 타는 소녀',
      shortName: '호버보드 소녀',
      tag: '🌌 미래 공중부양',
      desc: '바닥에서 둥둥 떠서 플라즈마 제트 불꽃을 뿜는 사이버 네온 호버보드 소녀!',
      primaryColor: '#9b5de5',
      secondaryColor: '#00f5d4',
      accentColor: '#fee440'
    },
    {
      id: 'kart_solid',
      icon: '🛡️',
      name: '카트라이더 솔리드 골드',
      shortName: '솔리드 골드',
      tag: '👑 황금 중장갑 카트',
      desc: '어떤 장애물에도 끄떡없는 황금빛 에메랄드 중장갑 카트라이더 솔리드 시리즈!',
      primaryColor: '#ffd700',
      secondaryColor: '#10b981',
      accentColor: '#ffffff'
    },
    {
      id: 'girl_unicorn',
      icon: '🦄',
      name: '유니콘 마법카트 소녀',
      shortName: '유니콘 카트',
      tag: '🌈 무지개 공주카트',
      desc: '황금 뿔과 천사 날개가 달린 귀여운 유니콘 왕실 마법카트를 타고 달리는 공주 소윤이!',
      primaryColor: '#ffffff',
      secondaryColor: '#ff8fab',
      accentColor: '#ffd700'
    }
  ];

  GameConfig.CHARACTER_VEHICLES = CHARACTER_VEHICLES;
  GameConfig.DEFAULT_VEHICLE_ID = 'kart_saber';
  GameConfig.getVehicleById = function (id) {
    return CHARACTER_VEHICLES.find(function (v) { return v.id === id; }) || CHARACTER_VEHICLES[0];
  };

  window.GameConfig = GameConfig;
})(window);
