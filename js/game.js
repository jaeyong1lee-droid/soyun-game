/**
 * 👑 이소윤의 로블록스 오비 레이서 3D (Soyun's Roblox Obby Racer 3D)
 * Main Game Controller & State Machine
 * Coordinates SaveManager, QuestionEngine, Engine3D, SoundEngine, and UIManager.
 * Exposes `window.GameController`
 */
(function (window) {
  'use strict';

  const state = {
    initialized: false,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    wasPlayingBeforeModal: false,

    stage: 1,
    selectedDashboardStage: 1,
    stageConfig: null,
    stageProgress: 0,

    hp: 5,
    maxHp: 5,
    speed: 32.4,
    speedMultiplier: 1.0,
    obbySpeedMultiplier: 1.2,
    combo: 0,
    currentLane: 1,
    currentQuestion: null,

    isBossPhase: false,
    bossCurrentHp: 9,
    bossMaxHp: 9,

    pauseChancesRemaining: 2,
    maxPauseChances: 2,
    brakeCount: 0,
    activeSpeedFactor: 1.0,
    isBoosterActive: false,
    isBrakeActive: false,
    selectedVehicle: 'kart_saber',

    isObbyMode: false,
    obbyGameType: 'heaven_stairs',
    obbyWavesTotal: 8,
    obbyWavesCleared: 0,
    stageMinigameMilestones: [4, 8, 12],
    stageMinigameQueue: ['heaven_stairs', 'laser_jump', 'obby_rush'],
    stageMinigamesTriggered: 0,
    lastMinigameType: null,
    orientationMode: 'auto',
    stageWrongQuestions: []
  };

  /**
   * Computes strictly 3 evenly spaced question milestones per stage to trigger mini-games!
   * (e.g. for 15 questions -> [4, 8, 12])
   */
  function buildStageMinigameMilestones(questionsToBoss) {
    const q = Math.max(6, Number(questionsToBoss) || 15);
    const m1 = Math.max(2, Math.round(q * 0.26));
    const m2 = Math.max(m1 + 2, Math.round(q * 0.53));
    const m3 = Math.min(q - 1, Math.max(m2 + 2, Math.round(q * 0.80)));
    return [m1, m2, m3];
  }

  /**
   * Builds a 3-game queue of 3 DISTINCT mini-games for the stage (never repeats the same game!):
   * 1) 'heaven_stairs': 🌈☁️ 로블록스 천국의 계단 (2버튼 방향전환 & 오르기)
   * 2) 'laser_jump': ⚡🪵 로블록스 회전 레이저봉 & 거대 통나무 2단점프 서바이벌
   * 3) 'obby_rush': 🧱🔥 로블록스 3레인 용암·장애물 돌파 오비
   */
  function buildStageMinigameQueue(stageNum) {
    if ((Number(stageNum) || 1) % 2 === 0) {
      return ['heaven_stairs', 'obby_rush', 'laser_jump'];
    }
    return ['heaven_stairs', 'laser_jump', 'obby_rush'];
  }

  let _speechRec = null;
  let _speechRestartTimer = null;
  let _speechPermissionDenied = false;

  function stopSpeechListening() {
    if (_speechRestartTimer) {
      window.clearTimeout(_speechRestartTimer);
      _speechRestartTimer = null;
    }
    if (_speechRec) {
      try {
        _speechRec.onresult = null;
        _speechRec.onerror = null;
        _speechRec.onend = null;
        _speechRec.abort();
      } catch (_e) {}
      _speechRec = null;
    }
  }

  function speakTargetWordTTS(word) {
    if (!word || typeof window.speechSynthesis === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(String(word));
      utter.lang = 'en-US';
      utter.rate = 0.86;
      utter.pitch = 1.08;
      window.speechSynthesis.speak(utter);
    } catch (_e) {}
  }

  function startSpeechListening(question) {
    stopSpeechListening();
    return; // Microphone speech questions completely disabled

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (window.UIManager && typeof window.UIManager.updateSpeechStatus === 'function') {
        window.UIManager.updateSpeechStatus(
          '🎤 음성 버튼 모드',
          `큰 소리로 "${(question.targetWord || '').toUpperCase()}" [${question.targetPron || ''}] 읽고 오른쪽 버튼을 눌러주세요!`,
          false,
          false
        );
      }
      return;
    }

    _speechPermissionDenied = false;
    try {
      const rec = new SpeechRecognition();
      _speechRec = rec;
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 5;

      rec.onstart = function () {
        if (window.UIManager && typeof window.UIManager.updateSpeechStatus === 'function') {
          window.UIManager.updateSpeechStatus(
            '🎙️ 마이크 켜짐',
            `영어로 "${(question.targetWord || '').toUpperCase()}" [${question.targetPron || ''}] 라고 말해보세요!`,
            true,
            false
          );
        }
      };

      rec.onresult = function (event) {
        if (!state.isPlaying || state.isPaused || !state.currentQuestion || !state.currentQuestion.isSpeech) return;
        const curQ = state.currentQuestion;
        if (curQ.speechPassed) return;

        let latestTranscript = '';
        let matchedTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (!res) continue;
          for (let a = 0; a < res.length; a++) {
            const alt = res[a];
            if (!alt || !alt.transcript) continue;
            const text = String(alt.transcript).trim();
            if (!latestTranscript) latestTranscript = text;
            if (window.QuestionEngine && typeof window.QuestionEngine.checkSpeechMatch === 'function') {
              if (window.QuestionEngine.checkSpeechMatch(text, curQ)) {
                matchedTranscript = text;
                break;
              }
            }
          }
          if (matchedTranscript) break;
        }

        if (matchedTranscript) {
          curQ.speechPassed = true;
          curQ.spokenText = matchedTranscript;
          stopSpeechListening();
          if (window.UIManager && typeof window.UIManager.updateSpeechStatus === 'function') {
            window.UIManager.updateSpeechStatus(
              '✅ 발음 성공!',
              `🎉 "${(curQ.targetWord || '').toUpperCase()}" 정확한 발음! 관문 통과!!`,
              false,
              true
            );
          }
          if (window.Engine3D && typeof window.Engine3D.resolveSpeechGatePass === 'function') {
            window.Engine3D.resolveSpeechGatePass(matchedTranscript);
          }
        } else if (latestTranscript && window.UIManager && typeof window.UIManager.updateSpeechStatus === 'function') {
          window.UIManager.updateSpeechStatus(
            '🎙️ 듣는 중...',
            `🗣️ 들린 소리: "${latestTranscript}" ➔ "${(curQ.targetWord || '').toUpperCase()}" [${curQ.targetPron || ''}] 라고 말해보세요!`,
            true,
            false
          );
        }
      };

      rec.onerror = function (ev) {
        const errCode = ev && ev.error ? String(ev.error) : '';
        if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          _speechPermissionDenied = true;
          if (window.UIManager && typeof window.UIManager.updateSpeechStatus === 'function') {
            window.UIManager.updateSpeechStatus(
              '🎤 마이크 권한 필요',
              '브라우저 마이크 허용 후 [🎤 마이크 다시 켜기]를 눌러주세요!',
              false,
              false
            );
          }
        }
      };

      rec.onend = function () {
        if (
          !_speechPermissionDenied &&
          state.isPlaying &&
          !state.isPaused &&
          !state.isGameOver &&
          state.currentQuestion &&
          state.currentQuestion.isSpeech &&
          !state.currentQuestion.speechPassed
        ) {
          _speechRestartTimer = window.setTimeout(function () {
            if (state.isPlaying && !state.isPaused && state.currentQuestion && state.currentQuestion.isSpeech && !state.currentQuestion.speechPassed) {
              startSpeechListening(state.currentQuestion);
            }
          }, 220);
        }
      };

      rec.start();
    } catch (_err) {}
  }

  function getEffectiveSpeed() {
    const obbyFactor = state.isObbyMode ? (Number(state.obbySpeedMultiplier) || 1.2) : 1.0;
    const bossFactor = (!state.isObbyMode && state.isBossPhase)
      ? ((window.GameConfig && window.GameConfig.BOSS_SPEED_MULTIPLIER) ? window.GameConfig.BOSS_SPEED_MULTIPLIER : 1.5)
      : 1.0;
    const actionFactor = Number(state.activeSpeedFactor) || 1.0;
    const baseCap = state.isObbyMode ? 280 : (state.isBossPhase ? 260 : 225);
    const cap = actionFactor > 1.0 ? Math.round(baseCap * actionFactor) : baseCap;
    return Math.max(8, Math.min(cap, Math.round(((state.speed || 32.4) * (state.speedMultiplier || 1.0) * obbyFactor * bossFactor * actionFactor) * 100) / 100));
  }

  function getMaxHp() {
    return (window.GameConfig && window.GameConfig.MAX_HP) ? window.GameConfig.MAX_HP : 5;
  }

  function getStageCfg(stageNum) {
    if (window.GameConfig && typeof window.GameConfig.getStageConfig === 'function') {
      return window.GameConfig.getStageConfig(stageNum);
    }
    return {
      stage: stageNum || 1,
      title: '🌈 레인보우 스타터 오비 (Rainbow Obby)',
      questionsToBoss: 15,
      bossName: '블록 골렘 렉스 (Blocky Rex)',
      bossTitle: '1단계 로블록스 연산 수문장',
      bossHp: 9,
      baseSpeed: 32.4,
      themeColor: '#00f2fe',
      roadColor: '#1a103c',
      bossColor: 0xff3366
    };
  }

  function getActivePet() {
    const saveState = window.SaveManager ? window.SaveManager.getState() : {};
    if (window.GameConfig && typeof window.GameConfig.getCurrentPet === 'function') {
      const info = window.GameConfig.getCurrentPet(
        saveState.totalScore || 0,
        Math.max(state.stage || 1, saveState.maxStageReached || 1)
      );
      return info.current;
    }
    return {
      level: 1,
      icon: '🐣',
      name: '🐣 블록 병아리 펫 (Blocky Chick)',
      shortName: '🐣 블록 병아리 펫',
      cheerTag: '병아리펫'
    };
  }

  function syncHUD() {
    const saveState = window.SaveManager ? window.SaveManager.getState() : {};
    const wrongQueue = Array.isArray(saveState.wrongAnswerQueue) ? saveState.wrongAnswerQueue : [];

    if (window.UIManager) {
      window.UIManager.updateHUD({
        hp: state.hp,
        maxHp: state.maxHp,
        stage: state.stage,
        maxStageReached: Math.max(state.stage, saveState.maxStageReached || 1),
        stageConfig: state.stageConfig,
        stageProgress: state.stageProgress,
        isBossPhase: state.isBossPhase,
        speed: getEffectiveSpeed(),
        speedMultiplier: state.speedMultiplier,
        totalScore: saveState.totalScore || 0,
        totalCorrect: saveState.totalCorrect || 0,
        totalWrong: saveState.totalWrong || 0,
        bossesDefeated: saveState.bossesDefeated || 0,
        combo: state.combo,
        reviewCount: wrongQueue.length,
        isPaused: state.isPaused,
        pauseChancesRemaining: state.pauseChancesRemaining,
        brakeCount: state.brakeCount || 0,
        activeSpeedFactor: state.activeSpeedFactor || 1.0,
        isBoosterActive: Boolean(state.isBoosterActive),
        isBrakeActive: Boolean(state.isBrakeActive),
        selectedVehicle: state.selectedVehicle || 'kart_saber',
        maxPauseChances: state.maxPauseChances
      });
    }
  }

  const GameController = {
    /**
     * Initializes all subsystems, loads cumulative save state, binds DOM & keyboard events,
     * and renders the Cumulative Progress Dashboard.
     */
    init: function () {
      if (state.initialized) return this;
      state.initialized = true;

      // 1. Load Cumulative Save State (Never resets to Stage 1 on reload!)
      const saveState = window.SaveManager ? window.SaveManager.load() : { currentStage: 1, stageProgress: 0 };
      state.maxHp = getMaxHp();
      state.hp = state.maxHp;
      state.stage = Math.max(1, parseInt(saveState.currentStage, 10) || 1);
      state.selectedDashboardStage = state.stage;
      state.stageConfig = getStageCfg(state.stage);
      state.stageProgress = Math.max(0, parseInt(saveState.stageProgress, 10) || 0);
      state.speedMultiplier = typeof saveState.speedMultiplier === 'number' ? saveState.speedMultiplier : 1.0;
      state.obbySpeedMultiplier = typeof saveState.obbySpeedMultiplier === 'number' ? saveState.obbySpeedMultiplier : 1.2;
      state.speed = state.stageConfig.baseSpeed || 32.4;
      state.currentLane = 1;
      try {
        const savedOrient = window.localStorage.getItem('soyun_view_orientation_mode');
        if (savedOrient === 'portrait' || savedOrient === 'landscape' || savedOrient === 'auto') {
          state.orientationMode = savedOrient;
        }
      } catch (e) {}

      // 2. Initialize 3D Engine inside #game-canvas-container
      const container = document.getElementById('game-canvas-container');
      if (window.Engine3D && typeof window.Engine3D.init === 'function') {
        window.Engine3D.init(container, {
          onGatePass: function (selectedLane, questionData, isCorrect) {
            GameController.handleGatePass(selectedLane, questionData, isCorrect);
          },
          onGateProgress: function (progress0to1) {
            if (window.UIManager) {
              window.UIManager.updateGateProgress(progress0to1);
            }
          },
          onObbyWavePass: function (res) {
            GameController.handleObbyWavePass(res);
          },
          onHeavenStairStep: function (res) {
            GameController.handleHeavenStairStep(res);
          }
        });
        if (typeof window.Engine3D.setViewOrientationMode === 'function') {
          window.Engine3D.setViewOrientationMode(state.orientationMode);
        }
        state.selectedVehicle = (saveState && saveState.selectedVehicle) || 'kart_saber';
        if (typeof window.Engine3D.setVehicleType === 'function') {
          window.Engine3D.setVehicleType(state.selectedVehicle);
        }
        window.Engine3D.setStageTheme(state.stageConfig);
        window.Engine3D.setSpeed(getEffectiveSpeed());
        window.Engine3D.setLane(1);
        window.Engine3D.start();
        if (typeof window.Engine3D.setDemoMode === 'function') {
          window.Engine3D.setDemoMode(true);
        }
        window.Engine3D.setPaused(false);
      }

      // 3. Bind UI & Keyboard Controls
      this._bindEvents();

      // 4. Render Initial Cumulative Dashboard & HUD
      if (window.UIManager) {
        if (typeof window.UIManager.updateOrientationUI === 'function') {
          window.UIManager.updateOrientationUI(state.orientationMode);
        }
        if (typeof window.UIManager.updateCharacterButtonBadge === 'function') {
          window.UIManager.updateCharacterButtonBadge(state.selectedVehicle);
        }
        if (typeof window.UIManager.updateBoosterBrakeUI === 'function') {
          window.UIManager.updateBoosterBrakeUI(state.brakeCount, false, false);
        }
        window.UIManager.renderDashboard(saveState, state.selectedDashboardStage);
        window.UIManager.setStartScreenVisible(true);
        syncHUD();
      }

      return this;
    },

    /**
     * Starts or continues the race at the selected/current stage while preserving all cumulative records.
     * @param {number} [stageOverride]
     */
    startGame: function (stageOverride) {
      if (!state.initialized) {
        this.init();
      }

      if (window.SoundEngine) {
        window.SoundEngine.init();
        window.SoundEngine.playClick();
      }

      const saveState = window.SaveManager ? window.SaveManager.getState() : { currentStage: 1 };
      const targetStage = Math.max(
        1,
        parseInt(stageOverride !== undefined ? stageOverride : (state.selectedDashboardStage || saveState.currentStage), 10) || 1
      );

      const prevStage = parseInt(saveState.currentStage, 10) || 1;
      const savedStageProgress = parseInt(saveState.stageProgress, 10) || 0;

      // Preserve maxStageReached while setting active currentStage
      if (window.SaveManager && typeof window.SaveManager.setStage === 'function') {
        const prevMax = Math.max(saveState.maxStageReached || 1, saveState.currentStage || 1);
        window.SaveManager.setStage(targetStage);
        const updated = window.SaveManager.getState();
        if (updated.maxStageReached < prevMax) {
          updated.maxStageReached = prevMax;
          window.SaveManager.save();
        }
      }

      state.stage = targetStage;
      state.selectedDashboardStage = targetStage;
      state.stageConfig = getStageCfg(targetStage);
      // 게임을 다시 시작하면 해당 단계는 항상 처음(0 / 15)부터 시작!
      state.stageProgress = 0;
      if (window.SaveManager && typeof window.SaveManager.setStageProgress === 'function') {
        window.SaveManager.setStageProgress(0);
      }
      state.isBossPhase = false;
      state.bossMaxHp = state.stageConfig.bossHp || 9;
      state.bossCurrentHp = state.bossMaxHp;

      state.maxHp = getMaxHp();
      state.hp = state.maxHp;
      state.maxPauseChances = (window.GameConfig && window.GameConfig.MAX_PAUSE_CHANCES) ? window.GameConfig.MAX_PAUSE_CHANCES : 2;
      state.pauseChancesRemaining = state.maxPauseChances;
      state.brakeCount = 0;
      state.activeSpeedFactor = 1.0;
      state.isBoosterActive = false;
      state.isBrakeActive = false;
      if (this._speedActionTimer) {
        clearTimeout(this._speedActionTimer);
        this._speedActionTimer = null;
      }
      document.body.classList.remove('kart-booster-fx-active', 'kart-brake-fx-active');
      if (window.UIManager && typeof window.UIManager.updateBoosterBrakeUI === 'function') {
        window.UIManager.updateBoosterBrakeUI(0, false, false);
      }
      state.combo = 0;
      state.speedMultiplier = typeof saveState.speedMultiplier === 'number' ? saveState.speedMultiplier : 1.0;
      state.obbySpeedMultiplier = typeof saveState.obbySpeedMultiplier === 'number' ? saveState.obbySpeedMultiplier : 1.2;
      state.speed = state.stageConfig.baseSpeed || 32.4;
      state.currentLane = 1;
      state.isPlaying = true;
      state.isPaused = false;
      state.isGameOver = false;
      state.isObbyMode = false;
      state.obbyWavesCleared = 0;
      state.stageMinigameMilestones = buildStageMinigameMilestones(state.stageConfig.questionsToBoss || 15);
      state.stageMinigameQueue = buildStageMinigameQueue(state.stage);
      state.stageMinigamesTriggered = 0;
      state.stageWrongQuestions = [];

      if (this._bossSpotlightTimer) {
        clearTimeout(this._bossSpotlightTimer);
        this._bossSpotlightTimer = null;
      }
      if (this._obbyWaveTimer) {
        clearTimeout(this._obbyWaveTimer);
        this._obbyWaveTimer = null;
      }
      this._clearBossFinisherClickPrompt();
      document.body.classList.remove('boss-attack-spotlight-active');

      if (window.QuestionEngine && typeof window.QuestionEngine.resetStageCounters === 'function') {
        window.QuestionEngine.resetStageCounters(state.stage || 1);
      }

      if (window.UIManager) {
        window.UIManager.setStartScreenVisible(false);
        window.UIManager.hideGameOverModal();
        window.UIManager.hideReviewModal();
        window.UIManager.setPauseModalVisible(false, state.pauseChancesRemaining, state.maxPauseChances);
        window.UIManager.hideBossHUD();
        if (typeof window.UIManager.hideObbyHUD === 'function') {
          window.UIManager.hideObbyHUD();
        }
        if (typeof window.UIManager.hideExitConfirmModal === 'function') {
          window.UIManager.hideExitConfirmModal();
        }
        if (typeof window.UIManager.hideBossRewardModal === 'function') {
          window.UIManager.hideBossRewardModal();
        }
        if (typeof window.UIManager.hideNextStageModal === 'function') {
          window.UIManager.hideNextStageModal();
        }
        window.UIManager.hideStageClearBanner();
        window.UIManager.updateActiveLane(1);
        if (typeof window.UIManager.pushRobloxChat === 'function') {
          window.UIManager.pushRobloxChat(
            '시스템',
            `👑 VIP 이소윤 님이 [${state.stageConfig.title}] 월드에 접속했습니다!`,
            'system'
          );
        }
      }

      if (window.Engine3D) {
        if (typeof window.Engine3D.setDemoMode === 'function') {
          window.Engine3D.setDemoMode(false);
        }
        window.Engine3D.clearActiveGates();
        if (typeof window.Engine3D.clearObbyObstacles === 'function') {
          window.Engine3D.clearObbyObstacles();
        }
        if (typeof window.Engine3D.clearHeavenStairs === 'function') {
          window.Engine3D.clearHeavenStairs();
        }
        window.Engine3D.hideBoss();
        window.Engine3D.setStageTheme(state.stageConfig);
        window.Engine3D.setSpeed(getEffectiveSpeed());
        window.Engine3D.setLane(1);
        window.Engine3D.start();
        window.Engine3D.setPaused(false);
      }

      if (window.SoundEngine) {
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        window.SoundEngine.startBGM(state.stage, false);
      }

      this.spawnNextQuestion();
      syncHUD();
      return this;
    },

    /**
     * Retries the current stage immediately after HP depletion without resetting stage or cumulative stats!
     */
    retryCurrentStage: function () {
      const saveState = window.SaveManager ? window.SaveManager.getState() : { currentStage: state.stage };
      const retryStage = Math.max(1, parseInt(state.stage || saveState.currentStage, 10) || 1);
      return this.startGame(retryStage);
    },

    /**
     * Generates the next question from QuestionEngine and spawns its 3-lane gate in Engine3D.
     */
    spawnNextQuestion: function () {
      const saveState = window.SaveManager ? window.SaveManager.getState() : { subjectMode: 'mixed' };
      const mode = saveState.subjectMode || 'mixed';

      const question = (window.QuestionEngine && typeof window.QuestionEngine.nextQuestion === 'function')
        ? window.QuestionEngine.nextQuestion(state.stage, mode)
        : {
            id: 'fallback_math_25_17',
            category: 'math',
            categoryLabel: '초등 수학 · 두 자리 덧셈',
            prompt: '🧮 25 + 17 = ?',
            subPrompt: '두 자리 연산의 정답 게이트로 차선을 변경하세요!',
            choices: ['32', '42', '52'],
            correctLane: 1,
            answerText: '42',
            isReview: false
          };

      state.currentQuestion = question;

      if (window.Engine3D && typeof window.Engine3D.spawnQuestionGate === 'function') {
        window.Engine3D.clearActiveGates();
        window.Engine3D.spawnQuestionGate(question);
      }

      if (window.UIManager) {
        window.UIManager.showQuestion(question, state.isBossPhase, state.currentLane);
        if (typeof window.UIManager.pushRobloxChat === 'function') {
          const pet = getActivePet();
          if (question.isSpeech) {
            window.UIManager.pushRobloxChat(
              pet.cheerTag || '유니콘펫',
              `🎙️ 소윤아! 마이크가 켜졌어! 레인 상관없이 영어로 "${(question.targetWord || '').toUpperCase()}" [${question.targetPron || ''}] 라고 크게 말하면 바로 통과야!`,
              'pet'
            );
          } else if (question.isReview) {
            window.UIManager.pushRobloxChat(
              pet.cheerTag || '유니콘펫',
              '🔥 소윤아! 아까 아쉽게 틀렸던 복습 문제야! 이번엔 꼭 부숴버리자!',
              'pet'
            );
          } else {
            window.UIManager.pushRobloxChat(
              pet.cheerTag || '유니콘펫',
              '소윤아 이번 문제 정답은 어디일까?! 블록 게이트로 돌진하자!',
              'pet'
            );
          }
        }
      }

      if (false && question && question.isSpeech) {
        startSpeechListening(question);
      } else {
        stopSpeechListening();
      }

      syncHUD();
      return question;
    },

    /**
     * Transitions the current stage into Boss Battle Phase when questionsToBoss is reached.
     * Boosts speed by 1.5x and activates dynamic Boss Battle mode!
     */
    enterBossPhase: function () {
      state.isBossPhase = true;
      state.bossMaxHp = (state.stageConfig && state.stageConfig.bossHp) ? state.stageConfig.bossHp : 9;
      state.bossCurrentHp = state.bossMaxHp;

      // Grant +1 bonus HP on reaching the Boss!
      state.hp = Math.min(state.maxHp, state.hp + 1);

      const isJackpotBoss = (state.stage % 10 === 0);

      if (window.SoundEngine) {
        window.SoundEngine.playBossWarning();
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        window.SoundEngine.startBGM(state.stage, true);
      }

      if (window.Engine3D) {
        window.Engine3D.setSpeed(getEffectiveSpeed());
        if (typeof window.Engine3D.spawnBoss === 'function') {
          window.Engine3D.spawnBoss(state.stageConfig);
        }
      }

      if (window.UIManager) {
        window.UIManager.showBossHUD(state.stageConfig, state.bossCurrentHp, state.bossMaxHp);
        const toastMsg = isJackpotBoss
          ? `💴🚨 [만원 상금 보스 출현!] 속도 1.5배 폭주! ${state.stage}판 보스를 물리치면 [상금 10,000원] + 상금 게이지 +10 획득!!`
          : `👾 경고! ${state.stageConfig.bossName} 출현! (속도 1.5배 배틀!) 문제를 풀어 폭탄(💣)·탄도미사일(🚀)·레이저(⚡)·물총(🔫)을 발사하자!`;
        window.UIManager.showFeedbackToast(true, toastMsg);
        if (typeof window.UIManager.pushRobloxChat === 'function') {
          window.UIManager.pushRobloxChat(
            '로블록스TV',
            isJackpotBoss
              ? `💴 대박 찬스!! ${state.stage}판째 [만원(10,000원) 상금 보스] 출현! 폭탄을 명중시켜 만원을 획득하세요!!`
              : `🚨 긴급속보! 보스 [${state.stageConfig.bossName}] 출현! 속도 1.5배 부스트 가동!!`,
            'tv'
          );
        }
      }

      syncHUD();
      this.spawnNextQuestion();
    },

    /**
     * Handles the player car passing through a 3-lane answer gate.
     * @param {number} selectedLane
     * @param {Object} questionData
     * @param {boolean} [isCorrectOverride]
     */
    handleGatePass: function (selectedLane, questionData, isCorrectOverride) {
      if (!state.isPlaying || state.isGameOver) return;
      stopSpeechListening();

      const lane = typeof selectedLane === 'number'
        ? selectedLane
        : (window.Engine3D ? window.Engine3D.getCurrentLane() : state.currentLane);

      const q = questionData || state.currentQuestion || (window.QuestionEngine ? window.QuestionEngine.getCurrentQuestion() : null);
      if (!q) return;

      const isCorrect = typeof isCorrectOverride === 'boolean'
        ? isCorrectOverride
        : (q.isSpeech ? Boolean(q.speechPassed) : (lane === q.correctLane));

      // Record answer & update cumulative SaveManager + wrongAnswerQueue
      const beforeSolved = (window.SaveManager && window.SaveManager.getState())
        ? window.SaveManager.getState().totalSolved
        : 0;
      const beforeCorrect = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().totalCorrect || 0)
        : 0;
      const beforeWrong = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().totalWrong || 0)
        : 0;
      const beforeBosses = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().bossesDefeated || 0)
        : 0;
      const beforeMaxStg = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().maxStageReached || 1)
        : 1;

      if (window.QuestionEngine && typeof window.QuestionEngine.recordResult === 'function') {
        window.QuestionEngine.recordResult(q, lane);
      }

      const afterSolved = (window.SaveManager && window.SaveManager.getState())
        ? window.SaveManager.getState().totalSolved
        : 0;

      if (afterSolved === beforeSolved && window.SaveManager && typeof window.SaveManager.recordAnswer === 'function') {
        const chosenText = (Array.isArray(q.choices) && q.choices[lane] !== undefined)
          ? q.choices[lane]
          : lane;
        window.SaveManager.recordAnswer(q, chosenText, isCorrect);
      }

      const afterCorrect = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().totalCorrect || 0)
        : beforeCorrect;
      const afterWrong = (window.SaveManager && window.SaveManager.getState())
        ? (window.SaveManager.getState().totalWrong || 0)
        : beforeWrong;

      if (isCorrect) {
        state.combo += 1;

        // Increase speed gently, strictly capped at 2.5x of Stage 1 speed (90)
        const speedInc = (window.GameConfig && window.GameConfig.SPEED_INCREMENT_PER_CORRECT)
          ? window.GameConfig.SPEED_INCREMENT_PER_CORRECT
          : 0.15;
        const maxSpeedCap = (window.GameConfig && window.GameConfig.MAX_SPEED_CAP)
          ? window.GameConfig.MAX_SPEED_CAP
          : 90;
        state.speed = Math.min(maxSpeedCap, state.speed + speedInc);

        if (window.Engine3D) {
          window.Engine3D.setSpeed(getEffectiveSpeed());
        }
        if (window.SoundEngine) {
          window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        }

        // Calculate score earned
        const basePts = (window.GameConfig && window.GameConfig.SCORE_PER_CORRECT) ? window.GameConfig.SCORE_PER_CORRECT : 100;
        const comboBonus = Math.min(10, state.combo - 1) * ((window.GameConfig && window.GameConfig.SCORE_COMBO_BONUS) ? window.GameConfig.SCORE_COMBO_BONUS : 25);
        const reviewBonus = q.isReview ? ((window.GameConfig && window.GameConfig.SCORE_REVIEW_BONUS) ? window.GameConfig.SCORE_REVIEW_BONUS : 60) : 0;
        const bossHitBonus = state.isBossPhase ? 50 : 0;
        const pointsEarned = basePts + comboBonus + reviewBonus + bossHitBonus;

        const prevPet = getActivePet();
        if (window.SaveManager) {
          window.SaveManager.addScore(pointsEarned, state.speed);
        }
        const newPet = getActivePet();

        // Check if Soyun unlocked a new Roblox Pet!
        if (newPet && prevPet && newPet.level > prevPet.level && window.UIManager && typeof window.UIManager.pushRobloxChat === 'function') {
          window.UIManager.pushRobloxChat(
            '시스템',
            `🎉 축하합니다 이소윤 님! 새로운 펫 [${newPet.name}] 진화 완료!!`,
            'system'
          );
        }

        // Check if Soyun achieved a Real-Life Reward Gauge Milestone (용돈 3,000원 or 애슐리)!
        if (window.GameConfig && typeof window.GameConfig.getRewardStatus === 'function') {
          const prevRew = window.GameConfig.getRewardStatus(beforeCorrect, beforeBosses, beforeMaxStg, beforeWrong);
          const nextRew = window.GameConfig.getRewardStatus(afterCorrect, beforeBosses, beforeMaxStg, afterWrong);
          const curSave = window.SaveManager ? window.SaveManager.getState() : {};
          const pocketLabel = (nextRew.pocketMoney && nextRew.pocketMoney.displayName) || curSave.bonusNamePocket || '용돈 3,000원';
          const ashleyLabel = curSave.bonusNameAshley || '애슐리 외식 상품권';
          if (nextRew.pocketMoney.earnedCount > prevRew.pocketMoney.earnedCount) {
            if (window.SoundEngine) window.SoundEngine.playStageClear();
            if (window.UIManager) {
              window.UIManager.triggerImpactEffect('stageClear', { points: 3000, combo: state.combo });
              window.UIManager.showFeedbackToast(
                true,
                `💵🎊 대박!! 이소윤 선수 [${pocketLabel}] 게이지 100% 달성!! (${nextRew.pocketMoney.earnedCount}회째 달성!)`
              );
              if (typeof window.UIManager.pushRobloxChat === 'function') {
                window.UIManager.pushRobloxChat(
                  '시스템',
                  `💵🎊 축하합니다!! 이소윤 선수 [${pocketLabel}] 상품 게이지 100% 달성!!`,
                  'system'
                );
              }
            }
          }
          if (nextRew.ashley.earnedCount > prevRew.ashley.earnedCount) {
            if (window.SoundEngine) window.SoundEngine.playStageClear();
            if (window.UIManager) {
              window.UIManager.triggerImpactEffect('stageClear', { points: 10000, combo: state.combo });
              window.UIManager.showFeedbackToast(
                true,
                `🍓🏆 전설 달성!! 이소윤 선수 [${ashleyLabel}] 100% 달성!!`
              );
              if (typeof window.UIManager.pushRobloxChat === 'function') {
                window.UIManager.pushRobloxChat(
                  '시스템',
                  `🍓🏆 대박!! 이소윤 선수 [${ashleyLabel}] 게이지 100% 달성!!`,
                  'system'
                );
              }
            }
          }
        }

        if (state.isBossPhase) {
          // Boss Battle Phase: Launch Multi-Weapon Attack (Ballistic Missile / Water Gun / Mega Laser / Round Bomb / Meteor) at Boss & reduce Boss HP
          state.bossCurrentHp = Math.max(0, state.bossCurrentHp - 1);
          const hpRatio = state.bossCurrentHp / Math.max(1, state.bossMaxHp);

          if (window.Engine3D) {
            window.Engine3D.damageBoss(hpRatio);
          }

          const atkInfo = (window.Engine3D && window.Engine3D.lastBossAttackInfo)
            ? window.Engine3D.lastBossAttackInfo
            : {
                type: 'round_bomb',
                icon: '💣💥',
                badgeTitle: '💣 특대형 동그란 폭탄 보스 명중!! BOOM!!',
                badgeSub: '🔥 초대형 화염 폭탄 대폭발!!',
                toastTitle: '💣💥 특대형 동그란 슈퍼 폭탄 투하 & 보스 명중!! BOOM!!',
                tvMsg: '💣 BOOM!! 이소윤 선수의 특대형 동그란 슈퍼 폭탄이 보스에게 정확히 박혔습니다!!'
              };

          if (window.SoundEngine) {
            window.SoundEngine.playLaserShot(atkInfo.type);
            window.SoundEngine.playBossHit(atkInfo.type);
          }
          if (window.UIManager) {
            window.UIManager.updateBossHUD(state.bossCurrentHp, state.bossMaxHp);
            if (typeof window.UIManager.triggerImpactEffect === 'function') {
              window.UIManager.triggerImpactEffect('boss', {
                points: pointsEarned,
                combo: state.combo,
                attackInfo: atkInfo
              });
            }
          }

          if (state.bossCurrentHp <= 0) {
            if (this._bossSpotlightTimer) {
              clearTimeout(this._bossSpotlightTimer);
              this._bossSpotlightTimer = null;
            }
            this._clearBossFinisherClickPrompt();
            // 8-Second Slow-Motion Ultimate Firepower Boss Finisher Animation!
            // Hide question banner, unleash an 8-second slow-motion all-weapons barrage
            // (Missiles, Water Gun, Mega Laser, Round Bomb, Meteor), and then wait for 1 click/tap to proceed!
            document.body.classList.add('boss-attack-spotlight-active');
            if (window.Engine3D) {
              window.Engine3D.clearActiveGates();
              window.Engine3D.setSpeed(getEffectiveSpeed() * 1.25);
              if (typeof window.Engine3D.triggerBossFinisherBarrage === 'function') {
                window.Engine3D.triggerBossFinisherBarrage();
              }
            }
            if (window.UIManager && typeof window.UIManager.pushRobloxChat === 'function') {
              window.UIManager.pushRobloxChat(
                '로블록스TV',
                '🚨💥 [8초 슬로우모션 초필살 전탄 발사!!] 이소윤 선수의 모든 특수무기(🚀탄도미사일·🔫물총·⚡레이저·💣폭탄·☄️메테오)가 보스를 집중 폭격합니다!!',
                'tv'
              );
            }
            syncHUD();

            const self = this;
            this._bossSpotlightTimer = setTimeout(function () {
              self._bossSpotlightTimer = null;
              if (!state.isPlaying || state.isGameOver) {
                document.body.classList.remove('boss-attack-spotlight-active');
                return;
              }
              self._showBossFinisherClickPrompt(pointsEarned);
            }, 8000);
            return;
          } else {
            if (window.UIManager && typeof window.UIManager.pushRobloxChat === 'function') {
              window.UIManager.pushRobloxChat(
                '로블록스TV',
                atkInfo.tvMsg,
                'tv'
              );
            }
            syncHUD();

            // Boss Attack Spotlight Interval:
            // Keep the car racing at high speed while increasing the distance/interval before the next question gate spawns,
            // and temporarily hide the question banner so the Boss getting blasted by special weapons is 100% spotlighted!
            if (this._bossSpotlightTimer) {
              clearTimeout(this._bossSpotlightTimer);
              this._bossSpotlightTimer = null;
            }
            document.body.classList.add('boss-attack-spotlight-active');
            if (window.Engine3D) {
              window.Engine3D.setSpeed(getEffectiveSpeed() * 1.18);
            }
            const self = this;
            this._bossSpotlightTimer = setTimeout(function () {
              self._bossSpotlightTimer = null;
              document.body.classList.remove('boss-attack-spotlight-active');
              if (!state.isPlaying || state.isGameOver || !state.isBossPhase) return;
              if (window.Engine3D) {
                window.Engine3D.setSpeed(getEffectiveSpeed());
              }
              self.spawnNextQuestion();
            }, 1300);
          }
        } else {
          // Normal Stage Question Phase
          if (window.SoundEngine) {
            window.SoundEngine.playCorrect(state.combo);
          }

          state.stageProgress += 1;
          if (window.SaveManager && typeof window.SaveManager.setStageProgress === 'function') {
            window.SaveManager.setStageProgress(state.stageProgress);
          }

          const reviewTag = q.isReview ? ' [복습 마스터 완료!]' : '';
          const correctCheers = [
            `💥 우와! 이소윤 천재!! 블록 격파 성공! (+${pointsEarned} R$ 획득!)${reviewTag}`,
            `⚡ 소윤이 나이스!! 연속 ${state.combo}콤보 폭주 중! (+${pointsEarned} R$)${reviewTag}`,
            `🦄 소윤이와 큐브펫의 합동 필살기 발사!! (+${pointsEarned} R$)${reviewTag}`
          ];
          const chosenCheer = state.combo >= 2
            ? correctCheers[state.combo % correctCheers.length]
            : correctCheers[0];

          if (window.UIManager) {
            if (typeof window.UIManager.triggerImpactEffect === 'function') {
              window.UIManager.triggerImpactEffect('correct', { points: pointsEarned, combo: state.combo });
            }
            window.UIManager.showFeedbackToast(true, chosenCheer);
            if (typeof window.UIManager.pushRobloxChat === 'function') {
              window.UIManager.pushRobloxChat(
                '로블록스TV',
                `대박! 이소윤 선수 연속 정답으로 블럭 게이트 박살!! (+${pointsEarned} R$)`,
                'tv'
              );
            }
          }

          const questionsToBoss = (state.stageConfig && state.stageConfig.questionsToBoss)
            ? state.stageConfig.questionsToBoss
            : 15;

          const milestones = Array.isArray(state.stageMinigameMilestones)
            ? state.stageMinigameMilestones
            : buildStageMinigameMilestones(questionsToBoss);

          if (state.stageProgress >= questionsToBoss) {
            this.enterBossPhase();
          } else if (
            state.stageProgress > 0 &&
            (state.stageMinigamesTriggered || 0) < 3 &&
            milestones.indexOf(state.stageProgress) !== -1
          ) {
            // Strictly 3 times per stage, launching a DIFFERENT mini-game each time!
            state.stageMinigamesTriggered = (state.stageMinigamesTriggered || 0) + 1;
            const nextMinigameType = (Array.isArray(state.stageMinigameQueue) && state.stageMinigameQueue.length > 0)
              ? state.stageMinigameQueue.shift()
              : 'heaven_stairs';
            syncHUD();
            this.startObbyMinigame(nextMinigameType);
          } else {
            syncHUD();
            this.spawnNextQuestion();
          }
        }
      } else {
        // WRONG Answer
        state.combo = 0;
        state.hp = Math.max(0, state.hp - 1);

        // Record this failed question in state.stageWrongQuestions (answers stay hidden until [👀 답 보기] is clicked!)
        const wrongChosenText = (Array.isArray(q.choices) && q.choices[lane] !== undefined)
          ? q.choices[lane]
          : (q.isSpeech ? '발음 미통과' : '오답');
        if (!Array.isArray(state.stageWrongQuestions)) {
          state.stageWrongQuestions = [];
        }
        const qKey = q.id || q.prompt;
        const existingIdx = state.stageWrongQuestions.findIndex(function (item) {
          return (item.id || item.prompt) === qKey;
        });
        const wrongEntry = {
          id: qKey,
          prompt: q.prompt,
          category: q.category || 'math',
          answerText: q.answerText,
          wrongChoice: wrongChosenText
        };
        if (existingIdx >= 0) {
          state.stageWrongQuestions[existingIdx] = wrongEntry;
        } else {
          state.stageWrongQuestions.push(wrongEntry);
        }

        if (window.SoundEngine) {
          window.SoundEngine.playWrong();
        }
        if (window.UIManager) {
          window.UIManager.triggerDamageFlash();
          if (typeof window.UIManager.triggerImpactEffect === 'function') {
            window.UIManager.triggerImpactEffect('wrong', { combo: 0 });
          }
          window.UIManager.showFeedbackToast(
            false,
            `💪 아차! 오답으로 보너스 점수 -1점! 이따 문제 리스트에서 정답을 맞혀보고 [👀 답 보기]로 확인해 보자!`
          );
          if (typeof window.UIManager.pushRobloxChat === 'function') {
            const pet = getActivePet();
            window.UIManager.pushRobloxChat(
              pet.cheerTag || '유니콘펫',
              `괜찮아 소윤아! 틀린 문제는 이따 오답 리스트에서 다시 풀고 [👀 답 보기]로 확인할 수 있어!`,
              'pet'
            );
          }
        }

        syncHUD();

        if (state.hp <= 0) {
          this.handleGameOver();
        } else {
          this.spawnNextQuestion();
        }
      }
    },

    /**
     * Removes any active post-5s Boss finisher click-to-continue prompt & listeners.
     */
    _clearBossFinisherClickPrompt: function () {
      if (this._bossFinisherClickCleanup) {
        try {
          this._bossFinisherClickCleanup();
        } catch (_e) {}
        this._bossFinisherClickCleanup = null;
      }
      if (window.Engine3D && typeof window.Engine3D.stopVictoryCruise === 'function') {
        window.Engine3D.stopVictoryCruise();
      }
      const existing = document.getElementById('boss-finisher-click-prompt');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
    },

    /**
     * Shows a full-screen clickable prompt after the 5-second slow-motion Boss finisher animation
     * while playing a calm, peaceful Victory Cruise animation until the player clicks once!
     */
    _showBossFinisherClickPrompt: function (pointsEarned) {
      this._clearBossFinisherClickPrompt();
      const self = this;

      // Transition 3D scene & BGM into a calm, gentle victory cruise until the player clicks!
      if (window.Engine3D && typeof window.Engine3D.startGentleVictoryCruise === 'function') {
        window.Engine3D.startGentleVictoryCruise();
      }
      if (window.SoundEngine) {
        window.SoundEngine.setSpeedTempo(26);
        window.SoundEngine.startBGM(state.stage, false);
      }

      const overlay = document.createElement('div');
      overlay.id = 'boss-finisher-click-prompt';
      overlay.className = 'boss-finisher-click-prompt';
      overlay.innerHTML =
        '<div class="boss-finisher-click-pill">' +
          '<span class="boss-finisher-click-icon">🎬💥</span>' +
          '<span class="boss-finisher-click-text">보스 격파 완료! <strong>화면을 한 번 클릭(터치)</strong>하면 넘어갑니다!</span>' +
          '<span class="boss-finisher-click-arrow">👆 클릭!</span>' +
        '</div>';
      document.body.appendChild(overlay);

      let triggered = false;
      function onProceed(ev) {
        if (triggered) return;
        if (ev && typeof ev.preventDefault === 'function' && ev.type === 'keydown') {
          if (ev.key !== 'Enter' && ev.key !== ' ') return;
          ev.preventDefault();
        }
        triggered = true;
        self._clearBossFinisherClickPrompt();
        document.body.classList.remove('boss-attack-spotlight-active');
        if (window.SoundEngine && typeof window.SoundEngine.playClick === 'function') {
          window.SoundEngine.playClick();
        }
        if (!state.isPlaying || state.isGameOver) return;
        self.handleBossDefeated(pointsEarned);
      }

      // Small 120ms guard so an accidental tap at 4.99s doesn't skip before the prompt is seen
      const bindTimer = setTimeout(function () {
        overlay.addEventListener('pointerdown', onProceed, { once: true });
        overlay.addEventListener('click', onProceed, { once: true });
        window.addEventListener('keydown', onProceed);
      }, 120);

      this._bossFinisherClickCleanup = function () {
        clearTimeout(bindTimer);
        overlay.removeEventListener('pointerdown', onProceed);
        overlay.removeEventListener('click', onProceed);
        window.removeEventListener('keydown', onProceed);
      };
    },

    /**
     * Handles Boss defeat:
     * - Advances cumulative stage in SaveManager (+1 bossesDefeated = +10 Reward Gauge Bonus!)
     * - Awards 10,000원 (만원) Jackpot Prize on every 10th Stage Boss!
     * - Recovers +2 HP up to MAX_HP (3), restores normal stage speed, and transitions to next stage.
     * @param {number} [lastShotPoints]
     */
    handleBossDefeated: function (lastShotPoints) {
      this._clearBossFinisherClickPrompt();
      document.body.classList.remove('boss-attack-spotlight-active');
      const clearedStage = state.stage;
      const isTenStageJackpot = (clearedStage % 10 === 0);
      const bossClearBonus = (window.GameConfig && window.GameConfig.SCORE_BOSS_CLEAR)
        ? window.GameConfig.SCORE_BOSS_CLEAR
        : 500;

      const beforeSave = window.SaveManager ? window.SaveManager.getState() : {};
      const beforeCorrect = beforeSave.totalCorrect || 0;
      const beforeWrong = beforeSave.totalWrong || 0;
      const beforeBosses = beforeSave.bossesDefeated || 0;
      const beforeMaxStg = beforeSave.maxStageReached || 1;

      if (window.SaveManager) {
        window.SaveManager.addScore(bossClearBonus, state.speed);
      }

      // Immediately advance and persist currentStage + 1 & bossesDefeated + 1 in SaveManager!
      const nextStage = (window.SaveManager && typeof window.SaveManager.advanceStage === 'function')
        ? window.SaveManager.advanceStage()
        : (clearedStage + 1);

      const afterSave = window.SaveManager ? window.SaveManager.getState() : {};
      const afterBosses = afterSave.bossesDefeated || (beforeBosses + 1);
      const afterMaxStg = afterSave.maxStageReached || nextStage;

      // Check if the +10 Boss Defeat Gauge Bonus triggered a Reward Milestone (3,000원 / 애슐리 / 10판 보스 만원)!
      if (window.GameConfig && typeof window.GameConfig.getRewardStatus === 'function') {
        const prevRew = window.GameConfig.getRewardStatus(beforeCorrect, beforeBosses, beforeMaxStg, beforeWrong);
        const nextRew = window.GameConfig.getRewardStatus(beforeCorrect, afterBosses, afterMaxStg, beforeWrong);
        const pocketLabel = (nextRew.pocketMoney && nextRew.pocketMoney.displayName) || afterSave.bonusNamePocket || '용돈 3,000원';
        const ashleyLabel = afterSave.bonusNameAshley || '애슐리 외식 상품권';

        if (nextRew.pocketMoney.earnedCount > prevRew.pocketMoney.earnedCount && window.UIManager) {
          window.UIManager.pushRobloxChat(
            '시스템',
            `💵🎊 보스 격파 +10 게이지 보너스로 [${pocketLabel}] 상품 게이지 100% 달성!! (${nextRew.pocketMoney.earnedCount}회째!)`,
            'system'
          );
        }
        if (nextRew.ashley.earnedCount > prevRew.ashley.earnedCount && window.UIManager) {
          window.UIManager.pushRobloxChat(
            '시스템',
            `🍓🏆 보스 격파 +10 게이지 보너스로 [${ashleyLabel}] 게이지 100% 달성!!`,
            'system'
          );
        }
      }

      const nextStageCfg = getStageCfg(nextStage);

      // Recover +2 HP up to MAX_HP (5) & recharge 2 pause chances for the new stage!
      state.hp = Math.min(state.maxHp, state.hp + 2);
      state.pauseChancesRemaining = state.maxPauseChances || 2;

      // Transition state to next stage immediately so state & HUD reflect the new stage
      state.stage = nextStage;
      state.selectedDashboardStage = nextStage;
      state.stageConfig = nextStageCfg;
      state.stageProgress = 0;
      state.stageMinigameMilestones = buildStageMinigameMilestones(nextStageCfg.questionsToBoss || 15);
      state.stageMinigameQueue = buildStageMinigameQueue(nextStage);
      state.stageMinigamesTriggered = 0;
      state.isBossPhase = false;
      state.bossMaxHp = nextStageCfg.bossHp || 12;
      state.bossCurrentHp = state.bossMaxHp;

      const stageSpeedBonus = (window.GameConfig && window.GameConfig.SPEED_STAGE_BONUS)
        ? window.GameConfig.SPEED_STAGE_BONUS
        : 3.0;
      const maxSpeedCap = (window.GameConfig && window.GameConfig.MAX_SPEED_CAP)
        ? window.GameConfig.MAX_SPEED_CAP
        : 90;
      state.speed = Math.min(maxSpeedCap, Math.max(state.speed + stageSpeedBonus, nextStageCfg.baseSpeed || 35.1));

      if (window.QuestionEngine && typeof window.QuestionEngine.resetStageCounters === 'function') {
        window.QuestionEngine.resetStageCounters(nextStage);
      }

      stopSpeechListening();

      if (window.SoundEngine) {
        window.SoundEngine.playBossDefeat();
        window.SoundEngine.playStageClear();
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
      }

      if (window.Engine3D) {
        window.Engine3D.triggerStageClearEffect();
        window.Engine3D.defeatBoss();
        window.Engine3D.clearActiveGates();
        window.Engine3D.setStageTheme(nextStageCfg);
        window.Engine3D.setSpeed(getEffectiveSpeed());
        window.Engine3D.setPaused(true);
      }

      if (window.UIManager) {
        window.UIManager.hideBossHUD();
        if (typeof window.UIManager.triggerImpactEffect === 'function') {
          window.UIManager.triggerImpactEffect('stageClear', {
            points: isTenStageJackpot ? 10000 : bossClearBonus,
            combo: state.combo,
            isJackpot: isTenStageJackpot
          });
        }
        const jpName = (window.SaveManager && window.SaveManager.getState().bonusNameJackpot) || '10판 보스 만원 상금';
        const clearToast = isTenStageJackpot
          ? `💴🎊 대박!! ${clearedStage}판째 보스 격파!! [${jpName}] 보너스 달성 + 상금 게이지 +10 상승!!`
          : `🏆 보스 격파 성공!! 상금 게이지 +10 대폭 상승! STAGE ${nextStage} 월드로 승급! (+${bossClearBonus} R$)`;
        window.UIManager.showFeedbackToast(true, clearToast);
        if (typeof window.UIManager.pushRobloxChat === 'function') {
          window.UIManager.pushRobloxChat(
            '시스템',
            isTenStageJackpot
              ? `💴🎊 축하합니다!! 이소윤 선수 ${clearedStage}판째 보스 클리어! [${jpName}] 보너스 달성 및 상금 게이지 +10 상승!!`
              : `🏆 대박!! 보스 격파 보상으로 [상금 게이지 +10] 상승! 다음 월드(STAGE ${nextStage})로 승급했어요!`,
            'system'
          );
        }
        if (typeof window.UIManager.showBossRewardModal === 'function') {
          window.UIManager.showBossRewardModal(clearedStage, afterSave, state.stageWrongQuestions);
        }
      }

      syncHUD();
    },

    /**
     * Opens the Sky-Ascending World Tree Map Popup (#next-stage-modal in 'start' mode) BEFORE starting the game
     * so Soyun can see which world/country each stage is and her current climbing position!
     */
    openPreStartTreeMap: function (stageOverride) {
      if (!state.initialized) {
        this.init();
      }
      if (window.SoundEngine) {
        window.SoundEngine.init();
        window.SoundEngine.playClick();
      }
      const saveState = window.SaveManager ? window.SaveManager.getState() : { currentStage: 1, maxStageReached: 1 };
      const targetStage = Math.max(
        1,
        parseInt(stageOverride !== undefined ? stageOverride : (state.selectedDashboardStage || saveState.currentStage), 10) || 1
      );
      state.selectedDashboardStage = targetStage;
      const targetCfg = getStageCfg(targetStage);

      if (window.Engine3D && typeof window.Engine3D.setStageTheme === 'function') {
        window.Engine3D.setStageTheme(targetCfg);
      }

      if (window.UIManager && typeof window.UIManager.showNextStageModal === 'function') {
        window.UIManager.showNextStageModal(targetStage, targetCfg, {
          mode: 'start',
          maxStageReached: Math.max(targetStage, parseInt(saveState.maxStageReached || saveState.currentStage, 10) || 1)
        });
      }
      return this;
    },

    /**
     * Step 1 -> Step 2 on Boss Clear:
     * Clicking the Center Reward Status Popup (#boss-reward-modal) hides it and opens the Sky-Ascending World Tree Map Popup (#next-stage-modal).
     */
    onBossRewardModalClick: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager) {
        if (typeof window.UIManager.hideBossRewardModal === 'function') {
          window.UIManager.hideBossRewardModal();
        }
        if (typeof window.UIManager.showNextStageModal === 'function') {
          const saveState = window.SaveManager ? window.SaveManager.getState() : {};
          window.UIManager.showNextStageModal(state.stage, state.stageConfig, {
            mode: 'next_stage',
            clearedStage: Math.max(1, state.stage - 1),
            maxStageReached: Math.max(state.stage, parseInt(saveState.maxStageReached, 10) || state.stage)
          });
        }
      }
    },

    /**
     * Confirms starting the stage from the Sky-Ascending World Tree Map Popup (#next-stage-modal):
     * - If opened before game start (mode === 'start'), calls startGame(targetStage).
     * - If opened on Boss Clear (mode === 'next_stage'), resumes 3D engine and starts the new stage.
     */
    confirmNextStageStart: function () {
      const modal = document.getElementById('next-stage-modal');
      const mode = modal ? modal.getAttribute('data-treemap-mode') : 'next_stage';
      const targetAttr = modal ? parseInt(modal.getAttribute('data-target-stage'), 10) : NaN;

      if (mode === 'start') {
        const startStg = !isNaN(targetAttr) && targetAttr >= 1 ? targetAttr : state.selectedDashboardStage;
        return this.startGame(startStg);
      }

      if (window.SoundEngine) {
        window.SoundEngine.playClick();
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        window.SoundEngine.startBGM(state.stage, false);
      }
      if (window.UIManager && typeof window.UIManager.hideNextStageModal === 'function') {
        window.UIManager.hideNextStageModal();
      }
      state.stageWrongQuestions = [];
      if (window.Engine3D) {
        window.Engine3D.setPaused(false);
      }
      syncHUD();
      this.spawnNextQuestion();
    },

    /**
     * Opens the Confirm Exit Popup (#exit-confirm-modal) when user clicks the top-right [✕ 닫기] button.
     */
    openExitConfirmModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      stopSpeechListening();
      if (window.Engine3D) {
        window.Engine3D.setPaused(true);
      }
      if (window.UIManager && typeof window.UIManager.showExitConfirmModal === 'function') {
        window.UIManager.showExitConfirmModal();
      }
    },

    /**
     * Cancels Exit and resumes gameplay when user clicks [아니오, 계속 달리기].
     */
    cancelExitConfirmModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager && typeof window.UIManager.hideExitConfirmModal === 'function') {
        window.UIManager.hideExitConfirmModal();
      }
      if (state.isPlaying && !state.isGameOver && !state.isPaused) {
        if (window.Engine3D) {
          window.Engine3D.setPaused(false);
        }
        if (state.currentQuestion && state.currentQuestion.isSpeech && !state.currentQuestion.speechPassed) {
          startSpeechListening(state.currentQuestion);
        }
      }
    },

    /**
     * Handles HP reaching 0.
     * NEVER resets currentStage to 1! Preserves all cumulative records and offers instant stage retry.
     */
    handleGameOver: function () {
      state.isPlaying = false;
      state.isGameOver = true;
      if (this._bossSpotlightTimer) {
        clearTimeout(this._bossSpotlightTimer);
        this._bossSpotlightTimer = null;
      }
      document.body.classList.remove('boss-attack-spotlight-active');

      if (window.Engine3D) {
        window.Engine3D.setPaused(true);
        window.Engine3D.clearActiveGates();
      }

      if (window.SoundEngine) {
        window.SoundEngine.stopBGM();
        window.SoundEngine.playGameOver();
      }

      // Ensure currentStage in SaveManager remains at state.stage (never reset to 1!)
      const saveState = window.SaveManager ? window.SaveManager.getState() : { currentStage: state.stage };
      if (window.SaveManager && saveState.currentStage < state.stage) {
        window.SaveManager.setStage(state.stage);
      }

      if (window.UIManager) {
        window.UIManager.showGameOverModal(
          window.SaveManager ? window.SaveManager.getState() : saveState,
          state.stage,
          state.stageWrongQuestions
        );
      }
    },

    /**
     * Selects a lane (0 = Left, 1 = Center, 2 = Right)
     * @param {number} laneIndex
     */
    selectLane: function (laneIndex) {
      const clamped = Math.max(0, Math.min(2, Math.round(Number(laneIndex) || 0)));
      if (clamped !== state.currentLane && window.SoundEngine) {
        window.SoundEngine.playLaneSwitch();
      }
      state.currentLane = clamped;
      if (window.Engine3D) {
        window.Engine3D.setLane(clamped);
      }
      if (window.UIManager) {
        window.UIManager.updateActiveLane(clamped);
      }
      return state.currentLane;
    },

    moveLeft: function () {
      return this.selectLane(state.currentLane - 1);
    },

    moveRight: function () {
      return this.selectLane(state.currentLane + 1);
    },

    /**
     * Right Action Button (#btn-jump-action ⬆️):
     * - In 'heaven_stairs': Climbs 1 step forward in Soyun's current facing direction!
     * - In 'laser_jump' / 'obby_rush' / Normal: Jumps over low laser bars & hurdles!
     */
    triggerJump: function () {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return false;
      if (window.Engine3D && typeof window.Engine3D.jump === 'function') {
        const jumped = window.Engine3D.jump();
        if (jumped && window.SoundEngine && !(state.isObbyMode && state.obbyGameType === 'heaven_stairs')) {
          if (typeof window.SoundEngine.playJump === 'function') {
            window.SoundEngine.playJump();
          } else {
            window.SoundEngine.playLaneSwitch();
          }
        }
        return jumped;
      }
      return false;
    },

    /**
     * Left Action Button (#btn-turn-jump-action 🔄):
     * - In 'heaven_stairs': Flips Soyun's facing direction (-1 <-> +1) AND climbs 1 step!
     * - In 'laser_jump' / 'obby_rush' / Normal: Triggers a high 360° Spin 2-Stage Super Jump!
     */
    triggerTurnJump: function () {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return false;
      if (window.Engine3D) {
        if (typeof window.Engine3D.superJump === 'function') {
          const jumped = window.Engine3D.superJump();
          if (jumped && window.SoundEngine && !(state.isObbyMode && state.obbyGameType === 'heaven_stairs')) {
            if (typeof window.SoundEngine.playJump === 'function') {
              window.SoundEngine.playJump();
            } else {
              window.SoundEngine.playLaneSwitch();
            }
          }
          return jumped;
        }
      }
      return false;
    },

    /**
     * 🚀 KartRider Booster Button (#btn-booster-action, left of Jump/Climb button):
     * - Speeds up to 2.0x for 2.0 seconds!
     * - Grants +1 Brake charge (state.brakeCount += 1)!
     * - Triggers KartRider high-speed animation & nitro effects!
     */
    triggerBooster: function () {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return false;
      const self = this;

      state.brakeCount = (state.brakeCount || 0) + 1;
      state.isBoosterActive = true;
      state.isBrakeActive = false;
      state.activeSpeedFactor = 2.0;

      if (this._speedActionTimer) {
        clearTimeout(this._speedActionTimer);
        this._speedActionTimer = null;
      }

      document.body.classList.remove('kart-brake-fx-active');
      document.body.classList.add('kart-booster-fx-active');

      if (window.SoundEngine) {
        if (typeof window.SoundEngine.playBooster === 'function') {
          window.SoundEngine.playBooster();
        } else {
          window.SoundEngine.playCorrect(3);
        }
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
      }

      if (window.Engine3D) {
        window.Engine3D.setSpeed(getEffectiveSpeed());
        if (typeof window.Engine3D.triggerKartBooster === 'function') {
          window.Engine3D.triggerKartBooster(2.0);
        }
      }

      if (window.UIManager) {
        if (typeof window.UIManager.updateBoosterBrakeUI === 'function') {
          window.UIManager.updateBoosterBrakeUI(state.brakeCount, true, false);
        }
        window.UIManager.showFeedbackToast(
          true,
          `🚀💨 [카트라이더 부스터 발동!!] 2초간 속도 2.0배 폭주! (+🛑 브레이크 1회 충전 ➔ 총 ${state.brakeCount}회)`
        );
      }

      syncHUD();

      this._speedActionTimer = setTimeout(function () {
        self._speedActionTimer = null;
        state.isBoosterActive = false;
        state.activeSpeedFactor = 1.0;
        document.body.classList.remove('kart-booster-fx-active');
        if (window.Engine3D) {
          window.Engine3D.setSpeed(getEffectiveSpeed());
        }
        if (window.SoundEngine) {
          window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        }
        if (window.UIManager && typeof window.UIManager.updateBoosterBrakeUI === 'function') {
          window.UIManager.updateBoosterBrakeUI(state.brakeCount, false, false);
        }
        syncHUD();
      }, 2000);

      return true;
    },

    /**
     * 🛑 Sudden Hard-Brake Button (#btn-brake-action, right of Turn-Jump button):
     * - Starts at 0 charges; each Booster use adds +1 charge!
     * - When pressed (if brakeCount > 0), slows speed to 0.5x for 2.0 seconds with sudden stop animation!
     */
    triggerBrake: function () {
      if (!state.isPlaying || state.isGameOver || state.isPaused) return false;
      const self = this;

      if ((state.brakeCount || 0) <= 0) {
        if (window.SoundEngine) {
          window.SoundEngine.playClick();
        }
        if (window.UIManager) {
          window.UIManager.showFeedbackToast(
            false,
            '🛑 브레이크 횟수가 0회예요! 우측 [🚀 부스터]를 쓰면 브레이크가 1회씩 올라갑니다!'
          );
        }
        return false;
      }

      state.brakeCount = Math.max(0, state.brakeCount - 1);
      state.isBrakeActive = true;
      state.isBoosterActive = false;
      state.activeSpeedFactor = 0.5;

      if (this._speedActionTimer) {
        clearTimeout(this._speedActionTimer);
        this._speedActionTimer = null;
      }

      document.body.classList.remove('kart-booster-fx-active');
      document.body.classList.add('kart-brake-fx-active');

      if (window.SoundEngine) {
        if (typeof window.SoundEngine.playBrake === 'function') {
          window.SoundEngine.playBrake();
        } else {
          window.SoundEngine.playClick();
        }
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
      }

      if (window.Engine3D) {
        window.Engine3D.setSpeed(getEffectiveSpeed());
        if (typeof window.Engine3D.triggerKartBrake === 'function') {
          window.Engine3D.triggerKartBrake(2.0);
        }
      }

      if (window.UIManager) {
        if (typeof window.UIManager.updateBoosterBrakeUI === 'function') {
          window.UIManager.updateBoosterBrakeUI(state.brakeCount, false, true);
        }
        window.UIManager.showFeedbackToast(
          true,
          `🛑💨 끼이익!! [급브레이크 작동!] 2초간 속도가 0.5배로 느려집니다! (남은 브레이크: ${state.brakeCount}회)`
        );
      }

      syncHUD();

      this._speedActionTimer = setTimeout(function () {
        self._speedActionTimer = null;
        state.isBrakeActive = false;
        state.activeSpeedFactor = 1.0;
        document.body.classList.remove('kart-brake-fx-active');
        if (window.Engine3D) {
          window.Engine3D.setSpeed(getEffectiveSpeed());
        }
        if (window.SoundEngine) {
          window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        }
        if (window.UIManager && typeof window.UIManager.updateBoosterBrakeUI === 'function') {
          window.UIManager.updateBoosterBrakeUI(state.brakeCount, false, false);
        }
        syncHUD();
      }, 2000);

      return true;
    },

    /**
     * Selects one of the 10 Characters / Vehicles and updates the 3D scene immediately!
     * @param {string} vehicleId
     */
    selectVehicle: function (vehicleId) {
      const vObj = (window.GameConfig && typeof window.GameConfig.getVehicleById === 'function')
        ? window.GameConfig.getVehicleById(vehicleId)
        : { id: 'kart_saber', icon: '🏎️', name: '카트라이더 세이버 프로' };
      state.selectedVehicle = vObj.id;

      if (window.SaveManager && typeof window.SaveManager.setSelectedVehicle === 'function') {
        window.SaveManager.setSelectedVehicle(vObj.id);
      }
      if (window.Engine3D && typeof window.Engine3D.setVehicleType === 'function') {
        window.Engine3D.setVehicleType(vObj.id);
      }
      if (window.SoundEngine) {
        window.SoundEngine.playCorrect(2);
      }
      if (window.UIManager) {
        window.UIManager.renderCharacterModal(vObj.id);
        window.UIManager.showFeedbackToast(
          true,
          `${vObj.icon} [${vObj.name}] 캐릭터 장착 완료!!`
        );
      }
      return vObj.id;
    },

    openCharacterModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager && typeof window.UIManager.showCharacterModal === 'function') {
        window.UIManager.showCharacterModal(state.selectedVehicle || 'kart_saber');
      }
    },

    closeCharacterModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager && typeof window.UIManager.hideCharacterModal === 'function') {
        window.UIManager.hideCharacterModal();
      }
    },

    /**
     * Starts one of the 3 Distinct Roblox Action Mini-Games (strictly 3 times per stage, never repeating the same game!):
     * 1) 'heaven_stairs': 🌈☁️ 로블록스 천국의 계단 (2버튼: 우측 [⬆️ 오르기] & 좌측 [🔄 방향전환 점프])
     * 2) 'laser_jump': ⚡🪵 로블록스 회전 레이저봉 & 거대 2단 통나무 점프 서바이벌 (우측 [⬆️ 점프] & 좌측 [🔄 2단 슈퍼점프])
     * 3) 'obby_rush': 🧱🔥 로블록스 3레인 용암·장애물 돌파 오비
     */
    startObbyMinigame: function (forcedGameType) {
      if (!state.isPlaying || state.isGameOver) return false;
      if (state.isObbyMode) return true;

      if (this._obbyWaveTimer) {
        clearTimeout(this._obbyWaveTimer);
        this._obbyWaveTimer = null;
      }

      const validTypes = ['heaven_stairs', 'laser_jump', 'obby_rush'];
      let gameType = (forcedGameType && validTypes.indexOf(forcedGameType) !== -1) ? forcedGameType : null;
      if (!gameType) {
        if (Array.isArray(state.stageMinigameQueue) && state.stageMinigameQueue.length > 0) {
          gameType = state.stageMinigameQueue.shift();
        } else {
          const nonRepeat = validTypes.filter(function (t) { return t !== state.lastMinigameType; });
          gameType = nonRepeat[Math.floor(Math.random() * nonRepeat.length)] || 'heaven_stairs';
        }
      }
      state.lastMinigameType = gameType;
      state.isObbyMode = true;
      state.obbyGameType = gameType;
      state.obbyWavesCleared = 0;
      state.obbySuccessCount = 0;
      state.obbyWaveQueue = [];

      if (window.Engine3D) {
        if (typeof window.Engine3D.setDemoMode === 'function') {
          window.Engine3D.setDemoMode(false);
        }
        window.Engine3D.clearActiveGates();
        if (typeof window.Engine3D.clearObbyObstacles === 'function') {
          window.Engine3D.clearObbyObstacles();
        }
        if (typeof window.Engine3D.clearHeavenStairs === 'function') {
          window.Engine3D.clearHeavenStairs();
        }
        window.Engine3D.setSpeed(getEffectiveSpeed());
      }

      if (window.SoundEngine) {
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        window.SoundEngine.playStageClear();
      }

      if (gameType === 'heaven_stairs') {
        // 🌈☁️ MINI-GAME 1: 로블록스 천국의 계단 (8 Steps 2-Button Climbing Game!)
        state.obbyWavesTotal = 8;
        let stairInfo = { stepIndex: 0, totalSteps: 8, facingDir: 1, nextRequiredDir: 1 };
        if (window.Engine3D && typeof window.Engine3D.startHeavenStairs === 'function') {
          stairInfo = window.Engine3D.startHeavenStairs(8) || stairInfo;
        }
        if (window.UIManager) {
          if (typeof window.UIManager.showHeavenStairsHUD === 'function') {
            window.UIManager.showHeavenStairsHUD(0, stairInfo.totalSteps, stairInfo.facingDir, stairInfo.nextRequiredDir);
          }
          window.UIManager.showFeedbackToast(
            true,
            '☁️🌈 [미니게임 1: 로블록스 천국의 계단!] 방향이 같으면 우측 [⬆️ 오르기], 꺾이면 좌측 [🔄 방향전환] 버튼을 눌러 천국의 문까지 올라가세요!'
          );
        }
        syncHUD();
        return true;
      }

      if (gameType === 'laser_jump') {
        // ⚡🪵 MINI-GAME 2: 로블록스 회전 레이저봉 & 거대 2단 통나무 점프 서바이벌!
        state.obbyWavesTotal = 3;
        const laserWaveTypes = ['low_laser', 'high_log', Math.random() < 0.5 ? 'low_laser' : 'high_log'];
        for (let w = 0; w < state.obbyWavesTotal; w++) {
          const wt = laserWaveTypes[w];
          state.obbyWaveQueue.push({
            waveIndex: w + 1,
            totalWaves: state.obbyWavesTotal,
            waveType: wt,
            passLane: 1,
            lanes: [wt, wt, wt]
          });
        }
        if (window.UIManager) {
          window.UIManager.showFeedbackToast(
            true,
            '⚡🪵 [미니게임 2: 회전 레이저봉 & 거대 통나무 점프!] 낮은 레이저봉은 우측 [⬆️ 점프], 거대 2단 통나무는 좌측 [🔄 2단점프]로 뛰어넘으세요!'
          );
        }
        syncHUD();
        this._spawnNextObbyWave();
        return true;
      }

      // 🧱🔥 MINI-GAME 3: 로블록스 3레인 장애물 벽 & 불구덩이 돌파 ('obby_rush')
      state.obbyWavesTotal = 3;
      const types = [];
      for (let i = 0; i < 3; i++) {
        types.push(Math.random() < 0.5 ? 'obstacle_wall' : 'fire_pit');
      }
      if (types[0] === types[1] && types[1] === types[2]) {
        types[2] = types[0] === 'obstacle_wall' ? 'fire_pit' : 'obstacle_wall';
      }

      let prevPassLane = -1;
      for (let w = 0; w < state.obbyWavesTotal; w++) {
        const wType = types[w];
        const candidateLanes = [0, 1, 2].filter(function (l) {
          return l !== prevPassLane;
        });
        const passLane = candidateLanes[Math.floor(Math.random() * candidateLanes.length)];
        prevPassLane = passLane;

        const lanes = [0, 1, 2].map(function (laneIdx) {
          if (laneIdx === passLane) {
            return wType === 'fire_pit' ? 'narrow_fire' : 'hurdle';
          }
          return wType === 'fire_pit' ? 'wide_fire' : 'block';
        });

        state.obbyWaveQueue.push({
          waveIndex: w + 1,
          totalWaves: state.obbyWavesTotal,
          waveType: wType,
          passLane: passLane,
          lanes: lanes
        });
      }

      if (window.UIManager) {
        window.UIManager.showFeedbackToast(
          true,
          '🧱🔥 [미니게임 3: 용암·장애물 레인 돌파!] 높은 블록과 넓은 불구덩이를 피해 낮은/좁은 레인으로 3번 돌파하세요!'
        );
      }

      syncHUD();
      this._spawnNextObbyWave();
      return true;
    },

    /**
     * Handles each button step in the 3D '천국의 계단' (Stairway to Heaven) Mini-Game!
     * @param {Object} res { cleared, isFinished, stepIndex, totalSteps, facingDir, nextRequiredDir }
     */
    handleHeavenStairStep: function (res) {
      if (!state.isPlaying || !state.isObbyMode || state.isGameOver) return;
      if (!res) return;

      if (res.cleared) {
        state.obbyWavesCleared = res.stepIndex;
        state.obbySuccessCount = res.stepIndex;
        const stepPts = 40;
        if (window.SoundEngine) {
          window.SoundEngine.playCorrect(res.stepIndex);
        }
        if (window.SaveManager) {
          window.SaveManager.addScore(stepPts, getEffectiveSpeed());
        }
        if (window.UIManager && typeof window.UIManager.showHeavenStairsHUD === 'function') {
          window.UIManager.showHeavenStairsHUD(
            res.stepIndex,
            res.totalSteps,
            res.facingDir,
            res.nextRequiredDir
          );
        }
        syncHUD();

        if (res.isFinished || res.stepIndex >= res.totalSteps) {
          const self = this;
          if (this._obbyWaveTimer) clearTimeout(this._obbyWaveTimer);
          this._obbyWaveTimer = setTimeout(function () {
            self._obbyWaveTimer = null;
            self.endObbyMinigame();
          }, 550);
        }
      } else {
        // Stepped in the wrong direction -> -1 HP & hurt feedback, then align facing direction for easy continuation!
        state.combo = 0;
        state.hp = Math.max(0, state.hp - 1);
        if (window.SoundEngine) {
          window.SoundEngine.playWrong();
        }
        if (window.UIManager) {
          window.UIManager.triggerDamageFlash();
          if (typeof window.UIManager.triggerImpactEffect === 'function') {
            window.UIManager.triggerImpactEffect('obby_hurt', {
              outcome: 'hit_stair',
              waveType: 'heaven_stairs',
              hp: state.hp,
              maxHp: state.maxHp
            });
          }
          if (typeof window.UIManager.showHeavenStairsHUD === 'function') {
            window.UIManager.showHeavenStairsHUD(
              res.stepIndex,
              res.totalSteps,
              res.facingDir,
              res.nextRequiredDir
            );
          }
          window.UIManager.showFeedbackToast(
            false,
            `☁️💦 어이쿠!! 계단 반대쪽으로 헛디뎌 피가 1 깎였어요! (❤️ ${state.hp}/${state.maxHp} · 이제 우측 [⬆️ 오르기]를 누르세요!)`
          );
        }
        syncHUD();

        if (state.hp <= 0) {
          const self = this;
          if (this._obbyWaveTimer) clearTimeout(this._obbyWaveTimer);
          this._obbyWaveTimer = setTimeout(function () {
            self._obbyWaveTimer = null;
            self.handleGameOver();
          }, 680);
        }
      }
    },

    /**
     * Spawns the next obstacle wave (1/3 -> 2/3 -> 3/3) in the current Obby Mini-Game session.
     */
    _spawnNextObbyWave: function () {
      if (!state.isPlaying || state.isGameOver || !state.isObbyMode) return;
      if (!Array.isArray(state.obbyWaveQueue) || state.obbyWaveQueue.length === 0) return;

      const nextWaveCfg = state.obbyWaveQueue.shift();
      if (window.Engine3D && typeof window.Engine3D.spawnObbyObstacleWave === 'function') {
        window.Engine3D.spawnObbyObstacleWave({
          z: -72,
          waveIndex: nextWaveCfg.waveIndex,
          totalWaves: nextWaveCfg.totalWaves,
          waveType: nextWaveCfg.waveType,
          lanes: nextWaveCfg.lanes
        });
      }

      if (window.UIManager && typeof window.UIManager.showObbyHUD === 'function') {
        window.UIManager.showObbyHUD(
          nextWaveCfg.waveIndex,
          nextWaveCfg.totalWaves,
          nextWaveCfg.waveType,
          nextWaveCfg.passLane
        );
      }
    },

    /**
     * Handles passing a single 3-lane or full-road obstacle wave during the Roblox Obby Mini-Game (3 waves total).
     * @param {Object} res { cleared, outcome, laneType, waveType, lane, waveIndex, totalWaves }
     */
    handleObbyWavePass: function (res) {
      if (!state.isPlaying || !state.isObbyMode || state.isGameOver) return;

      state.obbyWavesCleared += 1;
      const isCleared = res ? Boolean(res.cleared) : true;
      const outcome = res ? (res.outcome || (isCleared ? 'jump_clear' : 'hit_block')) : 'jump_clear';
      const waveType = (res && res.waveType) ? res.waveType : 'obstacle_wall';

      if (isCleared && (outcome === 'jump_clear' || outcome === 'coin')) {
        state.obbySuccessCount = (state.obbySuccessCount || 0) + 1;
        const bonusPts = waveType === 'high_log' ? 110 : 85;
        if (window.SoundEngine) {
          window.SoundEngine.playCorrect(state.combo + 1);
        }
        if (window.SaveManager) {
          window.SaveManager.addScore(bonusPts, getEffectiveSpeed());
        }
        if (window.UIManager) {
          let successMsg = `🧱⬆️ 나이스 점프!! 낮은 장애물 넘기 성공! (+${bonusPts} R$ · ${state.obbyWavesCleared}/${state.obbyWavesTotal})`;
          if (waveType === 'fire_pit') {
            successMsg = `🔥⬆️ 나이스 점프!! 좁은 불구덩이 건너기 성공! (+${bonusPts} R$ · ${state.obbyWavesCleared}/${state.obbyWavesTotal})`;
          } else if (waveType === 'low_laser') {
            successMsg = `⚡⬆️ 나이스 점프!! 회전 레이저봉 완벽 통과! (+${bonusPts} R$ · ${state.obbyWavesCleared}/${state.obbyWavesTotal})`;
          } else if (waveType === 'high_log') {
            successMsg = `🪵🔄 슈퍼 2단점프!! 거대 회전 통나무 완벽 통과! (+${bonusPts} R$ · ${state.obbyWavesCleared}/${state.obbyWavesTotal})`;
          }
          window.UIManager.showFeedbackToast(true, successMsg);
        }
      } else {
        // FAILED to clear obstacle -> Subtract 1 HP & trigger Hurt / Ouch Animation ("피가 깎이고 아픈 애니")!
        state.combo = 0;
        state.hp = Math.max(0, state.hp - 1);

        if (window.SoundEngine) {
          window.SoundEngine.playWrong();
        }
        if (window.UIManager) {
          window.UIManager.triggerDamageFlash();
          if (typeof window.UIManager.triggerImpactEffect === 'function') {
            window.UIManager.triggerImpactEffect('obby_hurt', {
              outcome: outcome,
              waveType: waveType,
              hp: state.hp,
              maxHp: state.maxHp
            });
          }
          let failMsg = `🧱💥 콰직!! 아야! 높은 블록에 부딪혀 피가 1 깎였어요! (❤️ ${state.hp}/${state.maxHp} · 낮은 장애물 레인으로 이동 후 [⬆️ 점프]하세요!)`;
          if (outcome === 'hit_hurdle') {
            failMsg = `🧱💥 쿵!! 낮은 장애물 레인에서 [⬆️ 점프]를 누르지 않아 부딪혔어요! (❤️ ${state.hp}/${state.maxHp})`;
          } else if (outcome === 'hit_fire' && res && res.laneType === 'narrow_fire') {
            failMsg = `🔥💥 앗 뜨거!! 좁은 불구덩이에서 [⬆️ 점프]를 누르지 않아 빠졌어요! (❤️ ${state.hp}/${state.maxHp})`;
          } else if (outcome === 'hit_fire' || waveType === 'fire_pit') {
            failMsg = `🔥💥 앗 뜨거!! 넓은 불구덩이에 빠져 피가 1 깎였어요! (❤️ ${state.hp}/${state.maxHp} · 좁은 불구덩이 레인으로 이동 후 [⬆️ 점프]하세요!)`;
          } else if (outcome === 'hit_laser' || waveType === 'low_laser') {
            failMsg = `⚡💥 찌릿!! 회전 레이저봉에 걸려 피가 1 깎였어요! (❤️ ${state.hp}/${state.maxHp} · 우측 [⬆️ 점프] 버튼을 누르세요!)`;
          } else if (outcome === 'hit_log' || waveType === 'high_log') {
            failMsg = `🪵💥 쿵!! 거대 통나무에 부딪혀 피가 1 깎였어요! (❤️ ${state.hp}/${state.maxHp} · 좌측 [🔄 2단점프] 버튼을 누르세요!)`;
          }
          window.UIManager.showFeedbackToast(false, failMsg);
        }

        syncHUD();

        if (state.hp <= 0) {
          const self = this;
          if (this._obbyWaveTimer) {
            clearTimeout(this._obbyWaveTimer);
          }
          this._obbyWaveTimer = setTimeout(function () {
            self._obbyWaveTimer = null;
            self.handleGameOver();
          }, 680);
          return;
        }
      }

      syncHUD();

      const self = this;
      if (this._obbyWaveTimer) {
        clearTimeout(this._obbyWaveTimer);
        this._obbyWaveTimer = null;
      }

      if (state.obbyWavesCleared < state.obbyWavesTotal) {
        this._obbyWaveTimer = setTimeout(function () {
          self._obbyWaveTimer = null;
          self._spawnNextObbyWave();
        }, isCleared ? 360 : 620);
      } else {
        this._obbyWaveTimer = setTimeout(function () {
          self._obbyWaveTimer = null;
          self.endObbyMinigame();
        }, isCleared ? 520 : 920);
      }
    },

    /**
     * Ends the current Roblox Action Mini-Game ('heaven_stairs' | 'laser_jump' | 'obby_rush'),
     * restores 1x quiz speed, awards bonus Robux, and seamlessly resumes quiz mode (`spawnNextQuestion()`).
     */
    endObbyMinigame: function () {
      if (!state.isObbyMode) return;
      if (this._obbyWaveTimer) {
        clearTimeout(this._obbyWaveTimer);
        this._obbyWaveTimer = null;
      }
      const finishedGameType = state.obbyGameType || 'obby_rush';
      state.isObbyMode = false;
      const clearedCnt = state.obbySuccessCount || 0;
      const totalCnt = state.obbyWavesTotal || 3;
      state.obbyWavesCleared = 0;
      state.obbySuccessCount = 0;
      state.obbyWaveQueue = [];

      if (!state.isPlaying || state.isGameOver || state.hp <= 0) {
        return;
      }

      const clearBonus = finishedGameType === 'heaven_stairs' ? 240 : (clearedCnt * 80);
      if (clearBonus > 0 && window.SaveManager) {
        window.SaveManager.addScore(clearBonus, getEffectiveSpeed());
      }

      if (window.Engine3D) {
        if (typeof window.Engine3D.clearObbyObstacles === 'function') {
          window.Engine3D.clearObbyObstacles();
        }
        if (typeof window.Engine3D.clearHeavenStairs === 'function') {
          window.Engine3D.clearHeavenStairs();
        }
        window.Engine3D.setSpeed(getEffectiveSpeed());
      }

      if (window.SoundEngine) {
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
        if (clearedCnt > 0) {
          window.SoundEngine.playStageClear();
        }
      }

      if (window.UIManager) {
        if (typeof window.UIManager.hideObbyHUD === 'function') {
          window.UIManager.hideObbyHUD();
        }
        const gameLabel = finishedGameType === 'heaven_stairs'
          ? '☁️🌈 천국의 계단'
          : (finishedGameType === 'laser_jump' ? '⚡🪵 회전 레이저봉·통나무 점프' : '🧱🔥 용암·장애물 오비');
        if (clearedCnt >= totalCnt) {
          if (typeof window.UIManager.triggerImpactEffect === 'function') {
            window.UIManager.triggerImpactEffect('correct', { points: clearBonus, combo: state.combo });
          }
          window.UIManager.showFeedbackToast(
            true,
            `🏁 ${gameLabel} 완벽 클리어!! 보너스 +${clearBonus} R$ 획득! 다시 문제를 풀어볼까요?`
          );
        } else {
          window.UIManager.showFeedbackToast(
            clearedCnt > 0,
            `🏁 ${gameLabel} 종료! (보너스 +${clearBonus} R$) 다시 문제 풀기로 돌아갑니다!`
          );
        }
      }

      syncHUD();
      if (state.isPlaying && !state.isGameOver) {
        this.spawnNextQuestion();
      }
    },

    /**
     * Sets mobile/screen orientation optimization mode ('auto' | 'portrait' | 'landscape').
     * @param {string} mode
     */
    setOrientationMode: function (mode) {
      const m = (mode === 'portrait' || mode === 'landscape') ? mode : 'auto';
      state.orientationMode = m;
      try {
        window.localStorage.setItem('soyun_view_orientation_mode', m);
      } catch (e) {}

      if (window.Engine3D && typeof window.Engine3D.setViewOrientationMode === 'function') {
        window.Engine3D.setViewOrientationMode(m);
      }
      if (window.UIManager && typeof window.UIManager.updateOrientationUI === 'function') {
        window.UIManager.updateOrientationUI(m);
        const label = m === 'portrait' ? '📱 세로보기 최적화' : (m === 'landscape' ? '📺 가로보기 최적화' : '🔄 자동 화면 감지');
        window.UIManager.showFeedbackToast(true, `화면 보기 모드 변경: ${label}`);
      }
      return m;
    },

    /**
     * Cycles through orientation modes: 'auto' -> 'portrait' -> 'landscape' -> 'auto'
     */
    cycleOrientationMode: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      const order = ['auto', 'portrait', 'landscape'];
      const idx = order.indexOf(state.orientationMode);
      const next = order[(idx + 1) % order.length];
      return this.setOrientationMode(next);
    },

    /**
     * Changes the subject mode ('mixed' | 'math' | 'english') and saves it.
     * @param {string} mode
     */
    setSubjectMode: function (mode) {
      if (window.SaveManager) {
        window.SaveManager.setSubjectMode(mode);
        if (window.UIManager) {
          window.UIManager.renderDashboard(window.SaveManager.getState(), state.selectedDashboardStage);
        }
      }
    },

    /**
     * Sets user speed multiplier (1.0x ~ 2.5x) and updates 3D engine & HUD immediately.
     * @param {number} mult
     */
    setSpeedMultiplier: function (mult) {
      const clamped = Math.max(1.0, Math.min(2.5, Math.round((Number(mult) || 1.0) * 100) / 100));
      state.speedMultiplier = clamped;
      if (window.SaveManager && typeof window.SaveManager.setSpeedMultiplier === 'function') {
        window.SaveManager.setSpeedMultiplier(clamped);
      }
      if (window.Engine3D) {
        window.Engine3D.setSpeed(getEffectiveSpeed());
      }
      if (window.SoundEngine) {
        window.SoundEngine.setSpeedTempo(getEffectiveSpeed());
      }
      if (window.UIManager) {
        if (window.SaveManager) {
          window.UIManager.renderDashboard(window.SaveManager.getState(), state.selectedDashboardStage);
        }
        window.UIManager.showFeedbackToast(
          true,
          `⚡ 소윤이 카트 속도 조절: ${clamped.toFixed(1)}x 배속 (${Math.round(getEffectiveSpeed())} KM/H)`
        );
      }
      syncHUD();
      return state.speedMultiplier;
    },

    /**
     * Sets Parent-configured Obby Jump Mini-Game speed multiplier (0.8x ~ 2.5x, default 1.2x).
     * @param {number} mult
     */
    setObbySpeedMultiplier: function (mult) {
      const clamped = Math.max(0.8, Math.min(2.5, Math.round((Number(mult) || 1.2) * 100) / 100));
      state.obbySpeedMultiplier = clamped;
      if (window.SaveManager && typeof window.SaveManager.setObbySpeedMultiplier === 'function') {
        window.SaveManager.setObbySpeedMultiplier(clamped);
      }
      if (state.isObbyMode && window.Engine3D) {
        window.Engine3D.setSpeed(getEffectiveSpeed());
      }
      if (window.UIManager) {
        if (window.SaveManager) {
          window.UIManager.renderParentModal(window.SaveManager.getState());
          window.UIManager.renderDashboard(window.SaveManager.getState(), state.selectedDashboardStage);
        }
        window.UIManager.showFeedbackToast(
          true,
          `🧱🔥 점프게임 속도 배율 설정: 현재 주행속도의 ${clamped.toFixed(1)}x 배속`
        );
      }
      syncHUD();
      return state.obbySpeedMultiplier;
    },

    /**
     * Adjusts speed multiplier up or down by delta (e.g. -0.1 or +0.1)
     * @param {number} delta
     */
    adjustSpeed: function (delta) {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      const nextMult = Math.round(((state.speedMultiplier || 1.0) + (Number(delta) || 0)) * 10) / 10;
      return this.setSpeedMultiplier(nextMult);
    },

    /**
     * Steps the left-side cute speed arrows strictly within x 1.0 ~ x 2.5!
     * @param {number} delta (+0.1 or -0.1)
     */
    stepLeftSpeedArrow: function (delta) {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      const base = Math.max(1.0, Math.min(2.5, Number(state.speedMultiplier) || 1.0));
      const nextMult = Math.max(1.0, Math.min(2.5, Math.round((base + (Number(delta) || 0)) * 10) / 10));
      return this.setSpeedMultiplier(nextMult);
    },

    /**
     * Opens the Cumulative Wrong Answer Review Notebook Modal.
     */
    openReviewModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      state.wasPlayingBeforeModal = Boolean(state.isPlaying && !state.isPaused);
      if (state.wasPlayingBeforeModal && window.Engine3D) {
        window.Engine3D.setPaused(true);
      }
      if (window.UIManager) {
        const saveState = window.SaveManager ? window.SaveManager.getState() : {};
        window.UIManager.showReviewModal(saveState);
      }
    },

    /**
     * Closes the Cumulative Wrong Answer Review Notebook Modal.
     */
    closeReviewModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager) {
        window.UIManager.hideReviewModal();
      }
      if (state.wasPlayingBeforeModal && state.isPlaying && !state.isPaused && window.Engine3D) {
        window.Engine3D.setPaused(false);
      }
      state.wasPlayingBeforeModal = false;
    },

    /**
     * Opens the Parent Control Modal (#parent-modal) for Speed & Bonus Payout management.
     */
    openParentModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      state.parentUnlocked = false;
      if (window.UIManager && typeof window.UIManager.showParentModal === 'function') {
        const saveState = window.SaveManager ? window.SaveManager.getState() : {};
        window.UIManager.showParentModal(saveState, false);
      }
    },

    commitPendingParentBonusInputs: function (excludeCountKey) {
      if (!window.SaveManager) return;
      const container = document.getElementById('parent-bonus-list-container');
      if (!container) return;
      const s = window.SaveManager.getState();

      const nameInputs = container.querySelectorAll('.parent-bonus-name-input');
      nameInputs.forEach(function (inp) {
        const key = inp.getAttribute('data-bonus-key');
        const val = String(inp.value || '').trim();
        if (!key || !val) return;
        if (key === 'pocket' && val !== s.bonusNamePocket) {
          window.SaveManager.setBonusName('pocket', val);
        } else if (key === 'ashley' && val !== s.bonusNameAshley) {
          window.SaveManager.setBonusName('ashley', val);
        } else if (key === 'jackpot' && val !== s.bonusNameJackpot) {
          window.SaveManager.setBonusName('jackpot', val);
        }
      });

      const countInputs = container.querySelectorAll('.parent-bonus-count-input');
      countInputs.forEach(function (inp) {
        const key = inp.getAttribute('data-bonus-key');
        if (!key || key === excludeCountKey) return;
        const num = Math.max(1, Math.min(99999, parseInt(inp.value, 10) || 0));
        if (!num) return;
        if (key === 'pocket' && num !== s.bonusTargetPocket) {
          window.SaveManager.setBonusAchievedCount('pocket', num);
        } else if (key === 'ashley' && num !== s.bonusTargetAshley) {
          window.SaveManager.setBonusAchievedCount('ashley', num);
        } else if (key === 'jackpot' && num !== s.bonusTargetJackpot) {
          window.SaveManager.setBonusAchievedCount('jackpot', num);
        }
      });
    },

    closeParentModal: function () {
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      this.commitPendingParentBonusInputs();
      if (window.UIManager && typeof window.UIManager.hideParentModal === 'function') {
        window.UIManager.hideParentModal();
      }
      if (window.UIManager && window.SaveManager) {
        window.UIManager.renderDashboard(window.SaveManager.getState(), state.selectedDashboardStage);
      }
      syncHUD();
    },

    /**
     * Marks 1 achieved bonus ('pocket' | 'ashley' | 'jackpot') as paid/completed and deletes it from unpaid count.
     * @param {string} bonusKey
     */
    markBonusPaid: function (bonusKey) {
      if (!window.SaveManager || typeof window.SaveManager.markBonusPaid !== 'function') return;
      this.commitPendingParentBonusInputs();
      if (window.SoundEngine) {
        window.SoundEngine.playStageClear();
      }
      const updated = window.SaveManager.markBonusPaid(bonusKey);
      if (window.UIManager) {
        window.UIManager.renderParentModal(updated);
        window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
        window.UIManager.showFeedbackToast(
          true,
          '✅ [지급 완료 처리됨] 보너스가 지급 완료되어 달성 개수에서 삭제되었습니다!'
        );
      }
      syncHUD();
    },

    undoBonusPaid: function (bonusKey) {
      if (!window.SaveManager || typeof window.SaveManager.undoBonusPaid !== 'function') return;
      this.commitPendingParentBonusInputs();
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      const updated = window.SaveManager.undoBonusPaid(bonusKey);
      if (window.UIManager) {
        window.UIManager.renderParentModal(updated);
        window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
        window.UIManager.showFeedbackToast(
          true,
          '↩️ [지급 취소] 보너스 달성 개수가 다시 1개 복구되었습니다.'
        );
      }
      syncHUD();
    },

    setBonusName: function (bonusKey, newName) {
      if (!window.SaveManager || typeof window.SaveManager.setBonusName !== 'function') return;
      const cleaned = String(newName || '').trim();
      if (!cleaned) {
        window.alert('보너스 이름을 입력해 주세요.');
        return;
      }
      this.commitPendingParentBonusInputs();
      if (window.SoundEngine) {
        window.SoundEngine.playCorrect(1);
      }
      const updated = window.SaveManager.setBonusName(bonusKey, cleaned);
      if (window.UIManager) {
        window.UIManager.renderParentModal(updated);
        window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
        window.UIManager.showFeedbackToast(true, `✏️ 보너스 명이 [${cleaned}](으)로 변경되었습니다!`);
      }
      syncHUD();
    },

    setBonusAchievedCount: function (bonusKey, targetCount) {
      if (!window.SaveManager || typeof window.SaveManager.setBonusAchievedCount !== 'function') return;
      this.commitPendingParentBonusInputs(bonusKey);
      const num = Math.max(1, Math.min(99999, parseInt(targetCount, 10) || 1));
      if (window.SoundEngine) {
        window.SoundEngine.playCorrect(1);
      }
      const updated = window.SaveManager.setBonusAchievedCount(bonusKey, num);
      const unitLabel = bonusKey === 'jackpot' ? '단계' : '판';
      if (window.UIManager) {
        window.UIManager.renderParentModal(updated);
        window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
        window.UIManager.showFeedbackToast(true, `🔢 보너스 목표 달성횟수가 [${num}${unitLabel}]로 저장되었습니다!`);
      }
      syncHUD();
    },

    stepBonusAchievedCount: function (bonusKey, delta) {
      if (!window.SaveManager) return;
      this.commitPendingParentBonusInputs(bonusKey);
      const s = window.SaveManager.getState();
      let cur = 100;
      if (bonusKey === 'pocket') cur = Math.max(1, parseInt(s.bonusTargetPocket, 10) || 100);
      else if (bonusKey === 'ashley') cur = Math.max(1, parseInt(s.bonusTargetAshley, 10) || 1000);
      else if (bonusKey === 'jackpot') cur = Math.max(1, parseInt(s.bonusTargetJackpot, 10) || 10);
      const next = Math.max(1, Math.min(99999, cur + (parseInt(delta, 10) || 0)));
      this.setBonusAchievedCount(bonusKey, next);
    },

    /**
     * Toggles game pause state.
     */
    togglePause: function () {
      if (!state.isPlaying || state.isGameOver) return;
      if (state.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    },

    pauseGame: function () {
      if (!state.isPlaying || state.isGameOver) return false;
      if (state.isPaused) return true;

      // Enforce 2 pause chances limit ("일시정지 기회는 2번이야, 그걸 표현해줘야 해")
      if (state.pauseChancesRemaining <= 0) {
        if (window.SoundEngine) {
          window.SoundEngine.playClick();
        }
        if (window.UIManager) {
          window.UIManager.showFeedbackToast(
            false,
            '⚠️ 일시정지 기회(2번)를 모두 사용했어요! 다음 스테이지에서 다시 충전됩니다!'
          );
        }
        return false;
      }

      state.pauseChancesRemaining = Math.max(0, state.pauseChancesRemaining - 1);
      state.isPaused = true;
      stopSpeechListening();

      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.Engine3D) {
        window.Engine3D.setPaused(true);
        if (typeof window.Engine3D.renderSingleFrame === 'function') {
          window.Engine3D.renderSingleFrame();
        }
      }
      if (window.UIManager) {
        window.UIManager.setPauseModalVisible(true, state.pauseChancesRemaining, state.maxPauseChances);
        window.UIManager.showFeedbackToast(
          true,
          `⏸️ TIME FREEZE! 화면이 멈췄어요! 문제를 보고 천천히 풀어보세요 (남은 기회: ${state.pauseChancesRemaining}/${state.maxPauseChances})`
        );
      }
      syncHUD();
      return true;
    },

    resumeGame: function () {
      if (!state.isPlaying || state.isGameOver) return false;
      state.isPaused = false;
      if (window.SoundEngine) {
        window.SoundEngine.playClick();
      }
      if (window.UIManager) {
        window.UIManager.setPauseModalVisible(false, state.pauseChancesRemaining, state.maxPauseChances);
        window.UIManager.showFeedbackToast(
          true,
          '▶️ 다시 출발!! 정답 차선으로 멋지게 돌파하세요!'
        );
      }
      if (window.Engine3D) {
        window.Engine3D.setPaused(false);
      }
      if (state.currentQuestion && state.currentQuestion.isSpeech && !state.currentQuestion.speechPassed) {
        startSpeechListening(state.currentQuestion);
      }
      syncHUD();
      return true;
    },

    /**
     * Synchronizes runtime UI when SaveManager receives updated cumulative state from Neon PostgreSQL Cloud DB.
     */
    syncFromCloud: function (cloudState) {
      const s = cloudState || (window.SaveManager ? window.SaveManager.getState() : {});
      if (!state.isPlaying) {
        state.stage = Math.max(1, parseInt(s.currentStage, 10) || 1);
        state.selectedDashboardStage = state.stage;
        state.stageConfig = getStageCfg(state.stage);
        state.stageProgress = Math.max(0, parseInt(s.stageProgress, 10) || 0);
        if (window.UIManager) {
          window.UIManager.renderDashboard(s, state.selectedDashboardStage);
        }
      }
      syncHUD();
    },

    /**
     * Returns to the Title / Cumulative Progress Dashboard while preserving all progress.
     */
    returnToDashboard: function () {
      stopSpeechListening();
      state.isPlaying = false;
      state.isPaused = false;
      state.isGameOver = false;
      state.isObbyMode = false;
      state.obbyWavesCleared = 0;
      state.stageWrongQuestions = [];

      if (this._bossSpotlightTimer) {
        clearTimeout(this._bossSpotlightTimer);
        this._bossSpotlightTimer = null;
      }
      if (this._obbyWaveTimer) {
        clearTimeout(this._obbyWaveTimer);
        this._obbyWaveTimer = null;
      }
      this._clearBossFinisherClickPrompt();
      document.body.classList.remove('boss-attack-spotlight-active');

      if (window.QuestionEngine && typeof window.QuestionEngine.resetStageCounters === 'function') {
        window.QuestionEngine.resetStageCounters(state.stage || 1);
      }

      if (window.Engine3D) {
        window.Engine3D.clearActiveGates();
        if (typeof window.Engine3D.clearObbyObstacles === 'function') {
          window.Engine3D.clearObbyObstacles();
        }
        window.Engine3D.hideBoss();
        if (typeof window.Engine3D.setDemoMode === 'function') {
          window.Engine3D.setDemoMode(true);
        }
        window.Engine3D.setPaused(false);
      }

      if (window.SoundEngine) {
        window.SoundEngine.stopBGM();
      }

      const saveState = window.SaveManager ? window.SaveManager.getState() : { currentStage: 1 };
      state.selectedDashboardStage = Math.max(1, parseInt(saveState.currentStage, 10) || 1);

      if (window.UIManager) {
        window.UIManager.hideGameOverModal();
        window.UIManager.hideReviewModal();
        window.UIManager.setPauseModalVisible(false);
        window.UIManager.hideBossHUD();
        if (typeof window.UIManager.hideObbyHUD === 'function') {
          window.UIManager.hideObbyHUD();
        }
        if (typeof window.UIManager.hideExitConfirmModal === 'function') {
          window.UIManager.hideExitConfirmModal();
        }
        if (typeof window.UIManager.hideBossRewardModal === 'function') {
          window.UIManager.hideBossRewardModal();
        }
        if (typeof window.UIManager.hideNextStageModal === 'function') {
          window.UIManager.hideNextStageModal();
        }
        window.UIManager.renderDashboard(saveState, state.selectedDashboardStage);
        window.UIManager.setStartScreenVisible(true);
      }
      syncHUD();
    },

    /**
     * Toggles sound mute/unmute state.
     */
    toggleSound: function () {
      if (!window.SoundEngine) return false;
      const isMuted = window.SoundEngine.toggleMute();
      if (window.UIManager) {
        window.UIManager.updateSoundButton(isMuted);
      }
      return isMuted;
    },

    /**
     * Explicitly resets all cumulative progress when confirmed by user.
     */
    resetAllProgress: function (skipConfirm) {
      if (!skipConfirm) {
        const ok = window.confirm('정말 모든 누적 점수, 스테이지 기록, 오답 노트를 초기화하시겠습니까?');
        if (!ok) return;
      }
      if (window.SaveManager) {
        const fresh = window.SaveManager.resetAllProgress();
        state.stage = 1;
        state.selectedDashboardStage = 1;
        state.stageConfig = getStageCfg(1);
        state.stageProgress = 0;
        if (window.UIManager) {
          window.UIManager.renderDashboard(fresh, 1);
        }
        syncHUD();
      }
    },

    /**
     * Helper method for automated testing & quick simulation:
     * Immediately resolves the active question gate on the specified lane (or correct/wrong lane).
     * @param {number|boolean} [laneOrCorrect]
     */
    passCurrentGate: function (laneOrCorrect) {
      if (!state.currentQuestion) return false;
      let targetLane = state.currentLane;
      if (typeof laneOrCorrect === 'number') {
        targetLane = Math.max(0, Math.min(2, laneOrCorrect));
      } else if (laneOrCorrect === true) {
        targetLane = state.currentQuestion.correctLane;
      } else if (laneOrCorrect === false) {
        targetLane = (state.currentQuestion.correctLane + 1) % 3;
      }

      this.selectLane(targetLane);
      if (window.Engine3D && typeof window.Engine3D.forcePassActiveGate === 'function') {
        const passed = window.Engine3D.forcePassActiveGate(targetLane);
        if (passed) return true;
      }
      this.handleGatePass(targetLane, state.currentQuestion, targetLane === state.currentQuestion.correctLane);
      return true;
    },

    /**
     * Returns complete runtime & cumulative state for inspection and automated tests.
     */
    getState: function () {
      const saveState = window.SaveManager ? window.SaveManager.getState() : {};
      const activePet = getActivePet();
      return {
        playerName: '이소윤',
        isPlaying: state.isPlaying,
        isPaused: state.isPaused,
        pauseChancesRemaining: state.pauseChancesRemaining,
        maxPauseChances: state.maxPauseChances,
        isGameOver: state.isGameOver,
        isBossPhase: state.isBossPhase,
        isObbyMode: state.isObbyMode,
        obbyWavesCleared: state.obbyWavesCleared,
        obbyWavesTotal: state.obbyWavesTotal,
        orientationMode: state.orientationMode,
        stage: state.stage,
        selectedDashboardStage: state.selectedDashboardStage,
        stageTitle: state.stageConfig ? state.stageConfig.title : '',
        stageProgress: state.stageProgress,
        questionsToBoss: state.stageConfig ? state.stageConfig.questionsToBoss : 15,
        hp: state.hp,
        maxHp: state.maxHp,
        speed: Math.round(state.speed),
        effectiveSpeed: getEffectiveSpeed(),
        combo: state.combo,
        currentLane: state.currentLane,
        currentQuestion: state.currentQuestion,
        bossHp: state.bossCurrentHp,
        bossCurrentHp: state.bossCurrentHp,
        bossMaxHp: state.bossMaxHp,
        bossName: state.stageConfig ? state.stageConfig.bossName : '',
        currentPet: activePet ? activePet.name : '',
        currentPetLevel: activePet ? activePet.level : 1,
        totalScore: saveState.totalScore || 0,
        totalSolved: saveState.totalSolved || 0,
        totalCorrect: saveState.totalCorrect || 0,
        totalWrong: saveState.totalWrong || 0,
        wrongAnswerQueueLength: Array.isArray(saveState.wrongAnswerQueue) ? saveState.wrongAnswerQueue.length : 0,
        subjectMode: saveState.subjectMode || 'mixed'
      };
    },

    /**
     * Binds keyboard shortcuts and DOM button click listeners.
     */
    _bindEvents: function () {
      const self = this;

      // Keyboard Controls
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          const revModal = document.getElementById('review-modal');
          if (revModal && !revModal.classList.contains('hidden')) {
            self.closeReviewModal();
            return;
          }
          self.togglePause();
          return;
        }

        if (!state.isPlaying || state.isGameOver) return;

        if (state.isObbyMode && state.obbyGameType === 'heaven_stairs') {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyZ' || e.code === 'KeyQ') {
            e.preventDefault();
            self.triggerTurnJump();
            return;
          }
          if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowRight' || e.code === 'KeyD') {
            e.preventDefault();
            self.triggerJump();
            return;
          }
        }

        switch (e.code) {
          case 'ShiftLeft':
          case 'ShiftRight':
          case 'KeyZ':
          case 'KeyQ':
            e.preventDefault();
            self.triggerTurnJump();
            break;
          case 'ArrowLeft':
          case 'KeyA':
            e.preventDefault();
            self.moveLeft();
            break;
          case 'ArrowRight':
          case 'KeyD':
            e.preventDefault();
            self.moveRight();
            break;
          case 'Digit1':
          case 'Numpad1':
            e.preventDefault();
            self.selectLane(0);
            break;
          case 'Digit2':
          case 'Numpad2':
          case 'KeyS':
          case 'ArrowDown':
            e.preventDefault();
            self.selectLane(1);
            break;
          case 'Space':
          case 'ArrowUp':
          case 'KeyW':
            e.preventDefault();
            self.triggerJump();
            break;
          case 'Digit3':
          case 'Numpad3':
            e.preventDefault();
            self.selectLane(2);
            break;
          default:
            break;
        }
      });

      // Viewport touch disabled by user request:
      // Touching anywhere outside the 3 bottom brick lane buttons (#btn-lane-0/1/2) must NOT move the car!

      // Left Round Turn-Jump / 2x Super-Jump Button (#btn-turn-jump-action 🔄)
      const btnTurnJump = document.getElementById('btn-turn-jump-action');
      if (btnTurnJump) {
        let lastTurnTap = 0;
        btnTurnJump.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          lastTurnTap = Date.now();
          self.triggerTurnJump();
        });
        btnTurnJump.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (Date.now() - lastTurnTap < 350) return;
          self.triggerTurnJump();
        });
      }

      // Right Round Jump / Climb Button (#btn-jump-action ⬆️)
      const btnJump = document.getElementById('btn-jump-action');
      if (btnJump) {
        let lastJumpTap = 0;
        btnJump.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          lastJumpTap = Date.now();
          self.triggerJump();
        });
        btnJump.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (Date.now() - lastJumpTap < 350) return;
          self.triggerJump();
        });
      }

      // 🚀 Right-Side KartRider Booster Button (#btn-booster-action, left of Jump button)
      const btnBooster = document.getElementById('btn-booster-action');
      if (btnBooster) {
        let lastBoosterTap = 0;
        btnBooster.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          lastBoosterTap = Date.now();
          self.triggerBooster();
        });
        btnBooster.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (Date.now() - lastBoosterTap < 350) return;
          self.triggerBooster();
        });
      }

      // 🛑 Left-Side Hard-Brake Button (#btn-brake-action, right of Turn-Jump button)
      const btnBrake = document.getElementById('btn-brake-action');
      if (btnBrake) {
        let lastBrakeTap = 0;
        btnBrake.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          lastBrakeTap = Date.now();
          self.triggerBrake();
        });
        btnBrake.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (Date.now() - lastBrakeTap < 350) return;
          self.triggerBrake();
        });
      }

      // 🏎️ Middle-Right Character / Vehicle Change Button & Modal (10 types)
      const btnOpenChar = document.getElementById('btn-open-character-modal');
      if (btnOpenChar) {
        btnOpenChar.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.openCharacterModal();
        });
      }
      const btnCloseChar = document.getElementById('btn-close-character-modal');
      if (btnCloseChar) {
        btnCloseChar.addEventListener('click', function () {
          self.closeCharacterModal();
        });
      }
      const btnConfirmChar = document.getElementById('btn-confirm-character-modal');
      if (btnConfirmChar) {
        btnConfirmChar.addEventListener('click', function () {
          self.closeCharacterModal();
        });
      }
      const charGrid = document.getElementById('character-select-grid');
      if (charGrid) {
        charGrid.addEventListener('click', function (e) {
          const card = e.target.closest('[data-vehicle-id]');
          if (!card) return;
          const vId = card.getAttribute('data-vehicle-id');
          if (vId) {
            self.selectVehicle(vId);
          }
        });
      }

      // Quick Trigger Button for 2x Speed Roblox Obby Mini-Game (#btn-trigger-obby)
      const btnTriggerObby = document.getElementById('btn-trigger-obby');
      if (btnTriggerObby) {
        btnTriggerObby.addEventListener('click', function () {
          if (window.SoundEngine) window.SoundEngine.playClick();
          if (!state.isPlaying || state.isGameOver) {
            self.startGame(state.selectedDashboardStage);
          }
          if (state.isObbyMode) {
            self.endObbyMinigame();
          } else {
            self.startObbyMinigame();
          }
        });
      }

      // Orientation Mode Button in Utility Bar (#btn-orientation-mode)
      const btnOrient = document.getElementById('btn-orientation-mode');
      if (btnOrient) {
        btnOrient.addEventListener('click', function () {
          self.cycleOrientationMode();
        });
      }

      // Orientation Mode Selector on Start Dashboard (#dashboard-orientation-selector)
      const dashOrientContainer = document.getElementById('dashboard-orientation-selector');
      if (dashOrientContainer) {
        dashOrientContainer.addEventListener('click', function (e) {
          const btn = e.target.closest('[data-orient]');
          if (!btn) return;
          const orient = btn.getAttribute('data-orient');
          if (orient) {
            if (window.SoundEngine) window.SoundEngine.playClick();
            self.setOrientationMode(orient);
          }
        });
      }

      // Fullscreen Toggle Button for Mobile / Tablet / PC
      const btnFullscreen = document.getElementById('btn-fullscreen');
      if (btnFullscreen) {
        btnFullscreen.addEventListener('click', function () {
          if (window.SoundEngine) window.SoundEngine.playClick();
          const docEl = document.documentElement;
          if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (docEl.requestFullscreen) {
              docEl.requestFullscreen().catch(function () {});
            } else if (docEl.webkitRequestFullscreen) {
              docEl.webkitRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen().catch(function () {});
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          }
        });
      }

      // Parent Modal Speed Multiplier Preset Selector (#dashboard-speed-selector inside #parent-modal)
      const dashSpeedContainer = document.getElementById('dashboard-speed-selector');
      if (dashSpeedContainer) {
        dashSpeedContainer.addEventListener('click', function (e) {
          const btn = e.target.closest('.speed-preset-pill');
          if (!btn) return;
          const mult = parseFloat(btn.getAttribute('data-mult'));
          if (!isNaN(mult)) {
            if (window.SoundEngine) window.SoundEngine.playClick();
            self.setSpeedMultiplier(mult);
            if (window.UIManager && window.SaveManager) {
              window.UIManager.renderParentModal(window.SaveManager.getState());
            }
          }
        });
      }

      // Parent Modal Obby Jump Mini-Game Speed Multiplier Selector (#dashboard-obby-speed-selector inside #parent-modal)
      const dashObbySpeedContainer = document.getElementById('dashboard-obby-speed-selector');
      if (dashObbySpeedContainer) {
        dashObbySpeedContainer.addEventListener('click', function (e) {
          const btn = e.target.closest('[data-obby-mult]');
          if (!btn) return;
          const obbyMult = parseFloat(btn.getAttribute('data-obby-mult'));
          if (!isNaN(obbyMult)) {
            if (window.SoundEngine) window.SoundEngine.playClick();
            self.setObbySpeedMultiplier(obbyMult);
          }
        });
      }

      // Parent Modal Open / Close / PIN / Bonus Payout Events
      const btnOpenParent = document.getElementById('btn-open-parent-modal');
      if (btnOpenParent) {
        btnOpenParent.addEventListener('click', function () {
          self.openParentModal();
        });
      }
      const btnDashParentShortcut = document.getElementById('btn-dash-parent-shortcut');
      if (btnDashParentShortcut) {
        btnDashParentShortcut.addEventListener('click', function () {
          self.openParentModal();
        });
      }
      const btnDashParentSecondary = document.getElementById('btn-dashboard-parent');
      if (btnDashParentSecondary) {
        btnDashParentSecondary.addEventListener('click', function () {
          self.openParentModal();
        });
      }
      const btnCloseParent = document.getElementById('btn-close-parent');
      if (btnCloseParent) {
        btnCloseParent.addEventListener('click', function () {
          self.closeParentModal();
        });
      }
      const btnCloseParentBottom = document.getElementById('btn-close-parent-bottom');
      if (btnCloseParentBottom) {
        btnCloseParentBottom.addEventListener('click', function () {
          self.closeParentModal();
        });
      }
      const btnCloseParentPin = document.getElementById('btn-close-parent-pin');
      if (btnCloseParentPin) {
        btnCloseParentPin.addEventListener('click', function () {
          self.closeParentModal();
        });
      }

      const verifyPinAction = function () {
        const pinInput = document.getElementById('parent-pin-input');
        const pinErr = document.getElementById('parent-pin-error');
        const val = pinInput ? pinInput.value : '';
        const isOk = window.SaveManager && typeof window.SaveManager.verifyParentPin === 'function'
          ? window.SaveManager.verifyParentPin(val)
          : (String(val).trim() === '1508');

        if (isOk) {
          state.parentUnlocked = true;
          if (window.SoundEngine) window.SoundEngine.playCorrect(1);
          if (pinErr) pinErr.classList.add('hidden');
          if (window.UIManager && window.SaveManager) {
            window.UIManager.showParentModal(window.SaveManager.getState(), true);
          }
        } else {
          if (window.SoundEngine) window.SoundEngine.playWrong();
          if (pinErr) pinErr.classList.remove('hidden');
        }
      };

      const btnVerifyPin = document.getElementById('btn-verify-parent-pin');
      if (btnVerifyPin) {
        btnVerifyPin.addEventListener('click', verifyPinAction);
      }
      const parentPinInput = document.getElementById('parent-pin-input');
      if (parentPinInput) {
        parentPinInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            verifyPinAction();
          }
        });
      }

      const btnSaveParentPin = document.getElementById('btn-save-parent-pin');
      if (btnSaveParentPin) {
        btnSaveParentPin.addEventListener('click', function () {
          const newPinInput = document.getElementById('parent-new-pin-input');
          const newVal = newPinInput ? newPinInput.value.trim() : '';
          if (newVal.length < 4) {
            window.alert('새 비밀번호는 4자리 이상 입력해 주세요.');
            return;
          }
          if (window.SaveManager && typeof window.SaveManager.setParentPin === 'function') {
            window.SaveManager.setParentPin(newVal);
            if (newPinInput) newPinInput.value = '';
            if (window.UIManager) {
              window.UIManager.showFeedbackToast(true, '🔑 보호자 비밀번호가 변경되었습니다!');
            }
          }
        });
      }

      const parentTabNav = document.getElementById('parent-tab-nav');
      if (parentTabNav) {
        parentTabNav.addEventListener('click', function (e) {
          const tabBtn = e.target.closest('[data-parent-tab]');
          if (!tabBtn) return;
          if (window.SoundEngine) window.SoundEngine.playClick();
          const targetTab = tabBtn.getAttribute('data-parent-tab');
          parentTabNav.querySelectorAll('[data-parent-tab]').forEach(function (b) {
            const isAct = b.getAttribute('data-parent-tab') === targetTab;
            b.classList.toggle('active', isAct);
            b.setAttribute('aria-selected', isAct ? 'true' : 'false');
          });
          ['bonus', 'settings', 'reset'].forEach(function (tabName) {
            const pane = document.getElementById('parent-tab-' + tabName);
            if (pane) {
              pane.classList.toggle('hidden', tabName !== targetTab);
              pane.classList.toggle('active', tabName === targetTab);
            }
          });
        });
      }

      const parentBonusContainer = document.getElementById('parent-bonus-list-container');
      if (parentBonusContainer) {
        parentBonusContainer.addEventListener('click', function (e) {
          const saveNameBtn = e.target.closest('[data-action="save-bonus-name"]');
          if (saveNameBtn) {
            const key = saveNameBtn.getAttribute('data-bonus-key');
            const card = saveNameBtn.closest('.parent-bonus-card');
            const input = card ? card.querySelector('.parent-bonus-name-input') : null;
            if (key && input) {
              self.setBonusName(key, input.value);
            }
            return;
          }

          const stepBtn = e.target.closest('[data-action="step-bonus-count"]');
          if (stepBtn) {
            const key = stepBtn.getAttribute('data-bonus-key');
            const step = parseInt(stepBtn.getAttribute('data-step'), 10) || 0;
            if (key && step !== 0) {
              self.stepBonusAchievedCount(key, step);
            }
            return;
          }

          const saveCountBtn = e.target.closest('[data-action="save-bonus-count"]');
          if (saveCountBtn) {
            const key = saveCountBtn.getAttribute('data-bonus-key');
            const card = saveCountBtn.closest('.parent-bonus-card');
            const input = card ? card.querySelector('.parent-bonus-count-input') : null;
            if (key && input) {
              self.setBonusAchievedCount(key, input.value);
            }
            return;
          }

          const markBtn = e.target.closest('[data-action="mark-paid"]');
          if (markBtn && !markBtn.disabled) {
            const key = markBtn.getAttribute('data-bonus-key');
            if (key) self.markBonusPaid(key);
            return;
          }

          const undoBtn = e.target.closest('[data-action="undo-paid"]');
          if (undoBtn) {
            const key = undoBtn.getAttribute('data-bonus-key');
            if (key) self.undoBonusPaid(key);
          }
        });

        parentBonusContainer.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          const nameInput = e.target.closest('.parent-bonus-name-input');
          if (nameInput) {
            e.preventDefault();
            const key = nameInput.getAttribute('data-bonus-key');
            if (key) self.setBonusName(key, nameInput.value);
            return;
          }
          const countInput = e.target.closest('.parent-bonus-count-input');
          if (countInput) {
            e.preventDefault();
            const key = countInput.getAttribute('data-bonus-key');
            if (key) self.setBonusAchievedCount(key, countInput.value);
          }
        });

        // Real-time auto-save as the user types on their phone keyboard so edits are never lost even without pressing [이름저장]!
        parentBonusContainer.addEventListener('input', function (e) {
          const nameInput = e.target.closest('.parent-bonus-name-input');
          if (nameInput && window.SaveManager && typeof window.SaveManager.setBonusName === 'function') {
            const key = nameInput.getAttribute('data-bonus-key');
            const val = String(nameInput.value || '').trim();
            if (key && val) {
              const updated = window.SaveManager.setBonusName(key, val);
              if (window.UIManager) {
                window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
              }
              syncHUD();
            }
            return;
          }
          const countInput = e.target.closest('.parent-bonus-count-input');
          if (countInput && window.SaveManager && typeof window.SaveManager.setBonusAchievedCount === 'function') {
            const key = countInput.getAttribute('data-bonus-key');
            const num = parseInt(countInput.value, 10);
            if (key && !isNaN(num) && num >= 1) {
              const updated = window.SaveManager.setBonusAchievedCount(key, num);
              if (window.UIManager) {
                window.UIManager.renderDashboard(updated, state.selectedDashboardStage);
              }
              syncHUD();
            }
          }
        });

        parentBonusContainer.addEventListener('change', function (e) {
          const nameInput = e.target.closest('.parent-bonus-name-input');
          if (nameInput) {
            const key = nameInput.getAttribute('data-bonus-key');
            const val = String(nameInput.value || '').trim();
            if (key && val) {
              self.setBonusName(key, val);
            }
            return;
          }
          const countInput = e.target.closest('.parent-bonus-count-input');
          if (countInput) {
            const key = countInput.getAttribute('data-bonus-key');
            const num = parseInt(countInput.value, 10);
            if (key && !isNaN(num) && num >= 1) {
              self.setBonusAchievedCount(key, num);
            }
            return;
          }
          const sel = e.target.closest('.parent-payout-select');
          if (!sel) return;
          const key = sel.getAttribute('data-bonus-key');
          if (!key) return;
          if (sel.value === 'paid') {
            self.markBonusPaid(key);
          } else if (sel.value === 'paid_all') {
            self.setBonusAchievedCount(key, 0);
          }
        });
      }

      // Bottom 3-Lane Brick Buttons (#btn-lane-0/1/2): ONLY touching these 3 bricks moves the car left/center/right!
      [0, 1, 2].forEach(function (laneIdx) {
        const laneBtn = document.getElementById(`btn-lane-${laneIdx}`);
        if (laneBtn) {
          let lastBrickTap = 0;
          laneBtn.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            lastBrickTap = Date.now();
            self.selectLane(laneIdx);
          });
          laneBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (Date.now() - lastBrickTap < 420) return;
            self.selectLane(laneIdx);
          });
        }
        const steerBtn = document.getElementById(`touch-steer-${laneIdx}`);
        if (steerBtn) {
          steerBtn.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.selectLane(laneIdx);
          });
          steerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            self.selectLane(laneIdx);
          });
        }
        const choicePill = document.getElementById(`choice-pill-${laneIdx}`);
        if (choicePill) {
          choicePill.addEventListener('click', function () {
            self.selectLane(laneIdx);
          });
        }
      });

      // Start Dashboard Primary CTA & Blinking Attract Graphic -> Opens World Adventure Tree Map BEFORE starting the race!
      const btnStart = document.getElementById('btn-start-game');
      if (btnStart) {
        btnStart.addEventListener('click', function () {
          self.openPreStartTreeMap(state.selectedDashboardStage);
        });
      }

      const attractBanner = document.getElementById('soyun-arcade-attract-banner');
      if (attractBanner) {
        attractBanner.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.openPreStartTreeMap(state.selectedDashboardStage);
        });
      }

      const showcaseStage = document.getElementById('main-game-stage-showcase');
      if (showcaseStage) {
        showcaseStage.addEventListener('click', function () {
          self.openPreStartTreeMap(state.selectedDashboardStage);
        });
      }

      // Subject Mode Selector
      const modeContainer = document.getElementById('subject-mode-selector');
      if (modeContainer) {
        modeContainer.addEventListener('click', function (e) {
          const btn = e.target.closest('.mode-pill');
          if (!btn) return;
          const mode = btn.getAttribute('data-mode');
          if (mode) {
            if (window.SoundEngine) window.SoundEngine.playClick();
            self.setSubjectMode(mode);
          }
        });
      }

      // Stage Selector Pill Bar
      const stageBar = document.getElementById('stage-selector-bar');
      if (stageBar) {
        stageBar.addEventListener('click', function (e) {
          const btn = e.target.closest('.stage-pill');
          if (!btn || btn.disabled) return;
          const stg = parseInt(btn.getAttribute('data-stage'), 10);
          if (!isNaN(stg) && stg >= 1) {
            if (window.SoundEngine) window.SoundEngine.playClick();
            state.selectedDashboardStage = stg;
            if (window.UIManager && window.SaveManager) {
              window.UIManager.renderDashboard(window.SaveManager.getState(), state.selectedDashboardStage);
            }
          }
        });
      }

      // Reset Progress Button
      const btnReset = document.getElementById('btn-reset-progress');
      if (btnReset) {
        btnReset.addEventListener('click', function () {
          self.resetAllProgress(false);
        });
      }

      // Utility Bar Buttons
      const btnOpenReview = document.getElementById('btn-open-review');
      if (btnOpenReview) {
        btnOpenReview.addEventListener('click', function () {
          self.openReviewModal();
        });
      }

      const btnDashReview = document.getElementById('btn-dashboard-review');
      if (btnDashReview) {
        btnDashReview.addEventListener('click', function () {
          self.openReviewModal();
        });
      }

      const btnGameoverReview = document.getElementById('btn-gameover-review');
      if (btnGameoverReview) {
        btnGameoverReview.addEventListener('click', function () {
          self.openReviewModal();
        });
      }

      const btnPauseReview = document.getElementById('btn-pause-review');
      if (btnPauseReview) {
        btnPauseReview.addEventListener('click', function () {
          self.openReviewModal();
        });
      }

      const btnCloseReview = document.getElementById('btn-close-review');
      if (btnCloseReview) {
        btnCloseReview.addEventListener('click', function () {
          self.closeReviewModal();
        });
      }

      const btnCloseReviewBottom = document.getElementById('btn-close-review-bottom');
      if (btnCloseReviewBottom) {
        btnCloseReviewBottom.addEventListener('click', function () {
          self.closeReviewModal();
        });
      }

      const btnToggleSound = document.getElementById('btn-toggle-sound');
      if (btnToggleSound) {
        btnToggleSound.addEventListener('click', function () {
          self.toggleSound();
        });
      }

      const btnPause = document.getElementById('btn-pause');
      if (btnPause) {
        btnPause.addEventListener('click', function () {
          self.togglePause();
        });
      }

      // Left-Side Cute Mini Speed Up/Down Arrows (x 1.0 ~ x 1.6)
      const btnSpeedUp = document.getElementById('btn-speed-up');
      if (btnSpeedUp) {
        btnSpeedUp.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.stepLeftSpeedArrow(0.1);
        });
      }
      const btnSpeedDown = document.getElementById('btn-speed-down');
      if (btnSpeedDown) {
        btnSpeedDown.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.stepLeftSpeedArrow(-0.1);
        });
      }

      const pauseInlineBanner = document.getElementById('pause-inline-banner');
      if (pauseInlineBanner) {
        pauseInlineBanner.addEventListener('click', function () {
          if (state.isPaused) {
            self.resumeGame();
          }
        });
      }

      const btnGoDash = document.getElementById('btn-go-dashboard');
      if (btnGoDash) {
        btnGoDash.addEventListener('click', function () {
          if (window.SoundEngine) window.SoundEngine.playClick();
          self.returnToDashboard();
        });
      }

      // Pause Modal Buttons
      const btnResume = document.getElementById('btn-resume-game');
      if (btnResume) {
        btnResume.addEventListener('click', function () {
          self.resumeGame();
        });
      }

      const btnPauseDash = document.getElementById('btn-pause-dashboard');
      if (btnPauseDash) {
        btnPauseDash.addEventListener('click', function () {
          self.returnToDashboard();
        });
      }

      // Game Over / Stage Retry Modal Buttons
      const btnRetryStage = document.getElementById('btn-retry-stage');
      if (btnRetryStage) {
        btnRetryStage.addEventListener('click', function () {
          self.retryCurrentStage();
        });
      }

      const btnGameoverDash = document.getElementById('btn-gameover-dashboard');
      if (btnGameoverDash) {
        btnGameoverDash.addEventListener('click', function () {
          self.returnToDashboard();
        });
      }

      // Top-Right Close Button next to Life Panel (#btn-top-close-game) & Confirm Exit Modal (#exit-confirm-modal)
      const btnTopCloseGame = document.getElementById('btn-top-close-game');
      if (btnTopCloseGame) {
        btnTopCloseGame.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.openExitConfirmModal();
        });
      }

      const btnExitConfirmYes = document.getElementById('btn-exit-confirm-yes');
      if (btnExitConfirmYes) {
        btnExitConfirmYes.addEventListener('click', function () {
          if (window.UIManager && typeof window.UIManager.hideExitConfirmModal === 'function') {
            window.UIManager.hideExitConfirmModal();
          }
          self.returnToDashboard();
        });
      }

      const btnExitConfirmNo = document.getElementById('btn-exit-confirm-no');
      if (btnExitConfirmNo) {
        btnExitConfirmNo.addEventListener('click', function () {
          self.cancelExitConfirmModal();
        });
      }

      // Boss Clear Step 1: Center Reward Status Popup (#boss-reward-modal) -> click anywhere (except inside the failed questions answer reveal box) to open Step 2 (#next-stage-modal)
      const bossRewardModal = document.getElementById('boss-reward-modal');
      if (bossRewardModal) {
        bossRewardModal.addEventListener('click', function (e) {
          if (e.target && e.target.closest('#boss-clear-wrong-section')) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          self.onBossRewardModalClick();
        });
      }

      // Boss Clear Step 2 & Pre-Start: Visual Treasure-Island World Adventure Map (#next-stage-modal)
      const btnNextStageYes = document.getElementById('btn-next-stage-yes');
      if (btnNextStageYes) {
        btnNextStageYes.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.confirmNextStageStart();
        });
      }

      const btnNextStageNo = document.getElementById('btn-next-stage-no');
      if (btnNextStageNo) {
        btnNextStageNo.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const modal = document.getElementById('next-stage-modal');
          const mode = modal ? modal.getAttribute('data-treemap-mode') : 'next_stage';
          if (window.UIManager && typeof window.UIManager.hideNextStageModal === 'function') {
            window.UIManager.hideNextStageModal();
          }
          if (mode === 'start') {
            if (window.UIManager && typeof window.UIManager.setStartScreenVisible === 'function') {
              window.UIManager.setStartScreenVisible(true);
            }
          } else {
            self.returnToDashboard();
          }
        });
      }

      // Clicking an island or number sphere on the Treasure Map immediately starts that stage!
      const skyTreeList = document.getElementById('sky-treemap-list');
      if (skyTreeList) {
        skyTreeList.addEventListener('click', function (e) {
          const modal = document.getElementById('next-stage-modal');
          if (!modal) return;
          const mode = modal.getAttribute('data-treemap-mode') || 'start';
          const node = e.target.closest('[data-treemap-stage]');
          if (!node) return;
          const stg = parseInt(node.getAttribute('data-treemap-stage'), 10);
          const isUnlocked = node.getAttribute('data-unlocked') === 'true';

          if (mode === 'next_stage') {
            e.preventDefault();
            e.stopPropagation();
            self.confirmNextStageStart();
            return;
          }

          if (!isNaN(stg) && stg >= 1 && isUnlocked) {
            e.preventDefault();
            e.stopPropagation();
            state.selectedDashboardStage = stg;
            modal.setAttribute('data-target-stage', String(stg));
            self.startGame(stg);
          }
        });
      }

      // Speech / Pronunciation HUD Buttons (Stage 3+ Speaking Quiz)
      const btnSpeechTts = document.getElementById('btn-speech-listen-tts');
      if (btnSpeechTts) {
        btnSpeechTts.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (state.currentQuestion && state.currentQuestion.targetWord) {
            speakTargetWordTTS(state.currentQuestion.targetWord);
          }
        });
      }

      const btnSpeechMic = document.getElementById('btn-speech-retry-mic');
      if (btnSpeechMic) {
        btnSpeechMic.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (!state.currentQuestion || !state.currentQuestion.isSpeech) return;
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
            state.currentQuestion.speechPassed = true;
            state.currentQuestion.spokenText = state.currentQuestion.targetWord;
            if (window.Engine3D && typeof window.Engine3D.resolveSpeechGatePass === 'function') {
              window.Engine3D.resolveSpeechGatePass(state.currentQuestion.targetWord);
            }
            return;
          }
          startSpeechListening(state.currentQuestion);
        });
      }
    }
  };

  window.GameController = GameController;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      GameController.init();
    });
  } else {
    GameController.init();
  }
})(window);
