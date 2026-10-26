/**
 * 👑 이소윤의 로블록스 오비 레이서 3D (Soyun's Roblox Obby Racer 3D)
 * UI Dashboard, HUD, Roblox Pet Evolution, Hit-Marker Impact FX & Modal Manager
 * Exposes `window.UIManager` and `window.UI`
 */
(function (window) {
  'use strict';

  let _toastTimer = null;
  let _stageClearTimer = null;
  let _damageFlashTimer = null;
  let _shakeTimer = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str !== undefined && str !== null ? str : '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPetInfo(totalScore, maxStage) {
    if (window.GameConfig && typeof window.GameConfig.getCurrentPet === 'function') {
      return window.GameConfig.getCurrentPet(totalScore, maxStage);
    }
    return {
      current: {
        level: 1,
        icon: '🐣',
        name: '🐣 블록 병아리 펫 (Blocky Chick)',
        shortName: '🐣 블록 병아리 펫',
        cheerTag: '병아리펫'
      },
      next: null
    };
  }

  function getRewardInfo(totalCorrect, bossesDefeated, maxStageReached, totalWrong) {
    if (window.GameConfig && typeof window.GameConfig.getRewardStatus === 'function') {
      return window.GameConfig.getRewardStatus(totalCorrect, bossesDefeated, maxStageReached, totalWrong);
    }
    const c = Math.max(0, parseInt(totalCorrect, 10) || 0);
    const w = Math.max(0, parseInt(totalWrong, 10) || 0);
    const b = Math.max(0, parseInt(bossesDefeated, 10) || 0);
    const gaugePoints = Math.max(0, c - w + b * 10);
    const pocketEarned = Math.floor(gaugePoints / 100);
    const pocketCur = gaugePoints % 100;
    const pocketTgt = 100;
    const ashleyEarned = Math.floor(gaugePoints / 1000);
    const ashleyCur = gaugePoints % 1000;
    const jackpotEarned = Math.floor(b / 10);
    const jackpotCur = b % 10;
    return {
      totalCorrect: c,
      totalWrong: w,
      bossesDefeated: b,
      gaugePoints: gaugePoints,
      pocketMoney: {
        earnedCount: pocketEarned,
        current: pocketCur,
        target: pocketTgt,
        unit: '판',
        percent: Math.min(100, Math.round((pocketCur / pocketTgt) * 100)),
        phaseLabel: `(0→100판 반복 · 오답 -1)`
      },
      ashley: {
        earnedCount: ashleyEarned,
        current: ashleyCur,
        target: 1000,
        unit: '판',
        percent: Math.min(100, Math.round((ashleyCur / 1000) * 100)),
        phaseLabel: `(0→1,000판 반복 · 오답 -1)`
      },
      bossJackpot: {
        earnedCount: jackpotEarned,
        totalWon: jackpotEarned * 10000,
        current: jackpotCur,
        target: 10,
        unit: '단계',
        remaining: 10 - jackpotCur,
        percent: Math.min(100, Math.round((jackpotCur / 10) * 100)),
        phaseLabel: `(0→10단계 반복)`
      }
    };
  }

  const UIManager = {
    /**
     * Renders the Title / Start Cumulative Progress Dashboard for Soyun
     * @param {Object} saveState
     * @param {number} [selectedStage]
     */
    renderDashboard: function (saveState, selectedStage) {
      const state = saveState || (window.SaveManager ? window.SaveManager.getState() : {});
      const currentStage = Math.max(1, parseInt(state.currentStage, 10) || 1);
      const maxStageReached = Math.max(currentStage, parseInt(state.maxStageReached, 10) || 1);
      const activeStage = Math.max(1, parseInt(selectedStage, 10) || currentStage);

      const stageCfg = (window.GameConfig && window.GameConfig.getStageConfig)
        ? window.GameConfig.getStageConfig(currentStage)
        : { stage: currentStage, title: '🌈 레인보우 스타터 오비 (Rainbow Obby)' };

      const activeStageCfg = (window.GameConfig && window.GameConfig.getStageConfig)
        ? window.GameConfig.getStageConfig(activeStage)
        : stageCfg;

      const totalScore = parseInt(state.totalScore, 10) || 0;
      const totalSolved = parseInt(state.totalSolved, 10) || 0;
      const totalCorrect = parseInt(state.totalCorrect, 10) || 0;
      const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
      const wrongQueue = Array.isArray(state.wrongAnswerQueue) ? state.wrongAnswerQueue : [];
      const reviewHistory = Array.isArray(state.reviewHistory) ? state.reviewHistory : [];

      const petInfo = getPetInfo(totalScore, maxStageReached);
      const activePet = petInfo.current;

      const elStage = byId('dash-current-stage');
      if (elStage) {
        elStage.textContent = `STAGE ${currentStage} - ${stageCfg.title}`;
      }

      const elScore = byId('dash-total-score');
      if (elScore) {
        elScore.textContent = `🟢 R$ ${totalScore.toLocaleString()}`;
      }

      const elPet = byId('dash-current-pet');
      if (elPet && activePet) {
        elPet.textContent = `${activePet.shortName || activePet.name} (Lv.${activePet.level})`;
      }

      const elAcc = byId('dash-accuracy');
      if (elAcc) {
        elAcc.textContent = `${accuracy}% (${totalCorrect}/${totalSolved})`;
      }

      const elReview = byId('dash-review-count');
      if (elReview) {
        elReview.textContent = `${wrongQueue.length} 문제`;
      }

      const elMath = byId('dash-math-stat');
      if (elMath) {
        elMath.textContent = `🧮 수학 정답: ${state.mathCorrect || 0}문제`;
      }

      const elEng = byId('dash-eng-stat');
      if (elEng) {
        elEng.textContent = `🔤 영어 정답: ${state.englishCorrect || 0}문제`;
      }

      const elBoss = byId('dash-boss-stat');
      if (elBoss) {
        elBoss.textContent = `👾 격파한 오비 보스: ${state.bossesDefeated || 0}기 (보스당 게이지 +10)`;
      }

      const elSpeed = byId('dash-speed-stat');
      const currentMult = typeof state.speedMultiplier === 'number' ? state.speedMultiplier : 1.0;
      if (elSpeed) {
        elSpeed.textContent = `🔒 현재 설정 속도: ${currentMult.toFixed(1)}x 배속 (보호자 창에서 변경)`;
      }

      const elReviewBtnNum = byId('dash-btn-review-num');
      if (elReviewBtnNum) {
        elReviewBtnNum.textContent = String(wrongQueue.length || reviewHistory.length || 0);
      }

      const elUtilBadge = byId('review-badge-count');
      if (elUtilBadge) {
        elUtilBadge.textContent = String(wrongQueue.length);
      }

      // Render Roblox Pet Evolution Showcase Strip
      const petShowcase = byId('dash-pet-showcase');
      if (petShowcase && window.GameConfig && Array.isArray(window.GameConfig.ROBLOX_PETS)) {
        petShowcase.innerHTML = window.GameConfig.ROBLOX_PETS.map(function (pet) {
          const isUnlocked = totalScore >= pet.minScore || maxStageReached >= pet.minStage;
          const isCurrent = activePet && activePet.level === pet.level;
          const cls = 'pet-evo-chip' + (isUnlocked ? ' unlocked' : '') + (isCurrent ? ' active-pet' : '');
          const lockIcon = isUnlocked ? '' : '🔒 ';
          return `
            <div class="${cls}" title="${escapeHtml(pet.unlockDesc || '')}">
              <span class="pet-evo-lvl">Lv.${pet.level} (${pet.minScore.toLocaleString()}+ R$)</span>
              <span>${lockIcon}${escapeHtml(pet.shortName || pet.name)}</span>
            </div>
          `;
        }).join('');
      }

      // Render Real-Life Reward Gauges on Dashboard (달성 시 0부터 다시 시작 + 보너스 달성 개수 별도 표시!)
      const rewards = getRewardInfo(totalCorrect, state.bossesDefeated || 0, maxStageReached, state.totalWrong || 0);
      const pm = rewards.pocketMoney;
      const ash = rewards.ashley;
      const jp = rewards.bossJackpot;
      const unpaidPocket = typeof pm.unpaidCount === 'number' ? pm.unpaidCount : pm.earnedCount;
      const unpaidAshley = typeof ash.unpaidCount === 'number' ? ash.unpaidCount : ash.earnedCount;
      const unpaidJackpot = jp ? (typeof jp.unpaidCount === 'number' ? jp.unpaidCount : jp.earnedCount) : 0;
      const totalUnpaid = unpaidPocket + unpaidAshley + unpaidJackpot;

      const elTotalBonusBadge = byId('dash-total-bonus-badge');
      if (elTotalBonusBadge) {
        elTotalBonusBadge.textContent = `🎁 달성 보너스 ${totalUnpaid}개`;
        elTotalBonusBadge.classList.toggle('has-bonus', totalUnpaid > 0);
      }

      const pocketTitleText = pm.displayName || pm.customName || state.bonusNamePocket || '용돈 3,000원';
      const ashleyTitleText = ash.customName || state.bonusNameAshley || '애슐리 외식';
      const jackpotTitleText = (jp && (jp.displayName || jp.customName)) || state.bonusNameJackpot || '10판 보스 만원 상금';

      const elDashPocketTitle = byId('dash-pocket-title');
      if (elDashPocketTitle) {
        elDashPocketTitle.textContent = String(pocketTitleText).replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      }
      const elDashPocketBonus = byId('dash-pocket-bonus-pill');
      if (elDashPocketBonus) {
        elDashPocketBonus.textContent = '';
        elDashPocketBonus.style.display = 'none';
      }
      const elDashPocketFill = byId('dash-pocket-fill');
      if (elDashPocketFill) {
        elDashPocketFill.style.width = `${pm.percent}%`;
      }
      const elDashPocketDesc = byId('dash-pocket-desc');
      if (elDashPocketDesc) {
        elDashPocketDesc.textContent = `0→${pm.target}점`;
      }
      const elDashPocketCount = byId('dash-pocket-count');
      if (elDashPocketCount) {
        elDashPocketCount.textContent = `${pm.current} / ${pm.target}점`;
      }

      const elDashAshleyTitle = byId('dash-ashley-title');
      if (elDashAshleyTitle) {
        elDashAshleyTitle.textContent = String(ashleyTitleText).replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      }
      const elDashAshleyBonus = byId('dash-ashley-bonus-pill');
      if (elDashAshleyBonus) {
        elDashAshleyBonus.textContent = `${unpaidAshley}개`;
        elDashAshleyBonus.classList.toggle('has-bonus', unpaidAshley > 0);
      }
      const elDashAshleyFill = byId('dash-ashley-fill');
      if (elDashAshleyFill) {
        elDashAshleyFill.style.width = `${ash.percent}%`;
      }
      const elDashAshleyDesc = byId('dash-ashley-desc');
      if (elDashAshleyDesc) {
        elDashAshleyDesc.textContent = `0→1,000점`;
      }
      const elDashAshleyCount = byId('dash-ashley-count');
      if (elDashAshleyCount) {
        elDashAshleyCount.textContent = `${ash.current} / ${ash.target.toLocaleString()}점`;
      }

      if (jp) {
        const elDashJackpotTitle = byId('dash-jackpot-title');
        if (elDashJackpotTitle) {
          elDashJackpotTitle.textContent = String(jackpotTitleText).replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
        }
        const elDashJackpotBonus = byId('dash-jackpot-bonus-pill');
        if (elDashJackpotBonus) {
          elDashJackpotBonus.textContent = `${unpaidJackpot}개`;
          elDashJackpotBonus.classList.toggle('has-bonus', unpaidJackpot > 0);
        }
        const elDashJackpotFill = byId('dash-jackpot-fill');
        if (elDashJackpotFill) {
          elDashJackpotFill.style.width = `${jp.percent}%`;
        }
        const elDashJackpotDesc = byId('dash-jackpot-desc');
        if (elDashJackpotDesc) {
          elDashJackpotDesc.textContent = `0→10판 보스`;
        }
        const elDashJackpotCount = byId('dash-jackpot-count');
        if (elDashJackpotCount) {
          elDashJackpotCount.textContent = `${jp.current} / ${jp.target}판`;
        }
      }

      const elMainStageBadge = byId('main-stage-badge');
      if (elMainStageBadge) {
        elMainStageBadge.textContent = `🏁 STAGE ${activeStage}`;
      }
      const elMainPetBadge = byId('main-pet-badge');
      if (elMainPetBadge && activePet) {
        elMainPetBadge.textContent = `${activePet.shortName || activePet.name}`;
      }

      // Keep Parent Modal in sync ONLY when #parent-modal is closed so background cloud sync NEVER overwrites phone input fields!
      const parentModalEl = byId('parent-modal');
      const isParentModalOpen = Boolean(parentModalEl && !parentModalEl.classList.contains('hidden'));
      if (!isParentModalOpen) {
        this.renderParentModal(state);
      }

      // Subject Mode Buttons
      const modeContainer = byId('subject-mode-selector');
      if (modeContainer) {
        const modeBtns = modeContainer.querySelectorAll('.mode-pill');
        modeBtns.forEach(function (btn) {
          const m = btn.getAttribute('data-mode');
          btn.classList.toggle('active', m === (state.subjectMode || 'mixed'));
        });
      }

      // Speed Multiplier Preset Buttons inside Parent Modal
      const speedContainer = byId('dashboard-speed-selector');
      if (speedContainer) {
        const speedBtns = speedContainer.querySelectorAll('.speed-preset-pill');
        speedBtns.forEach(function (btn) {
          const m = parseFloat(btn.getAttribute('data-mult'));
          btn.classList.toggle('active', Math.abs(m - currentMult) < 0.08);
        });
      }

      // Orientation Mode Selector Buttons on Dashboard (자동 / 세로보기 / 가로보기)
      if (state.orientationMode) {
        this.updateOrientationUI(state.orientationMode);
      }

      // Infinite Stage Selector Pill Bar (1 .. maxStageReached + 2 preview + STAGE 10 jackpot preview + STAGE ∞ badge)
      const stageBar = byId('stage-selector-bar');
      if (stageBar) {
        const totalPills = Math.max(5, maxStageReached + 2);
        stageBar.innerHTML = '';
        for (let s = 1; s <= totalPills; s++) {
          const cfg = (window.GameConfig && window.GameConfig.getStageConfig)
            ? window.GameConfig.getStageConfig(s)
            : { stage: s, title: `스테이지 ${s}` };
          const unlocked = s <= maxStageReached;
          const isJackpot = (s % 10 === 0);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'stage-pill' + (s === activeStage ? ' active' : '') + (isJackpot ? ' stage-pill-jackpot' : '');
          btn.disabled = !unlocked;
          btn.setAttribute('data-stage', String(s));
          const jackpotTag = isJackpot ? ` 💴${escapeHtml(jackpotTitleText)}!` : '';
          btn.innerHTML = unlocked
            ? `<span>🏁 STAGE ${s}${jackpotTag}</span><span>· ${escapeHtml(cfg.title)}</span>`
            : `<span>🔒 STAGE ${s}${jackpotTag}</span><span>· ${escapeHtml(cfg.title)}</span>`;
          stageBar.appendChild(btn);
        }

        // Always show next 10th stage preview pill if not already rendered in totalPills
        const nextJackpotStage = Math.ceil(Math.max(1, maxStageReached) / 10) * 10;
        if (nextJackpotStage > totalPills) {
          const jBtn = document.createElement('button');
          jBtn.type = 'button';
          jBtn.className = 'stage-pill stage-pill-jackpot';
          jBtn.disabled = true;
          jBtn.innerHTML = `<span>🔒 STAGE ${nextJackpotStage} 💴${escapeHtml(jackpotTitleText)}!</span><span>· 10단계 보스 보너스!</span>`;
          stageBar.appendChild(jBtn);
        }

        const infBadge = document.createElement('div');
        infBadge.className = 'stage-infinity-pill';
        infBadge.innerHTML = `<span>♾️ STAGE ∞ (10판 보스마다 💴${escapeHtml(jackpotTitleText)}!)</span>`;
        stageBar.appendChild(infBadge);
      }

      // Primary CTA Button
      const btnStart = byId('btn-start-game');
      if (btnStart) {
        btnStart.textContent = `🚀 STAGE ${activeStage} 시작하기!`;
      }
    },

    /**
     * Shows or hides the Start / Dashboard Modal
     * @param {boolean} visible
     */
    setStartScreenVisible: function (visible) {
      const el = byId('start-screen');
      if (el) {
        el.classList.toggle('hidden', !visible);
      }
      document.body.classList.toggle('start-screen-active', Boolean(visible));
    },

    /**
     * Updates the Arcade Racing Dashboard HUD (HP, Stage, Progress, Speed, Robux Score, Active Pet, Combo, Review Queue)
     * @param {Object} data
     */
    updateHUD: function (data) {
      if (!data) return;
      const maxHp = (window.GameConfig && window.GameConfig.MAX_HP) ? window.GameConfig.MAX_HP : 5;
      const hp = Math.max(0, Math.min(maxHp, typeof data.hp === 'number' ? data.hp : maxHp));

      // 1. HP Hearts
      const elHearts = byId('hp-hearts');
      if (elHearts) {
        let heartsStr = '';
        for (let i = 0; i < maxHp; i++) {
          heartsStr += i < hp ? '❤️' : '🖤';
        }
        elHearts.textContent = heartsStr;
      }
      const elHpNum = byId('hp-numeric');
      if (elHpNum) {
        elHpNum.textContent = `${hp} / ${maxHp}`;
      }

      // 2. Stage & Progress toward Boss
      const stageNum = data.stage || 1;
      const stageCfg = data.stageConfig || (window.GameConfig ? window.GameConfig.getStageConfig(stageNum) : { title: '🌈 레인보우 스타터 오비', questionsToBoss: 15 });
      const elStage = byId('hud-stage');
      if (elStage) {
        elStage.textContent = stageNum % 10 === 0 ? `STAGE ${stageNum} 💴만원!` : `STAGE ${stageNum}`;
      }
      const elStageTitle = byId('hud-stage-title');
      if (elStageTitle) {
        elStageTitle.textContent = stageCfg.title || '';
      }

      const qToBoss = Math.max(1, stageCfg.questionsToBoss || 15);
      const solvedInStage = Math.max(0, data.stageProgress || 0);
      const isBoss = Boolean(data.isBossPhase);

      const elProgText = byId('hud-stage-progress-text');
      const elBossHint = byId('hud-stage-boss-hint');
      const elProgFill = byId('hud-stage-progress-fill');

      if (isBoss) {
        if (elProgText) {
          elProgText.textContent = stageNum % 10 === 0
            ? '💴 10판 만원 상금 보스전! (1.5x)'
            : '🔥 1.5x 다이나믹 보스전!';
        }
        if (elBossHint) elBossHint.textContent = '정답 시 💣폭탄·🚀미사일·⚡레이저·🔫물총 발사!';
        if (elProgFill) elProgFill.style.width = '100%';
      } else {
        const clampedSolved = Math.min(qToBoss, solvedInStage);
        const remaining = Math.max(0, qToBoss - clampedSolved);
        if (elProgText) elProgText.textContent = `일반 문제 ${clampedSolved} / ${qToBoss}`;
        if (elBossHint) {
          elBossHint.textContent = stageNum % 10 === 0
            ? `💴만원 보스까지 ${remaining}문제`
            : `보스 출현까지 ${remaining}문제`;
        }
        if (elProgFill) elProgFill.style.width = `${Math.round((clampedSolved / qToBoss) * 100)}%`;
      }

      // 3. Speedometer, RPM Bar, Speed Multiplier Badge & Left Cute Speed Arrows (x 1.0 ~ x 1.6)
      const speedKmh = Math.round(data.speed || 36);
      const elSpeedVal = byId('hud-speed-value');
      if (elSpeedVal) {
        elSpeedVal.textContent = String(speedKmh);
      }
      const multVal = typeof data.speedMultiplier === 'number' ? data.speedMultiplier : 1.0;
      const elMultBadge = byId('hud-speed-mult-badge');
      if (elMultBadge) {
        if (isBoss) {
          const bossMult = Math.round(multVal * 1.5 * 100) / 100;
          elMultBadge.textContent = `🔥${bossMult}x 보스폭주`;
        } else {
          elMultBadge.textContent = `${multVal.toFixed(1)}x 배속`;
        }
      }
      const elLeftSpeedLbl = byId('left-speed-mult-label');
      if (elLeftSpeedLbl) {
        const clampedArrowMult = Math.max(1.0, Math.min(2.5, multVal));
        elLeftSpeedLbl.textContent = `x${clampedArrowMult.toFixed(1)}`;
      }
      const btnSpeedUp = byId('btn-speed-up');
      if (btnSpeedUp) {
        btnSpeedUp.disabled = multVal >= 2.5 - 0.01;
      }
      const btnSpeedDown = byId('btn-speed-down');
      if (btnSpeedDown) {
        btnSpeedDown.disabled = multVal <= 1.0 + 0.01;
      }
      const elRpmFill = byId('hud-rpm-fill');
      if (elRpmFill) {
        const minSpd = 18;
        const maxSpd = 120;
        const rpmPct = Math.max(12, Math.min(100, Math.round(((speedKmh - minSpd) / (maxSpd - minSpd)) * 100)));
        elRpmFill.style.width = `${rpmPct}%`;
      }

      // 4. Robux Score, Active Pet, Combo & Pending Review Queue Counter
      const totalScore = typeof data.totalScore === 'number' ? data.totalScore : 0;
      const elScore = byId('hud-score');
      if (elScore) {
        elScore.textContent = `🟢 R$ ${totalScore.toLocaleString()}`;
      }

      const petInfo = getPetInfo(totalScore, Math.max(stageNum, data.maxStageReached || stageNum));
      if (petInfo && petInfo.current) {
        const elPetName = byId('hud-pet-name');
        const elPetLvl = byId('hud-pet-level');
        if (elPetName) {
          elPetName.textContent = petInfo.current.name;
        }
        if (elPetLvl) {
          elPetLvl.textContent = `Lv.${petInfo.current.level}`;
        }
      }

      const combo = data.combo || 0;
      const elCombo = byId('hud-combo');
      if (elCombo) {
        elCombo.textContent = `${combo} COMBO!`;
        elCombo.classList.remove('combo-pop');
        if (combo > 0) {
          void elCombo.offsetWidth;
          elCombo.classList.add('combo-pop');
        }
      }

      const reviewCount = typeof data.reviewCount === 'number' ? data.reviewCount : 0;
      const elHudReview = byId('hud-review-count');
      if (elHudReview) {
        elHudReview.textContent = `복습 대기: ${reviewCount}`;
      }
      const elBadgeCount = byId('review-badge-count');
      if (elBadgeCount) {
        elBadgeCount.textContent = String(reviewCount);
      }

      // 5. Real-Life Reward Gauges on Left Panel (달성 시 0부터 재시작 + 보너스 달성 개수 별도 표시)
      const totalCorrect = typeof data.totalCorrect === 'number' ? data.totalCorrect : 0;
      const totalWrong = typeof data.totalWrong === 'number'
        ? data.totalWrong
        : (window.SaveManager ? (window.SaveManager.getState().totalWrong || 0) : 0);
      const bossesDefeated = typeof data.bossesDefeated === 'number'
        ? data.bossesDefeated
        : (window.SaveManager ? (window.SaveManager.getState().bossesDefeated || 0) : 0);
      const rewards = getRewardInfo(totalCorrect, bossesDefeated, Math.max(stageNum, data.maxStageReached || stageNum), totalWrong);
      const pm = rewards.pocketMoney;
      const ash = rewards.ashley;
      const jp = rewards.bossJackpot;

      const unpaidPocket = typeof pm.unpaidCount === 'number' ? pm.unpaidCount : pm.earnedCount;
      const unpaidAshley = typeof ash.unpaidCount === 'number' ? ash.unpaidCount : ash.earnedCount;
      const unpaidJackpot = jp ? (typeof jp.unpaidCount === 'number' ? jp.unpaidCount : jp.earnedCount) : 0;
      const totalUnpaid = unpaidPocket + unpaidAshley + unpaidJackpot;

      const elBonusSummaryPill = byId('hud-bonus-achieved-pill');
      if (elBonusSummaryPill) {
        elBonusSummaryPill.textContent = `🏆 달성 보너스 ${totalUnpaid}개`;
        elBonusSummaryPill.classList.toggle('has-bonus', totalUnpaid > 0);
      }

      const elHudPocketName = byId('hud-pocket-name');
      if (elHudPocketName) {
        elHudPocketName.textContent = String(pm.displayName || pm.customName || '용돈 3,000원').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      }
      const elPocketPhase = byId('hud-pocket-phase');
      if (elPocketPhase) {
        elPocketPhase.textContent = `(0→${pm.target}점)`;
      }
      const elPocketBonusBadge = byId('hud-pocket-bonus-badge');
      if (elPocketBonusBadge) {
        elPocketBonusBadge.textContent = '';
        elPocketBonusBadge.style.display = 'none';
      }
      const elPocketCount = byId('hud-pocket-count');
      if (elPocketCount) {
        elPocketCount.textContent = `${pm.current} / ${pm.target}점`;
      }
      const elPocketFill = byId('hud-pocket-fill');
      if (elPocketFill) {
        elPocketFill.style.width = `${pm.percent}%`;
      }

      const elHudAshleyName = byId('hud-ashley-name');
      if (elHudAshleyName) {
        elHudAshleyName.textContent = String(ash.customName || '애슐리 외식').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      }
      const elAshleyPhase = byId('hud-ashley-phase');
      if (elAshleyPhase) {
        elAshleyPhase.textContent = '(0→1,000점)';
      }
      const elAshleyBonusBadge = byId('hud-ashley-bonus-badge');
      if (elAshleyBonusBadge) {
        elAshleyBonusBadge.textContent = `${unpaidAshley}개`;
        elAshleyBonusBadge.classList.toggle('has-bonus', unpaidAshley > 0);
      }
      const elAshleyCount = byId('hud-ashley-count');
      if (elAshleyCount) {
        elAshleyCount.textContent = `${ash.current} / ${ash.target.toLocaleString()}점`;
      }
      const elAshleyFill = byId('hud-ashley-fill');
      if (elAshleyFill) {
        elAshleyFill.style.width = `${ash.percent}%`;
      }

      if (jp) {
        const elHudJackpotName = byId('hud-jackpot-name');
        if (elHudJackpotName) {
          elHudJackpotName.textContent = String(jp.displayName || jp.customName || '10판 보스 만원').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
        }
        const elJackpotPhase = byId('hud-jackpot-phase');
        if (elJackpotPhase) {
          elJackpotPhase.textContent = '(0→10판)';
        }
        const elJackpotBonusBadge = byId('hud-jackpot-bonus-badge');
        if (elJackpotBonusBadge) {
          elJackpotBonusBadge.textContent = `${unpaidJackpot}개`;
          elJackpotBonusBadge.classList.toggle('has-bonus', unpaidJackpot > 0);
        }
        const elJackpotCount = byId('hud-jackpot-count');
        if (elJackpotCount) {
          elJackpotCount.textContent = `${jp.current} / ${jp.target}판`;
        }
        const elJackpotFill = byId('hud-jackpot-fill');
        if (elJackpotFill) {
          elJackpotFill.style.width = `${jp.percent}%`;
        }
      }

      // 6. Pause Chances Badge (2/2)
      if (typeof data.pauseChancesRemaining === 'number') {
        this.updatePauseButton(Boolean(data.isPaused), data.pauseChancesRemaining, data.maxPauseChances || 2);
      }
    },

    /**
     * Appends a live cheering message into the Roblox Live Cheer Box (#roblox-chat-feed)
     * @param {string} senderTag e.g. '시스템' | '유니콘펫' | '로블록스TV'
     * @param {string} text
     * @param {string} [styleType='system'] 'system' | 'pet' | 'tv'
     */
    pushRobloxChat: function (senderTag, text, styleType) {
      const feed = byId('roblox-chat-feed');
      if (!feed) return;

      const line = document.createElement('div');
      const clsType = styleType === 'pet'
        ? 'chat-line-pet'
        : (styleType === 'tv' ? 'chat-line-tv' : 'chat-line-system');
      line.className = `chat-line ${clsType}`;
      line.textContent = `[${senderTag}] ${text}`;
      feed.appendChild(line);

      while (feed.children.length > 3) {
        feed.removeChild(feed.firstElementChild);
      }
    },

    /**
     * Triggers Explosive Comic / Roblox Hit-Marker Impact Effect (Screen Shake + Floating Burst Badges)
     * @param {string} type 'correct' | 'boss' | 'wrong' | 'stageClear'
     * @param {Object} [options]
     */
    triggerImpactEffect: function (type, options) {
      const opts = options || {};
      const layer = byId('impact-fx-layer');

      // 1. Trigger Screen Shake on Body
      const isHeavy = type === 'boss' || type === 'stageClear' || type === 'obby_hurt' || (opts.combo && opts.combo >= 3);
      document.body.classList.remove('screen-shake-hit', 'screen-shake-heavy');
      void document.body.offsetWidth;
      document.body.classList.add(isHeavy ? 'screen-shake-heavy' : 'screen-shake-hit');

      if (_shakeTimer) {
        window.clearTimeout(_shakeTimer);
      }
      _shakeTimer = window.setTimeout(function () {
        document.body.classList.remove('screen-shake-hit', 'screen-shake-heavy');
      }, 440);

      if (!layer) return;

      // Helper to spawn a floating comic badge
      function spawnBadge(text, badgeClass, offsetX, offsetY) {
        const badge = document.createElement('div');
        badge.className = `impact-burst-badge ${badgeClass}`;
        badge.textContent = text;
        if (offsetX || offsetY) {
          badge.style.left = `calc(50% + ${offsetX || 0}px)`;
          badge.style.top = `calc(46% + ${offsetY || 0}px)`;
        }
        layer.appendChild(badge);
        window.setTimeout(function () {
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        }, 960);
      }

      const pts = opts.points || 100;
      const combo = opts.combo || 1;

      if (type === 'boss') {
        const atkInfo = opts.attackInfo || (window.Engine3D && window.Engine3D.lastBossAttackInfo) || {
          type: 'round_bomb'
        };

        // 1) Subtle edge impact flash (no center text/badges so 3D Boss hit is 100% visible!)
        const flashEl = document.createElement('div');
        flashEl.className = `impact-boss-screen-flash flash-${atkInfo.type || 'round_bomb'}`;
        document.body.appendChild(flashEl);
        window.setTimeout(function () {
          if (flashEl.parentNode) {
            flashEl.parentNode.removeChild(flashEl);
          }
        }, 340);

        // 2) Rattle & flash the Top Boss HUD Bar (#boss-hud) on hit!
        const bossHudEl = byId('boss-hud');
        if (bossHudEl) {
          bossHudEl.classList.remove('boss-hud-hit-shake');
          void bossHudEl.offsetWidth;
          bossHudEl.classList.add('boss-hud-hit-shake');
          window.setTimeout(function () {
            bossHudEl.classList.remove('boss-hud-hit-shake');
          }, 520);
        }
      } else if (type === 'stageClear') {
        spawnBadge(`👑 BOSS KO!! 상금 게이지 +10 상승!`, 'impact-boss', 0, -22);
        spawnBadge(`🎉 보스 클리어 보너스 +${pts} R$!`, 'impact-combo', 0, 26);
      } else if (type === 'obby_hurt') {
        const isFire = opts.outcome === 'hit_fire' || opts.waveType === 'fire_pit';
        const isLaser = opts.outcome === 'hit_laser' || opts.waveType === 'low_laser';
        const isLog = opts.outcome === 'hit_log' || opts.waveType === 'high_log';
        const isStair = opts.outcome === 'hit_stair' || opts.waveType === 'heaven_stairs';
        let hurtMsg = `🧱💥 콰직!! 아야! 블록 충돌! (-1 ❤️)`;
        if (isFire) hurtMsg = `🔥💥 앗 뜨거!! 불구덩이 추락! (-1 ❤️)`;
        else if (isLaser) hurtMsg = `⚡💥 찌릿!! 회전 레이저봉 충돌! (-1 ❤️)`;
        else if (isLog) hurtMsg = `🪵💥 쿵!! 거대 2단 통나무 충돌! (-1 ❤️)`;
        else if (isStair) hurtMsg = `☁️💦 어이쿠!! 반대쪽 허공 헛디딤! (-1 ❤️)`;
        spawnBadge(
          hurtMsg,
          'impact-wrong',
          0,
          0
        );
        const hpBox = byId('hp-container') || byId('hp-hearts');
        if (hpBox) {
          hpBox.classList.remove('hp-hurt-shake');
          void hpBox.offsetWidth;
          hpBox.classList.add('hp-hurt-shake');
          window.setTimeout(function () {
            hpBox.classList.remove('hp-hurt-shake');
          }, 600);
        }
      } else if (type === 'wrong') {
        spawnBadge(`💢 OOF!! 함정 블록 충돌! (-1 ❤️)`, 'impact-wrong', 0, 0);
        const hpBox = byId('hp-container') || byId('hp-hearts');
        if (hpBox) {
          hpBox.classList.remove('hp-hurt-shake');
          void hpBox.offsetWidth;
          hpBox.classList.add('hp-hurt-shake');
          window.setTimeout(function () {
            hpBox.classList.remove('hp-hurt-shake');
          }, 600);
        }
      } else {
        spawnBadge(`💥 블록 격파!! +${pts} R$`, 'impact-correct', 0, combo >= 2 ? -20 : 0);
        if (combo >= 2) {
          spawnBadge(`👑 소윤이 나이스! x${combo} COMBO!`, 'impact-combo', 0, 26);
        }
      }
    },

    /**
     * Updates the Top Overhead Highway Quiz Display Board (#question-banner) and 3-lane buttons
     * @param {Object} question
     * @param {boolean} isBossPhase
     * @param {number} currentLane
     */
    showQuestion: function (question, isBossPhase, currentLane) {
      if (!question) return;

      const banner = byId('question-banner');
      const catBadge = byId('question-category-badge');
      const revBadge = byId('question-review-badge');
      const bossBadge = byId('question-boss-badge');
      const promptEl = byId('question-prompt');
      const subPromptEl = byId('question-subprompt');

      const isReview = Boolean(question.isReview);
      const isBoss = Boolean(isBossPhase);

      if (banner) {
        banner.classList.toggle('review-mode-active', isReview);
        banner.classList.toggle('boss-mode-active', isBoss && !isReview);
      }

      if (catBadge) {
        if (question.categoryLabel) {
          catBadge.textContent = question.categoryLabel;
        } else if (question.category === 'english') {
          catBadge.textContent = '🔤 영어 단어 퀴즈';
        } else {
          catBadge.textContent = '🧮 수학 (두자리 연산)';
        }
      }

      if (revBadge) {
        revBadge.classList.toggle('hidden', !isReview);
      }

      if (bossBadge) {
        bossBadge.classList.toggle('hidden', !isBoss);
      }

      if (promptEl) {
        const prefix = isReview ? '🔥 [복습] ' : '';
        promptEl.textContent = prefix + (question.prompt || '');
      }

      if (subPromptEl) {
        subPromptEl.textContent = question.subPrompt || '정답 차선으로 이동하여 게이트를 통과하세요!';
      }

      const choices = Array.isArray(question.choices) ? question.choices : ['-', '-', '-'];
      for (let i = 0; i < 3; i++) {
        const cText = choices[i] !== undefined ? String(choices[i]) : '-';
        const pillTextEl = byId(`choice-text-${i}`);
        if (pillTextEl) {
          pillTextEl.textContent = cText;
        }
        const laneBtnChoiceEl = byId(`lane-btn-choice-${i}`);
        if (laneBtnChoiceEl) {
          laneBtnChoiceEl.textContent = cText;
        }
      }

      if (typeof currentLane === 'number') {
        this.updateActiveLane(currentLane);
      }

      this.updateGateProgress(0); const _sp = byId('speech-hud-panel'); if (_sp) { _sp.classList.add('hidden'); }
    },

    /**
     * Highlights the currently selected lane on both the top preview pills and bottom cockpit buttons
     * @param {number} laneIndex (0, 1, 2)
     */
    updateSpeechStatus: function (statusText, heardText, isListening, isMatched) { const indEl = byId('speech-mic-indicator'); if (indEl && statusText) { indEl.textContent = statusText; indEl.classList.toggle('listening', Boolean(isListening)); indEl.classList.toggle('matched', Boolean(isMatched)); } const heardEl = byId('speech-heard-text'); if (heardEl && heardText) { heardEl.textContent = heardText; } }, updateActiveLane: function (laneIndex) {
      for (let i = 0; i < 3; i++) {
        const isCurrent = (i === laneIndex);
        const pill = byId(`choice-pill-${i}`);
        if (pill) {
          pill.classList.toggle('active-lane', isCurrent);
        }
        const btn = byId(`btn-lane-${i}`);
        if (btn) {
          btn.classList.toggle('active-lane', isCurrent);
        }
        const steerBtn = byId(`touch-steer-${i}`);
        if (steerBtn) {
          steerBtn.classList.toggle('active-lane', isCurrent);
        }
      }
    },

    /**
     * Updates the gate approach progress bar (0.0 -> 1.0)
     * @param {number} progress0to1
     */
    updateGateProgress: function (progress0to1) {
      const fill = byId('gate-progress-fill');
      if (fill) {
        const pct = Math.max(0, Math.min(100, Math.round((Number(progress0to1) || 0) * 100)));
        fill.style.width = `${pct}%`;
      }
    },

    /**
     * Shows and initializes the Boss Battle HUD (#boss-hud)
     * @param {Object} stageConfig
     * @param {number} bossCurrentHp
     * @param {number} bossMaxHp
     */
    showBossHUD: function (stageConfig, bossCurrentHp, bossMaxHp) {
      const bossHud = byId('boss-hud');
      if (bossHud) {
        bossHud.classList.remove('hidden'); document.body.classList.add('boss-phase-hud-active'); const _lp = byId('hud-left-panel'); if (_lp) _lp.classList.add('hidden');
      }
      const elName = byId('boss-name');
      if (elName && stageConfig) {
        elName.textContent = stageConfig.bossName || '메카 보스';
      }
      const elTitle = byId('boss-title');
      if (elTitle && stageConfig) {
        elTitle.textContent = stageConfig.bossTitle || '스테이지 수문장';
      }
      this.updateBossHUD(bossCurrentHp, bossMaxHp);
    },

    /**
     * Updates Boss HP bar and text
     * @param {number} bossCurrentHp
     * @param {number} bossMaxHp
     */
    updateBossHUD: function (bossCurrentHp, bossMaxHp) {
      const maxHp = Math.max(1, bossMaxHp || 9);
      const curHp = Math.max(0, Math.min(maxHp, bossCurrentHp));
      const pct = Math.round((curHp / maxHp) * 100);

      const fill = byId('boss-hp-fill');
      if (fill) {
        fill.style.width = `${pct}%`;
      }
      const text = byId('boss-hp-text');
      if (text) {
        text.textContent = `BOSS HP ${curHp} / ${maxHp}`;
      }
    },

    /**
     * Hides the Boss Battle HUD
     */
    hideBossHUD: function () {
      const bossHud = byId('boss-hud');
      if (bossHud) {
        bossHud.classList.add('hidden'); document.body.classList.remove('boss-phase-hud-active'); const _lp = byId('hud-left-panel'); if (_lp) _lp.classList.remove('hidden');
      }
    },

    /**
     * Updates the Top Banner & Button Highlights for the 3 Distinct Mini-Games:
     * 1) 'heaven_stairs': 🌈☁️ 로블록스 천국의 계단 (2-Button Climb vs Turn-Jump)
     * 2) 'laser_jump': ⚡🪵 회전 레이저봉 & 거대 2단 통나무 점프 서바이벌
     * 3) 'obby_rush': 🧱🔥 3레인 장애물 벽 & 불구덩이 돌파
     */
    showObbyHUD: function (waveIndex, totalWaves, waveType) {
      document.body.classList.add('obby-mode-active');
      const idx = Math.max(1, Math.min(totalWaves || 3, waveIndex || 1));
      const tot = totalWaves || 3;
      const catBadge = byId('question-category-badge');
      const promptEl = byId('question-prompt');
      const leftBtn = byId('btn-turn-jump-action');
      const rightBtn = byId('btn-jump-action');
      const leftLbl = byId('left-btn-action-label');
      const rightLbl = byId('right-btn-action-label');

      if (leftBtn) leftBtn.classList.remove('stair-recommended-btn');
      if (rightBtn) rightBtn.classList.remove('stair-recommended-btn');

      if (waveType === 'low_laser') {
        if (leftLbl) leftLbl.textContent = '2단점프';
        if (rightLbl) rightLbl.textContent = '⬆️점프!';
        if (rightBtn) rightBtn.classList.add('stair-recommended-btn');
        if (catBadge) {
          catBadge.textContent = `⚡ 점프 게임 (${idx} / ${tot}) · 회전 레이저봉 넘기`;
        }
        if (promptEl) {
          promptEl.textContent = `⚡ 회전 레이저봉! 우측 [⬆️ 점프] 터치! (${idx}/${tot})`;
        }
      } else if (waveType === 'high_log') {
        if (leftLbl) leftLbl.textContent = '🔄2단점프!';
        if (rightLbl) rightLbl.textContent = '1단점프';
        if (leftBtn) leftBtn.classList.add('stair-recommended-btn');
        if (catBadge) {
          catBadge.textContent = `🪵 점프 게임 (${idx} / ${tot}) · 거대 2단 통나무 넘기`;
        }
        if (promptEl) {
          promptEl.textContent = `🪵 거대 통나무! 좌측 [🔄 2단점프] 터치! (${idx}/${tot})`;
        }
      } else {
        if (leftLbl) leftLbl.textContent = '슈퍼점프';
        if (rightLbl) rightLbl.textContent = '⬆️점프!';
        if (rightBtn) rightBtn.classList.add('stair-recommended-btn');
        if (catBadge) {
          catBadge.textContent = waveType === 'fire_pit'
            ? `🔥 오비 미니게임 (${idx} / ${tot}) · 좁은 불구덩이 레인 이동 + 점프!`
            : `🧱 오비 미니게임 (${idx} / ${tot}) · 낮은 장애물 레인 이동 + 점프!`;
        }
        if (promptEl) {
          promptEl.textContent = waveType === 'fire_pit'
            ? `🔥 좁은 불구덩이 레인으로 가서 [⬆️ 점프]! (${idx}/${tot})`
            : `🧱 낮은 장애물 레인으로 가서 [⬆️ 점프]! (${idx}/${tot})`;
        }
      }
    },

    /**
     * Updates the Top Banner & Button Highlights for the 2-Button '천국의 계단' (Stairway to Heaven) Mini-Game!
     */
    showHeavenStairsHUD: function (stepIndex, totalSteps, facingDir, nextRequiredDir) {
      document.body.classList.add('obby-mode-active');
      const idx = Math.max(0, Math.min(totalSteps || 8, stepIndex || 0));
      const tot = totalSteps || 8;
      const needTurn = (facingDir !== nextRequiredDir);

      const catBadge = byId('question-category-badge');
      const promptEl = byId('question-prompt');
      const leftBtn = byId('btn-turn-jump-action');
      const rightBtn = byId('btn-jump-action');
      const leftLbl = byId('left-btn-action-label');
      const rightLbl = byId('right-btn-action-label');

      if (leftLbl) leftLbl.textContent = '🔄방향전환';
      if (rightLbl) rightLbl.textContent = '⬆️오르기';

      if (leftBtn) leftBtn.classList.toggle('stair-recommended-btn', needTurn);
      if (rightBtn) rightBtn.classList.toggle('stair-recommended-btn', !needTurn);

      if (catBadge) {
        catBadge.textContent = `☁️ 천국의 계단 (${idx} / ${tot}계단)`;
      }
      if (promptEl) {
        if (idx >= tot) {
          promptEl.textContent = `👑 천국의 문 골인 성공!! (${tot}/${tot})`;
        } else if (needTurn) {
          promptEl.textContent = `☁️ 천국의 계단 (${idx}/${tot}) ➔ 좌측 [🔄 방향전환]!`;
        } else {
          promptEl.textContent = `☁️ 천국의 계단 (${idx}/${tot}) ➔ 우측 [⬆️ 오르기]!`;
        }
      }
    },

    hideObbyHUD: function () {
      document.body.classList.remove('obby-mode-active');
      const leftBtn = byId('btn-turn-jump-action');
      const rightBtn = byId('btn-jump-action');
      const leftLbl = byId('left-btn-action-label');
      const rightLbl = byId('right-btn-action-label');
      if (leftBtn) leftBtn.classList.remove('stair-recommended-btn');
      if (rightBtn) rightBtn.classList.remove('stair-recommended-btn');
      if (leftLbl) leftLbl.textContent = '방향/2단';
      if (rightLbl) rightLbl.textContent = '점프/오르기';
    },

    /**
     * Displays an instant visual feedback toast when passing a gate
     * @param {boolean} isCorrect
     * @param {string} message
     */
    showFeedbackToast: function (isCorrect, message) {
      const toast = byId('feedback-toast');
      if (!toast) return;

      if (_toastTimer) {
        window.clearTimeout(_toastTimer);
        _toastTimer = null;
      }

      toast.textContent = message;
      toast.classList.remove('hidden', 'toast-correct', 'toast-wrong');
      toast.classList.add(isCorrect ? 'toast-correct' : 'toast-wrong');

      _toastTimer = window.setTimeout(function () {
        toast.classList.add('hidden');
      }, 2400);
    },

    /**
     * Triggers red damage flash on the screen edges
     */
    triggerDamageFlash: function () {
      document.body.classList.add('damage-flash');
      if (_damageFlashTimer) {
        window.clearTimeout(_damageFlashTimer);
      }
      _damageFlashTimer = window.setTimeout(function () {
        document.body.classList.remove('damage-flash');
      }, 460);
    },

    /**
     * Displays the Stage Clear celebratory banner when a Boss is defeated
     * @param {number} clearedStage
     * @param {Object} nextStageConfig
     */
    showStageClearBanner: function (clearedStage, nextStageConfig) {
      const banner = byId('stage-clear-banner');
      if (!banner) return;

      const nextStageNum = nextStageConfig ? nextStageConfig.stage : (clearedStage + 1);
      const nextTitle = nextStageConfig ? nextStageConfig.title : '';
      const isJackpot = (clearedStage % 10 === 0);

      const titleEl = byId('stage-clear-title');
      if (titleEl) {
        titleEl.textContent = isJackpot
          ? `💴 STAGE ${clearedStage} 10판 보스 격파! 만원(10,000원) 상금 획득!! 🎉`
          : `🎉 STAGE ${clearedStage} 보스 격파 & 상금 게이지 +10 상승!`;
      }
      const descEl = byId('stage-clear-desc');
      if (descEl) {
        descEl.textContent = isJackpot
          ? `🏆 초대박!! 이소윤 선수가 10판째 보스를 해치우고 만원(10,000원) 상금 + 상금 게이지 +10점을 획득했어요!! 다음 월드: STAGE ${nextStageNum} (${nextTitle})`
          : `🏆 대박!! 보스 격파 보너스로 상금 게이지 +10점 상승! 다음 로블록스 오비 월드(STAGE ${nextStageNum} · ${nextTitle})로 승급했어요! (체력 +2 회복)`;
      }

      banner.classList.remove('hidden');
      if (_stageClearTimer) {
        window.clearTimeout(_stageClearTimer);
      }
      _stageClearTimer = window.setTimeout(function () {
        banner.classList.add('hidden');
      }, 3400);
    },

    hideStageClearBanner: function () {
      const banner = byId('stage-clear-banner');
      if (banner) {
        banner.classList.add('hidden');
      }
    },

    /**
     * Shows the Stage Retry / Checkpoint Modal when HP reaches 0.
     * Emphasizes that currentStage and cumulative stats are preserved!
     * @param {Object} saveState
     * @param {number} currentStage
     */
    /**
     * Renders a list of failed/wrong questions with answers HIDDEN by default and a [👀 답 보기] button per item!
     * @param {HTMLElement} listEl
     * @param {HTMLElement|null} revealAllBtn
     * @param {Array} wrongItems
     * @param {string} emptyMsg
     */
    _renderHiddenAnswerList: function (listEl, revealAllBtn, wrongItems, emptyMsg) {
      if (!listEl) return;
      const items = Array.isArray(wrongItems) ? wrongItems.filter(Boolean) : [];

      if (items.length === 0) {
        if (revealAllBtn) {
          revealAllBtn.style.display = 'none';
        }
        listEl.innerHTML = `<div class="stage-wrong-empty">${escapeHtml(emptyMsg || '🎉 이번 판에 틀린 문제가 하나도 없어요! 완벽 클리어!')}</div>`;
        return;
      }

      if (revealAllBtn) {
        revealAllBtn.style.display = 'inline-flex';
        revealAllBtn.textContent = '👀 전체 답 보기';
        revealAllBtn.setAttribute('data-all-revealed', 'false');
        revealAllBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (window.SoundEngine && typeof window.SoundEngine.playClick === 'function') {
            window.SoundEngine.playClick();
          }
          const isAllRev = revealAllBtn.getAttribute('data-all-revealed') === 'true';
          const nextRev = !isAllRev;
          revealAllBtn.setAttribute('data-all-revealed', nextRev ? 'true' : 'false');
          revealAllBtn.textContent = nextRev ? '🙈 전체 답 숨기기' : '👀 전체 답 보기';

          const cards = listEl.querySelectorAll('.stage-wrong-item');
          cards.forEach(function (card) {
            const secretBox = card.querySelector('.stage-wrong-secret-box');
            const singleBtn = card.querySelector('.btn-reveal-single-ans');
            const ansText = card.getAttribute('data-correct-ans') || '';
            if (secretBox && singleBtn) {
              if (nextRev) {
                secretBox.className = 'stage-wrong-secret-box is-revealed-ans';
                secretBox.innerHTML = `✅ 정답: <strong>${escapeHtml(ansText)}</strong>`;
                singleBtn.textContent = '🙈 답 숨기기';
                singleBtn.classList.add('is-revealed');
                card.setAttribute('data-revealed', 'true');
              } else {
                secretBox.className = 'stage-wrong-secret-box is-hidden-ans';
                secretBox.innerHTML = '🔒 정답 숨김 (먼저 생각해 보세요!)';
                singleBtn.textContent = '👀 답 보기';
                singleBtn.classList.remove('is-revealed');
                card.setAttribute('data-revealed', 'false');
              }
            }
          });
        };
      }

      listEl.innerHTML = items
        .map(function (item, idx) {
          const catBadge = item.category === 'english' ? '🔤 영어' : '🧮 수학';
          const promptStr = item.prompt || '문제';
          const ansStr = item.answerText !== undefined && item.answerText !== null
            ? String(item.answerText)
            : String(item.correctAnswer || '');
          const wrongStr = item.wrongChoice !== undefined && item.wrongChoice !== null
            ? String(item.wrongChoice)
            : '시간초과/오답';

          return `
            <div class="stage-wrong-item" data-idx="${idx}" data-correct-ans="${escapeHtml(ansStr)}" data-revealed="false">
              <div class="stage-wrong-item-top">
                <span class="stage-wrong-q-text">${idx + 1}. [${catBadge}] ${escapeHtml(promptStr)}</span>
                <span class="stage-wrong-my-choice">내가 고른 답: ❌ ${escapeHtml(wrongStr)}</span>
              </div>
              <div class="stage-wrong-ans-row">
                <span class="stage-wrong-secret-box is-hidden-ans">🔒 정답 숨김 (먼저 생각해 보세요!)</span>
                <button type="button" class="btn-reveal-single-ans" data-action="toggle-reveal-ans">
                  👀 답 보기
                </button>
              </div>
            </div>
          `;
        })
        .join('');

      listEl.onclick = function (e) {
        e.stopPropagation();
        const btn = e.target.closest('[data-action="toggle-reveal-ans"]');
        if (!btn) return;
        e.preventDefault();
        if (window.SoundEngine && typeof window.SoundEngine.playClick === 'function') {
          window.SoundEngine.playClick();
        }
        const card = btn.closest('.stage-wrong-item');
        if (!card) return;
        const secretBox = card.querySelector('.stage-wrong-secret-box');
        const ansText = card.getAttribute('data-correct-ans') || '';
        const isRev = card.getAttribute('data-revealed') === 'true';
        if (!secretBox) return;

        if (!isRev) {
          secretBox.className = 'stage-wrong-secret-box is-revealed-ans';
          secretBox.innerHTML = `✅ 정답: <strong>${escapeHtml(ansText)}</strong>`;
          btn.textContent = '🙈 답 숨기기';
          btn.classList.add('is-revealed');
          card.setAttribute('data-revealed', 'true');
        } else {
          secretBox.className = 'stage-wrong-secret-box is-hidden-ans';
          secretBox.innerHTML = '🔒 정답 숨김 (먼저 생각해 보세요!)';
          btn.textContent = '👀 답 보기';
          btn.classList.remove('is-revealed');
          card.setAttribute('data-revealed', 'false');
        }
      };
    },

    showGameOverModal: function (saveState, currentStage, stageWrongQuestions) {
      const modal = byId('gameover-modal');
      if (!modal) return;

      const state = saveState || (window.SaveManager ? window.SaveManager.getState() : {});
      const stageNum = Math.max(1, parseInt(currentStage || state.currentStage, 10) || 1);
      const stageCfg = (window.GameConfig && window.GameConfig.getStageConfig)
        ? window.GameConfig.getStageConfig(stageNum)
        : { title: '' };

      const totalSolved = parseInt(state.totalSolved, 10) || 0;
      const totalCorrect = parseInt(state.totalCorrect, 10) || 0;
      const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
      const wrongQueue = Array.isArray(state.wrongAnswerQueue) ? state.wrongAnswerQueue : [];

      const elLabel = byId('retry-stage-label');
      if (elLabel) {
        elLabel.textContent = `STAGE ${stageNum} (${stageCfg.title})`;
      }

      const elStatStage = byId('retry-stat-stage');
      if (elStatStage) {
        elStatStage.textContent = `STAGE ${stageNum}`;
      }

      const elStatScore = byId('retry-stat-score');
      if (elStatScore) {
        elStatScore.textContent = `🟢 R$ ${(state.totalScore || 0).toLocaleString()}`;
      }

      const elStatAcc = byId('retry-stat-acc');
      if (elStatAcc) {
        elStatAcc.textContent = `${accuracy}%`;
      }

      const elStatRev = byId('retry-stat-review');
      if (elStatRev) {
        elStatRev.textContent = `${wrongQueue.length} 문제`;
      }

      const btnRetry = byId('btn-retry-stage');
      if (btnRetry) {
        btnRetry.textContent = `⚡ STAGE ${stageNum} 즉시 재도전 (소윤이 누적 로벅스·오답 기록 유지)`;
      }

      // Render failed questions list with answers hidden until [👀 답 보기] is clicked!
      const failedList = (Array.isArray(stageWrongQuestions) && stageWrongQuestions.length > 0)
        ? stageWrongQuestions
        : wrongQueue;
      this._renderHiddenAnswerList(
        byId('gameover-wrong-list'),
        byId('btn-gameover-reveal-all'),
        failedList,
        '이번 판에 틀린 문제가 없습니다! 다시 한 번 힘차게 도전해 볼까요?'
      );

      modal.classList.remove('hidden');
    },

    hideGameOverModal: function () {
      const modal = byId('gameover-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    /**
     * Renders and opens the Cumulative Wrong Answer Review Notebook Modal (#review-modal)
     * @param {Object} [saveState]
     */
    showReviewModal: function (saveState) {
      this.renderReviewModal(saveState);
      const modal = byId('review-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    },

    hideReviewModal: function () {
      const modal = byId('review-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    renderReviewModal: function (saveState) {
      const state = saveState || (window.SaveManager ? window.SaveManager.getState() : {});
      const queue = Array.isArray(state.wrongAnswerQueue) ? state.wrongAnswerQueue : [];
      const history = Array.isArray(state.reviewHistory) ? state.reviewHistory : [];

      const elPendingTotal = byId('review-pending-total');
      if (elPendingTotal) {
        elPendingTotal.textContent = `${queue.length} 문제`;
      }

      const elHistoryTotal = byId('review-history-total');
      if (elHistoryTotal) {
        elHistoryTotal.textContent = `${history.length} 건`;
      }

      const container = byId('review-list-container');
      if (!container) return;

      // Merge queue items and history items cleanly without duplicates
      const combined = [];
      const seenIds = new Set();

      queue.forEach(function (item) {
        if (!item) return;
        const key = item.id || item.prompt;
        seenIds.add(key);
        combined.push({
          prompt: item.prompt,
          category: item.category,
          answerText: item.answerText || item.correctAnswer,
          wrongChoice: item.wrongChoice || '오답',
          wrongCount: item.wrongCount || 1,
          inQueue: true,
          mastered: false
        });
      });

      history.forEach(function (item) {
        if (!item) return;
        const key = item.id || item.prompt;
        if (seenIds.has(key)) return;
        seenIds.add(key);
        combined.push({
          prompt: item.prompt,
          category: item.category,
          answerText: item.answerText || item.correctAnswer,
          wrongChoice: item.wrongChoice || '오답',
          wrongCount: item.wrongCount || 1,
          inQueue: false,
          mastered: Boolean(item.mastered)
        });
      });

      if (combined.length === 0) {
        container.innerHTML =
          '<div class="review-empty-state">✨ 아직 틀린 문제가 없습니다! 레이스를 달리며 틀린 문제가 생기면 이곳에 자동으로 기록되고 복습 문제로 다시 출제됩니다.</div>';
        return;
      }

      this._renderHiddenAnswerList(
        container,
        null,
        combined,
        '✨ 아직 틀린 문제가 없습니다!'
      );
    },

    /**
     * Shows or hides In-Place Time-Freeze Pause Animation (No blocking modal popup! Question & 3D Gate stay 100% visible!)
     * @param {boolean} visible
     * @param {number} [remainingChances]
     * @param {number} [maxChances]
     */
    setPauseModalVisible: function (visible, remainingChances, maxChances) {
      const modal = byId('pause-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      const isPaused = Boolean(visible);
      document.body.classList.toggle('is-time-paused', isPaused);

      const inlineBanner = byId('pause-inline-banner');
      if (inlineBanner) {
        inlineBanner.classList.toggle('hidden', !isPaused);
      }

      const maxC = typeof maxChances === 'number' ? maxChances : 2;
      const remC = typeof remainingChances === 'number' ? Math.max(0, remainingChances) : maxC;

      const titleEl = byId('pause-inline-title');
      if (titleEl) {
        titleEl.textContent = `⏸️ TIME FREEZE! 화면 일시정지 작동 중 (남은 일시정지 기회: ${remC} / ${maxC})`;
      }

      this.updatePauseButton(isPaused, remC, maxC);
    },

    /**
     * Updates the Pause Button (#btn-pause) and 2-Chance Badge (#pause-chance-badge)
     * @param {boolean} isPaused
     * @param {number} remainingChances
     * @param {number} [maxChances=2]
     */
    updatePauseButton: function (isPaused, remainingChances, maxChances) {
      const btn = byId('btn-pause');
      const iconEl = byId('pause-icon');
      const labelEl = byId('pause-label');
      const badgeEl = byId('pause-chance-badge');

      const maxC = Math.max(1, typeof maxChances === 'number' ? maxChances : 2);
      const remC = Math.max(0, Math.min(maxC, typeof remainingChances === 'number' ? remainingChances : maxC));

      if (btn) {
        btn.classList.toggle('pause-active-resume', Boolean(isPaused));
        btn.classList.toggle('pause-exhausted', !isPaused && remC <= 0);
      }

      if (isPaused) {
        if (iconEl) iconEl.textContent = '▶️';
        if (labelEl) labelEl.textContent = '다시 출발';
        if (badgeEl) badgeEl.textContent = `남은기회 ${remC}/${maxC}`;
      } else {
        if (iconEl) iconEl.textContent = '⏸️';
        if (labelEl) labelEl.textContent = '일시정지';
        if (badgeEl) {
          let icons = '';
          for (let i = 0; i < maxC; i++) {
            icons += i < remC ? '⚡' : '🖤';
          }
          badgeEl.textContent = `${icons} ${remC}/${maxC}`;
        }
      }
    },

    /**
     * Updates the Sound Mute/Unmute button UI
     * @param {boolean} isMuted
     */
    updateSoundButton: function (isMuted) {
      const iconEl = byId('sound-icon');
      const labelEl = byId('sound-label');
      if (iconEl) {
        iconEl.textContent = isMuted ? '🔇' : '🔊';
      }
      if (labelEl) {
        labelEl.textContent = isMuted ? '음소거' : '사운드 ON';
      }
    },

    /**
     * Shows and updates the Roblox Obby 2x Speed Action Mini-Game HUD (#obby-minigame-hud)
     * Hides the top life panel (#hud-left-panel) and displays #obby-minigame-hud in its exact place!
     * @param {number} clearedWaves
     * @param {number} totalWaves
     */
    showObbyHUD: function (clearedWaves, totalWaves) {
      const obbyHud = byId('obby-minigame-hud');
      const qBanner = byId('question-banner');
      const leftPanel = byId('hud-left-panel');
      if (qBanner) {
        qBanner.classList.add('hidden');
      }
      if (leftPanel) {
        leftPanel.classList.add('hidden');
      }
      if (obbyHud) {
        obbyHud.classList.remove('hidden');
      }
      document.body.classList.add('obby-mode-active');

      const total = Math.max(1, totalWaves || 7);
      const cleared = Math.max(0, Math.min(total, clearedWaves || 0));
      const pct = Math.round((cleared / total) * 100);

      const fillEl = byId('obby-progress-fill');
      if (fillEl) {
        fillEl.style.width = `${pct}%`;
      }
      const waveEl = byId('obby-wave-counter');
      if (waveEl) {
        waveEl.textContent = `장애물 돌파 ${cleared} / ${total}`;
      }
      const titleEl = byId('obby-hud-title');
      if (titleEl) {
        titleEl.textContent = `🧱 블록 벽은 차선 이동(◀▶) · 🔥 빨간 용암은 점프(⬆️)! (${cleared}/${total})`;
      }
    },

    /**
     * Hides the Roblox Obby Mini-Game HUD and restores the Top Life Panel (#hud-left-panel) & Question Banner
     */
    hideObbyHUD: function () {
      const obbyHud = byId('obby-minigame-hud');
      const qBanner = byId('question-banner');
      const leftPanel = byId('hud-left-panel');
      if (obbyHud) {
        obbyHud.classList.add('hidden');
      }
      if (qBanner) {
        qBanner.classList.remove('hidden');
      }
      if (leftPanel && !document.body.classList.contains('boss-phase-hud-active')) {
        leftPanel.classList.remove('hidden');
      }
      document.body.classList.remove('obby-mode-active');
    },

    /**
     * Updates Orientation Mode UI ('auto' | 'portrait' | 'landscape') on body, Utility Bar, and Dashboard
     * @param {string} mode
     */
    updateOrientationUI: function (mode) {
      const m = (mode === 'portrait' || mode === 'landscape') ? mode : 'auto';
      document.body.classList.remove('view-mode-auto', 'view-mode-portrait', 'view-mode-landscape');
      document.body.classList.add('view-mode-' + m);

      const orientIcon = byId('orient-icon');
      const orientLabel = byId('orient-label');
      if (orientIcon) {
        orientIcon.textContent = m === 'portrait' ? '📱' : (m === 'landscape' ? '📺' : '🔄');
      }
      if (orientLabel) {
        orientLabel.textContent = m === 'portrait' ? '화면: 세로' : (m === 'landscape' ? '화면: 가로' : '화면: 자동');
      }

      const dashOrient = byId('dashboard-orientation-selector');
      if (dashOrient) {
        const btns = dashOrient.querySelectorAll('[data-orient]');
        btns.forEach(function (btn) {
          btn.classList.toggle('active', btn.getAttribute('data-orient') === m);
        });
      }
    },

    /**
     * Opens the Parent Control Modal (#parent-modal)
     * @param {Object} [saveState]
     * @param {boolean} [isUnlocked=false]
     */
    showParentModal: function (saveState, isUnlocked) {
      this.renderParentModal(saveState);
      const modal = byId('parent-modal');
      const pinView = byId('parent-pin-view');
      const settingsView = byId('parent-settings-view');
      const pinInput = byId('parent-pin-input');
      const pinError = byId('parent-pin-error');

      if (pinError) {
        pinError.classList.add('hidden');
      }
      if (pinInput) {
        pinInput.value = '';
      }

      const unlocked = Boolean(isUnlocked);
      if (pinView) {
        pinView.classList.toggle('hidden', unlocked);
      }
      if (settingsView) {
        settingsView.classList.toggle('hidden', !unlocked);
      }
      if (modal) {
        modal.classList.remove('hidden');
      }
      if (!unlocked && pinInput) {
        window.setTimeout(function () {
          try { pinInput.focus(); } catch (_e) {}
        }, 50);
      }
    },

    hideParentModal: function () {
      const modal = byId('parent-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    /**
     * Renders the Parent Control Modal's Speed Controls and Bonus Payout / Deletion List
     * @param {Object} [saveState]
     */
    renderParentModal: function (saveState) {
      const state = saveState || (window.SaveManager ? window.SaveManager.getState() : {});
      const currentStage = Math.max(1, parseInt(state.currentStage, 10) || 1);
      const maxStageReached = Math.max(currentStage, parseInt(state.maxStageReached, 10) || 1);
      const totalCorrect = parseInt(state.totalCorrect, 10) || 0;
      const bossesDefeated = parseInt(state.bossesDefeated, 10) || 0;
      const currentMult = typeof state.speedMultiplier === 'number' ? state.speedMultiplier : 1.0;
      const currentObbyMult = typeof state.obbySpeedMultiplier === 'number' ? state.obbySpeedMultiplier : 1.2;

      // 1. Speed Selector inside Parent Modal
      const elSpeedBadge = byId('parent-current-speed-badge');
      if (elSpeedBadge) {
        elSpeedBadge.textContent = `현재 설정: ${currentMult.toFixed(1)}x 배속`;
      }
      const speedContainer = byId('dashboard-speed-selector');
      if (speedContainer) {
        const speedBtns = speedContainer.querySelectorAll('.speed-preset-pill');
        speedBtns.forEach(function (btn) {
          const m = parseFloat(btn.getAttribute('data-mult'));
          btn.classList.toggle('active', Math.abs(m - currentMult) < 0.08);
        });
      }

      // 1b. Obby Jump Mini-Game Speed Selector inside Parent Modal
      const elObbySpeedBadge = byId('parent-current-obby-speed-badge');
      if (elObbySpeedBadge) {
        elObbySpeedBadge.textContent = `현재 설정: ${currentObbyMult.toFixed(1)}x 배속`;
      }
      const obbySpeedContainer = byId('dashboard-obby-speed-selector');
      if (obbySpeedContainer) {
        const obbyBtns = obbySpeedContainer.querySelectorAll('[data-obby-mult]');
        obbyBtns.forEach(function (btn) {
          const m = parseFloat(btn.getAttribute('data-obby-mult'));
          btn.classList.toggle('active', Math.abs(m - currentObbyMult) < 0.08);
        });
      }

      // 2. Bonus Payout & Deletion Manager
      const totalWrong = parseInt(state.totalWrong, 10) || 0;
      const rewards = getRewardInfo(totalCorrect, bossesDefeated, maxStageReached, totalWrong);
      const pm = rewards.pocketMoney;
      const ash = rewards.ashley;
      const jp = rewards.bossJackpot;

      const unpaidPocket = typeof pm.unpaidCount === 'number' ? pm.unpaidCount : pm.earnedCount;
      const unpaidAshley = typeof ash.unpaidCount === 'number' ? ash.unpaidCount : ash.earnedCount;
      const unpaidJackpot = jp ? (typeof jp.unpaidCount === 'number' ? jp.unpaidCount : jp.earnedCount) : 0;
      const totalUnpaid = unpaidPocket + unpaidAshley + unpaidJackpot;

      const elUnpaidTotal = byId('parent-unpaid-total-badge');
      if (elUnpaidTotal) {
        const cumPocketWon = typeof pm.totalWon === 'number' ? pm.totalWon : 0;
        elUnpaidTotal.textContent = cumPocketWon > 0
          ? `미지급 보너스: ${totalUnpaid}개 (용돈 누계 ${cumPocketWon.toLocaleString()}원)`
          : `미지급 달성 보너스: ${totalUnpaid}개`;
      }

      const container = byId('parent-bonus-list-container');
      if (!container) return;

      const items = [
        {
          key: 'pocket',
          badgeLabel: '보너스 1',
          customName: pm.customName || state.bonusNamePocket || '용돈 3,000원',
          targetCount: pm.target || 100,
          currentCount: pm.current || 0,
          unit: '판',
          stepSize: 10,
          unpaid: unpaidPocket,
          totalWon: typeof pm.totalWon === 'number' ? pm.totalWon : undefined
        },
        {
          key: 'ashley',
          badgeLabel: '보너스 2',
          customName: ash.customName || state.bonusNameAshley || '애슐리 외식',
          targetCount: ash.target || 1000,
          currentCount: ash.current || 0,
          unit: '판',
          stepSize: 50,
          unpaid: unpaidAshley
        },
        {
          key: 'jackpot',
          badgeLabel: '10단계 보스',
          customName: (jp && jp.customName) || state.bonusNameJackpot || '10판 보스 만원 상금',
          targetCount: (jp && jp.target) ? jp.target : 10,
          currentCount: (jp && jp.current) ? jp.current : 0,
          unit: '단계',
          stepSize: 1,
          unpaid: unpaidJackpot
        }
      ];

      container.innerHTML = items.map(function (item) {
        const hasUnpaid = item.unpaid > 0;
        const cardCls = 'parent-bonus-card compact-bonus-card' + (hasUnpaid ? ' has-unpaid-bonus' : '');

        return `
          <div class="${cardCls}" data-bonus-key="${item.key}">
            <div class="compact-bonus-row1">
              <span class="parent-bonus-type-tag">${escapeHtml(item.badgeLabel)}</span>
              <input
                type="text"
                class="parent-bonus-name-input"
                data-bonus-key="${item.key}"
                value="${escapeHtml(item.customName)}"
                maxlength="40"
                placeholder="보너스 이름"
              />
              <button
                type="button"
                class="btn-parent-save-field"
                data-action="save-bonus-name"
                data-bonus-key="${item.key}"
              >
                이름저장
              </button>
            </div>

            <div class="compact-bonus-row2">
              <div class="compact-count-group">
                <span class="compact-count-label">달성횟수:</span>
                <button
                  type="button"
                  class="btn-parent-step"
                  data-action="step-bonus-count"
                  data-step="-${item.stepSize}"
                  data-bonus-key="${item.key}"
                >
                  ➖
                </button>
                <div class="parent-count-unit-wrap">
                  <input
                    type="number"
                    min="1"
                    max="99999"
                    class="parent-bonus-count-input"
                    data-bonus-key="${item.key}"
                    value="${item.targetCount}"
                  />
                  <span class="compact-count-unit">${escapeHtml(item.unit)}</span>
                </div>
                <button
                  type="button"
                  class="btn-parent-step"
                  data-action="step-bonus-count"
                  data-step="${item.stepSize}"
                  data-bonus-key="${item.key}"
                >
                  ➕
                </button>
                <button
                  type="button"
                  class="btn-parent-save-field"
                  data-action="save-bonus-count"
                  data-bonus-key="${item.key}"
                >
                  횟수저장
                </button>
              </div>
            </div>

            <div class="compact-bonus-row3">
              <span class="compact-gauge-pill">
                현재 저장 진행: <strong>${item.currentCount}${escapeHtml(item.unit)} / ${item.targetCount}${escapeHtml(item.unit)}</strong>
                &nbsp;·&nbsp; ${typeof item.totalWon === 'number' ? '현재 적립 누계: <strong>' + item.totalWon.toLocaleString() + '원</strong>' : '미지급 달성: <strong>' + item.unpaid + '개</strong>'}
              </span>
              <button
                type="button"
                class="btn-parent-mark-paid"
                data-action="mark-paid"
                data-bonus-key="${item.key}"
                ${hasUnpaid ? '' : 'disabled'}
              >
                ✅ 지급완료(삭제)
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    /**
     * Shows or hides the Confirm Exit Game Modal (#exit-confirm-modal)
     */
    showExitConfirmModal: function () {
      const modal = byId('exit-confirm-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    },

    hideExitConfirmModal: function () {
      const modal = byId('exit-confirm-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    /**
     * Boss Clear Step 1: Shows the Center Reward Status Popup (#boss-reward-modal) with full gauges
     * AND the list of failed questions from this stage with answers hidden until [👀 답 보기] is clicked!
     * @param {number} clearedStage
     * @param {Object} [saveState]
     * @param {Array} [stageWrongQuestions]
     */
    showBossRewardModal: function (clearedStage, saveState, stageWrongQuestions) {
      const modal = byId('boss-reward-modal');
      if (!modal) return;

      const state = saveState || (window.SaveManager ? window.SaveManager.getState() : {});
      const stg = Math.max(1, parseInt(clearedStage, 10) || 1);
      const isJackpot = (stg % 10 === 0);
      const totalCorrect = parseInt(state.totalCorrect, 10) || 0;
      const totalWrong = parseInt(state.totalWrong, 10) || 0;
      const bossesDefeated = parseInt(state.bossesDefeated, 10) || 0;
      const maxStageReached = Math.max(stg + 1, parseInt(state.maxStageReached, 10) || (stg + 1));

      const rewards = getRewardInfo(totalCorrect, bossesDefeated, maxStageReached, totalWrong);
      const pm = rewards.pocketMoney;
      const ash = rewards.ashley;
      const jp = rewards.bossJackpot;

      const unpaidPocket = typeof pm.unpaidCount === 'number' ? pm.unpaidCount : pm.earnedCount;
      const unpaidAshley = typeof ash.unpaidCount === 'number' ? ash.unpaidCount : ash.earnedCount;
      const unpaidJackpot = jp ? (typeof jp.unpaidCount === 'number' ? jp.unpaidCount : jp.earnedCount) : 0;

      const pocketName = String(pm.displayName || pm.customName || state.bonusNamePocket || '용돈 3,000원').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      const ashleyName = String(ash.customName || state.bonusNameAshley || '애슐리 외식').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      const jackpotName = String((jp && (jp.displayName || jp.customName)) || state.bonusNameJackpot || '10판 보스 만원 상금').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');

      const titleEl = byId('boss-reward-title');
      if (titleEl) {
        titleEl.textContent = isJackpot
          ? `💴 STAGE ${stg} 10판 보스 격파 완료!!`
          : `🎉 STAGE ${stg} 보스 격파 완료!`;
      }
      const subEl = byId('boss-reward-subtitle');
      if (subEl) {
        subEl.innerHTML = isJackpot
          ? `🏆 초대박!! 10판 보스 격파로 <strong>[${escapeHtml(jackpotName)}]</strong> 달성 + <strong>상금 게이지 +10점</strong> 상승!`
          : `보스 격파 보너스로 <strong>상금 게이지 +10점</strong>이 올라갔어요! 현재 보상 현황입니다.`;
      }

      const elPName = byId('boss-pop-pocket-name');
      if (elPName) elPName.textContent = `💵 ${pocketName}`;
      const elPBadge = byId('boss-pop-pocket-badge');
      if (elPBadge) {
        elPBadge.textContent = '';
        elPBadge.style.display = 'none';
      }
      const elPFill = byId('boss-pop-pocket-fill');
      if (elPFill) elPFill.style.width = `${pm.percent}%`;
      const elPScore = byId('boss-pop-pocket-score');
      if (elPScore) elPScore.textContent = `${pm.current} / ${pm.target}점`;
      const elPPct = byId('boss-pop-pocket-pct');
      if (elPPct) elPPct.textContent = `${pm.percent}%`;

      const elAName = byId('boss-pop-ashley-name');
      if (elAName) elAName.textContent = `🍓 ${ashleyName}`;
      const elABadge = byId('boss-pop-ashley-badge');
      if (elABadge) elABadge.textContent = `달성 ${unpaidAshley}개`;
      const elAFill = byId('boss-pop-ashley-fill');
      if (elAFill) elAFill.style.width = `${ash.percent}%`;
      const elAScore = byId('boss-pop-ashley-score');
      if (elAScore) elAScore.textContent = `${ash.current} / ${ash.target.toLocaleString()}점`;
      const elAPct = byId('boss-pop-ashley-pct');
      if (elAPct) elAPct.textContent = `${ash.percent}%`;

      if (jp) {
        const elJName = byId('boss-pop-jackpot-name');
        if (elJName) elJName.textContent = `💴 ${jackpotName}`;
        const elJBadge = byId('boss-pop-jackpot-badge');
        if (elJBadge) elJBadge.textContent = `달성 ${unpaidJackpot}개`;
        const elJFill = byId('boss-pop-jackpot-fill');
        if (elJFill) elJFill.style.width = `${jp.percent}%`;
        const elJScore = byId('boss-pop-jackpot-score');
        if (elJScore) elJScore.textContent = `${jp.current} / ${jp.target}단계`;
        const elJPct = byId('boss-pop-jackpot-pct');
        if (elJPct) elJPct.textContent = `${jp.percent}%`;
      }

      // Render failed questions from this stage (or pending wrongAnswerQueue) with answers hidden until [👀 답 보기] is clicked!
      const wrongQueue = Array.isArray(state.wrongAnswerQueue) ? state.wrongAnswerQueue : [];
      const failedList = (Array.isArray(stageWrongQuestions) && stageWrongQuestions.length > 0)
        ? stageWrongQuestions
        : wrongQueue;
      this._renderHiddenAnswerList(
        byId('boss-clear-wrong-list'),
        byId('btn-boss-reveal-all'),
        failedList,
        '🎉 이번 단계는 틀린 문제가 하나도 없어요! 100% 완벽 올클리어!'
      );

      modal.classList.remove('hidden');
    },

    hideBossRewardModal: function () {
      const modal = byId('boss-reward-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    /**
     * Helper to get World Country / Kingdom Summary info for any stage
     */
    _getWorldInfo: function (stageNum) {
      if (window.GameConfig && typeof window.GameConfig.getStageWorldInfo === 'function') {
        return window.GameConfig.getStageWorldInfo(stageNum);
      }
      const s = Math.max(1, parseInt(stageNum, 10) || 1);
      return {
        stage: s,
        icon: '🏞️',
        country: `STAGE ${s} 월드`,
        shortCountry: `🏞️ STAGE ${s} 월드`,
        summary: '3D 로블록스 오비 레이스 월드',
        altitudeMeters: s * 1000,
        altitudeLabel: `☁️ 상공 ${(s * 1000).toLocaleString()}m`,
        color: '#00f5ff',
        bg: 'linear-gradient(135deg, rgba(13,71,161,0.6), rgba(27,94,32,0.7))',
        isJackpot: (s % 10 === 0)
      };
    },

    /**
     * Generates a rich 3D-style miniature Floating Island SVG Illustration for the Treasure Adventure Map
     * ("트리맵지도는 글자를 최대한 빼고 이런식으로 만들란 말이야" + 빙하/정글/사막/공룡시대/하늘/바닷속/용암/상상의나라!)
     */
    _buildIslandIllustrationSvg: function (biome, stageNum) {
      const b = biome || 'river_nature';
      let topScene = '';
      let surfaceColor = '#4ade80';
      let cliffColor = '#854d0e';
      let cliffDark = '#5c3409';

      if (b === 'river_nature') {
        // 1. Waterfall, Pine Trees, Gold Treasure Chest & Deer Island
        surfaceColor = '#4ade80';
        cliffColor = '#92400e';
        cliffDark = '#5c2804';
        topScene = `
          <!-- Waterfall cascading down island cliff -->
          <path d="M58 48 Q62 72 56 92 L74 92 Q78 70 72 48 Z" fill="#38bdf8" opacity="0.92"/>
          <circle cx="60" cy="91" r="6" fill="#e0f2fe"/>
          <circle cx="70" cy="92" r="5" fill="#bae6fd"/>
          <!-- Pine Trees -->
          <polygon points="34,14 20,44 48,44" fill="#15803d"/>
          <polygon points="34,6 23,30 45,30" fill="#22c55e"/>
          <polygon points="98,18 86,44 110,44" fill="#166534"/>
          <!-- Gold Coins Treasure Chest -->
          <rect x="64" y="30" width="24" height="16" rx="3" fill="#b45309" stroke="#fde047" stroke-width="2"/>
          <circle cx="72" cy="28" r="4" fill="#fde047"/>
          <circle cx="80" cy="27" r="4" fill="#facc15"/>
          <text x="44" y="42" font-size="18">🦌</text>
        `;
      } else if (b === 'jungle_safari') {
        // 2. Tropical Jungle Palms, Vines, Golden Trophy & Lion Island ("정글 사자")
        surfaceColor = '#65a30d';
        cliffColor = '#713f12';
        cliffDark = '#422006';
        topScene = `
          <!-- Jungle Palm Tree -->
          <path d="M36 46 Q32 26 40 14" stroke="#78350f" stroke-width="6" fill="none" stroke-linecap="round"/>
          <ellipse cx="28" cy="14" rx="14" ry="5" transform="rotate(-20 28 14)" fill="#16a34a"/>
          <ellipse cx="50" cy="14" rx="14" ry="5" transform="rotate(20 50 14)" fill="#22c55e"/>
          <ellipse cx="40" cy="10" rx="13" ry="4" fill="#4ade80"/>
          <!-- Golden Trophy Chest -->
          <rect x="82" y="28" width="22" height="16" rx="3" fill="#92400e" stroke="#facc15" stroke-width="2"/>
          <polygon points="87,18 99,18 96,28 90,28" fill="#fde047"/>
          <!-- Lion & Monkey -->
          <text x="50" y="44" font-size="24">🦁</text>
          <text x="20" y="42" font-size="15">🐒</text>
        `;
      } else if (b === 'desert_pyramid') {
        // 3. Golden Desert Pyramid, Oasis Palm, Cactus & Two-Hump Camel ("사막 낙타")
        surfaceColor = '#fbbf24';
        cliffColor = '#b45309';
        cliffDark = '#78350f';
        topScene = `
          <!-- Giant Golden Pyramid -->
          <polygon points="62,8 34,46 62,46" fill="#fde047"/>
          <polygon points="62,8 90,46 62,46" fill="#d97706"/>
          <!-- Saguaro Cactus -->
          <rect x="24" y="22" width="6" height="24" rx="3" fill="#15803d"/>
          <rect x="19" y="28" width="6" height="4" rx="2" fill="#15803d"/>
          <rect x="29" y="25" width="6" height="4" rx="2" fill="#15803d"/>
          <!-- Camel & Desert Fox -->
          <text x="64" y="45" font-size="23">🐪</text>
          <text x="92" y="46" font-size="15">🦊</text>
        `;
      } else if (b === 'glacier_ice' || b === 'snow_aurora') {
        // 4. Crystal Glacier Icebergs, Royal Crown Chest, Penguin & Polar Bear ("빙하")
        surfaceColor = '#e0f2fe';
        cliffColor = '#0284c7';
        cliffDark = '#0369a1';
        topScene = `
          <!-- Faceted Blue Iceberg Spires -->
          <polygon points="38,6 22,46 50,46" fill="#bae6fd"/>
          <polygon points="38,6 50,46 58,46" fill="#38bdf8"/>
          <polygon points="92,14 80,46 104,46" fill="#7dd3fc"/>
          <!-- Penguin & Polar Bear -->
          <text x="50" y="44" font-size="22">🐧</text>
          <text x="74" y="44" font-size="19">🐻‍❄️</text>
        `;
      } else if (b === 'dino_jurassic') {
        // 5. Prehistoric Smoking Volcano, Cycad Fern & T-Rex Dinosaur ("공룡시대")
        surfaceColor = '#4d7c0f';
        cliffColor = '#44403c';
        cliffDark = '#292524';
        topScene = `
          <!-- Smoking Prehistoric Volcano -->
          <polygon points="22,46 34,14 48,14 60,46" fill="#44403c"/>
          <ellipse cx="41" cy="14" rx="7" ry="3" fill="#ff5722"/>
          <circle cx="44" cy="7" r="5" fill="#78716c" opacity="0.8"/>
          <!-- T-Rex & Brachiosaurus -->
          <text x="54" y="44" font-size="24">🦖</text>
          <text x="84" y="43" font-size="20">🦕</text>
        `;
      } else if (b === 'sky_heaven') {
        // 6. Cloud Castle, 7-Color Rainbow Arch & Winged Unicorn Pegasus
        surfaceColor = '#ffffff';
        cliffColor = '#7dd3fc';
        cliffDark = '#0284c7';
        topScene = `
          <!-- Rainbow Arch -->
          <path d="M26 44 A38 34 0 0 1 102 44" fill="none" stroke="#ff2a85" stroke-width="4"/>
          <path d="M30 44 A34 30 0 0 1 98 44" fill="none" stroke="#ffe600" stroke-width="4"/>
          <path d="M34 44 A30 26 0 0 1 94 44" fill="none" stroke="#00e5ff" stroke-width="4"/>
          <!-- Golden Cloud Spire & Unicorn -->
          <polygon points="64,10 52,32 76,32" fill="#fde047"/>
          <text x="52" y="45" font-size="23">🦄</text>
        `;
      } else if (b === 'underwater_ocean') {
        // 7. Underwater Coral Reef, Pearl Chest, Sea Turtle & Dolphin
        surfaceColor = '#06b6d4';
        cliffColor = '#0e7490';
        cliffDark = '#164e63';
        topScene = `
          <!-- Glowing Coral Branches -->
          <path d="M32 45 L26 22 M32 36 L40 24" stroke="#fb7185" stroke-width="5" stroke-linecap="round"/>
          <path d="M96 45 L102 24 M96 36 L88 26" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
          <!-- Sea Turtle & Dolphin -->
          <text x="44" y="43" font-size="22">🐢</text>
          <text x="70" y="38" font-size="21">🐬</text>
        `;
      } else if (b === 'molten_lava') {
        // 8. Molten Lava Volcano Canyon, Magma River & Fire Dragon
        surfaceColor = '#450a0a';
        cliffColor = '#7f1d1d';
        cliffDark = '#2b0504';
        topScene = `
          <!-- Erupting Magma Crag & Lava Stream -->
          <polygon points="24,46 42,10 58,46" fill="#1c1917"/>
          <path d="M42 12 Q46 30 40 48" stroke="#ff5722" stroke-width="6" fill="none"/>
          <!-- Magic Orb Chest & Fire Dragon -->
          <circle cx="88" cy="28" r="9" fill="#a855f7" stroke="#fde047" stroke-width="2"/>
          <text x="52" y="44" font-size="24">🐉</text>
        `;
      } else if (b === 'wonderland_magic') {
        // 9. Candy Wonderland Polka-Dot Mushroom, Lollipop & Magic Bunny
        surfaceColor = '#f472b6';
        cliffColor = '#9d174d';
        cliffDark = '#500724';
        topScene = `
          <!-- Giant Magic Mushroom -->
          <rect x="34" y="26" width="10" height="20" rx="3" fill="#fffbeb"/>
          <path d="M20 28 Q39 4 58 28 Z" fill="#ff2a85"/>
          <circle cx="33" cy="19" r="3.5" fill="#ffffff"/>
          <circle cx="45" cy="21" r="3" fill="#ffffff"/>
          <!-- Swirl Lollipop & Bunny -->
          <line x1="92" y1="24" x2="92" y2="46" stroke="#ffffff" stroke-width="3"/>
          <circle cx="92" cy="20" r="9" fill="#00f5d4" stroke="#ff2a85" stroke-width="3"/>
          <text x="56" y="45" font-size="22">🐇</text>
        `;
      } else {
        // 10. Cherry Blossom & Golden 10,000원 Boss Fortress Island
        surfaceColor = '#fde047';
        cliffColor = '#b45309';
        cliffDark = '#78350f';
        topScene = `
          <!-- Sakura Tree & Golden Boss Fortress -->
          <circle cx="34" cy="24" r="14" fill="#ffb3c6"/>
          <rect x="54" y="18" width="34" height="26" rx="4" fill="#78350f" stroke="#fde047" stroke-width="2.5"/>
          <text x="59" y="39" font-size="21">👑</text>
          <text x="24" y="45" font-size="18">🐼</text>
        `;
      }

      return `
        <svg viewBox="0 0 128 96" aria-hidden="true">
          <!-- Soft Shadow under Floating Island -->
          <ellipse cx="64" cy="88" rx="44" ry="6" fill="rgba(68, 36, 12, 0.28)"/>
          <!-- 3D Tapered Floating Rock Cliff Base -->
          <polygon points="18,46 110,46 92,76 64,84 36,76" fill="${cliffColor}"/>
          <polygon points="64,46 110,46 92,76 64,84" fill="${cliffDark}"/>
          <!-- Lush Biome Surface Rim -->
          <ellipse cx="64" cy="46" rx="48" ry="12" fill="${surfaceColor}" stroke="#422006" stroke-width="2"/>
          ${topScene}
        </svg>
      `;
    },

    /**
     * Shows the Visual Illustrated Treasure-Island World Adventure Map (#next-stage-modal)
     * Minimal text ("트리맵지도는 글자를 최대한 빼고 이런식으로 만들란 말이야")
     * Used BOTH before Game Start (mode === 'start') AND after Boss Clear (mode === 'next_stage')!
     */
    showNextStageModal: function (targetStage, stageConfig, options) {
      const modal = byId('next-stage-modal');
      if (!modal) return;

      const opts = options || {};
      const mode = opts.mode === 'start' ? 'start' : 'next_stage';
      const saveState = window.SaveManager ? window.SaveManager.getState() : {};
      const stg = Math.max(1, parseInt(targetStage, 10) || 1);
      const maxReached = Math.max(
        stg,
        parseInt(opts.maxStageReached !== undefined ? opts.maxStageReached : (saveState.maxStageReached || saveState.currentStage || 1), 10) || 1
      );

      const curWorld = this._getWorldInfo(stg);

      // Hide #start-screen when opening the Tree Map so #start-screen never blocks or overlaps the map!
      this.setStartScreenVisible(false);

      // Render 10 Floating Biome Islands along a Winding Treasure-Map Trail (Bottom = Stage 1 -> Top = Stage 10)
      const listEl = byId('sky-treemap-list');
      if (listEl) {
        const tierBlock = Math.floor((stg - 1) / 10);
        const startStage = tierBlock * 10 + 1;
        const topStage = startStage + 9;

        // Zig-zag coordinates (x% across parchment, y px from top of 880px map) from Stage 1 (bottom) to Stage 10 (top)
        const stops = [
          { x: 26, y: 805 }, // 1: River Waterfall
          { x: 74, y: 725 }, // 2: Lion Jungle
          { x: 28, y: 640 }, // 3: Camel Pyramid Desert
          { x: 74, y: 555 }, // 4: Penguin/Polar Bear Glacier
          { x: 26, y: 470 }, // 5: T-Rex Dinosaur Era
          { x: 74, y: 385 }, // 6: Sky Rainbow Pegasus
          { x: 28, y: 300 }, // 7: Underwater Coral Sea
          { x: 74, y: 215 }, // 8: Molten Lava Volcano
          { x: 30, y: 132 }, // 9: Candy Wonderland
          { x: 68, y: 56 }   // 10: Sakura & Golden Boss Fortress
        ];

        // Build smooth winding SVG cubic bezier path + intermediate stepping-stone pearls
        let pathD = '';
        const midDotsSvg = [];
        for (let i = 0; i < stops.length; i++) {
          const pt = stops[i];
          const px = pt.x * 5; // mapped to 500x880 SVG viewBox
          const py = pt.y;
          if (i === 0) {
            pathD += `M ${px} ${py}`;
          } else {
            const prev = stops[i - 1];
            const prevX = prev.x * 5;
            const prevY = prev.y;
            const cy1 = prevY - (prevY - py) * 0.48;
            const cy2 = prevY - (prevY - py) * 0.52;
            pathD += ` C ${prevX} ${cy1}, ${px} ${cy2}, ${px} ${py}`;

            // 2 small decorative stepping-stone spheres along the dashed curve between islands
            [0.35, 0.68].forEach(function (t) {
              const mx = prevX + (px - prevX) * t;
              const my = prevY + (py - prevY) * t;
              const isPassed = (startStage + i - 1) < stg;
              midDotsSvg.push(
                `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="6.5" fill="${isPassed ? '#fde047' : '#e2e8f0'}" stroke="#5c3615" stroke-width="2"/>`
              );
            });
          }
        }

        const bgSvgHtml = `
          <svg class="treasure-map-svg-bg" viewBox="0 0 500 880" preserveAspectRatio="none" aria-hidden="true">
            <!-- Compass Rose watermark in corner -->
            <g transform="translate(65, 75)" opacity="0.24">
              <circle cx="0" cy="0" r="34" fill="none" stroke="#5c3615" stroke-width="2.5"/>
              <polygon points="0,-42 8,-8 42,0 8,8 0,42 -8,8 -42,0 -8,-8" fill="#784419"/>
            </g>
            <!-- Winding Dashed Adventure Trail -->
            <path d="${pathD}" fill="none" stroke="rgba(255, 248, 220, 0.7)" stroke-width="11" stroke-linecap="round"/>
            <path d="${pathD}" fill="none" stroke="#6b3e16" stroke-width="5.5" stroke-dasharray="11 10" stroke-linecap="round"/>
            ${midDotsSvg.join('')}
          </svg>
        `;

        const islandNodesHtml = [];
        for (let i = 0; i < 10; i++) {
          const s = startStage + i;
          const pt = stops[i];
          const wInfo = this._getWorldInfo(s);
          const isCurrent = (s === stg);
          const isCleared = (s < stg) || (s < maxReached && !isCurrent);
          const isUnlocked = (s <= maxReached);

          let stateClass = 'is-locked';
          if (isCurrent) stateClass = 'is-current';
          else if (isCleared) stateClass = 'is-cleared';
          else if (isUnlocked) stateClass = 'is-unlocked';

          const orbLabel = isCurrent ? '👑' : (isCleared ? '⭐' : String(s));
          const soyunPinHtml = isCurrent
            ? `<div class="island-soyun-pin">👑 START!</div>`
            : '';

          islandNodesHtml.push(`
            <div
              id="${isCurrent ? 'treemap-node-current' : `treemap-node-${s}`}"
              class="island-map-node ${stateClass}"
              style="left: ${pt.x}%; top: ${pt.y}px;"
              data-treemap-stage="${s}"
              data-unlocked="${isUnlocked ? 'true' : 'false'}"
              title="STAGE ${s} ${escapeHtml(wInfo.country)}"
            >
              ${soyunPinHtml}
              <div class="island-svg-wrap">
                ${this._buildIslandIllustrationSvg(wInfo.biome, s)}
              </div>
              <div class="island-step-orb">
                <span>${orbLabel}</span>
              </div>
              <div class="island-mini-tag">${escapeHtml(wInfo.icon)} ${s}</div>
            </div>
          `);
        }

        listEl.innerHTML = bgSvgHtml + islandNodesHtml.join('');
      }

      // Update hidden compatibility nodes & bottom CTA buttons (Minimal text!)
      const badgeEl = byId('next-stage-badge');
      if (badgeEl) badgeEl.textContent = `STAGE ${stg}`;
      const nameEl = byId('next-stage-name');
      if (nameEl) nameEl.textContent = `${curWorld.icon} ${curWorld.country}`;

      const yesBtn = byId('btn-next-stage-yes');
      if (yesBtn) {
        yesBtn.textContent = `🚀 STAGE ${stg} ${curWorld.icon} START!`;
      }
      const noBtn = byId('btn-next-stage-no');
      if (noBtn) {
        noBtn.textContent = '✕';
      }

      modal.setAttribute('data-treemap-mode', mode);
      modal.setAttribute('data-target-stage', String(stg));
      modal.classList.remove('hidden');

      // Smoothly scroll the parchment map to center on Soyun's current floating island!
      const scrollBox = byId('sky-treemap-scroll');
      if (scrollBox) {
        scrollBox.scrollTop = scrollBox.scrollHeight;
        setTimeout(function () {
          const curNode = byId('treemap-node-current');
          if (curNode && scrollBox) {
            const targetTop = Math.max(
              0,
              curNode.offsetTop - scrollBox.clientHeight / 2
            );
            scrollBox.scrollTo({ top: targetTop, behavior: 'smooth' });
          }
        }, 60);
      }
    },

    hideNextStageModal: function () {
      const modal = byId('next-stage-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    /**
     * Updates the Booster & Brake buttons' badges, labels, and active glow states!
     * @param {number} brakeCount
     * @param {boolean} [isBoosterActive]
     * @param {boolean} [isBrakeActive]
     */
    updateBoosterBrakeUI: function (brakeCount, isBoosterActive, isBrakeActive) {
      const cnt = Math.max(0, parseInt(brakeCount, 10) || 0);
      const brakeBtn = byId('btn-brake-action');
      const brakeBadge = byId('brake-count-badge');
      const brakeLbl = byId('brake-btn-label');
      const boosterBtn = byId('btn-booster-action');
      const boosterLbl = byId('booster-btn-label');

      if (brakeBadge) {
        brakeBadge.textContent = String(cnt);
      }
      if (brakeLbl) {
        brakeLbl.textContent = isBrakeActive ? '🛑사용중...' : `브레이크 ${cnt}`;
      }
      if (brakeBtn) {
        brakeBtn.disabled = Boolean(isBrakeActive);
        brakeBtn.classList.toggle('brake-empty', cnt <= 0 && !isBrakeActive);
        brakeBtn.classList.toggle('brake-active-glow', Boolean(isBrakeActive));
      }
      if (boosterLbl) {
        boosterLbl.textContent = isBoosterActive ? '🚀사용중...' : '부스터x2';
      }
      if (boosterBtn) {
        boosterBtn.disabled = Boolean(isBoosterActive);
        boosterBtn.classList.toggle('booster-active-glow', Boolean(isBoosterActive));
      }
    },

    /**
     * Updates the middle-right Character Change button badge on the Main Screen
     * @param {string} vehicleId
     */
    updateCharacterButtonBadge: function (vehicleId) {
      const vObj = (window.GameConfig && typeof window.GameConfig.getVehicleById === 'function')
        ? window.GameConfig.getVehicleById(vehicleId)
        : { icon: '🏎️', shortName: '세이버 프로', name: '카트라이더 세이버 프로' };
      const iconEl = byId('btn-char-current-icon');
      const nameEl = byId('btn-char-current-name');
      if (iconEl) iconEl.textContent = vObj.icon || '🏎️';
      if (nameEl) nameEl.textContent = vObj.shortName || vObj.name || '세이버 프로';
    },

    /**
     * Renders the 10 selectable Characters / Vehicles inside #character-select-modal
     * @param {string} selectedVehicleId
     */
    renderCharacterModal: function (selectedVehicleId) {
      const curId = String(selectedVehicleId || 'kart_saber').trim() || 'kart_saber';
      this.updateCharacterButtonBadge(curId);

      const gridEl = byId('character-select-grid');
      if (!gridEl) return;

      const list = (window.GameConfig && Array.isArray(window.GameConfig.CHARACTER_VEHICLES))
        ? window.GameConfig.CHARACTER_VEHICLES
        : [];

      const cardsHtml = list.map(function (v) {
        const isSel = (v.id === curId);
        return `
          <button
            type="button"
            class="character-card ${isSel ? 'is-selected' : ''}"
            data-vehicle-id="${escapeHtml(v.id)}"
            role="option"
            aria-selected="${isSel ? 'true' : 'false'}"
          >
            <div class="character-card-icon-wrap" style="border-color: ${escapeHtml(v.primaryColor || '#00f5ff')};">
              <span>${escapeHtml(v.icon)}</span>
            </div>
            <span class="character-card-tag">${escapeHtml(v.tag)}</span>
            <strong class="character-card-name">${escapeHtml(v.name)}</strong>
            <span class="character-card-desc">${escapeHtml(v.desc)}</span>
            <span class="character-card-select-pill">${isSel ? '✅ 현재 장착중' : '👆 이 캐릭터 선택'}</span>
          </button>
        `;
      });

      gridEl.innerHTML = cardsHtml.join('');
    },

    showCharacterModal: function (selectedVehicleId) {
      this.renderCharacterModal(selectedVehicleId);
      const modal = byId('character-select-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    },

    hideCharacterModal: function () {
      const modal = byId('character-select-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }
  };

  window.UIManager = UIManager;
  window.UI = UIManager;
})(window);
