/**
 * Run & Learn Racer 3D (런앤런 레이서 3D - 소윤이의 로블록스 오비 에디션)
 * 3D Roblox Obby + Synthwave Arcade Racing & Physics Engine (Three.js)
 * Features:
 *  - "소윤이의 로블록스 오비 슈퍼카트" + 3D Blocky Avatar "👑 [VIP] 이소윤" + Floating 3D Cube Pet
 *  - Roblox Obby Studded Rainbow Platforms & Jump Pads along the highway
 *  - Giant 3D Blocky Roblox Mecha Boss with swinging Ban-Hammer at BOSS_Z = -38, y = 2.8
 *  - Explosive 40+ 3D Roblox Brick Shatter + Robux (R$) Coin Bursts + Camera FOV Zoom Punch
 *  - Twin Kart + Pet Mega Laser & Golden Rocket Strike with Boss Knockback Recoil
 * Exposes `window.Engine3D`
 */
(function (global) {
  'use strict';

  const DEFAULT_CONFIG = {
    LANES: [-4.5, 0, 4.5],
    GATE_SPAWN_Z: -74,
    GATE_PASS_Z: 8,
    GATE_DESPAWN_Z: 24,
    BOSS_Z: -38,
    BASE_SPEED: 32.4,
    MAX_SPEED: 500,
    MIN_SPEED: 1.5
  };

  const STAGE_THEMES = [
    {
      id: 1,
      biome: 'river_nature',
      name: '🏞️ 에메랄드 강변 & 알프스 대자연 숲',
      primary: 0x00f5d4,
      secondary: 0x38bdf8,
      accent: 0xffe600,
      fog: 0x1b4d3e,
      ground: 0x1e5631,
      river: 0x0096c7,
      riverFoam: 0x90e0ef,
      skyTop: '#0d47a1',
      skyUpper: '#29b6f6',
      skyLower: '#81d4fa',
      skyBottom: '#a7f3d0',
      sunColor: '#fff59d',
      road: 0x1e293b,
      grid: 0x22c55e,
      curbA: 0x10b981,
      curbB: 0xfacc15,
      mountain: 0x2d6a4f,
      mountainCap: 0xffffff,
      mountainEdge: 0x52b788,
      treeFoliage: 0x22c55e,
      treeTrunk: 0x5c3a21,
      showGrid: false
    },
    {
      id: 2,
      biome: 'jungle_safari',
      name: '🌴 아마존 정글 & 황금 사자 사파리',
      primary: 0x84cc16,
      secondary: 0xf59e0b,
      accent: 0xffe600,
      fog: 0x14381c,
      ground: 0x1b4322,
      river: 0x0d9488,
      riverFoam: 0x99f6e4,
      skyTop: '#064e3b',
      skyUpper: '#15803d',
      skyLower: '#84cc16',
      skyBottom: '#fef08a',
      sunColor: '#fde047',
      road: 0x292514,
      grid: 0x84cc16,
      curbA: 0x84cc16,
      curbB: 0xf59e0b,
      mountain: 0x14532d,
      mountainCap: 0x4ade80,
      mountainEdge: 0x84cc16,
      treeFoliage: 0x16a34a,
      treeTrunk: 0x713f12,
      showGrid: false
    },
    {
      id: 3,
      biome: 'desert_pyramid',
      name: '🏜️ 황금 사막 피라미드 & 낙타 오아시스',
      primary: 0xfbbf24,
      secondary: 0xf97316,
      accent: 0x38bdf8,
      fog: 0x6b3a14,
      ground: 0xd97706,
      river: 0x06b6d4,
      riverFoam: 0xa5f3fc,
      skyTop: '#7c2d12',
      skyUpper: '#ea580c',
      skyLower: '#fbbf24',
      skyBottom: '#fef3c7',
      sunColor: '#fffbeb',
      road: 0x3b2612,
      grid: 0xfbbf24,
      curbA: 0xf59e0b,
      curbB: 0xfef08a,
      mountain: 0xb45309,
      mountainCap: 0xfde047,
      mountainEdge: 0xfbbf24,
      treeFoliage: 0x15803d,
      treeTrunk: 0x92400e,
      showGrid: false
    },
    {
      id: 4,
      biome: 'glacier_ice',
      name: '🧊 남극 크리스탈 빙하 & 얼음 대륙',
      primary: 0x38bdf8,
      secondary: 0x7dd3fc,
      accent: 0x00f5d4,
      fog: 0x0c4a6e,
      ground: 0xe0f2fe,
      river: 0x0284c7,
      riverFoam: 0xffffff,
      skyTop: '#082f49',
      skyUpper: '#0284c7',
      skyLower: '#7dd3fc',
      skyBottom: '#f0f9ff',
      sunColor: '#e0f2fe',
      road: 0x0f2942,
      grid: 0x38bdf8,
      curbA: 0x38bdf8,
      curbB: 0xffffff,
      mountain: 0x38bdf8,
      mountainCap: 0xffffff,
      mountainEdge: 0xbae6fd,
      treeFoliage: 0x7dd3fc,
      treeTrunk: 0x0369a1,
      showGrid: false
    },
    {
      id: 5,
      biome: 'dino_jurassic',
      name: '🦖 쥬라기 공룡시대 & 원시 화산 밀림',
      primary: 0x22c55e,
      secondary: 0xf97316,
      accent: 0xfacc15,
      fog: 0x243018,
      ground: 0x2d3a1e,
      river: 0x0d9488,
      riverFoam: 0x5eead4,
      skyTop: '#3b1d11',
      skyUpper: '#9a3412',
      skyLower: '#f59e0b',
      skyBottom: '#bef264',
      sunColor: '#fde047',
      road: 0x262114,
      grid: 0x22c55e,
      curbA: 0x22c55e,
      curbB: 0xf97316,
      mountain: 0x365314,
      mountainCap: 0xff5722,
      mountainEdge: 0x84cc16,
      treeFoliage: 0x15803d,
      treeTrunk: 0x451a03,
      showGrid: false
    },
    {
      id: 6,
      biome: 'sky_heaven',
      name: '☁️ 천공의 구름 왕국 · 하늘 위 무지개 길',
      primary: 0x38bdf8,
      secondary: 0xfacc15,
      accent: 0xff80b5,
      fog: 0x1e40af,
      ground: 0xbae6fd,
      river: 0x38bdf8,
      riverFoam: 0xffffff,
      skyTop: '#0284c7',
      skyUpper: '#38bdf8',
      skyLower: '#93c5fd',
      skyBottom: '#fef08a',
      sunColor: '#fffbeb',
      road: 0x1e3a8a,
      grid: 0x7dd3fc,
      curbA: 0xfacc15,
      curbB: 0xffffff,
      mountain: 0xe0f2fe,
      mountainCap: 0xffffff,
      mountainEdge: 0x38bdf8,
      treeFoliage: 0xffffff,
      treeTrunk: 0xfde047,
      showGrid: false
    },
    {
      id: 7,
      biome: 'underwater_ocean',
      name: '🐠 신비한 바닷속 산호초 & 아틀란티스 해저월드',
      primary: 0x00f5d4,
      secondary: 0x00bbf9,
      accent: 0xff6b6b,
      fog: 0x003554,
      ground: 0x004e64,
      river: 0x0077b6,
      riverFoam: 0x90e0ef,
      skyTop: '#001d3d',
      skyUpper: '#00509d',
      skyLower: '#0096c7',
      skyBottom: '#00b4d8',
      sunColor: '#90e0ef',
      road: 0x002845,
      grid: 0x00f5d4,
      curbA: 0x00f5d4,
      curbB: 0xff6b6b,
      mountain: 0x005f73,
      mountainCap: 0xff758f,
      mountainEdge: 0x00f5d4,
      treeFoliage: 0xff6b6b,
      treeTrunk: 0x0a9396,
      showGrid: false
    },
    {
      id: 8,
      biome: 'molten_lava',
      name: '🌋 불타는 화산 용암지대 & 마그마 협곡',
      primary: 0xff6d00,
      secondary: 0xff0055,
      accent: 0xffea00,
      fog: 0x2b0904,
      ground: 0x1f0805,
      river: 0xff3d00,
      riverFoam: 0xffea00,
      skyTop: '#140202',
      skyUpper: '#6a040f',
      skyLower: '#dc2f02',
      skyBottom: '#ff6d00',
      sunColor: '#ffea00',
      road: 0x1a0808,
      grid: 0xff4500,
      curbA: 0xff6d00,
      curbB: 0xffea00,
      mountain: 0x240b07,
      mountainCap: 0xff4500,
      mountainEdge: 0xff9e00,
      treeFoliage: 0xff4500,
      treeTrunk: 0x1a0f0f,
      showGrid: false
    },
    {
      id: 9,
      biome: 'wonderland_magic',
      name: '🎠 상상의 나라 · 마법 동화 & 캔디 원더랜드',
      primary: 0xff66cc,
      secondary: 0x72efdd,
      accent: 0xffe600,
      fog: 0x3b185f,
      ground: 0x5a189a,
      river: 0xff4da6,
      riverFoam: 0x80ffdb,
      skyTop: '#240046',
      skyUpper: '#7b2cbf',
      skyLower: '#c77dff',
      skyBottom: '#ff99c8',
      sunColor: '#fff3b0',
      road: 0x2d1440,
      grid: 0xff66cc,
      curbA: 0xff66cc,
      curbB: 0x72efdd,
      mountain: 0x7b2cbf,
      mountainCap: 0xffccd5,
      mountainEdge: 0x80ffdb,
      treeFoliage: 0xff66cc,
      treeTrunk: 0xffffff,
      showGrid: false
    },
    {
      id: 10,
      biome: 'cherry_lake',
      name: '🌸 벚꽃 호수 & 황금 만원 보스 신전',
      primary: 0xff80b5,
      secondary: 0x38bdf8,
      accent: 0xffe600,
      fog: 0x2d3a54,
      ground: 0x2e6f40,
      river: 0x00b4d8,
      riverFoam: 0xcaf0f8,
      skyTop: '#1e3a8a',
      skyUpper: '#f472b6',
      skyLower: '#fbcfe8',
      skyBottom: '#fde68a',
      sunColor: '#fff1f2',
      road: 0x26243b,
      grid: 0xff80b5,
      curbA: 0xff80b5,
      curbB: 0xffffff,
      mountain: 0x3b7a57,
      mountainCap: 0xffb3c6,
      mountainEdge: 0xff80b5,
      treeFoliage: 0xff85a1,
      treeTrunk: 0x4a2c2a,
      showGrid: false
    }
  ];

  const ROBLOX_BRICK_COLORS = [
    0xff2a55, // Bright Red
    0x00b4ff, // Obby Cyan Blue
    0x00ff88, // Slime Green
    0xffe600, // Bright Yellow
    0xff4da6, // Soyun Pink
    0x9b5de5, // Royal Purple
    0xff7b00, // Neon Orange
    0x00f5d4  // Mint Aqua
  ];

  function getCfg() {
    const gc = global.GameConfig || {};
    return {
      LANES: Array.isArray(gc.LANES) && gc.LANES.length === 3 ? gc.LANES : DEFAULT_CONFIG.LANES,
      GATE_SPAWN_Z: typeof gc.GATE_SPAWN_Z === 'number' ? gc.GATE_SPAWN_Z : DEFAULT_CONFIG.GATE_SPAWN_Z,
      GATE_PASS_Z: typeof gc.GATE_PASS_Z === 'number' ? gc.GATE_PASS_Z : DEFAULT_CONFIG.GATE_PASS_Z,
      GATE_DESPAWN_Z: typeof gc.GATE_DESPAWN_Z === 'number' ? gc.GATE_DESPAWN_Z : DEFAULT_CONFIG.GATE_DESPAWN_Z,
      BOSS_Z: DEFAULT_CONFIG.BOSS_Z
    };
  }

  function hexToCss(hex) {
    if (typeof hex === 'string') return hex;
    return '#' + ('000000' + (hex >>> 0).toString(16)).slice(-6);
  }

  function parseColorHex(val, fallback) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.startsWith('#')) {
      const parsed = parseInt(val.slice(1), 16);
      if (!isNaN(parsed)) return parsed;
    }
    return fallback;
  }

  /**
   * CORS-safe Texture Helper:
   * Immediately creates a vibrant procedural CanvasTexture so WebGL NEVER renders black
   * (even when index.html is opened directly over file://), and swaps in the PNG image
   * only if it passes an offscreen canvas taint test without throwing a SecurityError.
   */
  function createSafeTexture(url, width, height, drawProceduralFn, onImageLoadedFn) {
    const THREE = global.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (typeof drawProceduralFn === 'function') {
      drawProceduralFn(ctx, width, height);
    }

    if (!THREE) return null;
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    if (url) {
      const resolvedUrl = (global.NanoBananaAssets && global.NanoBananaAssets[url]) ? global.NanoBananaAssets[url] : url;
      const img = new Image();
      if (!resolvedUrl.startsWith('data:') && global.location && global.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
      }
      img.onload = function () {
        try {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 4;
          testCanvas.height = 4;
          const testCtx = testCanvas.getContext('2d');
          testCtx.drawImage(img, 0, 0, 4, 4);
          testCtx.getImageData(0, 0, 1, 1);

          if (typeof onImageLoadedFn === 'function') {
            onImageLoadedFn(ctx, img, width, height, drawProceduralFn);
          } else {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          texture.needsUpdate = true;
        } catch (_err) {
          // Keep procedural fallback on file:// CORS restriction
        }
      };
      img.onerror = function () {
        // Keep procedural fallback if image is missing
      };
      img.src = resolvedUrl;
    }

    return { texture, canvas, ctx, drawProceduralFn };
  }

  /**
   * Draws a rounded rectangle path on a 2D canvas context
   */
  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  const Engine3D = {
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    rafId: null,

    isInitialized: false,
    isRunning: false,
    isPaused: false,
    isDemoMode: false,
    demoTimer: 0,

    // Callbacks
    onGatePass: null,
    onGateProgress: null,
    onObbyWavePass: null,

    // Player & Physics State
    currentLane: 1,
    targetLane: 1,
    currentSpeed: 130,
    targetSpeed: 130,
    elapsedTime: 0,
    roadScrollOffset: 0,
    carJumpY: 0,
    carJumpVel: 0,
    isJumping: false,
    viewOrientationMode: 'auto', // 'auto' | 'portrait' | 'landscape'

    // Camera Shake, Zoom Punch & Flash State
    shakeIntensity: 0,
    shakeTimer: 0,
    cameraZoomPunch: 0,
    damageFlashTimer: 0,
    boostEffectTimer: 0,
    stageClearTimer: 0,

    // Theme State
    currentTheme: STAGE_THEMES[0],

    // 3D Scene Groups & Collections
    carGroup: null,
    carWheels: [],
    carFlames: [],
    carBodyMaterials: [],
    carUnderGlow: null,
    steeringWheelMesh: null,

    // Soyun 3D Roblox Avatar & Floating Cube Pet State
    soyunAvatarGroup: null,
    soyunHeadMesh: null,
    soyunCrownGroup: null,
    soyunLeftArm: null,
    soyunRightArm: null,
    soyunLeftPigtail: null,
    soyunRightPigtail: null,
    soyunNameSprite: null,
    avatarCheerTimer: 0,

    petGroup: null,
    petLeftWing: null,
    petRightWing: null,
    petSpinTimer: 0,
    carHurtTimer: 0,
    carHurtType: 'block',

    roadGroup: null,
    laneDashMeshes: [],
    curbMeshes: [],
    sceneryItems: [],
    obbyPlatforms: [],
    speedLineParticles: null,
    starField: null,
    skyBackdropMesh: null,
    retroSunMesh: null,
    skyTextureObj: null,

    // Lights
    ambientLight: null,
    dirLight: null,
    carPointLight: null,

    // Gates & Obstacles
    activeGates: [],
    activeObbyWaves: [],
    hazardBarriers: [],

    // Particles, 3D Shatter Bricks & Laser Beams
    particleBursts: [],
    activeBricks: [],
    activeLasers: [],
    activeProjectiles: [],
    sharedBrickGeo: null,
    sharedStudGeo: null,
    sharedRobuxGeo: null,
    sharedBrickMaterials: [],
    sharedRobuxMaterial: null,

    // Boss State
    isBossActive: false,
    bossGroup: null,
    bossCoreMesh: null,
    bossBillboardMesh: null,
    bossHpFillMesh: null,
    bossLeftArm: null,
    bossRightArm: null,
    bossHammerGroup: null,
    bossRing1: null,
    bossRing2: null,
    bossHpRatio: 1.0,
    bossHitTimer: 0,
    bossRecoilZ: 0,
    bossRecoilY: 0,
    bossRecoilPitch: 0,
    bossRecoilYaw: 0,
    bossRecoilRoll: 0,
    bossSquashTimer: 0,
    bossSpotlightTimer: 0,
    bossImpactLight: null,
    bossAttackCycleIndex: 0,
    lastBossAttackInfo: null,
    bossChainExplosions: [],
    bossDefeating: false,
    bossDefeatTimer: 0,
    bossDefeatCallback: null,
    lastAutoLaserTime: 0,

    // Shared Textures
    textures: {
      skybox: null,
      playerCar: null,
      obstacleBarrier: null,
      bossMecha: null,
      soyunFace: null,
      petFace: null,
      soyunNameplate: null
    },

    /**
     * Initialize the Three.js 3D Engine inside containerElement
     */
    init: function (containerElement, callbacks) {
      if (containerElement && typeof containerElement === 'object' && !(containerElement instanceof HTMLElement) && !callbacks) {
        callbacks = containerElement;
        containerElement = null;
      }
      if (typeof containerElement === 'string') {
        containerElement = document.querySelector(containerElement) || document.getElementById(containerElement);
      }
      if (!containerElement) {
        containerElement =
          document.getElementById('canvas-container') ||
          document.getElementById('game-canvas-container') ||
          document.getElementById('three-container') ||
          document.getElementById('game-container') ||
          document.body;
      }

      this.container = containerElement;

      if (callbacks) {
        if (typeof callbacks.onGatePass === 'function') this.onGatePass = callbacks.onGatePass;
        if (typeof callbacks.onGateProgress === 'function') this.onGateProgress = callbacks.onGateProgress;
        if (typeof callbacks.onObbyWavePass === 'function') this.onObbyWavePass = callbacks.onObbyWavePass;
        if (typeof callbacks.onHeavenStairStep === 'function') this.onHeavenStairStep = callbacks.onHeavenStairStep;
      }

      if (this.isInitialized) {
        this.resize();
        return this;
      }

      const THREE = global.THREE;
      if (!THREE) {
        console.error('Engine3D: THREE.js is not loaded.');
        return this;
      }
      this._installGraphicStyleAdapter();

      const width = this.container.clientWidth || global.innerWidth || 1280;
      const height = this.container.clientHeight || global.innerHeight || 720;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.currentTheme.fog);
      this.scene.fog = new THREE.FogExp2(this.currentTheme.fog, 0.0058);

      this.camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 320);
      this.camera.position.set(0, 4.4, 16.5);
      this.camera.lookAt(0, 1.8, -30);

      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));

        const oldCanvas = this.container.querySelector('canvas');
        if (oldCanvas && oldCanvas.parentNode === this.container) {
          this.container.removeChild(oldCanvas);
        }
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.container.appendChild(this.renderer.domElement);
      } catch (e) {
        console.warn('Engine3D: WebGLRenderer fallback mode activated:', e);
        this.renderer = null;
      }

      this.clock = new THREE.Clock();

      this._initSharedBrickAssets();
      this._initTextures();
      this._buildLighting();
      this._buildSkyAndHorizon();
      this._buildHighwayAndScenery();
      this._buildPlayerCar();
      this._buildSpeedLines();
      this._buildBossModel();

      this._boundResize = () => this.resize();
      global.addEventListener('resize', this._boundResize);
      global.addEventListener('orientationchange', () => {
        setTimeout(() => this.resize(), 120);
      });
      if (global.visualViewport) {
        global.visualViewport.addEventListener('resize', this._boundResize);
      }

      this.isInitialized = true;
      this.resize();
      this.renderSingleFrame();
      return this;
    },

    /**
     * Initialize shared geometries & materials for 3D Roblox Brick Shatter & Studs
     */
    graphicStyle: 'smooth',

    getGraphicStyle: function () {
      if (!this._graphicStyleLoaded) {
        this._graphicStyleLoaded = true;
        try {
          const saved = global.localStorage && global.localStorage.getItem('soyun_graphic_style_v1');
          if (saved === 'pixel' || saved === 'cartoon' || saved === 'smooth') {
            this.graphicStyle = saved;
          }
        } catch (_e) {}
      }
      return this.graphicStyle || 'smooth';
    },

    _getSoftGlowDotTexture: function () {
      const THREE = global.THREE;
      if (this._softGlowDotTex) return this._softGlowDotTex;
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
      g.addColorStop(0.75, 'rgba(255, 255, 255, 0.25)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      this._softGlowDotTex = new THREE.CanvasTexture(c);
      this._softGlowDotTex.needsUpdate = true;
      return this._softGlowDotTex;
    },

    _installGraphicStyleAdapter: function () {
      const THREE = global.THREE;
      if (!THREE || THREE.__SOYUN_SMOOTH_ADAPTER_INSTALLED__) return;
      THREE.__SOYUN_SMOOTH_ADAPTER_INSTALLED__ = true;

      const self = this;
      const OrigBox = THREE.BoxGeometry;
      const OrigCone = THREE.ConeGeometry;
      const OrigCyl = THREE.CylinderGeometry;
      const OrigDodec = THREE.DodecahedronGeometry;
      const OrigOcta = THREE.OctahedronGeometry;
      const OrigStdMat = THREE.MeshStandardMaterial;
      const OrigPointsMat = THREE.PointsMaterial;

      THREE.__OrigBoxGeometry = OrigBox;

      // 1. BoxGeometry: In 'smooth' mode, convert 1x1x1 cubes into smooth rounded 3D super-ellipsoids!
      const PatchedBox = function (w, h, d, ws, hs, ds) {
        const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
        const bw = w !== undefined ? w : 1;
        const bh = h !== undefined ? h : 1;
        const bd = d !== undefined ? d : 1;
        if (isSmooth && (!ws || ws === 1) && (!hs || hs === 1) && (!ds || ds === 1)) {
          const segs = 8;
          const geo = new OrigBox(bw, bh, bd, segs, segs, segs);
          const pos = geo.attributes.position;
          const norm = geo.attributes.normal;
          const hw = bw * 0.5 || 0.5;
          const hh = bh * 0.5 || 0.5;
          const hd = bd * 0.5 || 0.5;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            const vz = pos.getZ(i);
            const nx = vx / hw;
            const ny = vy / hh;
            const nz = vz / hd;
            const r2 = nx * nx + ny * ny + nz * nz;
            if (r2 > 0.0001) {
              // Smoothly round edges & corners (super-ellipsoid spherize)
              const factor = 1.0 / Math.pow(r2, 0.28);
              pos.setXYZ(i, vx * factor, vy * factor, vz * factor);
              // Smooth continuous outward normal
              const fnx = norm.getX(i);
              const fny = norm.getY(i);
              const fnz = norm.getZ(i);
              let snx = nx / hw;
              let sny = ny / hh;
              let snz = nz / hd;
              const slen = Math.hypot(snx, sny, snz) || 1;
              snx /= slen;
              sny /= slen;
              snz /= slen;
              let bx = fnx * 0.22 + snx * 0.78;
              let by = fny * 0.22 + sny * 0.78;
              let bz = fnz * 0.22 + snz * 0.78;
              const blen = Math.hypot(bx, by, bz) || 1;
              norm.setXYZ(i, bx / blen, by / blen, bz / blen);
            }
          }
          pos.needsUpdate = true;
          norm.needsUpdate = true;
          return geo;
        }
        return new OrigBox(bw, bh, bd, ws, hs, ds);
      };
      PatchedBox.prototype = OrigBox.prototype;
      THREE.BoxGeometry = PatchedBox;
      THREE.BoxBufferGeometry = PatchedBox;

      // 2. ConeGeometry: In 'smooth' mode, upgrade low-poly cones (4~12 segs) to 32 smooth segments!
      const PatchedCone = function (r, h, radialSegs, heightSegs, openEnded, thetaStart, thetaLength) {
        const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
        const segs = isSmooth ? Math.max(32, radialSegs || 32) : radialSegs;
        return new OrigCone(r, h, segs, heightSegs, openEnded, thetaStart, thetaLength);
      };
      PatchedCone.prototype = OrigCone.prototype;
      THREE.ConeGeometry = PatchedCone;
      THREE.ConeBufferGeometry = PatchedCone;

      // 3. CylinderGeometry: In 'smooth' mode, upgrade low-poly cylinders (6~16 segs) to 28 smooth segments!
      const PatchedCyl = function (rt, rb, h, radialSegs, heightSegs, openEnded, thetaStart, thetaLength) {
        const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
        const segs = isSmooth ? Math.max(28, radialSegs || 28) : radialSegs;
        return new OrigCyl(rt, rb, h, segs, heightSegs, openEnded, thetaStart, thetaLength);
      };
      PatchedCyl.prototype = OrigCyl.prototype;
      THREE.CylinderGeometry = PatchedCyl;
      THREE.CylinderBufferGeometry = PatchedCyl;

      // 4. Dodecahedron / Octahedron: In 'smooth' mode, subdivide to detail=3 for smooth spheres!
      if (OrigDodec) {
        const PatchedDodec = function (r, detail) {
          const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
          return new OrigDodec(r, isSmooth ? Math.max(3, detail || 0) : detail);
        };
        PatchedDodec.prototype = OrigDodec.prototype;
        THREE.DodecahedronGeometry = PatchedDodec;
      }
      if (OrigOcta) {
        const PatchedOcta = function (r, detail) {
          const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
          return new OrigOcta(r, isSmooth ? Math.max(3, detail || 0) : detail);
        };
        PatchedOcta.prototype = OrigOcta.prototype;
        THREE.OctahedronGeometry = PatchedOcta;
      }

      // 5. MeshStandardMaterial: Smooth in 'smooth' mode, vivid cel-pop in 'cartoon' mode, faceted in 'pixel' mode!
      const PatchedStdMat = function (params) {
        const gMode = self.getGraphicStyle();
        if (gMode !== 'pixel' && params) {
          params = Object.assign({}, params, { flatShading: false });
          if (gMode === 'cartoon') {
            params.roughness = 0.12;
            params.metalness = 0.05;
            if (params.color !== undefined && params.emissive === undefined) {
              params.emissive = params.color;
              params.emissiveIntensity = 0.28;
            } else if (typeof params.emissiveIntensity === 'number') {
              params.emissiveIntensity = Math.min(1.0, params.emissiveIntensity * 1.45);
            }
          }
        }
        return new OrigStdMat(params);
      };
      PatchedStdMat.prototype = OrigStdMat.prototype;
      THREE.MeshStandardMaterial = PatchedStdMat;

      // 6. PointsMaterial: Attach soft glowing circle texture in 'smooth' mode so stars/particles aren't square pixels!
      const PatchedPointsMat = function (params) {
        const gMode = self.getGraphicStyle(); const isSmooth = gMode === 'smooth' || gMode === 'cartoon';
        if (isSmooth && params && !params.map) {
          params = Object.assign({}, params, {
            map: self._getSoftGlowDotTexture(),
            transparent: true,
            alphaTest: 0.02
          });
        }
        return new OrigPointsMat(params);
      };
      PatchedPointsMat.prototype = OrigPointsMat.prototype;
      THREE.PointsMaterial = PatchedPointsMat;
    },

    setGraphicStyle: function (style) {
      const nextStyle = (style === 'pixel' || style === 'cartoon') ? style : 'smooth';
      this.graphicStyle = nextStyle;
      this._graphicStyleLoaded = true;
      try {
        if (global.localStorage) {
          global.localStorage.setItem('soyun_graphic_style_v1', nextStyle);
        }
      } catch (_e) {}
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('graphic-mode-smooth', nextStyle === 'smooth');
        document.body.classList.toggle('graphic-mode-cartoon', nextStyle === 'cartoon');
        document.body.classList.toggle('graphic-mode-pixel', nextStyle === 'pixel');
      }
      if (!this.isInitialized || !this.scene) return;

      // Rebuild entire 3D world immediately in the selected graphic style!
      const savedStage = this.currentStage || 1;
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
      this.activeGates = [];
      this.activeObstacles = [];
      this.activeProjectiles = [];
      this.particles = [];
      this._initSharedBrickAssets();
      this._initTextures();
      this._buildLighting();
      this._buildSkyAndHorizon();
      this._buildHighwayAndScenery();
      if (this.mountainWireMat) {
        this.mountainWireMat.opacity = nextStyle === 'smooth' ? 0.0 : (nextStyle === 'cartoon' ? 0.65 : 0.42);
      }
      this._buildPlayerCar();
      this._buildSpeedLines();
      this._buildBossModel();
      this.setStageTheme(savedStage);
      this.renderSingleFrame();
    },

    _initSharedBrickAssets: function () {
      const THREE = global.THREE;
      if (!THREE) return;

      this.sharedBrickGeo = new THREE.BoxGeometry(0.62, 0.36, 0.92);
      this.sharedStudGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.09, 10);
      this.sharedRobuxGeo = new THREE.TorusGeometry(0.32, 0.1, 8, 16);

      this.sharedBrickMaterials = ROBLOX_BRICK_COLORS.map((hex) =>
        new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.32,
          roughness: 0.25,
          metalness: 0.2
        })
      );

      this.sharedRobuxMaterial = new THREE.MeshBasicMaterial({
        color: 0xffea00
      });
    },

    /**
     * Initialize CORS-safe textures with vibrant procedural Canvas fallbacks
     */
    _initTextures: function () {
      const THREE = global.THREE;

      // 1. Skybox Horizon Banner Texture
      this.skyTextureObj = createSafeTexture(
        'assets/bg_skybox.png',
        1024,
        512,
        (ctx, w, h) => {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, '#040112');
          grad.addColorStop(0.45, '#190535');
          grad.addColorStop(0.8, '#5a0b4d');
          grad.addColorStop(1, '#ff007f');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Stars & floating blocky clouds
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 140; i++) {
            const sx = (i * 97) % w;
            const sy = (i * 53) % Math.floor(h * 0.65);
            const r = (i % 3 === 0) ? 2.2 : 1.2;
            ctx.globalAlpha = 0.4 + (i % 5) * 0.12;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          // Retro Outrun Segmented Sun
          const sunGrad = ctx.createLinearGradient(0, h * 0.25, 0, h * 0.88);
          sunGrad.addColorStop(0, '#fff75e');
          sunGrad.addColorStop(0.5, '#ff5400');
          sunGrad.addColorStop(1, '#ff006e');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(w / 2, h * 0.62, 130, 0, Math.PI * 2);
          ctx.fill();

          // Horizontal scanline cutouts across the lower sun
          ctx.fillStyle = '#260634';
          for (let s = 0; s < 7; s++) {
            const sy = h * 0.58 + s * 18;
            const sh = 3 + s * 1.8;
            ctx.fillRect(w / 2 - 140, sy, 280, sh);
          }

          // Distant Blocky Roblox Towers Silhouette
          ctx.fillStyle = '#090218';
          for (let x = 0; x < w; x += 28) {
            const bh = 25 + ((x * 19) % 75);
            ctx.fillRect(x, h - bh, 26, bh);
            ctx.fillStyle = (x % 56 === 0) ? '#00f3ff' : '#ff007f';
            for (let wy = h - bh + 6; wy < h - 8; wy += 10) {
              ctx.fillRect(x + 5, wy, 6, 4);
              ctx.fillRect(x + 15, wy, 6, 4);
            }
            ctx.fillStyle = '#090218';
          }
        },
        (ctx, img, w, h) => {
          ctx.drawImage(img, 0, 0, w, h);
        }
      );
      this.textures.skybox = this.skyTextureObj ? this.skyTextureObj.texture : null;

      // 1b. Boss Phase Hell & Erupting Lava Skybox Texture ("지옥에 용암 나오는 배경")
      if (THREE) {
        const hellCanvas = document.createElement('canvas');
        hellCanvas.width = 1024;
        hellCanvas.height = 512;
        const hctx = hellCanvas.getContext('2d');

        // Apocalyptic Hell Blood-Red to Molten Magma Sky Gradient
        const hellGrad = hctx.createLinearGradient(0, 0, 0, 512);
        hellGrad.addColorStop(0, '#0f0002');
        hellGrad.addColorStop(0.32, '#3b0006');
        hellGrad.addColorStop(0.65, '#8f1100');
        hellGrad.addColorStop(0.88, '#ff3d00');
        hellGrad.addColorStop(1, '#ffbe0b');
        hctx.fillStyle = hellGrad;
        hctx.fillRect(0, 0, 1024, 512);

        // Glowing Hellfire Sun / Magma Core behind Volcano
        const coreGrad = hctx.createRadialGradient(512, 330, 15, 512, 330, 210);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.25, '#ffee55');
        coreGrad.addColorStop(0.6, '#ff4500');
        coreGrad.addColorStop(1, 'rgba(180, 0, 0, 0)');
        hctx.fillStyle = coreGrad;
        hctx.beginPath();
        hctx.arc(512, 330, 210, 0, Math.PI * 2);
        hctx.fill();

        // Giant Erupting Hell Volcanoes & Jagged Obsidian Peaks
        const peaks = [
          { x1: -40, xPeak: 140, x2: 330, yPeak: 190 },
          { x1: 240, xPeak: 512, x2: 780, yPeak: 125 }, // Center Mega Volcano
          { x1: 680, xPeak: 890, x2: 1064, yPeak: 180 }
        ];
        peaks.forEach((p, idx) => {
          hctx.fillStyle = '#160204';
          hctx.beginPath();
          hctx.moveTo(p.x1, 512);
          hctx.lineTo(p.xPeak - 36, p.yPeak);
          hctx.lineTo(p.xPeak + 36, p.yPeak);
          hctx.lineTo(p.x2, 512);
          hctx.closePath();
          hctx.fill();

          // Glowing Molten Lava Crater & Flowing Lava Streams down the Volcano!
          const lavaGrad = hctx.createLinearGradient(p.xPeak, p.yPeak - 30, p.xPeak, 512);
          lavaGrad.addColorStop(0, '#fff75e');
          lavaGrad.addColorStop(0.3, '#ff6d00');
          lavaGrad.addColorStop(0.75, '#ff1100');
          lavaGrad.addColorStop(1, '#ff9900');
          hctx.fillStyle = lavaGrad;

          // Crater Eruption Plume
          hctx.beginPath();
          hctx.ellipse(p.xPeak, p.yPeak, idx === 1 ? 52 : 34, 16, 0, 0, Math.PI * 2);
          hctx.fill();

          // Lava Rivers flowing down volcano slopes
          hctx.strokeStyle = lavaGrad;
          hctx.lineWidth = idx === 1 ? 16 : 11;
          hctx.lineCap = 'round';
          [-1, 0, 1].forEach((branch) => {
            hctx.beginPath();
            hctx.moveTo(p.xPeak + branch * 14, p.yPeak + 4);
            hctx.quadraticCurveTo(
              p.xPeak + branch * 55,
              (p.yPeak + 512) * 0.52,
              p.xPeak + branch * 95,
              512
            );
            hctx.stroke();
          });
        });

        // Flying Volcanic Fireballs, Lava Sparks & Ash Embers in the Hell Sky
        for (let i = 0; i < 160; i++) {
          const ex = (i * 89) % 1024;
          const ey = (i * 47) % 440;
          const r = (i % 4 === 0) ? 4.2 : 2.0;
          hctx.fillStyle = (i % 3 === 0) ? '#ffee55' : (i % 2 === 0 ? '#ff5500' : '#ff1100');
          hctx.beginPath();
          hctx.arc(ex, ey, r, 0, Math.PI * 2);
          hctx.fill();
        }

        // Bottom Molten Sea Horizon Strip
        const seaGrad = hctx.createLinearGradient(0, 465, 0, 512);
        seaGrad.addColorStop(0, 'rgba(255, 60, 0, 0)');
        seaGrad.addColorStop(0.5, '#ff3300');
        seaGrad.addColorStop(1, '#ffaa00');
        hctx.fillStyle = seaGrad;
        hctx.fillRect(0, 465, 1024, 47);

        this.textures.hellSkybox = new THREE.CanvasTexture(hellCanvas);
        this.textures.hellSkybox.needsUpdate = true;
      }

      // 2. Player Kart Rear VIP License Plate Texture ("👑 SOYUN VIP")
      const carTexObj = createSafeTexture(
        'assets/player_car.png',
        256,
        128,
        (ctx, w, h) => {
          ctx.fillStyle = '#140826';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#ffe600';
          ctx.lineWidth = 8;
          ctx.strokeRect(6, 6, w - 12, h - 12);

          const barGrad = ctx.createLinearGradient(0, 0, w, 0);
          barGrad.addColorStop(0, '#ff2a85');
          barGrad.addColorStop(0.5, '#00f3ff');
          barGrad.addColorStop(1, '#ff2a85');
          ctx.fillStyle = barGrad;
          ctx.fillRect(16, 16, w - 32, 24);

          ctx.fillStyle = '#ffe600';
          ctx.font = '900 30px "Malgun Gothic", "Orbitron", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('👑 이소윤 VIP', w / 2, h * 0.68);
        },
        (ctx, img, w, h, fallback) => {
          fallback(ctx, w, h);
        }
      );
      this.textures.playerCar = carTexObj ? carTexObj.texture : null;

      // 3. Obstacle Hazard Barrier Texture (Roblox Kill-Brick Style)
      const barrierTexObj = createSafeTexture(
        'assets/obstacle_barrier.png',
        512,
        256,
        (ctx, w, h) => {
          ctx.fillStyle = '#24030c';
          roundRectPath(ctx, 8, 8, w - 16, h - 16, 18);
          ctx.fill();

          ctx.save();
          roundRectPath(ctx, 16, 16, w - 32, h - 32, 12);
          ctx.clip();
          for (let x = -h; x < w + h; x += 48) {
            ctx.fillStyle = (Math.floor(x / 48) % 2 === 0) ? '#ff0044' : '#ffbe0b';
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 28, 0);
            ctx.lineTo(x - 28 + h, h);
            ctx.lineTo(x - 56 + h, h);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          ctx.fillStyle = 'rgba(12, 4, 20, 0.9)';
          ctx.fillRect(24, h / 2 - 42, w - 48, 84);
          ctx.strokeStyle = '#ff0044';
          ctx.lineWidth = 6;
          ctx.strokeRect(24, h / 2 - 42, w - 48, 84);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 38px "Malgun Gothic", "Orbitron", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚠ 오답 블럭! 조심! ⚠', w / 2, h / 2);
        },
        (ctx, img, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          ctx.strokeStyle = '#ff0044';
          ctx.lineWidth = 8;
          ctx.strokeRect(4, 4, w - 8, h - 8);
        }
      );
      this.textures.obstacleBarrier = barrierTexObj ? barrierTexObj.texture : null;

      // 4. Boss Mecha Texture (Blocky Roblox Boss Face & Emblem)
      const bossTexObj = createSafeTexture(
        'assets/boss_mecha.png',
        512,
        512,
        (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          const radGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 240);
          radGrad.addColorStop(0, 'rgba(255, 0, 128, 0.95)');
          radGrad.addColorStop(0.55, 'rgba(114, 9, 183, 0.8)');
          radGrad.addColorStop(1, 'rgba(0, 243, 255, 0.0)');
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 240, 0, Math.PI * 2);
          ctx.fill();

          // Blocky Roblox Mecha Head Frame
          ctx.fillStyle = '#18092c';
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 12;
          roundRectPath(ctx, 84, 76, w - 168, h - 152, 28);
          ctx.fill();
          ctx.stroke();

          // Angry Glowing Blocky Eyes
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(130, 165, 95, 52);
          ctx.fillRect(w - 225, 165, 95, 52);
          ctx.fillStyle = '#ffe600';
          ctx.fillRect(158, 180, 38, 26);
          ctx.fillRect(w - 196, 180, 38, 26);

          // Blocky Mecha Grin Teeth
          ctx.fillStyle = '#00f3ff';
          ctx.fillRect(145, 295, w - 290, 62);
          ctx.strokeStyle = '#18092c';
          ctx.lineWidth = 8;
          for (let tx = 185; tx < w - 150; tx += 45) {
            ctx.beginPath();
            ctx.moveTo(tx, 295);
            ctx.lineTo(tx, 357);
            ctx.stroke();
          }
        },
        (ctx, img, w, h, fallback) => {
          fallback(ctx, w, h);
          ctx.save();
          roundRectPath(ctx, 76, 76, w - 152, h - 152, 32);
          ctx.clip();
          ctx.drawImage(img, 64, 64, w - 128, h - 128);
          ctx.restore();
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 10;
          roundRectPath(ctx, 76, 76, w - 152, h - 152, 32);
          ctx.stroke();
        }
      );
      this.textures.bossMecha = bossTexObj ? bossTexObj.texture : null;

      // 5. Soyun 3D Blocky Roblox Avatar Face Texture
      if (THREE) {
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = 256;
        faceCanvas.height = 256;
        const fctx = faceCanvas.getContext('2d');
        fctx.fillStyle = '#ffdfb8';
        fctx.fillRect(0, 0, 256, 256);

        // Cute bangs across forehead
        fctx.fillStyle = '#1b112c';
        fctx.fillRect(0, 0, 256, 62);
        for (let bx = 0; bx < 256; bx += 32) {
          fctx.beginPath();
          fctx.moveTo(bx, 62);
          fctx.lineTo(bx + 16, 84);
          fctx.lineTo(bx + 32, 62);
          fctx.fill();
        }

        // Sparkling Roblox anime eyes
        fctx.fillStyle = '#1b112c';
        roundRectPath(fctx, 48, 98, 44, 52, 12);
        fctx.fill();
        roundRectPath(fctx, 164, 98, 44, 52, 12);
        fctx.fill();

        // White eye highlights
        fctx.fillStyle = '#ffffff';
        fctx.beginPath();
        fctx.arc(62, 114, 10, 0, Math.PI * 2);
        fctx.arc(178, 114, 10, 0, Math.PI * 2);
        fctx.fill();
        fctx.beginPath();
        fctx.arc(78, 134, 5, 0, Math.PI * 2);
        fctx.arc(194, 134, 5, 0, Math.PI * 2);
        fctx.fill();

        // Pink blush cheeks
        fctx.fillStyle = '#ff65a3';
        fctx.globalAlpha = 0.65;
        fctx.beginPath();
        fctx.ellipse(42, 164, 20, 11, 0, 0, Math.PI * 2);
        fctx.ellipse(214, 164, 20, 11, 0, 0, Math.PI * 2);
        fctx.fill();
        fctx.globalAlpha = 1;

        // Happy Roblox smile
        fctx.strokeStyle = '#1b112c';
        fctx.lineWidth = 8;
        fctx.lineCap = 'round';
        fctx.beginPath();
        fctx.arc(128, 162, 34, 0.15 * Math.PI, 0.85 * Math.PI);
        fctx.stroke();

        this.textures.soyunFace = new THREE.CanvasTexture(faceCanvas);
        this.textures.soyunFace.needsUpdate = true;

        // 6. Pet Face Texture (Switches between Smooth Kawaii and Retro Pixel!)
        const petCanvas = document.createElement('canvas');
        petCanvas.width = 512;
        petCanvas.height = 512;
        const pctx = petCanvas.getContext('2d');
        const petGrad = pctx.createLinearGradient(0, 0, 0, 512);
        petGrad.addColorStop(0, '#a8ffef');
        petGrad.addColorStop(0.55, '#fbcfe8');
        petGrad.addColorStop(1, '#f472b6');
        pctx.fillStyle = petGrad;
        pctx.fillRect(0, 0, 512, 512);

        if (this.getGraphicStyle && this.getGraphicStyle() === 'pixel') {
          pctx.strokeStyle = '#ff2a85'; pctx.lineWidth = 24; pctx.strokeRect(12, 12, 488, 488);
          pctx.fillStyle = '#0f172a'; pctx.fillRect(120, 170, 68, 96); pctx.fillRect(324, 170, 68, 96);
          pctx.fillStyle = '#ffffff'; pctx.fillRect(136, 184, 28, 28); pctx.fillRect(340, 184, 28, 28);
          pctx.fillStyle = 'rgba(255, 42, 133, 0.55)'; pctx.beginPath(); pctx.arc(96, 300, 36, 0, Math.PI * 2); pctx.arc(416, 300, 36, 0, Math.PI * 2); pctx.fill();
          pctx.strokeStyle = '#0f172a'; pctx.lineWidth = 16; pctx.lineCap = 'round'; pctx.beginPath(); pctx.arc(256, 290, 44, 0.15 * Math.PI, 0.85 * Math.PI); pctx.stroke();
        } else {
        // Rosy soft cheeks
        pctx.fillStyle = 'rgba(255, 42, 133, 0.45)';
        pctx.beginPath();
        pctx.ellipse(120, 310, 38, 22, 0, 0, Math.PI * 2);
        pctx.ellipse(392, 310, 38, 22, 0, 0, Math.PI * 2);
        pctx.fill();

        // Smooth round glossy eyes
        [176, 336].forEach((ex) => {
          pctx.fillStyle = '#1e1035';
          pctx.beginPath();
          pctx.ellipse(ex, 240, 36, 44, 0, 0, Math.PI * 2);
          pctx.fill();

          pctx.fillStyle = '#00f5ff';
          pctx.beginPath();
          pctx.ellipse(ex, 254, 24, 24, 0, 0, Math.PI * 2);
          pctx.fill();

          pctx.fillStyle = '#ffffff';
          pctx.beginPath();
          pctx.arc(ex - 12, 222, 13, 0, Math.PI * 2);
          pctx.arc(ex + 12, 258, 6, 0, Math.PI * 2);
          pctx.fill();
        });

        // Smooth cute smile
        pctx.strokeStyle = '#1e1035';
        pctx.lineWidth = 10;
        pctx.lineCap = 'round';
        pctx.lineJoin = 'round';
        pctx.beginPath();
        pctx.arc(256, 296, 28, 0.15 * Math.PI, 0.85 * Math.PI);
        pctx.stroke();
        }

        this.textures.petFace = new THREE.CanvasTexture(petCanvas);
        this.textures.petFace.needsUpdate = true;

        // 7. Overhead Roblox VIP Nameplate Texture ("👑 [VIP] 이소윤")
        const nameCanvas = document.createElement('canvas');
        nameCanvas.width = 512;
        nameCanvas.height = 128;
        const nctx = nameCanvas.getContext('2d');
        nctx.clearRect(0, 0, 512, 128);

        // Pill background
        const pillGrad = nctx.createLinearGradient(0, 14, 0, 114);
        pillGrad.addColorStop(0, 'rgba(20, 8, 44, 0.92)');
        pillGrad.addColorStop(1, 'rgba(68, 10, 82, 0.92)');
        nctx.fillStyle = pillGrad;
        roundRectPath(nctx, 18, 16, 476, 96, 48);
        nctx.fill();

        // Glowing gold + cyan border
        nctx.strokeStyle = '#ffd700';
        nctx.lineWidth = 7;
        roundRectPath(nctx, 18, 16, 476, 96, 48);
        nctx.stroke();

        // VIP Tag Text
        nctx.font = '900 44px "Malgun Gothic", "Apple SD Gothic Neo", "Orbitron", sans-serif';
        nctx.textAlign = 'center';
        nctx.textBaseline = 'middle';
        nctx.shadowColor = '#ff007f';
        nctx.shadowBlur = 12;
        nctx.fillStyle = '#ffe600';
        nctx.fillText('👑 [VIP] 이소윤', 256, 66);
        nctx.shadowBlur = 0;

        this.textures.soyunNameplate = new THREE.CanvasTexture(nameCanvas);
        this.textures.soyunNameplate.needsUpdate = true;
      }
    },

    /**
     * Build Scene Lighting
     */
    _buildLighting: function () {
      const THREE = global.THREE;
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.86);
      this.scene.add(this.ambientLight);

      this.dirLight = new THREE.DirectionalLight(0xffe6ff, 1.25);
      this.dirLight.position.set(12, 28, 20);
      this.scene.add(this.dirLight);

      this.carPointLight = new THREE.PointLight(this.currentTheme.primary, 2.1, 22);
      this.carPointLight.position.set(0, 2.5, 8);
      this.scene.add(this.carPointLight);
    },

    /**
     * Smooth S-Curve horizontal offset at worldZ (0 at player passZ = 8 so 3-lane collision is exact,
     * winding left and right ahead of the player for dynamic curved driving!)
     */
    _getRoadCurveX: function (worldZ) {
      const dist = Math.max(0, 8 - worldZ);
      if (dist <= 0.01) return 0;
      const env = Math.min(1, Math.pow(dist / 52, 1.32));
      const phase = this.roadCurvePhase || 0;
      return env * (
        Math.sin(phase - dist * 0.022) * 8.2 +
        Math.cos(phase * 0.62 - dist * 0.011) * 3.6
      );
    },

    /**
     * Approximate dX/dZ slope of the curving road at worldZ
     */
    _getRoadCurveSlope: function (worldZ) {
      return (this._getRoadCurveX(worldZ - 1.5) - this._getRoadCurveX(worldZ + 1.5)) / 3.0;
    },

    /**
     * Deform the main highway, side rivers/streams, and neon edge rails along the live S-curve
     */
    _updateRoadCurveGeometry: function () {
      if (this.roadMesh && this.roadMesh.geometry) {
        const pos = this.roadMesh.geometry.attributes.position;
        const baseVxArr = this.roadMesh.userData.baseVx;
        if (baseVxArr && baseVxArr.length === pos.count) {
          for (let v = 0; v < pos.count; v++) {
            const bx = baseVxArr[v];
            const vy = pos.getY(v);
            const worldZ = -85 - vy;
            const wf = 1;
            const curveX = this._getRoadCurveX(worldZ);
            pos.setX(v, bx * wf + curveX);
          }
          pos.needsUpdate = true;
        }
      }

      if (Array.isArray(this.edgeRailMeshes)) {
        for (let r = 0; r < this.edgeRailMeshes.length; r++) {
          const rail = this.edgeRailMeshes[r];
          if (!rail || !rail.geometry) continue;
          const pos = rail.geometry.attributes.position;
          const baseVxArr = rail.userData.baseVx;
          const sideEdge = rail.userData.sideEdge || -7.2;
          if (baseVxArr && baseVxArr.length === pos.count) {
            for (let v = 0; v < pos.count; v++) {
              const vy = pos.getY(v);
              const worldZ = -85 - vy;
              const wf = 1;
              const curveX = this._getRoadCurveX(worldZ);
              pos.setX(v, sideEdge * wf + baseVxArr[v] + curveX);
            }
            pos.needsUpdate = true;
          }
        }
      }

      if (Array.isArray(this.stageRiverMeshes)) {
        for (let m = 0; m < this.stageRiverMeshes.length; m++) {
          const river = this.stageRiverMeshes[m];
          if (!river || !river.geometry) continue;
          const pos = river.geometry.attributes.position;
          const baseVxArr = river.userData.baseVx;
          const sideOffset = river.userData.sideOffset || -20;
          if (baseVxArr && baseVxArr.length === pos.count) {
            for (let v = 0; v < pos.count; v++) {
              const vy = pos.getY(v);
              const worldZ = -85 - vy;
              const wf = 1;
              const curveX = this._getRoadCurveX(worldZ);
              const wave = Math.sin((this.elapsedTime || 0) * 3.2 + worldZ * 0.08) * 0.45;
              pos.setX(v, sideOffset * wf + baseVxArr[v] + curveX + wave);
            }
            pos.needsUpdate = true;
          }
        }
      }
    },

    /**
     * Paint bespoke 1024x512 Skybox Canvas for each Stage Biome:
     * river_nature, sky_heaven, underwater_ocean, molten_lava, wonderland_magic, cherry_lake, snow_aurora, neon_fantasy
     */
    _paintBiomeSkyboxTexture: function (theme) {
      const THREE = global.THREE;
      if (!THREE) return null;
      if (!this.biomeSkyCanvas) {
        this.biomeSkyCanvas = document.createElement('canvas');
        this.biomeSkyCanvas.width = 1024;
        this.biomeSkyCanvas.height = 512;
        this.biomeSkyTexture = new THREE.CanvasTexture(this.biomeSkyCanvas);
      }
      const ctx = this.biomeSkyCanvas.getContext('2d');
      const w = 1024;
      const h = 512;
      const biome = (theme && theme.biome) ? theme.biome : 'river_nature';

      ctx.clearRect(0, 0, w, h);

      // 1. Base Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, (theme && theme.skyTop) || '#0d47a1');
      grad.addColorStop(0.45, (theme && theme.skyUpper) || '#29b6f6');
      grad.addColorStop(0.8, (theme && theme.skyLower) || '#81d4fa');
      grad.addColorStop(1, (theme && theme.skyBottom) || '#e0f7fa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (biome === 'river_nature') {
        // 🏞️ STAGE 1: Emerald River, Snow-Capped Alps Mountains & Lush Green Forest
        // Warm Golden Sun & Sunbeams
        const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.34, 12, w * 0.5, h * 0.34, 155);
        sunGrad.addColorStop(0, '#ffffff');
        sunGrad.addColorStop(0.3, '#fff59d');
        sunGrad.addColorStop(0.7, 'rgba(255, 238, 88, 0.35)');
        sunGrad.addColorStop(1, 'rgba(255, 238, 88, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.34, 155, 0, Math.PI * 2);
        ctx.fill();

        // Fluffy White Clouds across the blue sky
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        [
          { x: 150, y: 110, s: 1.0 },
          { x: 370, y: 85, s: 0.85 },
          { x: 690, y: 105, s: 1.1 },
          { x: 890, y: 130, s: 0.9 }
        ].forEach((c) => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 34 * c.s, 0, Math.PI * 2);
          ctx.arc(c.x + 28 * c.s, c.y - 10 * c.s, 40 * c.s, 0, Math.PI * 2);
          ctx.arc(c.x + 60 * c.s, c.y, 32 * c.s, 0, Math.PI * 2);
          ctx.fill();
        });

        // Distant Snow-Capped Alpine Mountain Range
        const alps = [
          { x1: -30, xp: 120, x2: 270, yp: 210, col: '#2c5e4f' },
          { x1: 180, xp: 340, x2: 500, yp: 175, col: '#235347' },
          { x1: 410, xp: 590, x2: 770, yp: 155, col: '#1b4332' },
          { x1: 660, xp: 830, x2: 1000, yp: 185, col: '#2c5e4f' },
          { x1: 860, xp: 990, x2: 1080, yp: 220, col: '#235347' }
        ];
        alps.forEach((m) => {
          ctx.fillStyle = m.col;
          ctx.beginPath();
          ctx.moveTo(m.x1, h);
          ctx.lineTo(m.xp, m.yp);
          ctx.lineTo(m.x2, h);
          ctx.closePath();
          ctx.fill();

          // White Snow Cap on Mountain Peak
          const capRatio = 0.34;
          const lx = m.xp + (m.x1 - m.xp) * capRatio;
          const rx = m.xp + (m.x2 - m.xp) * capRatio;
          const cy = m.yp + (h - m.yp) * capRatio;
          ctx.fillStyle = '#f4fbff';
          ctx.beginPath();
          ctx.moveTo(m.xp, m.yp);
          ctx.lineTo(rx, cy);
          ctx.lineTo(m.xp + 12, cy - 10);
          ctx.lineTo(m.xp - 10, cy + 6);
          ctx.lineTo(lx, cy);
          ctx.closePath();
          ctx.fill();
        });

        // Lush Green Rolling Forest Hills & Pine Silhouette
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.quadraticCurveTo(260, 380, 512, 425);
        ctx.quadraticCurveTo(780, 385, w, 430);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Sparkling Emerald River Winding from Horizon
        const rivGrad = ctx.createLinearGradient(0, 415, 0, h);
        rivGrad.addColorStop(0, '#80ffdb');
        rivGrad.addColorStop(0.5, '#00e5ff');
        rivGrad.addColorStop(1, '#0096c7');
        ctx.fillStyle = rivGrad;
        ctx.fillRect(0, 445, w, h - 445);
      } else if (biome === 'sky_heaven') {
        // ☁️ STAGE 2: Sky Kingdom Above the Clouds & Giant Double Rainbow
        // Giant Vivid 7-Color Rainbow Arch across the sky!
        const rainbowColors = ['#ff1744', '#ff9100', '#ffea00', '#00e676', '#00e5ff', '#2979ff', '#d500f9'];
        ctx.lineWidth = 10;
        rainbowColors.forEach((rc, idx) => {
          ctx.strokeStyle = rc;
          ctx.globalAlpha = 0.72;
          ctx.beginPath();
          ctx.arc(w / 2, h + 30, 410 - idx * 10, Math.PI * 1.08, Math.PI * 1.92);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;

        // Floating Golden Sky Islands & Cloud Castles in distance
        [
          { x: 220, y: 245, w: 130 },
          { x: 512, y: 195, w: 170 },
          { x: 805, y: 240, w: 135 }
        ].forEach((isl) => {
          // Golden Castle Spires
          ctx.fillStyle = '#fff8e1';
          ctx.fillRect(isl.x - 28, isl.y - 52, 56, 52);
          ctx.fillStyle = '#ffd54f';
          ctx.beginPath();
          ctx.moveTo(isl.x - 36, isl.y - 52);
          ctx.lineTo(isl.x, isl.y - 95);
          ctx.lineTo(isl.x + 36, isl.y - 52);
          ctx.closePath();
          ctx.fill();

          // Fluffy Cloud Base under Island
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(isl.x - 42, isl.y, 32, 0, Math.PI * 2);
          ctx.arc(isl.x, isl.y + 4, 42, 0, Math.PI * 2);
          ctx.arc(isl.x + 42, isl.y, 32, 0, Math.PI * 2);
          ctx.fill();
        });

        // Billowing Sea of Sunlit White & Golden Clouds at Horizon
        for (let cx = -20; cx <= w + 40; cx += 68) {
          ctx.fillStyle = 'rgba(255, 248, 225, 0.95)';
          ctx.beginPath();
          ctx.arc(cx, h - 38, 48, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 22, h - 22, 44, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (biome === 'underwater_ocean') {
        // 🐠 STAGE 3: Deep Underwater Coral Reef, Sunlight Rays, Whales & Atlantis
        // Piercing Underwater Caustic Sunlight Beams from Ocean Surface
        for (let b = 0; b < 9; b++) {
          const bx = 80 + b * 110;
          const beamGrad = ctx.createLinearGradient(bx, 0, bx + 40, h * 0.85);
          beamGrad.addColorStop(0, 'rgba(144, 224, 239, 0.42)');
          beamGrad.addColorStop(1, 'rgba(0, 180, 216, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(bx - 22, 0);
          ctx.lineTo(bx + 22, 0);
          ctx.lineTo(bx + 85, h * 0.85);
          ctx.lineTo(bx - 45, h * 0.85);
          ctx.closePath();
          ctx.fill();
        }

        // Atlantis Glowing Sea Palace Domes on the Horizon
        ctx.fillStyle = '#004e7c';
        ctx.beginPath();
        ctx.arc(w / 2, h - 45, 95, Math.PI, 0);
        ctx.arc(w / 2 - 120, h - 45, 58, Math.PI, 0);
        ctx.arc(w / 2 + 120, h - 45, 58, Math.PI, 0);
        ctx.fill();

        // Glowing Bioluminescent Windows & Coral Reef Silhouettes
        ctx.fillStyle = '#72efdd';
        for (let wx = w / 2 - 70; wx <= w / 2 + 70; wx += 28) {
          ctx.beginPath();
          ctx.arc(wx, h - 78, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swimming Whale & Dolphin Silhouettes in the Sea Sky
        ctx.fillStyle = 'rgba(2, 62, 138, 0.75)';
        ctx.beginPath();
        ctx.ellipse(240, 170, 68, 22, -0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(172, 175);
        ctx.lineTo(142, 154);
        ctx.lineTo(148, 192);
        ctx.closePath();
        ctx.fill();

        // Rising Underwater Bubbles
        ctx.strokeStyle = 'rgba(202, 240, 248, 0.78)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 95; i++) {
          const bx = (i * 97) % w;
          const by = (i * 53) % (h - 30);
          const br = 3 + (i % 5) * 2.5;
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (biome === 'molten_lava') {
        // 🌋 STAGE 4: Inside a Fiery Molten Lava Volcano & Magma Canyon
        const coreGrad = ctx.createRadialGradient(w / 2, 320, 15, w / 2, 320, 220);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.28, '#ffea00');
        coreGrad.addColorStop(0.65, '#ff3d00');
        coreGrad.addColorStop(1, 'rgba(180, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(w / 2, 320, 220, 0, Math.PI * 2);
        ctx.fill();

        // Jagged Volcano Peaks & Flowing Magma Rivers
        [
          { x1: -40, xp: 170, x2: 380, yp: 175 },
          { x1: 270, xp: 512, x2: 750, yp: 120 },
          { x1: 650, xp: 860, x2: 1060, yp: 165 }
        ].forEach((v) => {
          ctx.fillStyle = '#1b0303';
          ctx.beginPath();
          ctx.moveTo(v.x1, h);
          ctx.lineTo(v.xp - 34, v.yp);
          ctx.lineTo(v.xp + 34, v.yp);
          ctx.lineTo(v.x2, h);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#ff9100';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.moveTo(v.xp, v.yp);
          ctx.quadraticCurveTo(v.xp + 35, (v.yp + h) * 0.5, v.xp + 70, h);
          ctx.stroke();
        });

        // Volcanic Sparks
        for (let i = 0; i < 130; i++) {
          ctx.fillStyle = (i % 2 === 0) ? '#ffea00' : '#ff3d00';
          ctx.beginPath();
          ctx.arc((i * 83) % w, (i * 47) % 450, (i % 3) + 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (biome === 'wonderland_magic') {
        // 🎠 STAGE 5: Magical Pastel Wonderland, Candy Castles, Giant Crescent Moon & Rainbow Stars
        // Whimsical Glowing Golden Crescent Moon & Candy Planet
        ctx.fillStyle = '#fff59d';
        ctx.beginPath();
        ctx.arc(760, 145, 58, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = theme.skyUpper || '#7b2cbf';
        ctx.beginPath();
        ctx.arc(782, 132, 48, 0, Math.PI * 2);
        ctx.fill();

        // Ringed Pastel Candy Planet
        ctx.fillStyle = '#ff80ab';
        ctx.beginPath();
        ctx.arc(230, 155, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#80ffdb';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(230, 155, 76, 16, -0.25, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 110; i++) {
          ctx.beginPath();
          ctx.arc((i * 91) % w, (i * 59) % 360, (i % 3) + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pastel Candy Hills & Fairytale Castle Silhouette at Horizon
        const hills = [
          { x: 180, r: 190, c: '#ff70a6' },
          { x: 512, r: 220, c: '#b5179e' },
          { x: 840, r: 190, c: '#7209b7' }
        ];
        hills.forEach((hl) => {
          ctx.fillStyle = hl.c;
          ctx.beginPath();
          ctx.arc(hl.x, h + 40, hl.r, Math.PI, 0);
          ctx.fill();
        });
      } else if (biome === 'cherry_lake') {
        // 🌸 STAGE 6: Pink Cherry Blossom Lake & Spring Mt. Fuji Valley
        // Warm Spring Sun
        const sunG = ctx.createRadialGradient(w / 2, 260, 10, w / 2, 260, 140);
        sunG.addColorStop(0, '#ffffff');
        sunG.addColorStop(0.45, '#ffe5ec');
        sunG.addColorStop(1, 'rgba(255, 179, 198, 0)');
        ctx.fillStyle = sunG;
        ctx.beginPath();
        ctx.arc(w / 2, 260, 140, 0, Math.PI * 2);
        ctx.fill();

        // Majestic Spring Mountains & Snow-Capped Center Peak
        ctx.fillStyle = '#5c5470';
        ctx.beginPath();
        ctx.moveTo(140, h);
        ctx.lineTo(465, 175);
        ctx.lineTo(558, 175);
        ctx.lineTo(884, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff0f5';
        ctx.beginPath();
        ctx.moveTo(465, 175);
        ctx.lineTo(558, 175);
        ctx.lineTo(635, 265);
        ctx.lineTo(512, 245);
        ctx.lineTo(390, 265);
        ctx.closePath();
        ctx.fill();

        // Sparkling Cherry Blossom Lake Horizon
        ctx.fillStyle = '#48cae4';
        ctx.fillRect(0, 445, w, h - 445);

        // Floating Sakura Petals in the Sky
        ctx.fillStyle = '#ffb3c6';
        for (let i = 0; i < 120; i++) {
          const px = (i * 89) % w;
          const py = (i * 43) % 440;
          ctx.beginPath();
          ctx.ellipse(px, py, 5, 3, (i % 6) * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (biome === 'jungle_safari') {
        // 🌴 STAGE 2: Amazon Tropical Jungle, Sunbeams, Hanging Vines & Lion Safari Valley
        const sunG = ctx.createRadialGradient(w * 0.5, h * 0.36, 12, w * 0.5, h * 0.36, 175);
        sunG.addColorStop(0, '#ffffff');
        sunG.addColorStop(0.35, '#fef08a');
        sunG.addColorStop(0.75, 'rgba(132, 204, 22, 0.35)');
        sunG.addColorStop(1, 'rgba(20, 83, 45, 0)');
        ctx.fillStyle = sunG;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.36, 175, 0, Math.PI * 2);
        ctx.fill();

        // Lush Layered Tropical Jungle Mountains & Waterfalls
        [
          { x1: -30, xp: 180, x2: 410, yp: 195, c: '#14532d' },
          { x1: 260, xp: 512, x2: 760, yp: 155, c: '#166534' },
          { x1: 620, xp: 850, x2: 1060, yp: 185, c: '#14532d' }
        ].forEach((jm) => {
          ctx.fillStyle = jm.c;
          ctx.beginPath();
          ctx.moveTo(jm.x1, h);
          ctx.quadraticCurveTo(jm.xp, jm.yp - 35, jm.x2, h);
          ctx.closePath();
          ctx.fill();
        });

        // Sparkling Jungle Waterfall cascading down center cliff
        const wfGrad = ctx.createLinearGradient(512, 210, 512, h);
        wfGrad.addColorStop(0, '#e0f2fe');
        wfGrad.addColorStop(0.5, '#38bdf8');
        wfGrad.addColorStop(1, '#0d9488');
        ctx.fillStyle = wfGrad;
        ctx.fillRect(496, 220, 32, h - 220);

        // Top Jungle Canopy Leaves & Hanging Liana Vines
        ctx.fillStyle = '#052e16';
        for (let vx = 40; vx < w; vx += 85) {
          ctx.beginPath();
          ctx.arc(vx, 12, 54, 0, Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(vx, 40);
          ctx.quadraticCurveTo(vx + ((vx % 2 === 0) ? 18 : -18), 115, vx + 6, 185 + (vx % 55));
          ctx.stroke();
        }
      } else if (biome === 'desert_pyramid') {
        // 🏜️ STAGE 3: Golden Desert Pyramids, Blazing Sun, Sand Dunes & Camel Oasis
        // Giant Blazing Golden Sun
        const dSun = ctx.createRadialGradient(w * 0.5, h * 0.34, 18, w * 0.5, h * 0.34, 155);
        dSun.addColorStop(0, '#ffffff');
        dSun.addColorStop(0.35, '#fef08a');
        dSun.addColorStop(0.75, '#f59e0b');
        dSun.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = dSun;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.34, 155, 0, Math.PI * 2);
        ctx.fill();

        // Three Majestic Ancient Golden Egyptian Pyramids on the Horizon!
        const pyramids = [
          { cx: 230, baseW: 230, peakY: 225, leftCol: '#f59e0b', rightCol: '#b45309' },
          { cx: 512, baseW: 290, peakY: 165, leftCol: '#fbbf24', rightCol: '#92400e' },
          { cx: 795, baseW: 220, peakY: 235, leftCol: '#f59e0b', rightCol: '#b45309' }
        ];
        pyramids.forEach((p) => {
          // Sunlit Left Face
          ctx.fillStyle = p.leftCol;
          ctx.beginPath();
          ctx.moveTo(p.cx - p.baseW / 2, h - 45);
          ctx.lineTo(p.cx, p.peakY);
          ctx.lineTo(p.cx, h - 45);
          ctx.closePath();
          ctx.fill();
          // Shaded Right Face
          ctx.fillStyle = p.rightCol;
          ctx.beginPath();
          ctx.moveTo(p.cx, p.peakY);
          ctx.lineTo(p.cx + p.baseW / 2, h - 45);
          ctx.lineTo(p.cx, h - 45);
          ctx.closePath();
          ctx.fill();
          // Glowing Gold Capstone
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(p.cx - 24, p.peakY + 34);
          ctx.lineTo(p.cx, p.peakY);
          ctx.lineTo(p.cx + 24, p.peakY + 34);
          ctx.closePath();
          ctx.fill();
        });

        // Sweeping Golden Sand Dunes & Shimmering Turquoise Oasis Strip
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.quadraticCurveTo(260, 405, 520, 442);
        ctx.quadraticCurveTo(790, 405, w, 445);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(0, 462, w, h - 462);
      } else if (biome === 'glacier_ice' || biome === 'snow_aurora') {
        // 🧊 STAGE 4: Crystal Glacier Continent, Towering Blue Icebergs & Polar Aurora
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 130; i++) {
          ctx.beginPath();
          ctx.arc((i * 97) % w, (i * 41) % 320, (i % 2) + 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sweeping Polar Aurora Borealis Ribbons
        [
          { y: 115, c1: 'rgba(56, 189, 248, 0.55)', c2: 'rgba(0, 245, 212, 0)' },
          { y: 170, c1: 'rgba(0, 245, 212, 0.5)', c2: 'rgba(125, 211, 252, 0)' }
        ].forEach((au, idx) => {
          const ag = ctx.createLinearGradient(0, au.y - 45, 0, au.y + 65);
          ag.addColorStop(0, au.c2);
          ag.addColorStop(0.5, au.c1);
          ag.addColorStop(1, au.c2);
          ctx.strokeStyle = ag;
          ctx.lineWidth = 44;
          ctx.beginPath();
          ctx.moveTo(0, au.y);
          ctx.bezierCurveTo(w * 0.3, au.y - 50 + idx * 18, w * 0.7, au.y + 50 - idx * 15, w, au.y - 12);
          ctx.stroke();
        });

        // Towering Faceted Crystal Blue Glaciers & Icebergs
        [
          { x1: -20, xp: 165, x2: 360, yp: 175, c1: '#e0f2fe', c2: '#38bdf8' },
          { x1: 270, xp: 512, x2: 750, yp: 130, c1: '#ffffff', c2: '#0284c7' },
          { x1: 650, xp: 855, x2: 1050, yp: 165, c1: '#e0f2fe', c2: '#38bdf8' }
        ].forEach((gl) => {
          ctx.fillStyle = gl.c1;
          ctx.beginPath();
          ctx.moveTo(gl.x1, h);
          ctx.lineTo(gl.xp - 28, gl.yp + 18);
          ctx.lineTo(gl.xp, gl.yp);
          ctx.lineTo(gl.xp, h);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = gl.c2;
          ctx.beginPath();
          ctx.moveTo(gl.xp, gl.yp);
          ctx.lineTo(gl.xp + 32, gl.yp + 24);
          ctx.lineTo(gl.x2, h);
          ctx.lineTo(gl.xp, h);
          ctx.closePath();
          ctx.fill();
        });

        // Frozen Glacial Sea & Ice Floes
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(0, 448, w, h - 448);
        ctx.fillStyle = '#f0f9ff';
        for (let ix = 50; ix < w; ix += 160) {
          ctx.fillRect(ix, 456, 75, 14);
        }
      } else if (biome === 'dino_jurassic') {
        // 🦖 STAGE 5: Jurassic Dinosaur Era, Prehistoric Smoking Volcano & Flying Pterodactyls
        // Glowing Prehistoric Amber Sun & Meteor Streak
        const jSun = ctx.createRadialGradient(w * 0.72, h * 0.3, 14, w * 0.72, h * 0.3, 140);
        jSun.addColorStop(0, '#ffffff');
        jSun.addColorStop(0.4, '#fde047');
        jSun.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = jSun;
        ctx.beginPath();
        ctx.arc(w * 0.72, h * 0.3, 140, 0, Math.PI * 2);
        ctx.fill();

        // Giant Prehistoric Smoking Volcano on the Horizon
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(220, h);
        ctx.lineTo(465, 165);
        ctx.lineTo(558, 165);
        ctx.lineTo(800, h);
        ctx.closePath();
        ctx.fill();

        // Volcano Lava Glow & Ash Plume
        ctx.fillStyle = '#ff5722';
        ctx.beginPath();
        ctx.ellipse(512, 165, 48, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(68, 64, 60, 0.65)';
        [
          { x: 512, y: 120, r: 42 },
          { x: 475, y: 85, r: 52 },
          { x: 430, y: 60, r: 60 }
        ].forEach((sm) => {
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Flying Pterodactyl Silhouettes in the Jurassic Sky!
        ctx.fillStyle = '#1c1917';
        [
          { x: 210, y: 135, s: 1.1 },
          { x: 330, y: 175, s: 0.85 },
          { x: 810, y: 145, s: 1.0 }
        ].forEach((pt) => {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x - 38 * pt.s, pt.y - 18 * pt.s);
          ctx.lineTo(pt.x - 14 * pt.s, pt.y + 4 * pt.s);
          ctx.lineTo(pt.x, pt.y + 12 * pt.s);
          ctx.lineTo(pt.x + 14 * pt.s, pt.y + 4 * pt.s);
          ctx.lineTo(pt.x + 38 * pt.s, pt.y - 18 * pt.s);
          ctx.closePath();
          ctx.fill();
        });

        // Prehistoric Jungle Swamp Horizon
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 442, w, h - 442);
      } else {
        // 🌈 STAGE 8: Cyber Neon Synthwave Fantasy World
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 140; i++) {
          ctx.beginPath();
          ctx.arc((i * 97) % w, (i * 53) % 340, (i % 3 === 0) ? 2.2 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const sunGrad = ctx.createLinearGradient(0, h * 0.25, 0, h * 0.88);
        sunGrad.addColorStop(0, '#fff75e');
        sunGrad.addColorStop(0.5, '#ff5400');
        sunGrad.addColorStop(1, '#ff006e');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.62, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      this.biomeSkyTexture.needsUpdate = true;
      return this.biomeSkyTexture;
    },

    /**
     * Build Horizon Skybox Banner, Giant Retro Sun, and 3D Starfield
     */
    _buildSkyAndHorizon: function () {
      const THREE = global.THREE;

      const initialSkyTex = this._paintBiomeSkyboxTexture(this.currentTheme) || this.textures.skybox;
      const skyGeo = new THREE.PlaneGeometry(340, 150);
      const skyMat = new THREE.MeshBasicMaterial({
        map: initialSkyTex,
        fog: false,
        depthWrite: false
      });
      this.skyBackdropMesh = new THREE.Mesh(skyGeo, skyMat);
      this.skyBackdropMesh.position.set(0, 46, -195);
      this.scene.add(this.skyBackdropMesh);

      const sunGeo = new THREE.CircleGeometry(28, 48);
      const sunMat = new THREE.MeshBasicMaterial({
        color: this.currentTheme.secondary,
        transparent: true,
        opacity: 0.32,
        fog: false
      });
      this.retroSunMesh = new THREE.Mesh(sunGeo, sunMat);
      this.retroSunMesh.position.set(0, 24, -180);
      this.scene.add(this.retroSunMesh);

      const starCount = 260;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 260;
        starPositions[i * 3 + 1] = 12 + Math.random() * 75;
        starPositions[i * 3 + 2] = -20 - Math.random() * 170;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.75,
        transparent: true,
        opacity: 0.85,
        fog: false
      });
      this.starField = new THREE.Points(starGeo, starMat);
      this.scene.add(this.starField);
    },

    /**
     * Build Curving 3-Lane Highway, Flowing Side Rivers/Streams, Studded Curbs, and Multi-Biome 3D Scenery
     */
    _buildHighwayAndScenery: function () {
      const THREE = global.THREE;
      this.roadGroup = new THREE.Group();
      this.scene.add(this.roadGroup);
      this.roadCurvePhase = 0;

      // 1. Wide Outer Ground Plane (Grass / Cloud Floor / Seafloor / Volcano / Wonderland / Snow)
      const groundGeo = new THREE.PlaneGeometry(320, 270, 28, 28);
      const groundMat = new THREE.MeshBasicMaterial({
        color: this.currentTheme.ground || this.currentTheme.fog,
        side: THREE.DoubleSide
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.set(0, -0.15, -85);
      this.roadGroup.add(groundMesh);
      this.outerGroundMat = groundMat;

      // 2. Flowing 3D Rivers / Sea Streams / Cloud Streams / Magma Rivers along both sides of the curving road!
      this.stageRiverMeshes = [];
      this.stageRiverMat = new THREE.MeshBasicMaterial({
        color: this.currentTheme.river || 0x00d2ff,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide
      });
      [-1, 1].forEach((side) => {
        const rivGeo = new THREE.PlaneGeometry(16, 260, 1, 56);
        const pos = rivGeo.attributes.position;
        const baseVx = new Float32Array(pos.count);
        for (let v = 0; v < pos.count; v++) {
          baseVx[v] = pos.getX(v);
        }
        const rivMesh = new THREE.Mesh(rivGeo, this.stageRiverMat);
        rivMesh.rotation.x = -Math.PI / 2;
        rivMesh.position.set(0, -0.06, -85);
        rivMesh.userData = {
          baseVx: baseVx,
          sideOffset: side * 18.5
        };
        this.roadGroup.add(rivMesh);
        this.stageRiverMeshes.push(rivMesh);
      });

      // 2b. Subtle Grid Floor
      const gridHelper = new THREE.GridHelper(260, 52, this.currentTheme.primary, this.currentTheme.grid);
      gridHelper.position.set(0, -0.08, -85);
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.22;
      }
      this.roadGroup.add(gridHelper);
      this.synthGridHelper = gridHelper;

      // 3. Main 3-Lane Asphalt Highway Surface (Subdivided along Z so it bends smoothly into S-curves!)
      const roadGeo = new THREE.PlaneGeometry(14.4, 260, 1, 72);
      const roadPos = roadGeo.attributes.position;
      const roadBaseVx = new Float32Array(roadPos.count);
      for (let v = 0; v < roadPos.count; v++) {
        roadBaseVx[v] = roadPos.getX(v);
      }

      const roadMat = new THREE.MeshStandardMaterial({
        color: this.currentTheme.road,
        roughness: 0.4,
        metalness: 0.35
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.position.set(0, 0, -85);
      roadMesh.userData = { baseVx: roadBaseVx };
      this.roadGroup.add(roadMesh);
      this.roadMesh = roadMesh;
      this.roadSurfaceMat = roadMat;

      // 4. Continuous Curving Neon Edge Rails following the S-curve road edges
      this.edgeRailMeshes = [];
      this.edgeRailMat = new THREE.MeshBasicMaterial({
        color: this.currentTheme.primary,
        side: THREE.DoubleSide
      });
      [-7.2, 7.2].forEach((sideEdge) => {
        const railGeo = new THREE.PlaneGeometry(0.36, 260, 1, 72);
        const rPos = railGeo.attributes.position;
        const rBaseVx = new Float32Array(rPos.count);
        for (let v = 0; v < rPos.count; v++) {
          rBaseVx[v] = rPos.getX(v);
        }
        const railMesh = new THREE.Mesh(railGeo, this.edgeRailMat);
        railMesh.rotation.x = -Math.PI / 2;
        railMesh.position.set(0, 0.05, -85);
        railMesh.userData = { baseVx: rBaseVx, sideEdge: sideEdge };
        this.roadGroup.add(railMesh);
        this.edgeRailMeshes.push(railMesh);
      });

      this._updateRoadCurveGeometry();

      // 5. Scrolling Lane Divider Dashes
      this.laneDashMeshes = [];
      const dashGeo = new THREE.PlaneGeometry(0.28, 4.2);
      this.dashMaterial = new THREE.MeshBasicMaterial({
        color: this.currentTheme.primary,
        side: THREE.DoubleSide
      });

      const numRows = 24;
      const spacing = 10;
      for (let i = 0; i < numRows; i++) {
        const zPos = 24 - i * spacing;
        const wf = 1;
        const curveX = this._getRoadCurveX(zPos);
        [-2.25, 2.25].forEach((xPos) => {
          const dash = new THREE.Mesh(dashGeo, this.dashMaterial);
          dash.rotation.x = -Math.PI / 2;
          dash.position.set(xPos * wf + curveX, 0.02, zPos);
          dash.userData = { baseX: xPos };
          this.roadGroup.add(dash);
          this.laneDashMeshes.push(dash);
        });
      }

      // 6. Alternating Glowing Roblox Studded Side Curb Bricks
      this.curbMeshes = [];
      const curbGeo = new THREE.BoxGeometry(0.65, 0.32, 3.6);
      this.curbMatA = new THREE.MeshBasicMaterial({ color: this.currentTheme.curbA });
      this.curbMatB = new THREE.MeshBasicMaterial({ color: this.currentTheme.curbB });

      for (let i = 0; i < 32; i++) {
        const zPos = 24 - i * 7.5;
        const wf = 1;
        const curveX = this._getRoadCurveX(zPos);
        const mat = (i % 2 === 0) ? this.curbMatA : this.curbMatB;
        [-7.55, 7.55].forEach((cx) => {
          const curbGroup = new THREE.Group();
          curbGroup.position.set(cx * wf + curveX, 0.16, zPos);
          curbGroup.userData = { baseX: cx };
          const brick = new THREE.Mesh(curbGeo, mat);
          curbGroup.add(brick);

          if (this.sharedStudGeo) {
            [-1.1, 0, 1.1].forEach((sz) => {
              const stud = new THREE.Mesh(this.sharedStudGeo, mat);
              stud.position.set(0, 0.2, sz);
              curbGroup.add(stud);
            });
          }

          this.roadGroup.add(curbGroup);
          this.curbMeshes.push(curbGroup);
        });
      }

      // 7. Roadside Scrolling Multi-Biome Scenery + Roaming 3D Animals + Floating Obby Platforms + Mountains!
      this.sceneryItems = [];
      this.obbyPlatforms = [];
      this.biomePropVariants = [];
      this.roamingAnimals = [];
      this.biomeAnimalVariants = [];
      this.mountainSnowCaps = [];
      this.mountainMat = new THREE.MeshStandardMaterial({
        color: this.currentTheme.mountain,
        roughness: 0.7,
        metalness: 0.2,
        flatShading: true
      });
      this.mountainWireMat = new THREE.MeshBasicMaterial({
        color: this.currentTheme.mountainEdge,
        wireframe: true,
        transparent: true,
        opacity: this.getGraphicStyle() === 'smooth' ? 0.0 : 0.42
      });
      this.mountainSnowCapMat = new THREE.MeshBasicMaterial({
        color: 0xf4fbff
      });

      for (let i = 0; i < 18; i++) {
        const zPos = 20 - i * 12;
        [-1, 1].forEach((side) => {
          // Floating Roblox Obby Rainbow Brick Platform beside the highway
          const obbyPlat = this._createObbyPlatform(i, side);
          const platBaseX = side * (13.4 + (i % 3) * 1.9);
          obbyPlat.position.set(
            platBaseX,
            2.4 + (i % 4) * 0.85,
            zPos
          );
          obbyPlat.userData = {
            baseX: platBaseX,
            baseY: obbyPlat.position.y,
            phase: i * 0.7 + (side > 0 ? 1.5 : 0)
          };
          this.roadGroup.add(obbyPlat);
          this.sceneryItems.push(obbyPlat);
          this.obbyPlatforms.push(obbyPlat);

          // Roaming 3D Biome Animals right beside the road (Lions in Jungle, Camels + Foxes in Desert, Penguins + Polar Bears in Glacier, Dinosaurs in Jurassic, Deer/Pegasus/Turtles/Pandas!)
          if (i < 14) {
            const animalCluster = this._createMultiBiomeAnimalContainer(i, side);
            const animalBaseX = side * (10.4 + (i % 2) * 1.6);
            animalCluster.position.set(animalBaseX, 0, zPos - 2);
            animalCluster.userData = {
              baseX: animalBaseX,
              side: side,
              phase: i * 0.85 + (side > 0 ? 1.7 : 0),
              walkSpeed: 1.4 + (i % 3) * 0.35
            };
            this.roadGroup.add(animalCluster);
            this.roamingAnimals.push(animalCluster);
          }

          // Multi-Biome Roadside Prop Container (Nature Trees, Jungle Palms, Desert Cacti/Pyramids, Glacier Icebergs, Dino Cycads, Sky Clouds, Coral/Jellyfish, Lava Spires, Mushrooms, Cherry Trees!)
          const propContainer = this._createMultiBiomePropContainer(i, side);
          const propBaseX = side * (16.8 + (i % 3) * 2.4);
          propContainer.position.set(propBaseX, 0, zPos - 4);
          propContainer.userData = {
            baseX: propBaseX,
            phase: i * 0.5 + (side > 0 ? 1.1 : 0)
          };
          this.roadGroup.add(propContainer);
          this.sceneryItems.push(propContainer);

          // Low-poly mountain peaks with Snow Caps along the outer valley
          if (i % 2 === 0) {
            const mtn = this._createLowPolyMountain(i, side);
            const mtnBaseX = side * (31 + (i % 4) * 7);
            mtn.position.set(mtnBaseX, 0, zPos - 3);
            mtn.userData = { baseX: mtnBaseX };
            this.roadGroup.add(mtn);
            this.sceneryItems.push(mtn);
          }
        });
      }

      this._applyBiomePropsVisibility(this.currentTheme.biome || 'river_nature');

      // 8. Boss Hell & Erupting Lava Environment Group (Visible during Boss Fights!)
      this.bossLavaGroup = new THREE.Group();
      this.bossLavaGroup.visible = false;
      this.roadGroup.add(this.bossLavaGroup);
      this.bossLavaGeysers = [];

      const lavaRiverGeo = new THREE.PlaneGeometry(36, 260, 1, 24);
      this.bossLavaRiverMat = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        side: THREE.DoubleSide
      });
      const lavaGlowStripGeo = new THREE.PlaneGeometry(8, 260);
      this.bossLavaCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        side: THREE.DoubleSide
      });

      [-1, 1].forEach((side) => {
        const river = new THREE.Mesh(lavaRiverGeo, this.bossLavaRiverMat);
        river.rotation.x = -Math.PI / 2;
        river.position.set(side * 26.5, -0.02, -85);
        this.bossLavaGroup.add(river);

        const coreStream = new THREE.Mesh(lavaGlowStripGeo, this.bossLavaCoreMat);
        coreStream.rotation.x = -Math.PI / 2;
        coreStream.position.set(side * 13.5, 0.01, -85);
        this.bossLavaGroup.add(coreStream);
      });

      const geyserOuterGeo = new THREE.ConeGeometry(1.8, 12, 7);
      const geyserInnerGeo = new THREE.ConeGeometry(1.0, 15, 7);
      const geyserOuterMat = new THREE.MeshBasicMaterial({
        color: 0xff2a00,
        transparent: true,
        opacity: 0.88
      });
      const geyserInnerMat = new THREE.MeshBasicMaterial({
        color: 0xffe600
      });

      for (let g = 0; g < 12; g++) {
        const gz = 14 - g * 18;
        [-1, 1].forEach((side) => {
          const geyserGroup = new THREE.Group();
          const gx = side * (11.8 + (g % 3) * 2.4);
          geyserGroup.position.set(gx, 0, gz);

          const outerCone = new THREE.Mesh(geyserOuterGeo, geyserOuterMat);
          outerCone.position.y = 5.5;
          const innerCone = new THREE.Mesh(geyserInnerGeo, geyserInnerMat);
          innerCone.position.y = 6.8;
          geyserGroup.add(outerCone, innerCone);

          geyserGroup.userData = {
            phase: g * 0.85 + (side > 0 ? 1.6 : 0),
            baseX: gx,
            side: side
          };
          this.bossLavaGroup.add(geyserGroup);
          this.bossLavaGeysers.push(geyserGroup);
        });
      }
    },

    /**
     * Build a multi-biome prop container that holds 3D scenery meshes for each biome so switching stages is instant!
     */
    _createMultiBiomePropContainer: function (idx, side) {
      const THREE = global.THREE;
      const container = new THREE.Group();

      // 1. Nature Pine & Lush Forest Tree (river_nature, snow_aurora)
      const natureGroup = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 2.6, 6), trunkMat);
      trunk.position.y = 1.3;
      natureGroup.add(trunk);
      const pineColors = [0x2e7d32, 0x388e3c, 0x43a047];
      for (let tier = 0; tier < 3; tier++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(2.1 - tier * 0.42, 2.8 - tier * 0.3, 7),
          new THREE.MeshStandardMaterial({
            color: pineColors[tier],
            roughness: 0.6,
            flatShading: true
          })
        );
        cone.position.y = 3.0 + tier * 1.55;
        natureGroup.add(cone);
      }
      container.add(natureGroup);

      // 2. Sky Kingdom Fluffy Cloud & Rainbow Ring (sky_heaven)
      const skyGroup = new THREE.Group();
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x80d8ff,
        emissiveIntensity: 0.25,
        roughness: 0.3
      });
      [
        { x: 0, y: 3.2, z: 0, r: 1.55 },
        { x: -1.1, y: 2.9, z: 0.3, r: 1.15 },
        { x: 1.1, y: 2.95, z: -0.2, r: 1.2 }
      ].forEach((p) => {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(p.r, 1), cloudMat);
        puff.position.set(p.x, p.y, p.z);
        skyGroup.add(puff);
      });
      if (idx % 2 === 0) {
        const rainbowArch = new THREE.Mesh(
          new THREE.TorusGeometry(2.2, 0.22, 8, 20, Math.PI),
          new THREE.MeshBasicMaterial({ color: (idx % 4 === 0) ? 0xff4081 : 0xffea00 })
        );
        rainbowArch.position.y = 3.4;
        skyGroup.add(rainbowArch);
      }
      container.add(skyGroup);

      // 3. Underwater Coral Reef, Seaweed Kelp & Glowing Jellyfish (underwater_ocean)
      const oceanGroup = new THREE.Group();
      const coralColor = (idx % 3 === 0) ? 0xff4d6d : (idx % 3 === 1 ? 0x00f5d4 : 0xffbe0b);
      const coralMat = new THREE.MeshStandardMaterial({
        color: coralColor,
        emissive: coralColor,
        emissiveIntensity: 0.45,
        roughness: 0.35
      });
      // Branching Coral / Kelp
      for (let b = -1; b <= 1; b++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 3.6 + Math.abs(b) * 0.8, 6), coralMat);
        branch.position.set(b * 0.65, 1.8, 0);
        branch.rotation.z = -b * 0.28;
        oceanGroup.add(branch);
      }
      // Floating Translucent Jellyfish above the coral!
      const jellyDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65),
        new THREE.MeshBasicMaterial({
          color: (idx % 2 === 0) ? 0x72efdd : 0xff70a6,
          transparent: true,
          opacity: 0.82,
          side: THREE.DoubleSide
        })
      );
      jellyDome.position.y = 5.4;
      oceanGroup.add(jellyDome);
      container.add(oceanGroup);

      // 4. Molten Lava Volcano Pillar & Fire Crystal (molten_lava)
      const lavaGroup = new THREE.Group();
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(1.45, 6.2, 6),
        new THREE.MeshStandardMaterial({
          color: 0x2b0504,
          emissive: 0xff3d00,
          emissiveIntensity: 0.55,
          flatShading: true
        })
      );
      spire.position.y = 3.1;
      const magmaTip = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.95, 0),
        new THREE.MeshBasicMaterial({ color: 0xffea00 })
      );
      magmaTip.position.y = 6.5;
      lavaGroup.add(spire, magmaTip);
      container.add(lavaGroup);

      // 5. Wonderland Giant Magic Mushroom & Candy Lollipop (wonderland_magic)
      const wonderGroup = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.58, 3.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xfff8e1, roughness: 0.4 })
      );
      stem.position.y = 1.7;
      wonderGroup.add(stem);
      if (idx % 2 === 0) {
        // Giant Polka-Dot Magic Mushroom Cap
        const capMat = new THREE.MeshStandardMaterial({
          color: (side > 0) ? 0xff2a85 : 0x7209b7,
          emissive: 0xff007f,
          emissiveIntensity: 0.3,
          roughness: 0.3
        });
        const cap = new THREE.Mesh(
          new THREE.ConeGeometry(2.2, 2.0, 12),
          capMat
        );
        cap.position.y = 4.1;
        wonderGroup.add(cap);
      } else {
        // Giant Swirl Candy Lollipop
        const candy = new THREE.Mesh(
          new THREE.CylinderGeometry(1.65, 1.65, 0.42, 16),
          new THREE.MeshBasicMaterial({ color: (side > 0) ? 0xff70a6 : 0x00f5d4 })
        );
        candy.rotation.x = Math.PI / 2;
        candy.position.y = 4.4;
        wonderGroup.add(candy);
      }
      container.add(wonderGroup);

      // 6. Blooming Pink Cherry Blossom Tree (cherry_lake)
      const cherryGroup = new THREE.Group();
      const cTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.44, 2.8, 6), trunkMat);
      cTrunk.position.y = 1.4;
      cherryGroup.add(cTrunk);
      const blossomMat = new THREE.MeshStandardMaterial({
        color: (idx % 2 === 0) ? 0xffb3c6 : 0xff8fab,
        emissive: 0xff758f,
        emissiveIntensity: 0.25,
        roughness: 0.5,
        flatShading: true
      });
      [
        { x: 0, y: 3.9, z: 0, r: 1.75 },
        { x: -0.95, y: 3.3, z: 0.4, r: 1.25 },
        { x: 0.95, y: 3.4, z: -0.3, r: 1.25 }
      ].forEach((b) => {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(b.r, 1), blossomMat);
        crown.position.set(b.x, b.y, b.z);
        cherryGroup.add(crown);
      });
      container.add(cherryGroup);

      // 7. Cyber Synthwave Palm / Neon Crystal (neon_fantasy)
      const neonGroup = (idx % 2 === 0) ? this._createCyberPalm() : this._createNeonPylon(idx);
      container.add(neonGroup);

      // 8. Jungle Tropical Palm Tree, Broad Leaves & Hanging Vine (jungle_safari)
      const jungleGroup = new THREE.Group();
      const jTrunkMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.85 });
      const jTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 5.4, 7), jTrunkMat);
      jTrunk.position.y = 2.7;
      jTrunk.rotation.z = side * -0.1;
      jungleGroup.add(jTrunk);
      const jLeafMat = new THREE.MeshStandardMaterial({
        color: (idx % 2 === 0) ? 0x16a34a : 0x65a30d,
        roughness: 0.5,
        flatShading: true
      });
      for (let f = 0; f < 6; f++) {
        const ang = (f / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.85, 3.6, 5), jLeafMat);
        frond.position.set(Math.cos(ang) * 1.25, 5.2, Math.sin(ang) * 1.25);
        frond.rotation.z = -Math.cos(ang) * 1.15;
        frond.rotation.x = Math.sin(ang) * 1.15;
        jungleGroup.add(frond);
      }
      // Lush Jungle Bush at base
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), jLeafMat);
      bush.position.set(-side * 0.8, 0.9, 0.5);
      jungleGroup.add(bush);
      container.add(jungleGroup);

      // 9. Golden Desert Saguaro Cactus & Ancient Sandstone Mini-Pyramid (desert_pyramid)
      const desertGroup = new THREE.Group();
      if (idx % 3 === 0) {
        // Golden Sandstone Pyramid Ruin
        const pyr = new THREE.Mesh(
          new THREE.ConeGeometry(2.9, 4.6, 4),
          new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0x78350f,
            emissiveIntensity: 0.25,
            roughness: 0.6,
            flatShading: true
          })
        );
        pyr.position.y = 2.3;
        pyr.rotation.y = Math.PI / 4;
        desertGroup.add(pyr);
      } else {
        // Saguaro Cactus with 2 side arms
        const cactusMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
        const mainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 4.8, 8), cactusMat);
        mainStem.position.y = 2.4;
        const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 1.8, 7), cactusMat);
        armL.position.set(-0.75, 3.1, 0);
        armL.rotation.z = 0.45;
        const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 1.6, 7), cactusMat);
        armR.position.set(0.75, 2.6, 0);
        armR.rotation.z = -0.45;
        desertGroup.add(mainStem, armL, armR);
      }
      container.add(desertGroup);

      // 10. Crystal Blue Glacier Iceberg & Ice SpireCluster (glacier_ice)
      const glacierGroup = new THREE.Group();
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
        roughness: 0.15,
        metalness: 0.25,
        flatShading: true
      });
      const mainIce = new THREE.Mesh(new THREE.ConeGeometry(1.9, 6.2, 5), iceMat);
      mainIce.position.y = 3.1;
      const subIce = new THREE.Mesh(new THREE.ConeGeometry(1.25, 4.0, 5), iceMat);
      subIce.position.set(-side * 1.1, 2.0, 0.6);
      subIce.rotation.z = side * 0.18;
      glacierGroup.add(mainIce, subIce);
      container.add(glacierGroup);

      // 11. Prehistoric Jurassic Cycad Fern Tree & Spotted Dino Egg Nest (dino_jurassic)
      const dinoGroup = new THREE.Group();
      const cycadTrunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.68, 3.8, 7),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
      );
      cycadTrunk.position.y = 1.9;
      dinoGroup.add(cycadTrunk);
      const fernMat = new THREE.MeshStandardMaterial({
        color: 0x4d7c0f,
        roughness: 0.55,
        flatShading: true
      });
      for (let f = 0; f < 7; f++) {
        const ang = (f / 7) * Math.PI * 2;
        const fern = new THREE.Mesh(new THREE.ConeGeometry(0.72, 3.4, 4), fernMat);
        fern.position.set(Math.cos(ang) * 1.1, 3.8, Math.sin(ang) * 1.1);
        fern.rotation.z = -Math.cos(ang) * 1.2;
        fern.rotation.x = Math.sin(ang) * 1.2;
        dinoGroup.add(fern);
      }
      if (idx % 2 === 0) {
        const dinoEgg = new THREE.Mesh(
          new THREE.SphereGeometry(0.65, 10, 10),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0x84cc16, emissiveIntensity: 0.2 })
        );
        dinoEgg.scale.set(0.85, 1.25, 0.85);
        dinoEgg.position.set(-side * 1.1, 0.75, 0.6);
        dinoGroup.add(dinoEgg);
      }
      container.add(dinoGroup);

      this.biomePropVariants.push({
        natureGroup: natureGroup,
        jungleGroup: jungleGroup,
        desertGroup: desertGroup,
        glacierGroup: glacierGroup,
        dinoGroup: dinoGroup,
        skyGroup: skyGroup,
        oceanGroup: oceanGroup,
        lavaGroup: lavaGroup,
        wonderGroup: wonderGroup,
        cherryGroup: cherryGroup,
        neonGroup: neonGroup
      });

      return container;
    },

    /**
     * Helper to build a 4-legged blocky animal base with animated legs, head, and tail
     */
    _buildQuadrupedMesh: function (opts) {
      const THREE = global.THREE;
      const root = new THREE.Group();
      const s = opts.scale || 1.25;
      const bodyMat = new THREE.MeshStandardMaterial({ color: opts.bodyColor || 0xf59e0b, roughness: 0.5 });
      const accentMat = new THREE.MeshStandardMaterial({ color: opts.accentColor || 0x78350f, roughness: 0.55 });
      const darkMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const legH = (opts.legHeight || 0.9) * s;
      const bodyW = (opts.bodyW || 1.05) * s;
      const bodyH = (opts.bodyH || 0.85) * s;
      const bodyL = (opts.bodyL || 1.85) * s;

      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyL), bodyMat);
      body.position.y = legH + bodyH * 0.5;
      root.add(body);

      // 4 Animated Legs
      const legGeo = new THREE.BoxGeometry(0.26 * s, legH, 0.26 * s);
      const legs = [];
      [
        { x: -bodyW * 0.34, z: -bodyL * 0.34 },
        { x: bodyW * 0.34, z: -bodyL * 0.34 },
        { x: -bodyW * 0.34, z: bodyL * 0.34 },
        { x: bodyW * 0.34, z: bodyL * 0.34 }
      ].forEach((lp) => {
        const leg = new THREE.Mesh(legGeo, bodyMat);
        leg.position.set(lp.x, legH * 0.5, lp.z);
        root.add(leg);
        legs.push(leg);
      });

      // Head Group
      const headGroup = new THREE.Group();
      const neckH = (opts.neckHeight || 0.35) * s;
      if (opts.neckHeight && opts.neckHeight > 0.4) {
        const neck = new THREE.Mesh(
          new THREE.BoxGeometry(0.38 * s, neckH, 0.42 * s),
          bodyMat
        );
        neck.position.set(0, legH + bodyH + neckH * 0.4, -bodyL * 0.42);
        neck.rotation.x = 0.22;
        root.add(neck);
      }

      headGroup.position.set(0, legH + bodyH + neckH * 0.72, -bodyL * 0.52);

      // Optional Lion Mane ("정글 지날갈때 옆에 사자가 나오고")
      if (opts.hasLionMane) {
        const maneOuter = new THREE.Mesh(
          new THREE.BoxGeometry(1.48 * s, 1.48 * s, 0.78 * s),
          accentMat
        );
        maneOuter.position.set(0, 0.05 * s, 0.08 * s);
        headGroup.add(maneOuter);
      }

      const headBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.82 * s, 0.76 * s, 0.82 * s),
        opts.headMat || bodyMat
      );
      headGroup.add(headBox);

      // Snout & Nose
      const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.48 * s, 0.36 * s, 0.38 * s),
        new THREE.MeshStandardMaterial({ color: opts.snoutColor || 0xfef3c7, roughness: 0.5 })
      );
      snout.position.set(0, -0.1 * s, -0.48 * s);
      const nose = new THREE.Mesh(new THREE.BoxGeometry(0.2 * s, 0.14 * s, 0.12 * s), darkMat);
      nose.position.set(0, -0.02 * s, -0.68 * s);
      headGroup.add(snout, nose);

      // Eyes
      [-0.22 * s, 0.22 * s].forEach((ex) => {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12 * s, 0.14 * s, 0.08 * s), darkMat);
        eye.position.set(ex, 0.12 * s, -0.42 * s);
        const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.05 * s, 0.05 * s, 0.09 * s), whiteMat);
        pupil.position.set(ex + 0.02 * s, 0.14 * s, -0.43 * s);
        headGroup.add(eye, pupil);
      });

      // Ears / Horns / Antlers
      const earH = (opts.earHeight || 0.28) * s;
      [-0.28 * s, 0.28 * s].forEach((ex) => {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.22 * s, earH, 0.18 * s), opts.earUseAccent ? accentMat : bodyMat);
        ear.position.set(ex, 0.38 * s + earH * 0.4, -0.05 * s);
        headGroup.add(ear);
      });

      if (opts.hasUnicornHorn) {
        const horn = new THREE.Mesh(
          new THREE.ConeGeometry(0.14 * s, 0.75 * s, 6),
          new THREE.MeshBasicMaterial({ color: 0xffd700 })
        );
        horn.position.set(0, 0.65 * s, -0.25 * s);
        horn.rotation.x = 0.35;
        headGroup.add(horn);
      }

      root.add(headGroup);

      // Optional Two Camel Humps ("사막은 낙타")
      if (opts.camelHumps === 2) {
        [-0.36 * s, 0.38 * s].forEach((hz) => {
          const hump = new THREE.Mesh(
            new THREE.BoxGeometry(0.76 * s, 0.68 * s, 0.66 * s),
            accentMat
          );
          hump.position.set(0, legH + bodyH + 0.28 * s, hz);
          root.add(hump);
        });
      }

      // Optional Wings (Pegasus / Fire Dragon)
      if (opts.hasWings) {
        const wingMat = new THREE.MeshStandardMaterial({ color: opts.wingColor || 0xffffff, roughness: 0.3 });
        [-1, 1].forEach((ws) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(1.15 * s, 0.14 * s, 0.72 * s), wingMat);
          wing.position.set(ws * (bodyW * 0.65), legH + bodyH * 0.85, -0.1 * s);
          wing.rotation.z = ws * 0.35;
          root.add(wing);
        });
      }

      // Tail
      const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.18 * s, 0.18 * s, 0.75 * s),
        accentMat
      );
      tail.position.set(0, legH + bodyH * 0.75, bodyL * 0.56);
      tail.rotation.x = -0.45;
      root.add(tail);

      root.userData = {
        legs: legs,
        headGroup: headGroup,
        tail: tail
      };
      return root;
    },

    /**
     * Build a multi-biome 3D Roaming Animal Cluster right beside the highway!
     * Includes primary animals (Lion in Jungle, Two-Hump Camel in Desert, Penguin/Polar Bear in Glacier, T-Rex/Brachiosaurus in Dino Era, etc.)
     * PLUS companion animals roaming around them ("정글 지날갈때 옆에 사자가 나오고, 사막은 낙타 주변에 동물들도 좀 돌아다니게 해")!
     */
    _createMultiBiomeAnimalContainer: function (idx, side) {
      const THREE = global.THREE;
      const cluster = new THREE.Group();

      // 1. JUNGLE SAFARI: 🦁 Golden Lion with Mane + Companion 🐒 Monkey / 🦓 Zebra
      const jungleAnimals = new THREE.Group();
      const lion = this._buildQuadrupedMesh({
        scale: 1.32,
        bodyColor: 0xf59e0b,
        accentColor: 0x78350f,
        snoutColor: 0xfef08a,
        hasLionMane: true,
        legHeight: 0.92
      });
      jungleAnimals.add(lion);

      // Companion animal roaming near the Lion (Monkey or Zebra cub)
      const jungleCompanion = this._buildQuadrupedMesh({
        scale: 0.78,
        bodyColor: (idx % 2 === 0) ? 0x92400e : 0xfef08a,
        accentColor: 0x1c1917,
        snoutColor: 0xfde68a,
        earHeight: 0.34,
        earUseAccent: true,
        legHeight: 0.75
      });
      jungleCompanion.position.set(side * 2.1, 0, 1.6);
      jungleAnimals.add(jungleCompanion);
      cluster.add(jungleAnimals);

      // 2. DESERT PYRAMID: 🐪 Two-Hump Camel + Surrounding 🦊 Fennec Fox & 🐐 Oasis Gazelle ("사막은 낙타 주변에 동물들도 좀 돌아다니게 해")
      const desertAnimals = new THREE.Group();
      const camel = this._buildQuadrupedMesh({
        scale: 1.38,
        bodyColor: 0xd97706,
        accentColor: 0x92400e,
        snoutColor: 0xfde68a,
        camelHumps: 2,
        neckHeight: 1.05,
        legHeight: 1.22,
        bodyL: 2.05
      });
      desertAnimals.add(camel);

      // Surrounding Animal 1: Cute Fennec Fox with giant ears trotting next to the Camel
      const desertFox = this._buildQuadrupedMesh({
        scale: 0.76,
        bodyColor: 0xfb923c,
        accentColor: 0xffffff,
        snoutColor: 0xffffff,
        earHeight: 0.58,
        earUseAccent: false,
        legHeight: 0.65
      });
      desertFox.position.set(side * 2.2, 0, -1.4);
      desertAnimals.add(desertFox);

      // Surrounding Animal 2: Oasis Gazelle / Desert Hare hopping on the other side of the Camel
      const desertGazelle = this._buildQuadrupedMesh({
        scale: 0.84,
        bodyColor: 0xfbbf24,
        accentColor: 0x78350f,
        snoutColor: 0xfef3c7,
        neckHeight: 0.68,
        earHeight: 0.46,
        earUseAccent: true,
        legHeight: 0.95
      });
      desertGazelle.position.set(-side * 1.65, 0, 2.1);
      desertAnimals.add(desertGazelle);
      cluster.add(desertAnimals);

      // 3. GLACIER ICE: 🐧 Waddling Emperor Penguin + 🐻‍❄️ Snowy Polar Bear
      const glacierAnimals = new THREE.Group();
      const polarBear = this._buildQuadrupedMesh({
        scale: 1.35,
        bodyColor: 0xf8fafc,
        accentColor: 0xcbd5e1,
        snoutColor: 0xe2e8f0,
        bodyW: 1.25,
        bodyH: 1.05,
        legHeight: 0.88
      });
      glacierAnimals.add(polarBear);

      // Waddling Emperor Penguin companion right beside the Polar Bear!
      const penguin = new THREE.Group();
      const pDark = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
      const pWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const pOrange = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      const pGold = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.55, 0.82), pDark);
      pBody.position.y = 0.95;
      const pBelly = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.25, 0.14), pWhite);
      pBelly.position.set(0, 0.88, -0.4);
      const pChest = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 0.16), pGold);
      pChest.position.set(0, 1.38, -0.41);
      const pHead = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.68, 0.76), pDark);
      pHead.position.y = 2.02;
      const pBeak = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 4), pOrange);
      pBeak.rotation.x = -Math.PI / 2;
      pBeak.position.set(0, 1.98, -0.56);
      [-0.42, 0.42].forEach((fx) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.52), pOrange);
        foot.position.set(fx * 0.7, 0.08, -0.15);
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.95, 0.36), pDark);
        wing.position.set(fx * 1.3, 0.98, 0);
        wing.rotation.z = fx * -0.25;
        penguin.add(foot, wing);
      });
      penguin.add(pBody, pBelly, pChest, pHead, pBeak);
      penguin.position.set(side * 2.1, 0, -1.3);
      glacierAnimals.add(penguin);
      cluster.add(glacierAnimals);

      // 4. DINO JURASSIC: 🦖 Giant T-Rex + 🦕 Tall Long-Neck Brachiosaurus
      const dinoAnimals = new THREE.Group();
      const trex = new THREE.Group();
      const dinoGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.55 });
      const dinoBelly = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.55 });
      const dinoTeeth = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dinoEye = new THREE.MeshBasicMaterial({ color: 0xffea00 });

      const tBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.55, 2.25), dinoGreen);
      tBody.position.set(0, 1.95, 0);
      tBody.rotation.x = -0.25;
      const tHead = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.1, 1.65), dinoGreen);
      tHead.position.set(0, 3.05, -1.15);
      const tJaw = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.24, 1.35), dinoTeeth);
      tJaw.position.set(0, 2.52, -1.2);
      [-0.58, 0.58].forEach((ex) => {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.2), dinoEye);
        eye.position.set(ex, 3.25, -1.45);
        trex.add(eye);
      });
      const tLegs = [];
      [-0.55, 0.55].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.5, 0.58), dinoGreen);
        leg.position.set(lx, 0.75, 0.2);
        trex.add(leg);
        tLegs.push(leg);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.55), dinoBelly);
        arm.position.set(lx * 1.2, 2.1, -0.95);
        trex.add(arm);
      });
      const tTail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.6, 5), dinoGreen);
      tTail.rotation.x = Math.PI * 0.42;
      tTail.position.set(0, 1.65, 1.95);
      trex.add(tBody, tHead, tJaw, tTail);
      trex.userData = { legs: tLegs, headGroup: tHead, tail: tTail };
      dinoAnimals.add(trex);

      // Long-Neck Brachiosaurus companion next to T-Rex
      const brachio = this._buildQuadrupedMesh({
        scale: 1.15,
        bodyColor: 0x0d9488,
        accentColor: 0x14b8a6,
        snoutColor: 0x99f6e4,
        neckHeight: 2.25,
        legHeight: 1.15
      });
      brachio.position.set(side * 2.5, 0, 1.8);
      dinoAnimals.add(brachio);
      cluster.add(dinoAnimals);

      // 5. RIVER NATURE: 🦌 Forest Deer + 🐰 Hopping White Bunny
      const natureAnimals = new THREE.Group();
      const deer = this._buildQuadrupedMesh({
        scale: 1.2,
        bodyColor: 0xb45309,
        accentColor: 0xfef08a,
        snoutColor: 0xfef3c7,
        neckHeight: 0.72,
        earHeight: 0.55,
        earUseAccent: true,
        legHeight: 1.05
      });
      const bunny = this._buildQuadrupedMesh({
        scale: 0.68,
        bodyColor: 0xffffff,
        accentColor: 0xf472b6,
        snoutColor: 0xfbcfe8,
        earHeight: 0.65,
        earUseAccent: true,
        legHeight: 0.55
      });
      bunny.position.set(side * 1.9, 0, -1.2);
      natureAnimals.add(deer, bunny);
      cluster.add(natureAnimals);

      // 6. SKY HEAVEN: 🦄 Winged Pegasus Unicorn
      const skyAnimals = new THREE.Group();
      const pegasus = this._buildQuadrupedMesh({
        scale: 1.28,
        bodyColor: 0xffffff,
        accentColor: 0xf472b6,
        snoutColor: 0xfef08a,
        neckHeight: 0.75,
        hasUnicornHorn: true,
        hasWings: true,
        wingColor: 0xe0f2fe,
        legHeight: 1.0
      });
      pegasus.position.y = 0.6;
      skyAnimals.add(pegasus);
      cluster.add(skyAnimals);

      // 7. UNDERWATER OCEAN: 🐢 Sea Turtle & 🐬 Dolphin
      const oceanAnimals = new THREE.Group();
      const turtle = this._buildQuadrupedMesh({
        scale: 1.18,
        bodyColor: 0x10b981,
        accentColor: 0x047857,
        snoutColor: 0xa7f3d0,
        bodyW: 1.45,
        bodyH: 0.55,
        legHeight: 0.45
      });
      turtle.position.y = 1.2;
      const dolphin = this._buildQuadrupedMesh({
        scale: 0.95,
        bodyColor: 0x38bdf8,
        accentColor: 0x0284c7,
        snoutColor: 0xe0f2fe,
        hasWings: true,
        wingColor: 0x38bdf8,
        legHeight: 0.35
      });
      dolphin.position.set(side * 2.0, 2.2, -1.2);
      oceanAnimals.add(turtle, dolphin);
      cluster.add(oceanAnimals);

      // 8. MOLTEN LAVA: 🐉 Red-Gold Fire Drake
      const lavaAnimals = new THREE.Group();
      const fireDrake = this._buildQuadrupedMesh({
        scale: 1.28,
        bodyColor: 0xdc2626,
        accentColor: 0xfacc15,
        snoutColor: 0xfef08a,
        neckHeight: 0.8,
        hasWings: true,
        wingColor: 0xf97316,
        earHeight: 0.48,
        earUseAccent: true,
        legHeight: 0.9
      });
      lavaAnimals.add(fireDrake);
      cluster.add(lavaAnimals);

      // 9. WONDERLAND MAGIC: 🐇 Pastel Wonderland Bunny & 🐱 Magic Cat
      const wonderAnimals = new THREE.Group();
      const magicBunny = this._buildQuadrupedMesh({
        scale: 1.15,
        bodyColor: 0xfdf4ff,
        accentColor: 0xff2a85,
        snoutColor: 0xfbcfe8,
        earHeight: 0.72,
        earUseAccent: true,
        legHeight: 0.82
      });
      const magicCat = this._buildQuadrupedMesh({
        scale: 0.82,
        bodyColor: 0xc084fc,
        accentColor: 0x80ffdb,
        snoutColor: 0xfef08a,
        earHeight: 0.38,
        earUseAccent: true,
        legHeight: 0.68
      });
      magicCat.position.set(side * 1.95, 0, 1.4);
      wonderAnimals.add(magicBunny, magicCat);
      cluster.add(wonderAnimals);

      // 10. CHERRY LAKE / NEON: 🐼 Giant Panda & 🦊 Pink Sakura Fox
      const cherryAnimals = new THREE.Group();
      const panda = this._buildQuadrupedMesh({
        scale: 1.28,
        bodyColor: 0xffffff,
        accentColor: 0x111827,
        snoutColor: 0xf8fafc,
        bodyW: 1.25,
        bodyH: 1.0,
        earHeight: 0.32,
        earUseAccent: true,
        legHeight: 0.8
      });
      const sakuraFox = this._buildQuadrupedMesh({
        scale: 0.82,
        bodyColor: 0xff8fab,
        accentColor: 0xffffff,
        snoutColor: 0xffe5ec,
        earHeight: 0.45,
        earUseAccent: true,
        legHeight: 0.72
      });
      sakuraFox.position.set(side * 2.0, 0, -1.3);
      cherryAnimals.add(panda, sakuraFox);
      cluster.add(cherryAnimals);

      this.biomeAnimalVariants.push({
        cluster: cluster,
        natureAnimals: natureAnimals,
        jungleAnimals: jungleAnimals,
        desertAnimals: desertAnimals,
        glacierAnimals: glacierAnimals,
        dinoAnimals: dinoAnimals,
        skyAnimals: skyAnimals,
        oceanAnimals: oceanAnimals,
        lavaAnimals: lavaAnimals,
        wonderAnimals: wonderAnimals,
        cherryAnimals: cherryAnimals,
        primaryWalkers: [lion, camel, polarBear, trex, deer, pegasus, turtle, fireDrake, magicBunny, panda],
        companions: [jungleCompanion, desertFox, desertGazelle, penguin, brachio, bunny, dolphin, magicCat, sakuraFox]
      });

      return cluster;
    },

    /**
     * Toggle visibility of roadside 3D props, roaming 3D animals & mountain snow caps to match the active stage biome
     */
    _applyBiomePropsVisibility: function (biome) {
      if (Array.isArray(this.biomePropVariants)) {
        for (let i = 0; i < this.biomePropVariants.length; i++) {
          const v = this.biomePropVariants[i];
          v.natureGroup.visible = (biome === 'river_nature' || biome === 'snow_aurora');
          if (v.jungleGroup) v.jungleGroup.visible = (biome === 'jungle_safari');
          if (v.desertGroup) v.desertGroup.visible = (biome === 'desert_pyramid');
          if (v.glacierGroup) v.glacierGroup.visible = (biome === 'glacier_ice');
          if (v.dinoGroup) v.dinoGroup.visible = (biome === 'dino_jurassic');
          v.skyGroup.visible = (biome === 'sky_heaven');
          v.oceanGroup.visible = (biome === 'underwater_ocean');
          v.lavaGroup.visible = (biome === 'molten_lava');
          v.wonderGroup.visible = (biome === 'wonderland_magic');
          v.cherryGroup.visible = (biome === 'cherry_lake');
          v.neonGroup.visible = (biome === 'neon_fantasy');
        }
      }
      if (Array.isArray(this.biomeAnimalVariants)) {
        for (let i = 0; i < this.biomeAnimalVariants.length; i++) {
          const a = this.biomeAnimalVariants[i];
          a.natureAnimals.visible = (biome === 'river_nature');
          a.jungleAnimals.visible = (biome === 'jungle_safari');
          a.desertAnimals.visible = (biome === 'desert_pyramid');
          a.glacierAnimals.visible = (biome === 'glacier_ice' || biome === 'snow_aurora');
          a.dinoAnimals.visible = (biome === 'dino_jurassic');
          a.skyAnimals.visible = (biome === 'sky_heaven');
          a.oceanAnimals.visible = (biome === 'underwater_ocean');
          a.lavaAnimals.visible = (biome === 'molten_lava');
          a.wonderAnimals.visible = (biome === 'wonderland_magic');
          a.cherryAnimals.visible = (biome === 'cherry_lake' || biome === 'neon_fantasy');
        }
      }
      if (Array.isArray(this.mountainSnowCaps)) {
        const showCaps = (
          biome === 'river_nature' ||
          biome === 'glacier_ice' ||
          biome === 'snow_aurora' ||
          biome === 'cherry_lake' ||
          biome === 'sky_heaven'
        );
        for (let c = 0; c < this.mountainSnowCaps.length; c++) {
          this.mountainSnowCaps[c].visible = showCaps;
        }
      }
    },

    /**
     * Create a colorful floating Roblox Obby Rainbow Platform with cylindrical Studs
     */
    _createObbyPlatform: function (idx, side) {
      const THREE = global.THREE;
      const group = new THREE.Group();
      const colorIdx = (idx + (side > 0 ? 3 : 0)) % ROBLOX_BRICK_COLORS.length;
      const mat =
        (this.sharedBrickMaterials && this.sharedBrickMaterials[colorIdx]) ||
        new THREE.MeshBasicMaterial({ color: ROBLOX_BRICK_COLORS[colorIdx] });

      const plateGeo = new THREE.BoxGeometry(3.4, 0.55, 4.8);
      const plate = new THREE.Mesh(plateGeo, mat);
      group.add(plate);

      // 6 Roblox cylindrical studs on top of the Obby brick
      const studGeo = this.sharedStudGeo || new THREE.CylinderGeometry(0.18, 0.18, 0.1, 10);
      [-0.85, 0.85].forEach((sx) => {
        [-1.4, 0, 1.4].forEach((sz) => {
          const stud = new THREE.Mesh(studGeo, mat);
          stud.position.set(sx, 0.33, sz);
          group.add(stud);
        });
      });

      // Every 3rd platform has a spinning Golden Robux Coin / Obby Star floating above it
      if (idx % 3 === 0 && this.sharedRobuxGeo && this.sharedRobuxMaterial) {
        const coin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
        coin.position.set(0, 1.25, 0);
        group.add(coin);
      }

      return group;
    },

    _createCyberPalm: function () {
      const THREE = global.THREE;
      const group = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.16, 0.35, 6.2, 6);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x240b36,
        emissive: 0xff007f,
        emissiveIntensity: 0.4,
        flatShading: true
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 3.1;
      group.add(trunk);

      const ringGeo = new THREE.TorusGeometry(0.28, 0.05, 6, 12);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
      for (let r = 1; r <= 4; r++) {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = r * 1.3;
        group.add(ring);
      }

      const frondGeo = new THREE.ConeGeometry(0.65, 3.2, 4);
      const frondMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        wireframe: false
      });
      for (let f = 0; f < 6; f++) {
        const angle = (f / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.position.set(Math.cos(angle) * 1.1, 6.1, Math.sin(angle) * 1.1);
        frond.rotation.z = -Math.cos(angle) * 1.1;
        frond.rotation.x = Math.sin(angle) * 1.1;
        group.add(frond);
      }

      return group;
    },

    _createNeonPylon: function (idx) {
      const THREE = global.THREE;
      const group = new THREE.Group();
      const h = 6 + (idx % 3) * 2.5;
      const pylonGeo = new THREE.OctahedronGeometry(1.1, 0);
      const color = (idx % 2 === 0) ? 0x00f3ff : 0xff007f;
      const pylonMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true
      });
      const crystal = new THREE.Mesh(pylonGeo, pylonMat);
      crystal.scale.set(1, h / 2.2, 1);
      crystal.position.y = h / 2 + 0.5;
      group.add(crystal);

      const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
      const coreMat = new THREE.MeshBasicMaterial({ color: color });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.scale.set(1, h / 2.6, 1);
      core.position.y = h / 2 + 0.5;
      group.add(core);

      return group;
    },

    _createLowPolyMountain: function (idx, side) {
      const THREE = global.THREE;
      const group = new THREE.Group();
      const radius = 9 + (idx % 3) * 4;
      const height = 11 + ((idx * 7) % 14);
      const coneGeo = new THREE.ConeGeometry(radius, height, 6);
      const mesh = new THREE.Mesh(coneGeo, this.mountainMat);
      mesh.position.y = height / 2 - 0.2;
      mesh.rotation.y = side * idx * 0.7;

      const wire = new THREE.Mesh(coneGeo, this.mountainWireMat);
      wire.position.y = height / 2 - 0.18;
      wire.rotation.y = mesh.rotation.y;
      wire.scale.set(1.01, 1.01, 1.01);

      // Snow Cap Cone on top of the mountain peak!
      const capGeo = new THREE.ConeGeometry(radius * 0.39, height * 0.38, 6);
      const snowCap = new THREE.Mesh(capGeo, this.mountainSnowCapMat);
      snowCap.position.y = height * 0.81 - 0.15;
      snowCap.rotation.y = mesh.rotation.y;
      if (this.mountainSnowCaps) {
        this.mountainSnowCaps.push(snowCap);
      }

      group.add(mesh, wire, snowCap);
      return group;
    },

    /**
     * Alias for _buildPlayerCar
     */
    createPlayerCar: function () {
      return this._buildPlayerCar();
    },

    /**
     * Changes the active 3D Character / Vehicle type (10 types, default 'kart_saber') and rebuilds the 3D model immediately!
     * @param {string} vehicleId
     */
    setVehicleType: function (vehicleId) {
      const nextId = String(vehicleId || 'kart_saber').trim() || 'kart_saber';
      this.currentVehicleType = nextId;
      if (this.scene && global.THREE) {
        const prevX = this.carGroup ? this.carGroup.position.x : 0;
        const prevY = this.carGroup ? this.carGroup.position.y : 0;
        this._buildPlayerCar();
        if (this.carGroup) {
          this.carGroup.position.x = prevX;
          this.carGroup.position.y = prevY;
        }
        this.renderSingleFrame();
      }
      return this.currentVehicleType;
    },

    /**
     * Triggers a 2.0-second KartRider Nitro Booster 3D Animation!
     * @param {number} [duration=2.0]
     */
    triggerKartBooster: function (duration) {
      const dur = typeof duration === 'number' ? duration : 2.0;
      this.kartBoosterTimer = dur;
      this.kartBrakeTimer = 0;
      this.boostEffectTimer = dur;
      this.BoosterParticleTick = 0;
      this.avatarCheerTimer = dur;
      this.petSpinTimer = dur;
      this.cameraZoomPunch = 14.5;
      if (this.carGroup) {
        const cx = this.carGroup.position.x;
        const cy = Math.max(0.4, this.carGroup.position.y + 0.5);
        const cz = getCfg().GATE_PASS_Z + 1.8;
        this._spawnParticleBurst(cx, cy, cz, 0x00e5ff, 36, 1.45);
        this._spawnParticleBurst(cx, cy, cz, 0xffe600, 24, 1.2);
      }
      return true;
    },

    /**
     * Triggers a 4.0-second Sudden Hard-Brake / Screech Stop 3D Animation!
     * @param {number} [duration=4.0]
     */
    triggerKartBrake: function (duration) {
      const dur = typeof duration === 'number' ? duration : 4.0;
      this.kartBrakeTimer = dur;
      this.kartBoosterTimer = 0;
      this.boostEffectTimer = 0;
      this.brakeParticleTick = 0;
      this.cameraZoomPunch = -8.5;
      if (this.carGroup) {
        const cx = this.carGroup.position.x;
        const cy = Math.max(0.25, this.carGroup.position.y + 0.25);
        const cz = getCfg().GATE_PASS_Z + 1.4;
        this._spawnParticleBurst(cx, cy, cz, 0xe2e8f0, 28, 1.0);
        this._spawnParticleBurst(cx, cy, cz, 0xff5500, 20, 0.9);
      }
      return true;
    },

    /**
     * Build 10 Distinct 3D Vehicles & Riding Characters for Soyun:
     * 1) 'kart_saber'     : 🏎️ 카트라이더 세이버 프로 (Default!)
     * 2) 'kart_cotton'    : ☁️ 카트라이더 코튼 V1
     * 3) 'kart_burst'     : 🔥 카트라이더 버스트 Z7
     * 4) 'girl_bicycle'   : 🚲 자전거 타는 소녀
     * 5) 'girl_motorcycle': 🏍️ 오토바이 타는 소녀
     * 6) 'girl_kickboard' : 🛴 킥보드 타는 소녀
     * 7) 'girl_roller'    : 🛼 롤러스케이트 타는 소녀
     * 8) 'girl_hoverboard': 🛸 호버보드 타는 소녀
     * 9) 'kart_solid'     : 🛡️ 카트라이더 솔리드 골드
     * 10) 'girl_unicorn'  : 🦄 유니콘 마법카트 소녀
     */
    _buildPlayerCar: function () {
      const THREE = global.THREE;
      if (this.carGroup && this.scene) {
        this.scene.remove(this.carGroup);
      }

      if (!this.currentVehicleType) {
        let savedVeh = 'kart_saber';
        try {
          if (global.SaveManager && typeof global.SaveManager.getSelectedVehicle === 'function') {
            savedVeh = global.SaveManager.getSelectedVehicle() || 'kart_saber';
          } else if (global.localStorage) {
            savedVeh = global.localStorage.getItem('soyun_selected_vehicle_v1') || 'kart_saber';
          }
        } catch (_e) {}
        this.currentVehicleType = savedVeh;
      }

      const vType = this.currentVehicleType || 'kart_saber';

      this.carGroup = new THREE.Group();
      this.carGroup.scale.set(0.8, 0.8, 0.8);
      this.carGroup.position.set(0, 0, getCfg().GATE_PASS_Z - 4.2);
      this.scene.add(this.carGroup);

      this.carWheels = [];
      this.carFlames = [];
      this.carBodyMaterials = [];
      this.soyunLeftLeg = null;
      this.soyunRightLeg = null;
      this.steeringWheelMesh = null;

      // Color palettes per vehicle
      const palettes = {
        kart_saber:      { primary: 0xe11d48, secondary: 0xffffff, accent: 0xffe600, glow: 0x00e5ff, jacket: 0xe11d48, sleeve: 0xffffff },
        kart_cotton:     { primary: 0x00b4d8, secondary: 0xf8fafc, accent: 0xffd166, glow: 0x38bdf8, jacket: 0x00b4d8, sleeve: 0xffffff },
        kart_burst:      { primary: 0xff6d00, secondary: 0x1e293b, accent: 0xffe600, glow: 0xff9100, jacket: 0xff6d00, sleeve: 0x1e293b },
        girl_bicycle:    { primary: 0x2ec4b6, secondary: 0xff70a6, accent: 0xffe600, glow: 0x2ec4b6, jacket: 0xff70a6, sleeve: 0xffffff },
        girl_motorcycle: { primary: 0xff2a85, secondary: 0x00f5ff, accent: 0xffe600, glow: 0xff2a85, jacket: 0x1e1b4b, sleeve: 0xff2a85 },
        girl_kickboard:  { primary: 0x00f5d4, secondary: 0x7209b7, accent: 0xffe600, glow: 0x00f5d4, jacket: 0x00f5d4, sleeve: 0xff2a85 },
        girl_roller:     { primary: 0xff70a6, secondary: 0x00bbf9, accent: 0xfee440, glow: 0xff70a6, jacket: 0xff70a6, sleeve: 0x00bbf9 },
        girl_hoverboard: { primary: 0x9b5de5, secondary: 0x00f5d4, accent: 0xfee440, glow: 0x00f5d4, jacket: 0x9b5de5, sleeve: 0x00f5d4 },
        kart_solid:      { primary: 0xffd700, secondary: 0x10b981, accent: 0xffffff, glow: 0xffd700, jacket: 0x10b981, sleeve: 0xffd700 },
        girl_unicorn:    { primary: 0xffffff, secondary: 0xff8fab, accent: 0xffd700, glow: 0xff8fab, jacket: 0xff8fab, sleeve: 0xffffff }
      };
      const pal = palettes[vType] || palettes.kart_saber;

      const primaryMat = new THREE.MeshStandardMaterial({
        color: pal.primary,
        metalness: 0.4,
        roughness: 0.22,
        emissive: pal.primary,
        emissiveIntensity: 0.28
      });
      const secondaryMat = new THREE.MeshStandardMaterial({
        color: pal.secondary,
        metalness: 0.35,
        roughness: 0.22,
        emissive: pal.secondary,
        emissiveIntensity: 0.22
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: pal.accent,
        metalness: 0.65,
        roughness: 0.2,
        emissive: 0x664400,
        emissiveIntensity: 0.42
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.15
      });
      const darkTireMat = new THREE.MeshStandardMaterial({
        color: 0x151522,
        roughness: 0.48
      });
      this.carBodyMaterials.push(primaryMat, secondaryMat);

      const nozzleGeo = new THREE.CylinderGeometry(0.16, 0.21, 0.42, 12);
      const flameGeo = new THREE.ConeGeometry(0.22, 1.35, 10);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.94
      });
      this.carFlameMat = flameMat;

      // Helper to add a booster nozzle + flame
      const addBoosterPipe = (xPos, yPos, zPos, tiltX) => {
        const nozzle = new THREE.Mesh(nozzleGeo, chromeMat);
        nozzle.rotation.x = (Math.PI / 2) + (tiltX || 0);
        nozzle.position.set(xPos, yPos, zPos);
        this.carGroup.add(nozzle);

        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.rotation.x = (Math.PI / 2) + (tiltX || 0);
        flame.position.set(xPos, yPos, zPos + 0.65);
        this.carGroup.add(flame);
        this.carFlames.push(flame);
      };

      // Avatar seat / standing offset depending on vehicle
      let avatarY = 0.68;
      let avatarZ = 0.15;
      let armAngleX = 1.15;
      let buildLegs = false;

      if (vType === 'girl_bicycle') {
        // =====================================================================
        // 🚲 BICYCLE GIRL (민트&핑크 두발 자전거 타는 소윤이!)
        // =====================================================================
        avatarY = 1.05;
        avatarZ = 0.22;
        armAngleX = 1.05;
        buildLegs = true;

        // 2 Large Thin Spoked Bicycle Wheels (Front & Rear centered at x = 0)
        const bikeTireGeo = new THREE.TorusGeometry(0.62, 0.085, 10, 24);
        const bikeRimGeo = new THREE.TorusGeometry(0.54, 0.035, 8, 24);
        const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 10);
        const spokeGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.08, 6);

        [-1.38, 1.32].forEach((wz) => {
          const wGroup = new THREE.Group();
          wGroup.position.set(0, 0.68, wz);
          const tire = new THREE.Mesh(bikeTireGeo, darkTireMat);
          tire.rotation.y = Math.PI / 2;
          const rim = new THREE.Mesh(bikeRimGeo, secondaryMat);
          rim.rotation.y = Math.PI / 2;
          const hub = new THREE.Mesh(hubGeo, chromeMat);
          hub.rotation.z = Math.PI / 2;
          wGroup.add(tire, rim, hub);
          for (let sIdx = 0; sIdx < 4; sIdx++) {
            const sp = new THREE.Mesh(spokeGeo, chromeMat);
            sp.rotation.x = (sIdx * Math.PI) / 4;
            wGroup.add(sp);
          }
          this.carGroup.add(wGroup);
          this.carWheels.push(wGroup);
        });

        // Tubular Diamond Bicycle Frame
        const tubeGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.55, 10);
        const topTube = new THREE.Mesh(tubeGeo, primaryMat);
        topTube.position.set(0, 1.15, -0.32);
        topTube.rotation.x = Math.PI / 2.2;
        const downTube = new THREE.Mesh(tubeGeo, primaryMat);
        downTube.position.set(0, 0.88, -0.45);
        downTube.rotation.x = Math.PI / 3.1;
        const seatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.1, 10), chromeMat);
        seatPost.position.set(0, 0.98, 0.28);
        seatPost.rotation.x = -0.22;
        const forkTube = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.28, 10), primaryMat);
        forkTube.position.set(0, 1.12, -1.16);
        forkTube.rotation.x = -0.26;
        this.carGroup.add(topTube, downTube, seatPost, forkTube);

        // Handlebars + Pink Grips + Cute Front Flower Basket
        const hBar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.25, 10), chromeMat);
        hBar.rotation.z = Math.PI / 2;
        hBar.position.set(0, 1.66, -0.98);
        this.carGroup.add(hBar);
        this.steeringWheelMesh = hBar;

        const basketGeo = new THREE.BoxGeometry(0.76, 0.46, 0.54);
        const basketMat = new THREE.MeshStandardMaterial({ color: 0xf4a261, roughness: 0.6 });
        const basket = new THREE.Mesh(basketGeo, basketMat);
        basket.position.set(0, 1.42, -1.35);
        this.carGroup.add(basket);

        // Colorful 3D flowers in the front basket
        [-0.22, 0, 0.22].forEach((fx, fi) => {
          const fl = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 8),
            new THREE.MeshBasicMaterial({ color: fi === 1 ? 0xffe600 : 0xff2a85 })
          );
          fl.position.set(fx, 1.68, -1.35);
          this.carGroup.add(fl);
        });

        // Saddle Seat & Rear Booster Pipes
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.56), secondaryMat);
        saddle.position.set(0, 1.38, 0.32);
        this.carGroup.add(saddle);

        addBoosterPipe(-0.28, 0.85, 1.48, 0);
        addBoosterPipe(0.28, 0.85, 1.48, 0);

      } else if (vType === 'girl_motorcycle') {
        // =====================================================================
        // 🏍️ MOTORCYCLE GIRL (네온 슈퍼바이크 오토바이 타는 소윤이!)
        // =====================================================================
        avatarY = 0.92;
        avatarZ = 0.18;
        armAngleX = 1.28;
        buildLegs = true;

        // 2 Fat Superbike Tires with Glowing Neon Rims
        const motoWheelGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.46, 18);
        const motoRimGeo = new THREE.TorusGeometry(0.38, 0.06, 10, 20);
        [-1.42, 1.38].forEach((wz, idx) => {
          const wHolder = new THREE.Group();
          wHolder.position.set(0, 0.58, wz);
          const tire = new THREE.Mesh(motoWheelGeo, darkTireMat);
          tire.rotation.z = Math.PI / 2;
          if (idx === 1) tire.scale.set(1, 1.25, 1); // Extra-wide rear superbike tire
          wHolder.add(tire);
          [-0.24, 0.24].forEach((rx) => {
            const rim = new THREE.Mesh(motoRimGeo, secondaryMat);
            rim.rotation.y = Math.PI / 2;
            rim.position.x = rx;
            wHolder.add(rim);
          });
          this.carGroup.add(wHolder);
          this.carWheels.push(wHolder);
        });

        // Sculpted Aerodynamic Superbike Body & Fuel Tank
        const bodyCore = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.68, 2.35), primaryMat);
        bodyCore.position.set(0, 0.88, 0);
        const fairingNose = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.15, 6), primaryMat);
        fairingNose.rotation.x = -Math.PI / 2;
        fairingNose.position.set(0, 1.02, -1.45);
        const windshield = new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 0.42, 0.65),
          new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.72 })
        );
        windshield.position.set(0, 1.38, -1.05);
        windshield.rotation.x = 0.52;
        const tailCowl = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.32, 0.95), secondaryMat);
        tailCowl.position.set(0, 1.18, 1.15);
        tailCowl.rotation.x = 0.22;
        this.carGroup.add(bodyCore, fairingNose, windshield, tailCowl);

        // Clip-on Handlebars
        const motoBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.18, 10), goldMat);
        motoBar.rotation.z = Math.PI / 2;
        motoBar.position.set(0, 1.34, -0.68);
        this.carGroup.add(motoBar);
        this.steeringWheelMesh = motoBar;

        // Twin Angled Superbike Exhaust Pipes
        addBoosterPipe(-0.48, 0.78, 1.65, -0.15);
        addBoosterPipe(0.48, 0.78, 1.65, -0.15);

      } else if (vType === 'girl_kickboard') {
        // =====================================================================
        // 🛴 KICKBOARD GIRL (전동 킥보드 서서 타는 소윤이!)
        // =====================================================================
        avatarY = 0.88;
        avatarZ = 0.15;
        armAngleX = 0.98;
        buildLegs = true;

        // Low Neon Electric Kickboard Deck
        const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.16, 2.75), secondaryMat);
        deckMesh.position.set(0, 0.34, 0);
        const ledTrim = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.08, 2.82), new THREE.MeshBasicMaterial({ color: 0x00f5d4 }));
        ledTrim.position.set(0, 0.34, 0);
        this.carGroup.add(deckMesh, ledTrim);

        // 2 Scooter Wheels
        const scootWheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.28, 16);
        [-1.22, 1.22].forEach((wz) => {
          const wHolder = new THREE.Group();
          wHolder.position.set(0, 0.34, wz);
          const wMesh = new THREE.Mesh(scootWheelGeo, primaryMat);
          wMesh.rotation.z = Math.PI / 2;
          wHolder.add(wMesh);
          this.carGroup.add(wHolder);
          this.carWheels.push(wHolder);
        });

        // Tall Vertical Steering Stem + T-Handlebar + LED Headlight
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 1.68, 10), chromeMat);
        stem.position.set(0, 1.12, -1.08);
        stem.rotation.x = -0.14;
        const tBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 10), goldMat);
        tBar.rotation.z = Math.PI / 2;
        tBar.position.set(0, 1.92, -0.96);
        this.carGroup.add(stem, tBar);
        this.steeringWheelMesh = tBar;

        addBoosterPipe(-0.34, 0.38, 1.45, 0);
        addBoosterPipe(0.34, 0.38, 1.45, 0);

      } else if (vType === 'girl_roller') {
        // =====================================================================
        // 🛼 ROLLER SKATE GIRL (네온 롤러스케이트 신고 달리는 소윤이!)
        // =====================================================================
        avatarY = 0.96;
        avatarZ = 0.0;
        armAngleX = 0.65;
        buildLegs = true;

        // 2 Neon Quad Roller Skates attached to the base with 4 glowing wheels each!
        const bootGeo = new THREE.BoxGeometry(0.38, 0.34, 0.78);
        const skateWheelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 12);
        [-0.34, 0.34].forEach((sx) => {
          const skateGroup = new THREE.Group();
          skateGroup.position.set(sx, 0.28, 0);
          const boot = new THREE.Mesh(bootGeo, primaryMat);
          boot.position.y = 0.12;
          skateGroup.add(boot);
          [-0.24, 0.24].forEach((wz) => {
            [-0.22, 0.22].forEach((wx) => {
              const sw = new THREE.Mesh(skateWheelGeo, goldMat);
              sw.rotation.z = Math.PI / 2;
              sw.position.set(wx, -0.08, wz);
              skateGroup.add(sw);
              this.carWheels.push(sw);
            });
          });
          this.carGroup.add(skateGroup);
        });

        addBoosterPipe(-0.34, 0.32, 0.48, 0);
        addBoosterPipe(0.34, 0.32, 0.48, 0);

      } else if (vType === 'girl_hoverboard') {
        // =====================================================================
        // 🛸 HOVERBOARD GIRL (공중부양 사이버 호버보드 소윤이!)
        // =====================================================================
        avatarY = 0.92;
        avatarZ = 0.05;
        armAngleX = 0.55;
        buildLegs = true;

        const boardGeo = new THREE.BoxGeometry(1.45, 0.18, 3.1);
        const boardMesh = new THREE.Mesh(boardGeo, primaryMat);
        boardMesh.position.set(0, 0.46, 0);
        const rimGeo = new THREE.BoxGeometry(1.58, 0.1, 3.22);
        const rimMesh = new THREE.Mesh(rimGeo, new THREE.MeshBasicMaterial({ color: 0x00f5d4 }));
        rimMesh.position.set(0, 0.46, 0);
        this.carGroup.add(boardMesh, rimMesh);

        // 2 Anti-Gravity Glowing Hover Rings Underneath
        const hoverRingGeo = new THREE.TorusGeometry(0.48, 0.08, 8, 20);
        hoverRingGeo.rotateX(Math.PI / 2);
        [-0.95, 0.95].forEach((hz) => {
          const hr = new THREE.Mesh(hoverRingGeo, new THREE.MeshBasicMaterial({ color: 0xfee440 }));
          hr.position.set(0, 0.26, hz);
          this.carGroup.add(hr);
          this.carWheels.push(hr);
        });

        addBoosterPipe(-0.42, 0.46, 1.62, 0);
        addBoosterPipe(0.42, 0.46, 1.62, 0);

      } else {
        // =====================================================================
        // 🏎️ KARTRIDER SERIES KARTS:
        //    - 'kart_saber'  (세이버 프로: 날렵한 레드&화이트 에어로 노즈콘 + 사이드 부스터 포드)
        //    - 'kart_cotton' (코튼 V1: 둥근 스카이블루&화이트 유선형 바디)
        //    - 'kart_burst'  (버스트 Z7: 오렌지 머슬 바디 + 거대 슈퍼차저 엔진)
        //    - 'kart_solid'  (솔리드 골드: 황금 중장갑 범퍼 + 사이드 실드)
        //    - 'girl_unicorn'(유니콘 마법카트: 유니콘 머리와 황금 뿔 + 날개)
        // =====================================================================
        // 1. Smooth Sculpted Aerodynamic KartRider Chassis
        const bodyGeo = new THREE.CylinderGeometry(0.78, 1.08, 3.85, 28);
        const baseMesh = new THREE.Mesh(bodyGeo, primaryMat);
        baseMesh.rotation.x = Math.PI / 2;
        baseMesh.scale.set(1.15, 1.0, 0.36);
        baseMesh.position.set(0, 0.44, 0.05);
        this.carGroup.add(baseMesh);

        // Smooth Tapered Aerodynamic Nose Cone & Rounded Front Wing
        const noseCone = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.82, 1.65, 28), secondaryMat);
        noseCone.rotation.x = Math.PI / 2;
        noseCone.scale.set(1.1, 1.0, 0.46);
        noseCone.position.set(0, 0.56, -1.45);
        const frontWing = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.28, 0.56, 28), primaryMat);
        frontWing.scale.set(1.05, 0.22, 0.48);
        frontWing.position.set(0, 0.32, -2.12);
        const frontGoldTrim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.055, 14, 32, Math.PI), goldMat);
        frontGoldTrim.rotation.x = Math.PI / 2;
        frontGoldTrim.scale.set(1.05, 0.36, 1.0);
        frontGoldTrim.position.set(0, 0.35, -2.05);
        this.carGroup.add(noseCone, frontWing, frontGoldTrim);

        // Smooth Cylindrical Side Booster Pontoons with Spherical Caps
        [-1.08, 1.08].forEach((px) => {
          const podGroup = new THREE.Group();
          podGroup.position.set(px, 0.58, 0.08);
          const podCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 2.1, 24), secondaryMat);
          podCyl.rotation.x = Math.PI / 2;
          const podFrontCap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 18), primaryMat);
          podFrontCap.position.set(0, 0, -1.05);
          const podRearCap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 18), goldMat);
          podRearCap.position.set(0, 0, 1.05);
          podGroup.add(podCyl, podFrontCap, podRearCap);
          this.carGroup.add(podGroup);
        });

        // Vehicle-specific signature KartRider centerpiece (Smooth sculpted!)
        if (vType === 'kart_saber') {
          const saberBlade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.75, 24), primaryMat);
          saberBlade.rotation.x = -Math.PI / 2;
          saberBlade.scale.set(0.55, 1.0, 0.85);
          saberBlade.position.set(0, 0.82, -1.15);
          this.carGroup.add(saberBlade);
        } else if (vType === 'kart_burst') {
          const blower = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.88, 24), chromeMat);
          blower.rotation.x = Math.PI / 2;
          blower.position.set(0, 0.88, -1.2);
          const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.58, 24), goldMat);
          scoop.rotation.x = Math.PI / 2;
          scoop.position.set(0, 1.18, -1.26);
          this.carGroup.add(blower, scoop);
        } else if (vType === 'kart_solid') {
          const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.55, 24), goldMat);
          ram.rotation.z = Math.PI / 2;
          ram.position.set(0, 0.5, -2.28);
          this.carGroup.add(ram);
        } else if (vType === 'girl_unicorn') {
          const uniHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 20), primaryMat);
          uniHead.position.set(0, 1.12, -1.78);
          const uniHorn = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.65, 20), goldMat);
          uniHorn.position.set(0, 1.58, -1.96);
          uniHorn.rotation.x = 0.45;
          this.carGroup.add(uniHead, uniHorn);
          [-1.32, 1.32].forEach((wx) => {
            const uWing = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), secondaryMat);
            uWing.scale.set(1.0, 0.18, 0.9);
            uWing.position.set(wx, 0.94, 0.18);
            uWing.rotation.z = wx > 0 ? 0.32 : -0.32;
            this.carGroup.add(uWing);
          });
        }

        // Smooth Curved KartRider Bucket Seat Backrest
        const seatBack = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.5, 0.82, 24), secondaryMat);
        seatBack.scale.set(1.0, 1.0, 0.38);
        seatBack.position.set(0, 0.98, 0.66);
        seatBack.rotation.x = -0.15;
        const headRest = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), primaryMat);
        headRest.scale.set(1.2, 0.75, 0.42);
        headRest.position.set(0, 1.42, 0.72);
        this.carGroup.add(seatBack, headRest);

        // Sporty KartRider Steering Column & Wheel
        const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.52, 16), chromeMat);
        colMesh.position.set(0, 0.96, -0.56);
        colMesh.rotation.x = -0.55;
        this.carGroup.add(colMesh);

        this.steeringWheelMesh = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 14, 28), goldMat);
        this.steeringWheelMesh.position.set(0, 1.12, -0.4);
        this.steeringWheelMesh.rotation.x = -0.55;
        this.carGroup.add(this.steeringWheelMesh);

        // Smooth Curved Rear Aero Spoiler Wing
        [-0.78, 0.78].forEach((sx) => {
          const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.58, 16), goldMat);
          strut.position.set(sx, 0.94, 1.72);
          strut.rotation.x = -0.18;
          this.carGroup.add(strut);
        });
        const wingBlade = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.52, 28), primaryMat);
        wingBlade.scale.set(1.04, 0.18, 0.48);
        wingBlade.position.set(0, 1.24, 1.82);
        this.carGroup.add(wingBlade);

        // Quad KartRider Rear Nitro Booster Pipes!
        [-0.68, -0.24, 0.24, 0.68].forEach((bx) => {
          addBoosterPipe(bx, 0.46, 2.04, -0.06);
        });

        // 4 Smooth High-Segment Racing Slicks with Glowing Rims
        const wheelGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.42, 28);
        const rimGeo = new THREE.TorusGeometry(0.27, 0.052, 14, 24);
        [
          [-1.24, 0.44, -1.28],
          [1.24, 0.44, -1.28],
          [-1.28, 0.46, 1.28],
          [1.28, 0.46, 1.28]
        ].forEach(([wx, wy, wz]) => {
          const wheelHolder = new THREE.Group();
          wheelHolder.position.set(wx, wy, wz);
          const tire = new THREE.Mesh(wheelGeo, darkTireMat);
          tire.rotation.z = Math.PI / 2;
          wheelHolder.add(tire);
          const rim = new THREE.Mesh(rimGeo, goldMat);
          rim.rotation.y = Math.PI / 2;
          rim.position.x = wx > 0 ? 0.22 : -0.22;
          wheelHolder.add(rim);
          this.carGroup.add(wheelHolder);
          this.carWheels.push(wheelHolder);
        });
      }

      // =======================================================================
      // 2. Smooth Natural 3D Avatar for "이소윤 (Soyun)" (No blocky BoxGeometry!)
      // =======================================================================
      this.soyunAvatarGroup = new THREE.Group();
      this.soyunAvatarGroup.position.set(0, avatarY, avatarZ);
      this.carGroup.add(this.soyunAvatarGroup);

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe3c4, roughness: 0.3, metalness: 0.05 });
      const torsoMat = new THREE.MeshStandardMaterial({
        color: pal.jacket,
        roughness: 0.25,
        metalness: 0.1,
        emissive: pal.jacket,
        emissiveIntensity: 0.22
      });
      const sleeveMat = new THREE.MeshStandardMaterial({
        color: pal.sleeve,
        roughness: 0.28
      });

      // Smooth Articulated Legs for Bicycle / Motorcycle / Kickboard / Roller / Hoverboard!
      if (buildLegs) {
        const legGeo = new THREE.CylinderGeometry(0.12, 0.10, 0.58, 20);
        const shoeGeo = new THREE.SphereGeometry(0.13, 20, 16);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
        this.soyunLeftLeg = new THREE.Group();
        this.soyunLeftLeg.position.set(-0.2, 0.08, 0);
        const lMesh = new THREE.Mesh(legGeo, legMat);
        lMesh.position.y = -0.28;
        const lShoe = new THREE.Mesh(shoeGeo, primaryMat);
        lShoe.scale.set(1.0, 0.7, 1.35);
        lShoe.position.set(0, -0.56, -0.04);
        this.soyunLeftLeg.add(lMesh, lShoe);

        this.soyunRightLeg = new THREE.Group();
        this.soyunRightLeg.position.set(0.2, 0.08, 0);
        const rMesh = new THREE.Mesh(legGeo, legMat);
        rMesh.position.y = -0.28;
        const rShoe = new THREE.Mesh(shoeGeo, primaryMat);
        rShoe.scale.set(1.0, 0.7, 1.35);
        rShoe.position.set(0, -0.56, -0.04);
        this.soyunRightLeg.add(rMesh, rShoe);

        this.soyunAvatarGroup.add(this.soyunLeftLeg, this.soyunRightLeg);
      }

      // Smooth Rounded Torso + Collar + Star Emblem
      const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.36, 0.66, 28), torsoMat);
      torsoMesh.scale.set(1.08, 1.0, 0.74);
      torsoMesh.position.set(0, 0.42, 0);
      const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 28, 20), torsoMat);
      shoulderCap.scale.set(1.12, 0.48, 0.74);
      shoulderCap.position.set(0, 0.72, 0);
      this.soyunAvatarGroup.add(torsoMesh, shoulderCap);

      const backBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 24), goldMat);
      backBadge.rotation.x = Math.PI / 2;
      backBadge.position.set(0, 0.45, 0.25);
      this.soyunAvatarGroup.add(backBadge);

      // Smooth Rounded Left & Right Arms + Spherical Hands
      const armGeo = new THREE.CylinderGeometry(0.11, 0.095, 0.56, 20);
      const shoulderJointGeo = new THREE.SphereGeometry(0.12, 20, 16);
      const handGeo = new THREE.SphereGeometry(0.115, 20, 16);

      this.soyunLeftArm = new THREE.Group();
      this.soyunLeftArm.position.set(-0.44, 0.66, 0);
      const leftShoulder = new THREE.Mesh(shoulderJointGeo, sleeveMat);
      const leftArmMesh = new THREE.Mesh(armGeo, sleeveMat);
      leftArmMesh.position.set(0, -0.24, 0);
      const leftHand = new THREE.Mesh(handGeo, skinMat);
      leftHand.position.set(0, -0.54, 0);
      this.soyunLeftArm.add(leftShoulder, leftArmMesh, leftHand);
      this.soyunLeftArm.rotation.x = armAngleX;
      this.soyunLeftArm.rotation.z = -0.18;
      this.soyunAvatarGroup.add(this.soyunLeftArm);

      this.soyunRightArm = new THREE.Group();
      this.soyunRightArm.position.set(0.44, 0.66, 0);
      const rightShoulder = new THREE.Mesh(shoulderJointGeo, sleeveMat);
      const rightArmMesh = new THREE.Mesh(armGeo, sleeveMat);
      rightArmMesh.position.set(0, -0.24, 0);
      const rightHand = new THREE.Mesh(handGeo, skinMat);
      rightHand.position.set(0, -0.54, 0);
      this.soyunRightArm.add(rightShoulder, rightArmMesh, rightHand);
      this.soyunRightArm.rotation.x = armAngleX;
      this.soyunRightArm.rotation.z = 0.18;
      this.soyunAvatarGroup.add(this.soyunRightArm);

      // Smooth Spherical Head + Glossy Flowing Twin Pigtails + Curved Visor + Royal Crown (👑)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.12, 0);
      this.soyunAvatarGroup.add(headGroup);
      this.soyunHeadMesh = headGroup;

      const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x231438, roughness: 0.28, metalness: 0.12 });
      const headGeoMode = this.getGraphicStyle() === 'pixel' ? new (THREE.__OrigBoxGeometry || THREE.BoxGeometry)(0.74, 0.74, 0.74) : new THREE.SphereGeometry(0.38, 32, 28);
      const faceMat = new THREE.MeshBasicMaterial({ map: this.textures.soyunFace });
      const headSphere = new THREE.Mesh(headGeoMode, this.getGraphicStyle() === 'pixel' ? [skinMat, skinMat, hairDarkMat, skinMat, faceMat, faceMat] : skinMat);
      if (this.getGraphicStyle() === 'cartoon') {
        const outlineHead = new THREE.Mesh(new THREE.SphereGeometry(0.415, 28, 24), new THREE.MeshBasicMaterial({ color: 0x090418, side: THREE.BackSide }));
        headGroup.add(outlineHead);
      }
      headGroup.add(headSphere);

      // Smooth Glossy Hair Dome & Rounded Back Hair
      const hairDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.405, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58),
        hairDarkMat
      );
      hairDome.position.set(0, 0.03, 0.02);
      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.395, 28, 24), hairDarkMat);
      hairBack.scale.set(0.98, 1.05, 0.65);
      hairBack.position.set(0, -0.02, 0.15);
      headGroup.add(hairDome, hairBack);

      // Smooth Curved Wrap-Around Racing Goggles / Visor
      const visorMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.415, 0.415, 0.15, 32, 1, false, Math.PI * 0.55, Math.PI * 0.9),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.82 })
      );
      visorMesh.position.set(0, 0.16, -0.02);
      headGroup.add(visorMesh);

      // Smooth Flowing Rounded Twin Pigtails + Cute Bow Ribbons
      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xff2a85 });
      const pigtailTopGeo = new THREE.SphereGeometry(0.15, 24, 20);
      const pigtailLockGeo = new THREE.ConeGeometry(0.16, 0.56, 24);
      const ribbonBowGeo = new THREE.SphereGeometry(0.11, 20, 16);

      this.soyunLeftPigtail = new THREE.Group();
      this.soyunLeftPigtail.position.set(-0.4, 0.08, 0.12);
      const leftBow = new THREE.Mesh(ribbonBowGeo, ribbonMat);
      leftBow.scale.set(1.35, 0.85, 0.95);
      const leftTailTop = new THREE.Mesh(pigtailTopGeo, hairDarkMat);
      leftTailTop.position.set(-0.05, -0.12, 0);
      const leftTailLock = new THREE.Mesh(pigtailLockGeo, hairDarkMat);
      leftTailLock.position.set(-0.08, -0.34, 0);
      leftTailLock.rotation.z = 0.22;
      this.soyunLeftPigtail.add(leftBow, leftTailTop, leftTailLock);
      headGroup.add(this.soyunLeftPigtail);

      this.soyunRightPigtail = new THREE.Group();
      this.soyunRightPigtail.position.set(0.4, 0.08, 0.12);
      const rightBow = new THREE.Mesh(ribbonBowGeo, ribbonMat);
      rightBow.scale.set(1.35, 0.85, 0.95);
      const rightTailTop = new THREE.Mesh(pigtailTopGeo, hairDarkMat);
      rightTailTop.position.set(0.05, -0.12, 0);
      const rightTailLock = new THREE.Mesh(pigtailLockGeo, hairDarkMat);
      rightTailLock.position.set(0.08, -0.34, 0);
      rightTailLock.rotation.z = -0.22;
      this.soyunRightPigtail.add(rightBow, rightTailTop, rightTailLock);
      headGroup.add(this.soyunRightPigtail);

      // Smooth Circular Golden 3D Crown (👑)
      this.soyunCrownGroup = new THREE.Group();
      this.soyunCrownGroup.position.set(0, 0.44, 0);
      headGroup.add(this.soyunCrownGroup);
      this.soyunCrownGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 0.14, 28), goldMat));
      const spikeGeo = new THREE.ConeGeometry(0.055, 0.18, 18);
      for (let c = 0; c < 6; c++) {
        const ang = (c / 6) * Math.PI * 2;
        const spike = new THREE.Mesh(spikeGeo, c % 2 === 0 ? new THREE.MeshBasicMaterial({ color: 0x00f3ff }) : goldMat);
        spike.position.set(Math.cos(ang) * 0.19, 0.15, Math.sin(ang) * 0.19);
        this.soyunCrownGroup.add(spike);
      }

      // 3. Nameplate Sprite
      if (this.textures.soyunNameplate) {
        const spriteMat = new THREE.SpriteMaterial({
          map: this.textures.soyunNameplate,
          transparent: true,
          depthTest: false
        });
        this.soyunNameSprite = new THREE.Sprite(spriteMat);
        this.soyunNameSprite.position.set(0, avatarY + 1.92, 0.15);
        this.soyunNameSprite.scale.set(2.9, 0.72, 1);
        this.carGroup.add(this.soyunNameSprite);
      }

      // 4. Smooth Round 3D Fairy Mascot Pet (No square voxel cube!)
      this.petGroup = new THREE.Group();
      this.petGroup.position.set(1.55, 1.85, 0.25);
      this.carGroup.add(this.petGroup);

      const petBodyMat = new THREE.MeshStandardMaterial({
        map: this.textures.petFace,
        roughness: 0.22,
        metalness: 0.08,
        emissive: 0xff70a6,
        emissiveIntensity: 0.18
      });
      const petGeoMode = this.getGraphicStyle() === 'pixel' ? new (THREE.__OrigBoxGeometry || THREE.BoxGeometry)(0.68, 0.68, 0.68) : new THREE.SphereGeometry(0.36, 32, 28);
      const petSphere = new THREE.Mesh(petGeoMode, petBodyMat);
      if (this.getGraphicStyle() === 'cartoon') {
        const outlinePet = new THREE.Mesh(new THREE.SphereGeometry(0.40, 28, 24), new THREE.MeshBasicMaterial({ color: 0x090418, side: THREE.BackSide }));
        this.petGroup.add(outlinePet);
      }
      petSphere.rotation.y = Math.PI * 0.5;
      this.petGroup.add(petSphere);

      // Smooth Halo Ring & Golden Horn on Fairy Pet
      const hornMesh = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.34, 24), new THREE.MeshBasicMaterial({ color: 0xffe600 }));
      hornMesh.position.set(0, 0.44, 0);
      this.petGroup.add(hornMesh);

      const wingGeo = new THREE.SphereGeometry(0.24, 24, 18);
      const wingMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      this.petLeftWing = new THREE.Mesh(wingGeo, wingMat);
      this.petLeftWing.scale.set(1.15, 0.32, 0.55);
      this.petLeftWing.position.set(-0.42, 0.06, 0);
      this.petRightWing = new THREE.Mesh(wingGeo, wingMat);
      this.petRightWing.scale.set(1.15, 0.32, 0.55);
      this.petRightWing.position.set(0.42, 0.06, 0);
      this.petGroup.add(this.petLeftWing, this.petRightWing);

      // 5. Undercarriage flat plate removed (prevented purple/rectangular stepping-pad artifact under character's feet)
      this.carUnderGlow = null;

      return this.carGroup;
    },

    /**
     * Build High-Speed Wind / Speed-Line Particles flying past camera
     */
    _buildSpeedLines: function () {
      const THREE = global.THREE;
      const count = 75;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 24;
        positions[i * 3 + 1] = 0.5 + Math.random() * 7;
        positions[i * 3 + 2] = -120 + Math.random() * 140;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x00f3ff,
        size: 0.36,
        transparent: true,
        opacity: 0.65
      });
      this.speedLineParticles = new THREE.Points(geo, mat);
      this.scene.add(this.speedLineParticles);
    },

    /**
     * Build Stage Boss 3D Blocky Roblox Mecha ("단계별 로블록스 보스")
     * Positioned at BOSS_Z = -38, y = 2.8 so it is 100% visible below the top HUD banner!
     */
    _buildBossModel: function () {
      const THREE = global.THREE;
      this.bossGroup = new THREE.Group();
      this.bossGroup.position.set(0, 2.8, getCfg().BOSS_Z);
      this.bossGroup.visible = false;
      this.scene.add(this.bossGroup);

      // Central Billboard Plane displaying assets/boss_mecha.png
      const billGeo = new THREE.PlaneGeometry(5.6, 5.6);
      const billMat = new THREE.MeshBasicMaterial({
        map: this.textures.bossMecha,
        transparent: true,
        opacity: 0.96,
        side: THREE.DoubleSide
      });
      this.bossBillboardMesh = new THREE.Mesh(billGeo, billMat);
      this.bossBillboardMesh.position.set(0, 0.4, 1.15);
      this.bossGroup.add(this.bossBillboardMesh);

      // 3D Blocky Roblox Mecha Torso & Studded Shoulders behind billboard
      const torsoGeo = new THREE.BoxGeometry(5.2, 4.4, 2.6);
      this.bossArmorMat = new THREE.MeshStandardMaterial({
        color: 0x26083c,
        emissive: 0xff0055,
        emissiveIntensity: 0.5,
        metalness: 0.65,
        roughness: 0.25
      });
      this.bossCoreMesh = new THREE.Mesh(torsoGeo, this.bossArmorMat);
      this.bossCoreMesh.position.set(0, 0.3, -0.2);
      this.bossGroup.add(this.bossCoreMesh);

      // Blocky Shoulder Pads with Giant Golden Roblox Studs
      const padGeo = new THREE.BoxGeometry(2.2, 1.4, 2.8);
      const padMat = new THREE.MeshStandardMaterial({
        color: 0x151030,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.45
      });
      const bossStudGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 12);
      const bossStudMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });

      [-3.6, 3.6].forEach((sx) => {
        const shoulder = new THREE.Mesh(padGeo, padMat);
        shoulder.position.set(sx, 2.1, 0);
        [-0.55, 0.55].forEach((ox) => {
          [-0.6, 0.6].forEach((oz) => {
            const stud = new THREE.Mesh(bossStudGeo, bossStudMat);
            stud.position.set(ox, 0.82, oz);
            shoulder.add(stud);
          });
        });
        this.bossGroup.add(shoulder);
      });

      // Rotating Energy Halo Rings around Boss
      const ring1Geo = new THREE.TorusGeometry(3.8, 0.13, 10, 36);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      this.bossRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
      this.bossRing1.position.y = 0.4;
      this.bossGroup.add(this.bossRing1);

      const ring2Geo = new THREE.TorusGeometry(4.4, 0.1, 8, 32);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff007f });
      this.bossRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
      this.bossRing2.position.y = 0.4;
      this.bossRing2.rotation.x = Math.PI / 3;
      this.bossGroup.add(this.bossRing2);

      // Left Blocky Claw Arm
      const armGeo = new THREE.BoxGeometry(1.3, 3.2, 1.3);
      this.bossLeftArm = new THREE.Mesh(armGeo, padMat);
      this.bossLeftArm.position.set(-4.5, 0.1, 1.0);
      this.bossLeftArm.rotation.x = Math.PI / 3;
      this.bossGroup.add(this.bossLeftArm);

      // Right Arm wielding a Giant Blocky ROBLOX BAN-HAMMER (사이버 해머)!
      this.bossRightArm = new THREE.Group();
      this.bossRightArm.position.set(4.5, 0.6, 1.0);
      const rightArmMesh = new THREE.Mesh(armGeo, padMat);
      rightArmMesh.position.set(0, -0.6, 0);
      this.bossRightArm.add(rightArmMesh);

      // Giant Roblox Ban-Hammer
      this.bossHammerGroup = new THREE.Group();
      this.bossHammerGroup.position.set(0, -1.5, 0.8);
      const handleGeo = new THREE.CylinderGeometry(0.22, 0.22, 4.6, 10);
      const handleMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      handleMesh.position.set(0, 1.6, 0);
      this.bossHammerGroup.add(handleMesh);

      const hammerHeadGeo = new THREE.BoxGeometry(2.6, 1.5, 1.6);
      const hammerHeadMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.65
      });
      const hammerHead = new THREE.Mesh(hammerHeadGeo, hammerHeadMat);
      hammerHead.position.set(0, 3.8, 0);
      this.bossHammerGroup.add(hammerHead);

      // Neon Cyan Impact Faces on Hammer Head
      const facePlateGeo = new THREE.BoxGeometry(2.72, 1.2, 1.2);
      const facePlateMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const facePlate = new THREE.Mesh(facePlateGeo, facePlateMat);
      facePlate.position.set(0, 3.8, 0);
      this.bossHammerGroup.add(facePlate);

      this.bossRightArm.add(this.bossHammerGroup);
      this.bossGroup.add(this.bossRightArm);

      // 3D Overhead Boss HP Bar in World Space (positioned compactly at y = 3.15 so it stays below HUD banner)
      const hpBgGeo = new THREE.PlaneGeometry(7.6, 0.58);
      const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x150520, side: THREE.DoubleSide });
      const hpBgMesh = new THREE.Mesh(hpBgGeo, hpBgMat);
      hpBgMesh.position.set(0, 3.15, 0.8);
      this.bossGroup.add(hpBgMesh);

      const hpFillGeo = new THREE.PlaneGeometry(7.2, 0.38);
      const hpFillMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, side: THREE.DoubleSide });
      this.bossHpFillMesh = new THREE.Mesh(hpFillGeo, hpFillMat);
      this.bossHpFillMesh.position.set(0, 3.15, 0.85);
      this.bossGroup.add(this.bossHpFillMesh);

      // Dedicated 3D Spotlight PointLight in front of Boss that flares up when Boss is hit by special weapons!
      this.bossImpactLight = new THREE.PointLight(0xffe600, 0, 28);
      this.bossImpactLight.position.set(0, 1.2, 3.2);
      this.bossGroup.add(this.bossImpactLight);
    },

    /**
     * Start the 60fps animation loop
     */
    start: function () {
      if (!this.isInitialized) {
        this.init();
      }
      this.isRunning = true;
      this.isPaused = false;
      if (this.clock) this.clock.getDelta();
      if (!this.rafId) {
        this._animate();
      }
      return this;
    },

    /**
     * Stop the animation loop
     */
    stop: function () {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      return this;
    },

    /**
     * Pause or resume simulation
     */
    setPaused: function (paused) {
      this.isPaused = Boolean(paused);
      if (!this.isPaused && this.clock) {
        this.clock.getDelta();
      }
      return this;
    },

    pause: function () {
      return this.setPaused(true);
    },

    resume: function () {
      return this.setPaused(false);
    },

    /**
     * Reset track, gates, boss, and car to initial state
     */
    reset: function () {
      this.clearActiveGates();
      this.hideBoss();
      this.setLane(1);
      if (this.carGroup) {
        this.carGroup.position.x = 0;
        this.carGroup.rotation.set(0, 0, 0);
      }
      this.setSpeed(DEFAULT_CONFIG.BASE_SPEED);
      return this;
    },

    /**
     * Set player target lane (0 = Left, 1 = Center, 2 = Right)
     */
    setLane: function (laneIndex) {
      const clamped = Math.max(0, Math.min(2, Math.round(Number(laneIndex) || 0)));
      this.targetLane = clamped;
      this.currentLane = clamped;
      if (this.isPaused && this.carGroup) {
        const lanes = getCfg().LANES;
        this.carGroup.position.x = lanes[clamped] !== undefined ? lanes[clamped] : 0;
        this.carGroup.rotation.z = 0;
        this.carGroup.rotation.y = 0;
      }
      return this.targetLane;
    },

    moveLeft: function () {
      return this.setLane(this.targetLane - 1);
    },

    moveRight: function () {
      return this.setLane(this.targetLane + 1);
    },

    getCurrentLane: function () {
      return this.targetLane;
    },

    /**
     * Launches Soyun's Roblox Super Kart into a 3D Jump!
     * - In Heaven Stairs mode ('heaven_stairs'): climbs 1 step forward in Soyun's current facing direction!
     * - In Laser/Log Jump or Obby Rush: performs a jump (and upgrades to a 2x Double Jump if pressed again in mid-air!).
     */
    jump: function (powerScale) {
      if (this.isPaused) return false;
      if (this.isHeavenStairsActive) {
        return this.stepHeavenStairs(false);
      }

      const pScale = typeof powerScale === 'number' ? powerScale : 1.1;

      // Mark any approaching full-road Laser / Rolling Log obstacle wave as jumped!
      if (Array.isArray(this.activeObbyWaves)) {
        for (let i = 0; i < this.activeObbyWaves.length; i++) {
          const w = this.activeObbyWaves[i];
          if (w && !w.passed && w.group && w.group.position.z >= -54) {
            w.playerJumped = true;
            w.maxJumpScale = Math.max(w.maxJumpScale || 0, pScale);
          }
        }
      }

      // If already in mid-air, upgrade to a 2-Stage Double Jump!
      if (this.carJumpY > 0.35 && this.carJumpVel > -6) {
        if (!this.isDoubleJumpActive) {
          this.isDoubleJumpActive = true;
          this.carJumpVel = 18.2;
          this.carSpinTimer = 0.58;
          this.lastJumpScale = 1.55;
          this.avatarCheerTimer = 0.65;
          this.petSpinTimer = 0.65;
          this.cameraZoomPunch = 8.5;
          if (this.carGroup) {
            this._spawnParticleBurst(this.carGroup.position.x, this.carGroup.position.y + 0.6, getCfg().GATE_PASS_Z, 0xffe600, 28, 1.15);
          }
          return true;
        }
        return false;
      }

      this.isJumping = true;
      this.isDoubleJumpActive = false;
      this.lastJumpScale = pScale;
      this.carJumpVel = 16.2 * pScale;
      this.avatarCheerTimer = 0.58;
      this.petSpinTimer = 0.58;
      this.cameraZoomPunch = 6.0;
      if (this.carGroup) {
        this._spawnParticleBurst(this.carGroup.position.x, 0.4, getCfg().GATE_PASS_Z, 0x00f3ff, 24, 0.95);
      }
      return true;
    },

    /**
     * Left Action Button (#btn-turn-jump-action 🔄):
     * - In Heaven Stairs mode ('heaven_stairs'): flips Soyun's facing direction (-1 <-> +1) AND climbs 1 step!
     * - In Laser/Log Jump or Normal mode: launches a high 360° Spin Super Jump (1.6x height) to vault over giant rolling logs!
     */
    superJump: function () {
      if (this.isPaused) return false;
      if (this.isHeavenStairsActive) {
        return this.stepHeavenStairs(true);
      }

      if (Array.isArray(this.activeObbyWaves)) {
        for (let i = 0; i < this.activeObbyWaves.length; i++) {
          const w = this.activeObbyWaves[i];
          if (w && !w.passed && w.group && w.group.position.z >= -54) {
            w.playerJumped = true;
            w.maxJumpScale = 1.65;
          }
        }
      }

      this.isJumping = true;
      this.isDoubleJumpActive = true;
      this.lastJumpScale = 1.65;
      this.carJumpVel = 20.6;
      this.carSpinTimer = 0.68;
      this.avatarCheerTimer = 0.72;
      this.petSpinTimer = 0.72;
      this.cameraZoomPunch = 9.5;
      if (this.carGroup) {
        this._spawnParticleBurst(this.carGroup.position.x, Math.max(0.5, this.carGroup.position.y), getCfg().GATE_PASS_Z, 0xff2a85, 32, 1.25);
        this._spawnParticleBurst(this.carGroup.position.x, Math.max(0.5, this.carGroup.position.y + 0.4), getCfg().GATE_PASS_Z, 0xffe600, 24, 1.1);
      }
      return true;
    },

    /**
     * Starts the 3D Roblox Stairway to Heaven Mini-Game ('heaven_stairs' — 2-button climbing game!)
     * Builds an ascending zig-zagging staircase of glowing golden/rainbow clouds in the sky.
     * @param {number} [totalSteps=8]
     */
    startHeavenStairs: function (totalSteps) {
      if (!this.isInitialized) this.init();
      const THREE = global.THREE;
      if (!THREE || !this.scene) return null;

      this.clearHeavenStairs();
      this.clearObbyObstacles();

      const numSteps = Math.max(5, Number(totalSteps) || 30);
      const passZ = this.carGroup ? this.carGroup.position.z : (getCfg().GATE_PASS_Z - 4.2);

      this.isHeavenStairsActive = true;
      this.heavenStairsFailed = false;
      this.heavenStairsTotal = numSteps;
      this.heavenStairsStepIndex = 0;
      this.stairClimbedY = 0;
      this.heavenStairsCollapseActive = false;
      this.heavenStairsCollapsedIndex = -1;
      this.heavenStairsCollapseTimer = 0;
      this.heavenStairsCollapseInterval = 0.68;

      // Build balanced zig-zag step directions so BOTH [⬆️ 오르기] and [🔄 방향전환] buttons are used!
      const steps = [
        { index: 0, x: 0, y: 0, z: 0, dir: 1 }
      ];

      // Pattern of relative moves ('same' = ⬆️ button, 'turn' = 🔄 button)
      const patterns = [
        ['same', 'turn', 'same', 'turn', 'same', 'same', 'turn', 'same'],
        ['same', 'same', 'turn', 'same', 'turn', 'same', 'turn', 'same'],
        ['turn', 'same', 'turn', 'same', 'same', 'turn', 'same', 'turn']
      ];
      const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

      let curDir = Math.random() < 0.5 ? 1 : -1;
      const initialFacing = chosenPattern[0] === 'same' ? curDir : -curDir;
      this.heavenStairsFacingDir = initialFacing;

      let curX = 0;
      for (let s = 1; s <= numSteps; s++) {
        if (s > 1) {
          const relMove = chosenPattern[(s - 1) % chosenPattern.length];
          if (relMove === 'turn') {
            curDir = -curDir;
          }
        }
        // Keep stairs well inside screen bounds [-4.2, +4.2]
        if (curX + curDir * 2.1 > 4.3 || curX + curDir * 2.1 < -4.3) {
          curDir = -curDir;
        }
        curX = Math.round((curX + curDir * 2.1) * 100) / 100;
        const stepY = Math.round(s * 1.18 * 100) / 100;
        const stepZ = -s * 2.5;
        steps.push({
          index: s,
          x: curX,
          y: stepY,
          z: stepZ,
          dir: curDir,
          coinMesh: null,
          stepMesh: null
        });
      }
      this.heavenStairsSteps = steps;

      const stairsGroup = new THREE.Group();
      stairsGroup.position.set(0, 0, passZ);

      const disposables = {
        geometries: [],
        materials: []
      };

      const stepGeo = new THREE.BoxGeometry(2.35, 0.42, 1.92);
      const cloudGeo = new THREE.BoxGeometry(2.75, 0.26, 2.24);
      const rimGeo = new THREE.BoxGeometry(2.44, 0.14, 2.0);
      disposables.geometries.push(stepGeo, cloudGeo, rimGeo);

      const stepColors = [0x00f5ff, 0xffe600, 0xff2a85, 0x00ff88, 0xa855f7, 0x38bdf8, 0xfbbf24, 0xff6d00];
      const cloudMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.92
      });
      const goldRimMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      disposables.materials.push(cloudMat, goldRimMat);

      for (let s = 0; s <= numSteps; s++) {
        const st = steps[s];
        const colHex = s === 0 ? 0x00ff88 : (s === numSteps ? 0xffd700 : stepColors[(s - 1) % stepColors.length]);
        const sMat = new THREE.MeshStandardMaterial({
          color: colHex,
          emissive: colHex,
          emissiveIntensity: 0.55,
          roughness: 0.2
        });
        disposables.materials.push(sMat);

        const sGroup = new THREE.Group();
        sGroup.position.set(st.x, st.y, st.z);

        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudMesh.position.set(0, -0.22, 0);
        const blockMesh = new THREE.Mesh(stepGeo, sMat);
        const rimMesh = new THREE.Mesh(rimGeo, goldRimMat);
        rimMesh.position.set(0, 0.18, 0);
        sGroup.add(cloudMesh, blockMesh, rimMesh);

        if (s >= 1 && this.sharedRobuxGeo && this.sharedRobuxMaterial) {
          const coin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
          const cScale = s === numSteps ? 2.1 : 1.45;
          coin.scale.set(cScale, cScale, cScale);
          coin.position.set(0, 1.05, 0);
          sGroup.add(coin);
          st.coinMesh = coin;
        }

        // Grand Golden Heaven Archway at the top step!
        if (s === numSteps) {
          const pillarGeo = new THREE.CylinderGeometry(0.22, 0.26, 3.2, 10);
          const archBeamGeo = new THREE.BoxGeometry(3.2, 0.48, 0.48);
          const archMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
          disposables.geometries.push(pillarGeo, archBeamGeo);
          disposables.materials.push(archMat);

          const leftP = new THREE.Mesh(pillarGeo, archMat);
          leftP.position.set(-1.15, 1.6, 0);
          const rightP = new THREE.Mesh(pillarGeo, archMat);
          rightP.position.set(1.15, 1.6, 0);
          const topB = new THREE.Mesh(archBeamGeo, archMat);
          topB.position.set(0, 3.25, 0);
          sGroup.add(leftP, rightP, topB);
        }

        stairsGroup.add(sGroup);
        st.stepMesh = sGroup;
      }

      // Glowing Target Ring highlighting the NEXT step to climb
      const targetRingGeo = new THREE.TorusGeometry(1.32, 0.14, 10, 28);
      targetRingGeo.rotateX(Math.PI / 2);
      const targetRingMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      disposables.geometries.push(targetRingGeo);
      disposables.materials.push(targetRingMat);

      this.heavenNextStepRing = new THREE.Mesh(targetRingGeo, targetRingMat);
      if (steps[1]) {
        this.heavenNextStepRing.position.set(steps[1].x, steps[1].y + 0.35, steps[1].z);
      }
      stairsGroup.add(this.heavenNextStepRing);

      // 3D Floating Direction Arrow above Soyun's Kart showing current facing direction (⬅️ Left vs ➡️ Right)
      const arrowGroup = new THREE.Group();
      const shaftGeo = new THREE.BoxGeometry(1.15, 0.32, 0.32);
      const headGeo = new THREE.ConeGeometry(0.52, 0.78, 8);
      headGeo.rotateZ(-Math.PI / 2);
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      disposables.geometries.push(shaftGeo, headGeo);
      disposables.materials.push(arrowMat);

      const shaftMesh = new THREE.Mesh(shaftGeo, arrowMat);
      shaftMesh.position.set(-0.2, 0, 0);
      const headMesh = new THREE.Mesh(headGeo, arrowMat);
      headMesh.position.set(0.55, 0, 0);
      arrowGroup.add(shaftMesh, headMesh);
      arrowGroup.position.set(0, 3.5, passZ);
      arrowGroup.scale.set(this.heavenStairsFacingDir, 1, 1);
      this.scene.add(arrowGroup);

      this.heavenFacingArrowGroup = arrowGroup;
      this.heavenFacingArrowMat = arrowMat;
      this.heavenStairsGroup = stairsGroup;
      this.heavenStairsDisposables = disposables;
      this.scene.add(stairsGroup);

      return {
        stepIndex: 0,
        totalSteps: numSteps,
        facingDir: this.heavenStairsFacingDir,
        nextRequiredDir: steps[1] ? steps[1].dir : this.heavenStairsFacingDir
      };
    },

    /**
     * Executes 1 step in the 3D Heaven Stairs Mini-Game:
     * @param {boolean} isTurnAndClimb - false = [⬆️ 오르기] (keep direction & climb), true = [🔄 방향전환] (flip direction & climb)
     */
    stepHeavenStairs: function (isTurnAndClimb) {
      if (!this.isHeavenStairsActive || this.heavenStairsFailed || !Array.isArray(this.heavenStairsSteps)) return false;
      const nextIdx = this.heavenStairsStepIndex + 1;
      if (nextIdx > this.heavenStairsTotal) return false;

      const nextStep = this.heavenStairsSteps[nextIdx];
      if (!nextStep) return false;

      const prevFacing = this.heavenStairsFacingDir || 1;
      const attemptedDir = isTurnAndClimb ? -prevFacing : prevFacing;
      const passZ = getCfg().GATE_PASS_Z;

      if (attemptedDir === nextStep.dir) {
        // SUCCESSFUL STEP CLIMB!
        this.heavenStairsFacingDir = attemptedDir;
        this.heavenStairsStepIndex = nextIdx;

        // 3계단 올라가면(stepIndex >= 3) 시작 계단(step 0)부터 차례대로 사라지기 시작!
        if (nextIdx >= 3 && !this.heavenStairsCollapseActive) {
          this.heavenStairsCollapseActive = true;
          this.heavenStairsCollapsedIndex = 0;
          this.heavenStairsCollapseTimer = 0;
          const startStep = this.heavenStairsSteps[0];
          if (startStep) {
            startStep.isCollapsing = true;
            startStep.collapseAnim = 0;
            this._spawnParticleBurst(startStep.x, startStep.y + 0.4, passZ + nextIdx * 2.5, 0xff5500, 16, 0.9);
          }
        }

        if (this.heavenFacingArrowGroup) {
          this.heavenFacingArrowGroup.scale.set(this.heavenStairsFacingDir, 1, 1);
        }

        // Snappy hop arc onto the step
        this.isJumping = true;
        this.carJumpY = 0.12;
        this.carJumpVel = 10.2;
        this.avatarCheerTimer = 0.52;
        this.petSpinTimer = 0.52;
        this.cameraZoomPunch = 5.5;

        if (nextStep.coinMesh) {
          nextStep.coinMesh.visible = false;
        }

        this.spawnBrickExplosion(nextStep.x, nextStep.y + 0.8, passZ, 18, false);
        this._spawnParticleBurst(nextStep.x, nextStep.y + 1.0, passZ, 0xffe600, 26, 1.15);
        this._spawnParticleBurst(nextStep.x, nextStep.y + 0.6, passZ, 0x00ff88, 20, 1.0);

        const upcomingStep = this.heavenStairsSteps[nextIdx + 1] || null;
        if (this.heavenNextStepRing) {
          if (upcomingStep) {
            this.heavenNextStepRing.visible = true;
            this.heavenNextStepRing.position.set(upcomingStep.x, upcomingStep.y + 0.35, upcomingStep.z);
          } else {
            this.heavenNextStepRing.visible = false;
          }
        }

        const isFinished = nextIdx >= this.heavenStairsTotal;
        if (isFinished) {
          this.triggerStageClearEffect();
        }

        if (typeof this.onHeavenStairStep === 'function') {
          this.onHeavenStairStep({
            cleared: true,
            isFinished: isFinished,
            stepIndex: nextIdx,
            totalSteps: this.heavenStairsTotal,
            facingDir: this.heavenStairsFacingDir,
            nextRequiredDir: upcomingStep ? upcomingStep.dir : this.heavenStairsFacingDir
          });
        }
        return true;
      } else {
        // WRONG DIRECTION -> 1번 틀리면 피 1 깎이고 즉시 천국의 계단 종료!
        this.heavenStairsFailed = true;
        this.heavenStairsCollapseActive = false;
        if (this.heavenNextStepRing) {
          this.heavenNextStepRing.visible = false;
        }
        const curStep = this.heavenStairsSteps[this.heavenStairsStepIndex] || { x: 0, y: 0 };
        this.triggerDamageEffect(curStep.x, 'stair_miss');

        if (typeof this.onHeavenStairStep === 'function') {
          this.onHeavenStairStep({
            cleared: false,
            isFailedEnd: true,
            isFinished: false,
            stepIndex: this.heavenStairsStepIndex,
            totalSteps: this.heavenStairsTotal,
            facingDir: this.heavenStairsFacingDir,
            nextRequiredDir: nextStep.dir
          });
        }
        return false;
      }
    },

    /**
     * Removes the 3D Heaven Stairs and smoothly returns Soyun's kart to the highway
     */
    clearHeavenStairs: function () {
      this.isHeavenStairsActive = false;
      this.heavenStairsFailed = false;
      this.heavenStairsCollapseActive = false;
      this.heavenStairsCollapsedIndex = -1;
      this.heavenStairsCollapseTimer = 0;
      this.heavenStairsSteps = [];
      this.heavenStairsStepIndex = 0;
      this.heavenNextStepRing = null;
      if (this.heavenStairsGroup && this.scene) {
        this.scene.remove(this.heavenStairsGroup);
      }
      this.heavenStairsGroup = null;
      if (this.heavenFacingArrowGroup && this.scene) {
        this.scene.remove(this.heavenFacingArrowGroup);
      }
      this.heavenFacingArrowGroup = null;
      if (this.heavenStairsDisposables) {
        this.heavenStairsDisposables.geometries.forEach((g) => g && g.dispose && g.dispose());
        this.heavenStairsDisposables.materials.forEach((m) => m && m.dispose && m.dispose());
        this.heavenStairsDisposables = null;
      }
      return this;
    },

    /**
     * Sets explicit view orientation mode ('auto' | 'portrait' | 'landscape') for mobile optimization
     */
    setViewOrientationMode: function (mode) {
      if (['auto', 'portrait', 'landscape'].includes(mode)) {
        this.viewOrientationMode = mode;
      } else {
        this.viewOrientationMode = 'auto';
      }
      this.resize();
      this.renderSingleFrame();
      return this.viewOrientationMode;
    },

    /**
     * Spawns a 3-Lane Roblox Obby Action Obstacle Wave
     * Supports 2 distinct obstacle modes:
     * - Mode A ('obstacle_wall'): 2 lanes Tall Block Wall ('block') + 1 lane Low Jump Hurdle ('hurdle')
     * - Mode B ('fire_pit'): 2 lanes Very Wide Fire Pit ('wide_fire') + 1 lane Narrow Jumpable Fire Pit ('narrow_fire')
     * @param {Object} waveConfig { z, waveIndex, totalWaves, waveType: 'obstacle_wall'|'fire_pit', lanes: [...] }
     */
    spawnObbyObstacleWave: function (waveConfig) {
      if (!this.isInitialized) this.init();
      const THREE = global.THREE;
      if (!THREE || !this.scene) return null;

      const cfg = getCfg();
      const lanes = cfg.LANES;
      const laneTypes = (waveConfig && Array.isArray(waveConfig.lanes) && waveConfig.lanes.length === 3)
        ? waveConfig.lanes
        : ['block', 'block', 'hurdle'];

      const waveGroup = new THREE.Group();
      const startZ = (waveConfig && typeof waveConfig.z === 'number') ? waveConfig.z : -72;
      waveGroup.position.set(0, 0, startZ);

      const disposables = {
        geometries: [],
        materials: [],
        textures: []
      };

      const coinMeshes = [];
      const flameMeshes = [];
      const spinnerMeshes = [];
      const rollerMeshes = [];
      const wType = (waveConfig && waveConfig.waveType) ? waveConfig.waveType : 'obstacle_wall';

      if (wType === 'low_laser') {
        // ⚡ FULL-ROAD SPINNING NEON LASER SWEEPER BAR ('low_laser' — Must jump over with [⬆️ 점프]!)
        const pylonGeo = new THREE.CylinderGeometry(0.45, 0.58, 2.6, 12);
        const pylonMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          emissive: 0x00f5ff,
          emissiveIntensity: 0.75,
          roughness: 0.2
        });
        const capGeo = new THREE.SphereGeometry(0.56, 12, 12);
        const capMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
        disposables.geometries.push(pylonGeo, capGeo);
        disposables.materials.push(pylonMat, capMat);

        [-6.8, 6.8].forEach((px) => {
          const pylon = new THREE.Mesh(pylonGeo, pylonMat);
          pylon.position.set(px, 1.3, 0);
          const cap = new THREE.Mesh(capGeo, capMat);
          cap.position.set(px, 2.7, 0);
          waveGroup.add(pylon, cap);
        });

        // Central Spinning Laser Rotor + Full-Width Twin Plasma Sweeper Beams
        const rotorGroup = new THREE.Group();
        rotorGroup.position.set(0, 0.74, 0);
        const hubGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.9, 14);
        const hubMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
        const beamGeo1 = new THREE.BoxGeometry(13.6, 0.34, 0.34);
        const beamMat1 = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
        const beamGeo2 = new THREE.BoxGeometry(0.34, 0.34, 5.2);
        const beamMat2 = new THREE.MeshBasicMaterial({ color: 0xff007f });
        disposables.geometries.push(hubGeo, beamGeo1, beamGeo2);
        disposables.materials.push(hubMat, beamMat1, beamMat2);

        const hubMesh = new THREE.Mesh(hubGeo, hubMat);
        const beamMesh1 = new THREE.Mesh(beamGeo1, beamMat1);
        const beamMesh2 = new THREE.Mesh(beamGeo2, beamMat2);
        rotorGroup.add(hubMesh, beamMesh1, beamMesh2);
        waveGroup.add(rotorGroup);
        spinnerMeshes.push(rotorGroup);

        // Glowing Jump Zone Mat in front of the Laser Bar (+Z)
        const zoneGeo = new THREE.BoxGeometry(13.2, 0.12, 3.2);
        const zoneMat = new THREE.MeshBasicMaterial({
          color: 0x00ff9d,
          transparent: true,
          opacity: 0.55
        });
        disposables.geometries.push(zoneGeo);
        disposables.materials.push(zoneMat);
        const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
        zoneMesh.position.set(0, 0.08, 2.4);
        waveGroup.add(zoneMesh);

        if (this.sharedRobuxGeo && this.sharedRobuxMaterial) {
          [-4.5, 0, 4.5].forEach((cx) => {
            const airCoin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
            airCoin.scale.set(1.65, 1.65, 1.65);
            airCoin.position.set(cx, 2.7, 0);
            waveGroup.add(airCoin);
            coinMeshes.push(airCoin);
          });
        }
      } else if (wType === 'high_log') {
        // 🪵🔥 FULL-ROAD GIANT 2-STORY ROLLING SPIKE LOG ('high_log' — Jump high with [🔄 2단 슈퍼점프]!)
        const logGroup = new THREE.Group();
        logGroup.position.set(0, 1.18, 0);

        const logGeo = new THREE.CylinderGeometry(1.12, 1.12, 13.8, 16);
        logGeo.rotateZ(Math.PI / 2);
        const logMat = new THREE.MeshStandardMaterial({
          color: 0x78350f,
          emissive: 0x451a03,
          emissiveIntensity: 0.45,
          roughness: 0.55
        });
        const bandGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.55, 16);
        bandGeo.rotateZ(Math.PI / 2);
        const bandMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
        const spikeGeo = new THREE.ConeGeometry(0.32, 0.78, 8);
        const spikeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
        disposables.geometries.push(logGeo, bandGeo, spikeGeo);
        disposables.materials.push(logMat, bandMat, spikeMat);

        const logMesh = new THREE.Mesh(logGeo, logMat);
        logGroup.add(logMesh);

        [-5.2, -1.8, 1.8, 5.2].forEach((bx) => {
          const band = new THREE.Mesh(bandGeo, bandMat);
          band.position.set(bx, 0, 0);
          logGroup.add(band);
        });

        // Add 3D hazard spikes around the rolling log circumference
        [-4.2, -2.1, 0, 2.1, 4.2].forEach((sx, idx) => {
          for (let a = 0; a < 4; a++) {
            const angle = (a * Math.PI) / 2 + (idx % 2) * 0.4;
            const sp = new THREE.Mesh(spikeGeo, spikeMat);
            sp.position.set(sx, Math.cos(angle) * 1.32, Math.sin(angle) * 1.32);
            sp.rotation.x = angle;
            logGroup.add(sp);
          }
        });

        waveGroup.add(logGroup);
        rollerMeshes.push(logGroup);

        // Glowing Super-Jump Zone Mat in front of the Giant Rolling Log (+Z)
        const superZoneGeo = new THREE.BoxGeometry(13.2, 0.14, 3.8);
        const superZoneMat = new THREE.MeshBasicMaterial({
          color: 0xff2a85,
          transparent: true,
          opacity: 0.58
        });
        disposables.geometries.push(superZoneGeo);
        disposables.materials.push(superZoneMat);
        const superZoneMesh = new THREE.Mesh(superZoneGeo, superZoneMat);
        superZoneMesh.position.set(0, 0.09, 2.8);
        waveGroup.add(superZoneMesh);

        if (this.sharedRobuxGeo && this.sharedRobuxMaterial) {
          [-4.5, 0, 4.5].forEach((cx) => {
            const highCoin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
            highCoin.scale.set(1.8, 1.8, 1.8);
            highCoin.position.set(cx, 3.6, 0);
            waveGroup.add(highCoin);
            coinMeshes.push(highCoin);
          });
        }
      } else {
      for (let i = 0; i < 3; i++) {
        const lx = lanes[i] !== undefined ? lanes[i] : (i - 1) * 4.5;
        const type = laneTypes[i];

        if (type === 'block') {
          // 🧱 Tall Studded Roblox Hazard Block Wall (2 lanes blocked — must dodge into the 1 low lane!)
          const wallGeo = new THREE.BoxGeometry(3.65, 3.85, 1.45);
          const wallMat = new THREE.MeshStandardMaterial({
            color: 0xff1744,
            emissive: 0x990022,
            emissiveIntensity: 0.6,
            roughness: 0.25
          });
          disposables.geometries.push(wallGeo);
          disposables.materials.push(wallMat);

          const wallMesh = new THREE.Mesh(wallGeo, wallMat);
          wallMesh.position.set(lx, 1.92, 0);
          waveGroup.add(wallMesh);

          // Yellow/Black hazard warning stripe bars across front
          const stripeGeo = new THREE.BoxGeometry(3.72, 0.62, 1.52);
          const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
          disposables.geometries.push(stripeGeo);
          disposables.materials.push(stripeMat);

          const stripeMesh1 = new THREE.Mesh(stripeGeo, stripeMat);
          stripeMesh1.position.set(lx, 1.25, 0);
          waveGroup.add(stripeMesh1);

          const stripeMesh2 = new THREE.Mesh(stripeGeo, stripeMat);
          stripeMesh2.position.set(lx, 2.65, 0);
          waveGroup.add(stripeMesh2);

          // Top warning cones/studs on tall wall
          const spikeGeo = new THREE.ConeGeometry(0.42, 0.95, 8);
          const spikeMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
          disposables.geometries.push(spikeGeo);
          disposables.materials.push(spikeMat);
          [-1.15, 0, 1.15].forEach((sx) => {
            const spike = new THREE.Mesh(spikeGeo, spikeMat);
            spike.position.set(lx + sx, 4.3, 0);
            waveGroup.add(spike);
          });
        } else if (type === 'wide_fire') {
          // 🔥 MASSIVE WIDE FIRE PIT (불구덩이가 매우 넓은 2개 레인 — 너무 넓어서 건널 수 없음!)
          const pitRimGeo = new THREE.BoxGeometry(4.25, 0.36, 12.6);
          const pitRimMat = new THREE.MeshBasicMaterial({ color: 0x1a0303 });
          const lavaBedGeo = new THREE.BoxGeometry(3.92, 0.44, 12.1);
          const lavaBedMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
          const magmaCoreGeo = new THREE.BoxGeometry(3.2, 0.48, 11.4);
          const magmaCoreMat = new THREE.MeshBasicMaterial({ color: 0xff9100 });
          disposables.geometries.push(pitRimGeo, lavaBedGeo, magmaCoreGeo);
          disposables.materials.push(pitRimMat, lavaBedMat, magmaCoreMat);

          const pitRim = new THREE.Mesh(pitRimGeo, pitRimMat);
          pitRim.position.set(lx, 0.14, -1.2);
          const lavaBed = new THREE.Mesh(lavaBedGeo, lavaBedMat);
          lavaBed.position.set(lx, 0.18, -1.2);
          const magmaCore = new THREE.Mesh(magmaCoreGeo, magmaCoreMat);
          magmaCore.position.set(lx, 0.21, -1.2);
          waveGroup.add(pitRim, lavaBed, magmaCore);

          // 9 Roaring 3D Flame Pillars across the entire 12.6m length of the Wide Fire Pit!
          const outerFlameGeo = new THREE.ConeGeometry(0.76, 2.75, 8);
          const innerFlameGeo = new THREE.ConeGeometry(0.48, 1.95, 8);
          const outerFlameMat = new THREE.MeshBasicMaterial({
            color: 0xff3d00,
            transparent: true,
            opacity: 0.92
          });
          const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
          disposables.geometries.push(outerFlameGeo, innerFlameGeo);
          disposables.materials.push(outerFlameMat, innerFlameMat);

          const flamePositions = [
            { x: -1.05, z: 4.0, s: 1.05 },
            { x: 1.05, z: 3.4, s: 0.95 },
            { x: 0.0, z: 1.8, s: 1.22 },
            { x: -1.1, z: 0.2, s: 1.08 },
            { x: 1.1, z: -0.4, s: 1.14 },
            { x: 0.0, z: -2.2, s: 1.28 },
            { x: -1.0, z: -4.0, s: 1.02 },
            { x: 1.0, z: -4.6, s: 0.96 },
            { x: 0.0, z: -6.2, s: 1.15 }
          ];
          flamePositions.forEach((fp, fIdx) => {
            const fGroup = new THREE.Group();
            fGroup.position.set(lx + fp.x, 1.15, fp.z);
            fGroup.scale.set(fp.s, fp.s, fp.s);
            fGroup.userData = { baseScaleY: fp.s, phase: fIdx * 1.1 + i * 2.0 };
            const oMesh = new THREE.Mesh(outerFlameGeo, outerFlameMat);
            const iMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
            iMesh.position.y = -0.2;
            fGroup.add(oMesh, iMesh);
            waveGroup.add(fGroup);
            flameMeshes.push(fGroup);
          });
        } else if (type === 'narrow_fire') {
          // 🔥⬆️ NARROW JUMPABLE FIRE PIT (불구덩이가 좁은 1개 레인 — 점프 발판을 밟고 뛰어넘을 수 있음!)
          const narrowRimGeo = new THREE.BoxGeometry(4.0, 0.28, 1.65);
          const narrowRimMat = new THREE.MeshBasicMaterial({ color: 0x260505 });
          const narrowLavaGeo = new THREE.BoxGeometry(3.65, 0.34, 1.35);
          const narrowLavaMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
          disposables.geometries.push(narrowRimGeo, narrowLavaGeo);
          disposables.materials.push(narrowRimMat, narrowLavaMat);

          const narrowRim = new THREE.Mesh(narrowRimGeo, narrowRimMat);
          narrowRim.position.set(lx, 0.12, 0);
          const narrowLava = new THREE.Mesh(narrowLavaGeo, narrowLavaMat);
          narrowLava.position.set(lx, 0.16, 0);
          waveGroup.add(narrowRim, narrowLava);

          // Small low embers inside the narrow pit
          const miniFlameGeo = new THREE.ConeGeometry(0.38, 0.82, 7);
          const miniFlameMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
          disposables.geometries.push(miniFlameGeo);
          disposables.materials.push(miniFlameMat);
          [-1.0, 0, 1.0].forEach((fx, fIdx) => {
            const mf = new THREE.Mesh(miniFlameGeo, miniFlameMat);
            mf.position.set(lx + fx, 0.52, 0);
            mf.userData = { baseScaleY: 1.0, phase: fIdx * 1.4 };
            waveGroup.add(mf);
            flameMeshes.push(mf);
          });

          // Glowing Green/Cyan Turbo Jump Ramp right in front of the Narrow Fire Pit (+Z)
          const rampGeo = new THREE.BoxGeometry(3.55, 0.24, 1.9);
          const rampMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d });
          const rampStripeGeo = new THREE.BoxGeometry(3.6, 0.28, 0.45);
          const rampStripeMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
          disposables.geometries.push(rampGeo, rampStripeGeo);
          disposables.materials.push(rampMat, rampStripeMat);

          const rampMesh = new THREE.Mesh(rampGeo, rampMat);
          rampMesh.position.set(lx, 0.14, 1.95);
          rampMesh.rotation.x = 0.12;
          const rampStripe = new THREE.Mesh(rampStripeGeo, rampStripeMat);
          rampStripe.position.set(lx, 0.22, 1.35);
          waveGroup.add(rampMesh, rampStripe);

          // Floating Golden Robux Ring in the jump arc over the narrow fire pit!
          if (this.sharedRobuxGeo && this.sharedRobuxMaterial) {
            const airCoin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
            airCoin.scale.set(1.65, 1.65, 1.65);
            airCoin.position.set(lx, 2.85, 0);
            waveGroup.add(airCoin);
            coinMeshes.push(airCoin);
          }
        } else if (type === 'hurdle') {
          // 🧱⬆️ Low Jumpable Obstacle Hurdle (낮은 1개 레인 장애물 — 점프해 뛰어넘음!)
          const hurdleGeo = new THREE.BoxGeometry(3.85, 0.92, 0.92);
          const hurdleMat = new THREE.MeshBasicMaterial({
            color: 0xff5500
          });
          disposables.geometries.push(hurdleGeo);
          disposables.materials.push(hurdleMat);

          const hurdleMesh = new THREE.Mesh(hurdleGeo, hurdleMat);
          hurdleMesh.position.set(lx, 0.48, 0);
          waveGroup.add(hurdleMesh);

          // Glowing Neon Yellow Top Rail
          const railGeo = new THREE.BoxGeometry(3.9, 0.22, 0.98);
          const railMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
          disposables.geometries.push(railGeo);
          disposables.materials.push(railMat);
          const railMesh = new THREE.Mesh(railGeo, railMat);
          railMesh.position.set(lx, 0.98, 0);
          waveGroup.add(railMesh);

          // Green Spring Jump Pad in front of the low hurdle
          const padGeo = new THREE.BoxGeometry(3.4, 0.18, 1.7);
          const padMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
          disposables.geometries.push(padGeo);
          disposables.materials.push(padMat);
          const padMesh = new THREE.Mesh(padGeo, padMat);
          padMesh.position.set(lx, 0.1, 1.65);
          waveGroup.add(padMesh);

          // Floating Golden Robux Ring in mid-air above the hurdle (y = 2.75) so jumping grabs it!
          if (this.sharedRobuxGeo && this.sharedRobuxMaterial) {
            const airCoin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
            airCoin.scale.set(1.6, 1.6, 1.6);
            airCoin.position.set(lx, 2.75, 0);
            waveGroup.add(airCoin);
            coinMeshes.push(airCoin);
          }
        } else {
          // Open Safe Lane with Spinning Golden Robux Ring + Green Boost Pad!
          const padGeo = new THREE.BoxGeometry(3.2, 0.12, 2.2);
          const padMat = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.65
          });
          disposables.geometries.push(padGeo);
          disposables.materials.push(padMat);
          const padMesh = new THREE.Mesh(padGeo, padMat);
          padMesh.position.set(lx, 0.08, 0);
          waveGroup.add(padMesh);

          if (this.sharedRobuxGeo && this.sharedRobuxMaterial) {
            const coin = new THREE.Mesh(this.sharedRobuxGeo, this.sharedRobuxMaterial);
            coin.scale.set(1.65, 1.65, 1.65);
            coin.position.set(lx, 1.45, 0);
            waveGroup.add(coin);
            coinMeshes.push(coin);
          }
        }
      }

      }

      this.scene.add(waveGroup);

      const waveObj = {
        group: waveGroup,
        lanes: laneTypes,
        waveType: wType,
        waveIndex: waveConfig && waveConfig.waveIndex ? waveConfig.waveIndex : 1,
        totalWaves: waveConfig && waveConfig.totalWaves ? waveConfig.totalWaves : 3,
        passed: false,
        playerJumped: false,
        maxJumpScale: 0,
        coinMeshes: coinMeshes,
        flameMeshes: flameMeshes,
        spinnerMeshes: spinnerMeshes,
        rollerMeshes: rollerMeshes,
        disposables: disposables
      };

      this.activeObbyWaves.push(waveObj);
      return waveObj;
    },

    /**
     * Clears all active Roblox Obby Mini-Game obstacle waves
     */
    clearObbyObstacles: function () {
      while (this.activeObbyWaves.length > 0) {
        const w = this.activeObbyWaves.pop();
        if (w && w.group && this.scene) {
          this.scene.remove(w.group);
        }
        if (w && w.disposables) {
          w.disposables.geometries.forEach((g) => g && g.dispose && g.dispose());
          w.disposables.materials.forEach((m) => m && m.dispose && m.dispose());
          w.disposables.textures.forEach((t) => t && t.dispose && t.dispose());
        }
      }
      return this;
    },

    /**
     * Set & get racing speed in km/h
     */
    setSpeed: function (speedKmh) {
      const val = Number(speedKmh);
      if (!isNaN(val)) {
        this.targetSpeed = Math.max(DEFAULT_CONFIG.MIN_SPEED, Math.min(DEFAULT_CONFIG.MAX_SPEED, val));
        this.currentSpeed = this.targetSpeed;
      }
      return this.currentSpeed;
    },

    getSpeed: function () {
      return Math.round(this.currentSpeed);
    },

    /**
     * Dynamically transition stage colors, fog, road grid, river, 3D biome scenery, and bespoke skybox theme
     */
    setStageTheme: function (stageConfig) {
      let theme = STAGE_THEMES[0];
      if (typeof stageConfig === 'number') {
        theme = STAGE_THEMES[(stageConfig - 1) % STAGE_THEMES.length] || STAGE_THEMES[0];
      } else if (stageConfig && typeof stageConfig === 'object') {
        const idx = Math.max(0, (stageConfig.id || stageConfig.stage || 1) - 1);
        const byBiome = stageConfig.biome
          ? STAGE_THEMES.find(function (t) { return t.biome === stageConfig.biome; })
          : null;
        const base = byBiome || STAGE_THEMES[idx % STAGE_THEMES.length] || STAGE_THEMES[0];
        theme = Object.assign({}, base, {
          biome: base.biome,
          id: stageConfig.stage || base.id,
          name: stageConfig.title || base.name
        });
      }

      this.currentTheme = theme;
      if (!this.scene) return this;

      this.scene.background.setHex(theme.fog);
      if (this.scene.fog) this.scene.fog.color.setHex(theme.fog);
      if (this.outerGroundMat) this.outerGroundMat.color.setHex(theme.ground || theme.fog);
      if (this.stageRiverMat) this.stageRiverMat.color.setHex(theme.river || theme.primary);
      if (this.roadSurfaceMat) this.roadSurfaceMat.color.setHex(theme.road);
      if (this.edgeRailMat) this.edgeRailMat.color.setHex(theme.primary);
      if (this.dashMaterial) this.dashMaterial.color.setHex(theme.primary);
      if (this.curbMatA) this.curbMatA.color.setHex(theme.curbA);
      if (this.curbMatB) this.curbMatB.color.setHex(theme.curbB);
      if (this.mountainMat) this.mountainMat.color.setHex(theme.mountain);
      if (this.mountainWireMat) this.mountainWireMat.color.setHex(theme.mountainEdge);
      if (this.carPointLight) this.carPointLight.color.setHex(theme.primary);
      if (this.retroSunMesh && this.retroSunMesh.material) {
        this.retroSunMesh.material.color.setHex(theme.secondary);
      }

      this._applyBiomePropsVisibility(theme.biome || 'river_nature');
      const biomeSkyTex = this._paintBiomeSkyboxTexture(theme);

      if (!this.isBossActive) {
        if (this.skyBackdropMesh && this.skyBackdropMesh.material && biomeSkyTex) {
          this.skyBackdropMesh.material.map = biomeSkyTex;
          this.skyBackdropMesh.material.needsUpdate = true;
        }
        if (this.bossLavaGroup) {
          this.bossLavaGroup.visible = false;
        }
      }
      return this;
    },

    /**
     * Switches the 3D world into the Apocalyptic Hell & Erupting Lava Environment when a Boss appears!
     */
    _applyBossHellEnvironment: function (enable) {
      if (!this.scene) return;
      if (enable) {
        const hellFog = 0x2a0303;
        this.scene.background.setHex(hellFog);
        if (this.scene.fog) this.scene.fog.color.setHex(hellFog);
        if (this.outerGroundMat) this.outerGroundMat.color.setHex(0x881100);
        if (this.stageRiverMat) this.stageRiverMat.color.setHex(0xff3300);
        if (this.roadSurfaceMat) this.roadSurfaceMat.color.setHex(0x1c0404);
        if (this.edgeRailMat) this.edgeRailMat.color.setHex(0xff3300);
        if (this.dashMaterial) this.dashMaterial.color.setHex(0xffaa00);
        if (this.curbMatA) this.curbMatA.color.setHex(0xff2200);
        if (this.curbMatB) this.curbMatB.color.setHex(0xffbe0b);
        if (this.mountainMat) this.mountainMat.color.setHex(0x280303);
        if (this.mountainWireMat) this.mountainWireMat.color.setHex(0xff4500);
        if (this.carPointLight) this.carPointLight.color.setHex(0xff4500);
        if (this.retroSunMesh && this.retroSunMesh.material) {
          this.retroSunMesh.material.color.setHex(0xff3300);
        }
        if (this.skyBackdropMesh && this.skyBackdropMesh.material && this.textures.hellSkybox) {
          this.skyBackdropMesh.material.map = this.textures.hellSkybox;
          this.skyBackdropMesh.material.needsUpdate = true;
        }
        if (this.bossLavaGroup) {
          this.bossLavaGroup.visible = true;
        }
      } else {
        if (this.bossLavaGroup) {
          this.bossLavaGroup.visible = false;
        }
        this.setStageTheme(this.currentTheme);
      }
    },

    /**
     * Create a high-resolution CanvasTexture for a Gate Lane Signboard
     * Renders HUGE, ultra-legible answer text right from the start!
     */
    _createChoiceSignTexture: function (laneIndex, choiceText, accentHex) {
      const THREE = global.THREE;
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 420;
      const ctx = canvas.getContext('2d');

      const laneColors = ['#00f3ff', '#ffe600', '#ff2a85'];
      const borderColor = accentHex ? hexToCss(accentHex) : laneColors[laneIndex] || '#00f3ff';

      // 100% Transparent Signboard Interior (no opaque fill so 3D road/sky/boss shows through!)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Thick glowing neon border on transparent glass
      ctx.save();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 14;
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 20;
      roundRectPath(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 26);
      ctx.stroke();
      ctx.restore();

      // Only show top badge for Speech Microphone sign; normal 3-lane boards use 100% of board for HUGE Answer text!
      const rawChoiceStr = String(choiceText !== undefined && choiceText !== null ? choiceText : '');
      const isSpeechSign = rawChoiceStr.startsWith('🎤');
      if (isSpeechSign) {
        ctx.fillStyle = borderColor;
        roundRectPath(ctx, 24, 22, 148, 52, 14);
        ctx.fill();

        ctx.fillStyle = '#050614';
        ctx.font = '900 30px "Malgun Gothic", "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎤 말하기', 98, 49);
      }

      // Giant Answer Text filling 100% of the signboard
      const text = rawChoiceStr.trim();
      const maxWidth = canvas.width - 36;
      const fontFamily = '"Malgun Gothic", "Pretendard", "Apple SD Gothic Neo", "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#040614';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 22;

      // Determine whether 2-line split gives much larger text (e.g. multi-word English or Korean > 4 chars)
      const hasSpaceOrSlash = text.indexOf(' ') > 0 || text.indexOf('/') > 0;
      const shouldSplitTwoLines = (hasSpaceOrSlash && text.length >= 6) || text.length >= 6;

      if (shouldSplitTwoLines) {
        const mid = Math.ceil(text.length / 2);
        let splitIdx = text.lastIndexOf('/', mid + 2);
        if (splitIdx <= 0) splitIdx = text.lastIndexOf(' ', mid + 4);
        if (splitIdx <= 0) splitIdx = text.indexOf(' ');
        if (splitIdx <= 0) splitIdx = mid;
        else splitIdx += 1;

        const line1 = text.slice(0, splitIdx).trim();
        const line2 = text.slice(splitIdx).trim();

        if (line1 && line2) {
          let fontSize = isSpeechSign ? 176 : 212;
          while (fontSize > 96) {
            ctx.font = `900 ${fontSize}px ${fontFamily}`;
            const w1 = ctx.measureText(line1).width;
            const w2 = ctx.measureText(line2).width;
            if (Math.max(w1, w2) <= maxWidth) break;
            fontSize -= 6;
          }
          ctx.font = `900 ${fontSize}px ${fontFamily}`;
          ctx.lineWidth = Math.max(14, Math.round(fontSize * 0.095));
          const y1 = isSpeechSign ? 166 : 126;
          const y2 = isSpeechSign ? 314 : 302;
          ctx.strokeText(line1, canvas.width / 2, y1, maxWidth);
          ctx.fillText(line1, canvas.width / 2, y1, maxWidth);
          ctx.strokeText(line2, canvas.width / 2, y2, maxWidth);
          ctx.fillText(line2, canvas.width / 2, y2, maxWidth);
        } else {
          let fontSize = 286;
          while (fontSize > 110) {
            ctx.font = `900 ${fontSize}px ${fontFamily}`;
            if (ctx.measureText(text).width <= maxWidth) break;
            fontSize -= 8;
          }
          ctx.font = `900 ${fontSize}px ${fontFamily}`;
          ctx.lineWidth = Math.max(16, Math.round(fontSize * 0.095));
          const cy = isSpeechSign ? 242 : 214;
          ctx.strokeText(text, canvas.width / 2, cy, maxWidth);
          ctx.fillText(text, canvas.width / 2, cy, maxWidth);
        }
      } else {
        let fontSize = 292;
        while (fontSize > 120) {
          ctx.font = `900 ${fontSize}px ${fontFamily}`;
          if (ctx.measureText(text).width <= maxWidth) break;
          fontSize -= 8;
        }
        ctx.font = `900 ${fontSize}px ${fontFamily}`;
        ctx.lineWidth = Math.max(16, Math.round(fontSize * 0.095));
        const cy = isSpeechSign ? 242 : 214;
        ctx.strokeText(text, canvas.width / 2, cy, maxWidth);
        ctx.fillText(text, canvas.width / 2, cy, maxWidth);
      }

      ctx.shadowBlur = 0;

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    },

    /**
     * Spawn a 3-Lane Overhead Roblox Obby Quiz Gate at GATE_SPAWN_Z (-88)
     */
    spawnQuestionGate: function (questionData) {
      if (!this.isInitialized) this.init();
      const THREE = global.THREE;
      if (!THREE || !this.scene) return null;

      const cfg = getCfg();
      const lanes = cfg.LANES;
      const qData = questionData || {
        question: '3 + 4 = ?',
        choices: ['6', '7', '8'],
        correctLane: 1
      };
      const choices = Array.isArray(qData.choices)
        ? qData.choices
        : Array.isArray(qData.options)
        ? qData.options
        : ['1', '2', '3'];
      const correctLane =
        typeof qData.correctLane === 'number'
          ? qData.correctLane
          : typeof qData.correctIndex === 'number'
          ? qData.correctIndex
          : typeof qData.answerIndex === 'number'
          ? qData.answerIndex
          : 0;

      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, cfg.GATE_SPAWN_Z);
      // Start scaled up when far away so the 3 answer signboards are BIG right from the start,
      // while adapting automatically on narrow mobile portrait screens so all 3 lanes fit 100%!
      const initScale = this._getAdaptiveGateScale(0);
      gateGroup.scale.set(initScale, initScale, 1);

      const disposables = {
        geometries: [],
        materials: [],
        textures: []
      };

      // 1. Left & Right Roblox Block Pillars + Studded Overhead Crossbar
      const pillarGeo = new THREE.BoxGeometry(0.65, 6.4, 0.65);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x161233,
        emissive: this.currentTheme.primary,
        emissiveIntensity: 0.6
      });
      disposables.geometries.push(pillarGeo);
      disposables.materials.push(pillarMat);

      [-7.4, 7.4].forEach((px) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(px, 3.2, 0);
        gateGroup.add(pillar);
      });

      const stanchionGeo = new THREE.BoxGeometry(0.28, 5.6, 0.28);
      disposables.geometries.push(stanchionGeo);
      [-2.25, 2.25].forEach((sx) => {
        const stanchion = new THREE.Mesh(stanchionGeo, pillarMat);
        stanchion.position.set(sx, 2.8, 0);
        gateGroup.add(stanchion);
      });

      const beamGeo = new THREE.BoxGeometry(15.6, 0.56, 0.68);
      const beamMat = new THREE.MeshBasicMaterial({ color: this.currentTheme.primary });
      disposables.geometries.push(beamGeo);
      disposables.materials.push(beamMat);
      const topBeam = new THREE.Mesh(beamGeo, beamMat);
      topBeam.position.set(0, 6.1, 0);
      gateGroup.add(topBeam);

      // 2. Three Lane Choice Signboards (LARGE 4.62 x 3.95 boards!) + Smashable Blocky Energy Curtains
      const signGeo = new THREE.PlaneGeometry(4.62, 3.95);
      const curtainGeo = new THREE.PlaneGeometry(4.1, 2.7);
      disposables.geometries.push(signGeo, curtainGeo);

      const laneColors = [0x00f3ff, 0xffe600, 0xff2a85];
      const curtains = [];
      const hazardMeshes = [];

      for (let i = 0; i < 3; i++) {
        const laneX = lanes[i] !== undefined ? lanes[i] : (i - 1) * 4.5;
        const signTex = this._createChoiceSignTexture(i, choices[i], laneColors[i]);
        disposables.textures.push(signTex);

        const signMat = new THREE.MeshBasicMaterial({
          map: signTex,
          transparent: true,
          side: THREE.DoubleSide,
          fog: false
        });
        disposables.materials.push(signMat);

        const signMesh = new THREE.Mesh(signGeo, signMat);
        signMesh.position.set(laneX, 4.35, 0.15);
        gateGroup.add(signMesh);

        const curtainMat = new THREE.MeshBasicMaterial({
          color: laneColors[i],
          transparent: true,
          opacity: 0.06,
          side: THREE.DoubleSide
        });
        disposables.materials.push(curtainMat);

        const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
        curtainMesh.position.set(laneX, 1.45, 0);
        gateGroup.add(curtainMesh);
        curtains.push(curtainMesh);

        const hazardGeo = new THREE.PlaneGeometry(3.9, 2.1);
        const hazardMat = new THREE.MeshBasicMaterial({
          map: this.textures.obstacleBarrier,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide
        });
        disposables.geometries.push(hazardGeo);
        disposables.materials.push(hazardMat);

        const hazardMesh = new THREE.Mesh(hazardGeo, hazardMat);
        hazardMesh.position.set(laneX, 1.2, 0.35);
        hazardMesh.visible = false;
        gateGroup.add(hazardMesh);
        hazardMeshes.push(hazardMesh);
      }

      this.scene.add(gateGroup);

      const gateObj = {
        group: gateGroup,
        questionData: Object.assign({}, qData, { choices, correctLane }),
        passed: false,
        progress: 0,
        curtains,
        hazardMeshes,
        disposables
      };

      this.activeGates.push(gateObj);
      return gateObj;
    },

    /**
     * Remove & dispose a single gate object
     */
    _disposeGate: function (gateObj) {
      if (!gateObj) return;
      if (gateObj.group && this.scene) {
        this.scene.remove(gateObj.group);
      }
      if (gateObj.disposables) {
        gateObj.disposables.geometries.forEach((g) => g && g.dispose && g.dispose());
        gateObj.disposables.materials.forEach((m) => m && m.dispose && m.dispose());
        gateObj.disposables.textures.forEach((t) => t && t.dispose && t.dispose());
      }
    },

    /**
     * Clear all active question gates from the highway
     */
    clearActiveGates: function () {
      while (this.activeGates.length > 0) {
        const gate = this.activeGates.pop();
        this._disposeGate(gate);
      }
      return this;
    },

    /**
     * Return active gate telemetry for HUD & automated testing
     */
    getActiveGateInfo: function () {
      const nextGate = this.activeGates.find((g) => !g.passed) || this.activeGates[0] || null;
      if (!nextGate) {
        return {
          hasGate: false,
          z: null,
          progress: 0,
          questionData: null,
          correctLane: null,
          choices: null
        };
      }
      return {
        hasGate: !nextGate.passed,
        z: nextGate.group.position.z,
        progress: nextGate.progress,
        questionData: nextGate.questionData,
        correctLane: nextGate.questionData.correctLane,
        choices: nextGate.questionData.choices
      };
    },

    /**
     * Test helper / fast-forward to immediately resolve the active gate
     */
    forcePassActiveGate: function (laneOverride) {
      const nextGate = this.activeGates.find((g) => !g.passed);
      if (!nextGate) return false;
      if (typeof laneOverride === 'number') {
        this.setLane(laneOverride);
      }
      const cfg = getCfg();
      nextGate.group.position.z = cfg.GATE_PASS_Z + 0.1;
      this._evaluateGatePass(nextGate);
      return true;
    },

    /**
     * Immediately resolves the active Speech (Pronunciation) Gate when Soyun says the target word into the mic!
     */
    resolveSpeechGatePass: function (spokenText) {
      const nextGate = this.activeGates.find((g) => !g.passed);
      if (!nextGate || !nextGate.questionData) return false;
      nextGate.questionData.speechPassed = true;
      nextGate.questionData.spokenText = spokenText || nextGate.questionData.answerText;
      const cfg = getCfg();
      nextGate.group.position.z = cfg.GATE_PASS_Z + 0.1;
      this._evaluateGatePass(nextGate);
      return true;
    },

    /**
     * Evaluate gate collision / answer check when gate reaches player car Z
     */
    _evaluateGatePass: function (gate) {
      if (!gate || gate.passed) return;
      gate.passed = true;
      gate.progress = 1.0;

      const currentLaneIndex = this.targetLane;
      const isSpeechGate = Boolean(gate.questionData && gate.questionData.isSpeech);
      const correctLane = gate.questionData.correctLane;
      const isCorrect = isSpeechGate
        ? Boolean(gate.questionData.speechPassed)
        : (currentLaneIndex === correctLane);
      const lanes = getCfg().LANES;
      const laneX = lanes[currentLaneIndex] || 0;

      if (isCorrect) {
        // Shatter the gate curtain on the correct lane (or all 3 lanes for a Speech Gate!)
        if (isSpeechGate && Array.isArray(gate.curtains)) {
          gate.curtains.forEach((c) => {
            if (c) c.visible = false;
          });
        } else if (gate.curtains[currentLaneIndex]) {
          gate.curtains[currentLaneIndex].visible = false;
        }
        this.triggerCorrectEffect(laneX);
        if (this.isBossActive) {
          this.lastAutoLaserTime = performance.now();
          this._fireLaserAtBoss();
        }
      } else {
        if (gate.hazardMeshes && gate.hazardMeshes[currentLaneIndex]) {
          const hMesh = gate.hazardMeshes[currentLaneIndex];
          hMesh.visible = true;
          hMesh.material.opacity = 1.0;
        }
        if (gate.curtains[currentLaneIndex]) {
          gate.curtains[currentLaneIndex].material.color.setHex(0xff0044);
          gate.curtains[currentLaneIndex].material.opacity = 0.85;
        }
        this.triggerDamageEffect(laneX);
      }

      if (typeof this.onGatePass === 'function') {
        this.onGatePass(currentLaneIndex, gate.questionData, isCorrect);
      }
    },

    /**
     * Spawn 40+ 3D colorful Roblox Bricks + Golden Robux (R$) Rings that spin & bounce off the road!
     */
    spawnBrickExplosion: function (x, y, z, brickCount, isBossHit) {
      const THREE = global.THREE;
      if (!THREE || !this.scene) return;
      if (!this.sharedBrickGeo) this._initSharedBrickAssets();

      const count = typeof brickCount === 'number' ? brickCount : 44;

      // Cap total active bricks to keep 60fps rock-solid
      while (this.activeBricks.length > 160) {
        const oldest = this.activeBricks.shift();
        if (oldest && oldest.mesh) this.scene.remove(oldest.mesh);
      }

      for (let i = 0; i < count; i++) {
        const isRobuxCoin = i % 5 === 0;
        const mat = isRobuxCoin
          ? this.sharedRobuxMaterial
          : this.sharedBrickMaterials[i % this.sharedBrickMaterials.length];
        const geo = isRobuxCoin ? this.sharedRobuxGeo : this.sharedBrickGeo;
        const mesh = new THREE.Mesh(geo, mat);

        const scale = isRobuxCoin ? 0.85 : 0.42 + Math.random() * 0.42;
        mesh.scale.set(scale, scale, scale);

        mesh.position.set(
          x + (Math.random() - 0.5) * 3.2,
          Math.max(0.4, y + (Math.random() - 0.3) * 2.4),
          z + (Math.random() - 0.5) * 1.8
        );

        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        this.scene.add(mesh);

        const spread = isBossHit ? 26 : 19;
        this.activeBricks.push({
          mesh,
          baseScale: scale,
          vx: (Math.random() - 0.5) * spread,
          vy: 7 + Math.random() * 14,
          vz: isBossHit ? (Math.random() - 0.3) * 22 : -10 + Math.random() * 26,
          rx: (Math.random() - 0.5) * 18,
          ry: (Math.random() - 0.5) * 18,
          rz: (Math.random() - 0.5) * 18,
          age: 0,
          maxAge: 1.05 + Math.random() * 0.35
        });
      }
    },

    _spawnBrickExplosion: function (x, y, z, brickCount, isBossHit) {
      return this.spawnBrickExplosion(x, y, z, brickCount, isBossHit);
    },

    /**
     * Spawn 3D particle burst at world position
     */
    _spawnParticleBurst: function (x, y, z, colorHex, count, speedScale) {
      const THREE = global.THREE;
      if (!THREE || !this.scene) return;

      const num = count || 36;
      const positions = new Float32Array(num * 3);
      const velocities = [];
      const spd = speedScale || 1.0;

      for (let i = 0; i < num; i++) {
        positions[i * 3] = x + (Math.random() - 0.5) * 1.2;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 1.2;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 1.2;

        velocities.push({
          vx: (Math.random() - 0.5) * 18 * spd,
          vy: (Math.random() * 12 + 2) * spd,
          vz: (Math.random() - 0.5) * 18 * spd
        });
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: colorHex,
        size: 0.48,
        transparent: true,
        opacity: 1.0
      });
      const points = new THREE.Points(geo, mat);
      this.scene.add(points);

      this.particleBursts.push({
        points,
        geo,
        mat,
        velocities,
        age: 0,
        maxAge: 0.75
      });
    },

    /**
     * 1) Builds a 3D Giant Round Super Bomb (동그란 폭탄) with spherical core, top fuse cap, burning spark, and hazard ring!
     */
    _createBombProjectileMesh: function (scale, mainColorHex) {
      const THREE = global.THREE;
      const bombGroup = new THREE.Group();
      const s = scale || 1.0;

      // 1. Round Bomb Spherical Core Body
      const coreGeo = new THREE.SphereGeometry(0.88 * s, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x161224,
        emissive: mainColorHex || 0xff1e42,
        emissiveIntensity: 0.68,
        roughness: 0.22,
        metalness: 0.72
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      bombGroup.add(coreMesh);

      // 2. Top Cylindrical Fuse Cap & Glowing Spark Ball
      const capGeo = new THREE.CylinderGeometry(0.28 * s, 0.34 * s, 0.35 * s, 12);
      const capMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.set(0, 0.88 * s, 0);
      bombGroup.add(capMesh);

      const sparkGeo = new THREE.SphereGeometry(0.32 * s, 10, 10);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
      sparkMesh.position.set(0, 1.22 * s, 0);
      bombGroup.add(sparkMesh);

      // 3. Glowing Hazard Ring around Bomb Equator
      const ringGeo = new THREE.TorusGeometry(0.92 * s, 0.13 * s, 8, 22);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      bombGroup.add(ringMesh);

      // 4. 4 Cross Tail Stabilizer Fins
      const finGeo = new THREE.BoxGeometry(1.7 * s, 0.16 * s, 0.58 * s);
      const finMat = new THREE.MeshBasicMaterial({ color: mainColorHex || 0xff1e42 });
      const finA = new THREE.Mesh(finGeo, finMat);
      finA.position.set(0, 0, 0.62 * s);
      const finB = new THREE.Mesh(finGeo, finMat);
      finB.rotation.z = Math.PI / 2;
      finB.position.set(0, 0, 0.62 * s);
      bombGroup.add(finA, finB);

      // 5. Blazing Rear Rocket Thruster Flame Cone (+Z)
      const flameGeo = new THREE.ConeGeometry(0.54 * s, 1.75 * s, 10);
      flameGeo.rotateX(Math.PI / 2);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xff9900,
        transparent: true,
        opacity: 0.95
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, 0, 1.32 * s);
      bombGroup.add(flameMesh);

      return {
        group: bombGroup,
        disposables: [coreGeo, coreMat, capGeo, capMat, sparkGeo, sparkMat, ringGeo, ringMat, finGeo, finMat, flameGeo, flameMat]
      };
    },

    /**
     * 2) Builds a 3D Supersonic Ballistic Cruise Missile (탄도미사일) with long cylindrical fuselage,
     * sharp conical warhead, hazard bands, 4 swept delta fins + canards, and roaring afterburner jet!
     */
    _createBallisticMissileMesh: function (scale, bodyColorHex, noseColorHex) {
      const THREE = global.THREE;
      const missileGroup = new THREE.Group();
      const s = scale || 1.0;

      // 1. Sleek Cylindrical Missile Fuselage along Z axis
      const bodyGeo = new THREE.CylinderGeometry(0.32 * s, 0.36 * s, 2.9 * s, 14);
      bodyGeo.rotateX(Math.PI / 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColorHex || 0xf8fafc,
        emissive: bodyColorHex || 0x38bdf8,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.78
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      missileGroup.add(bodyMesh);

      // 2. Sharp Pointed Warhead Nose Cone (-Z)
      const noseGeo = new THREE.ConeGeometry(0.34 * s, 1.25 * s, 14);
      noseGeo.rotateX(-Math.PI / 2);
      const noseMat = new THREE.MeshBasicMaterial({ color: noseColorHex || 0xff1744 });
      const noseMesh = new THREE.Mesh(noseGeo, noseMat);
      noseMesh.position.set(0, 0, -2.02 * s);
      missileGroup.add(noseMesh);

      // 3. Tactical Hazard Stripe Band
      const bandGeo = new THREE.CylinderGeometry(0.375 * s, 0.375 * s, 0.45 * s, 14);
      bandGeo.rotateX(Math.PI / 2);
      const bandMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.position.set(0, 0, -0.75 * s);
      missileGroup.add(bandMesh);

      // 4. 4 Rear Delta Tail Fins + 4 Forward Canard Fins
      const tailFinGeo = new THREE.BoxGeometry(1.65 * s, 0.1 * s, 0.78 * s);
      const canardGeo = new THREE.BoxGeometry(0.95 * s, 0.08 * s, 0.38 * s);
      const finMat = new THREE.MeshBasicMaterial({ color: noseColorHex || 0xff1744 });

      const tailA = new THREE.Mesh(tailFinGeo, finMat);
      tailA.position.set(0, 0, 1.05 * s);
      const tailB = new THREE.Mesh(tailFinGeo, finMat);
      tailB.rotation.z = Math.PI / 2;
      tailB.position.set(0, 0, 1.05 * s);

      const canardA = new THREE.Mesh(canardGeo, bandMat);
      canardA.position.set(0, 0, -1.05 * s);
      const canardB = new THREE.Mesh(canardGeo, bandMat);
      canardB.rotation.z = Math.PI / 2;
      canardB.position.set(0, 0, -1.05 * s);
      missileGroup.add(tailA, tailB, canardA, canardB);

      // 5. Roaring Dual-Stage Supersonic Afterburner Plume (+Z)
      const outerFlameGeo = new THREE.ConeGeometry(0.38 * s, 2.35 * s, 12);
      outerFlameGeo.rotateX(Math.PI / 2);
      const outerFlameMat = new THREE.MeshBasicMaterial({
        color: 0xff6d00,
        transparent: true,
        opacity: 0.92
      });
      const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
      outerFlame.position.set(0, 0, 2.45 * s);

      const innerFlameGeo = new THREE.ConeGeometry(0.22 * s, 1.55 * s, 10);
      innerFlameGeo.rotateX(Math.PI / 2);
      const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
      innerFlame.position.set(0, 0, 2.05 * s);
      missileGroup.add(outerFlame, innerFlame);

      return {
        group: missileGroup,
        disposables: [bodyGeo, bodyMat, noseGeo, noseMat, bandGeo, bandMat, tailFinGeo, canardGeo, finMat, outerFlameGeo, outerFlameMat, innerFlameGeo, innerFlameMat]
      };
    },

    /**
     * 3) Builds a 3D Pressurized Hydro Water Bomb / Splash Globe (슈퍼 물총 물폭탄)
     * with translucent aqua sphere, inner white foam bubble core, and swirling water splash rings!
     */
    _createWaterBalloonMesh: function (scale) {
      const THREE = global.THREE;
      const waterGroup = new THREE.Group();
      const s = scale || 1.0;

      // 1. Outer Glossy Aqua Water Sphere
      const outerGeo = new THREE.SphereGeometry(0.86 * s, 16, 16);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x0096c7,
        emissiveIntensity: 0.78,
        roughness: 0.08,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      waterGroup.add(outerMesh);

      // 2. Inner White/Cyan Pressurized Bubble Core
      const innerGeo = new THREE.SphereGeometry(0.52 * s, 12, 12);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xe0f7fa });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      waterGroup.add(innerMesh);

      // 3. Swirling Aqua Splash Rings
      const ringGeo = new THREE.TorusGeometry(0.98 * s, 0.13 * s, 8, 22);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x80ffdb,
        transparent: true,
        opacity: 0.92
      });
      const ringA = new THREE.Mesh(ringGeo, ringMat);
      const ringB = new THREE.Mesh(ringGeo, ringMat);
      ringB.rotation.x = Math.PI / 2;
      waterGroup.add(ringA, ringB);

      // 4. Pressurized Water Jet Tail Cone (+Z)
      const jetGeo = new THREE.ConeGeometry(0.55 * s, 1.85 * s, 10);
      jetGeo.rotateX(Math.PI / 2);
      const jetMat = new THREE.MeshBasicMaterial({
        color: 0x48cae4,
        transparent: true,
        opacity: 0.9
      });
      const jetMesh = new THREE.Mesh(jetGeo, jetMat);
      jetMesh.position.set(0, 0, 1.3 * s);
      waterGroup.add(jetMesh);

      return {
        group: waterGroup,
        disposables: [outerGeo, outerMat, innerGeo, innerMat, ringGeo, ringMat, jetGeo, jetMat]
      };
    },

    /**
     * 4) Builds a 3D Supernova Star Meteor (초신성 불꽃 메테오) with crystalline magma core and dual plasma rings!
     */
    _createMeteorProjectileMesh: function (scale) {
      const THREE = global.THREE;
      const meteorGroup = new THREE.Group();
      const s = scale || 1.0;

      const rockGeo = new THREE.IcosahedronGeometry(0.94 * s, 0);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0xffbe0b,
        emissive: 0xff0055,
        emissiveIntensity: 0.85,
        roughness: 0.3,
        metalness: 0.5
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      meteorGroup.add(rockMesh);

      const ringGeo = new THREE.TorusGeometry(1.18 * s, 0.13 * s, 8, 24);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const ring1 = new THREE.Mesh(ringGeo, ring1Mat);
      const ring2 = new THREE.Mesh(ringGeo, ring2Mat);
      ring2.rotation.y = Math.PI / 2;
      meteorGroup.add(ring1, ring2);

      return {
        group: meteorGroup,
        disposables: [rockGeo, rockMat, ringGeo, ring1Mat, ring2Mat]
      };
    },

    /**
     * Spawns a giant 3D Crossed Comic Hit-Marker (X-Burst) right on the Boss's chest on impact!
     */
    _spawnBossCrossHitMarker: function (pos, colorHex) {
      const THREE = global.THREE;
      if (!THREE || !this.scene) return;
      const barGeo = new THREE.BoxGeometry(4.2, 0.42, 0.42);
      const barMat = new THREE.MeshBasicMaterial({
        color: colorHex || 0xffe600,
        transparent: true,
        opacity: 0.98
      });

      const bar1 = new THREE.Mesh(barGeo, barMat);
      bar1.position.copy(pos);
      bar1.position.z += 1.2;
      bar1.rotation.z = Math.PI / 4;
      this.scene.add(bar1);

      const bar2 = new THREE.Mesh(barGeo.clone(), barMat.clone());
      bar2.position.copy(pos);
      bar2.position.z += 1.2;
      bar2.rotation.z = -Math.PI / 4;
      this.scene.add(bar2);

      this.activeLasers.push(
        { mesh: bar1, geo: barGeo, mat: barMat, isShockwave: true, age: 0, maxAge: 0.36 },
        { mesh: bar2, geo: bar2.geometry, mat: bar2.material, isShockwave: true, age: 0, maxAge: 0.36 }
      );
    },

    /**
     * Triggers a massive weapon-themed explosion + violent 3D stagger/squash/recoil when an attack slams into the Boss!
     */
    _triggerBombBossImpact: function (impactPos, attackType, isSecondaryChain) {
      const THREE = global.THREE;
      if (!THREE || !this.scene) return;

      const atkType = attackType || (this.lastBossAttackInfo && this.lastBossAttackInfo.type) || 'round_bomb';
      const pos = impactPos || (this.bossGroup
        ? new THREE.Vector3(this.bossGroup.position.x, this.bossGroup.position.y + 0.5, this.bossGroup.position.z + 1.8)
        : new THREE.Vector3(0, 3.3, -36));

      // Weapon-specific palette for Shockwave Sphere, Blast Rings, and Particles
      let sphereColor = 0xffaa00;
      let ring1Color = 0x00f3ff;
      let ring2Color = 0xff2a85;
      let pCol1 = 0xff5500;
      let pCol2 = 0xffe600;
      let pCol3 = 0x00f3ff;

      if (atkType === 'water_gun') {
        sphereColor = 0x00e5ff;
        ring1Color = 0xe0f7fa;
        ring2Color = 0x00b4d8;
        pCol1 = 0x00e5ff;
        pCol2 = 0x90e0ef;
        pCol3 = 0xffffff;
      } else if (atkType === 'mega_laser') {
        sphereColor = 0x00f3ff;
        ring1Color = 0xff007f;
        ring2Color = 0xffe600;
        pCol1 = 0x00f3ff;
        pCol2 = 0xff007f;
        pCol3 = 0xffffff;
      } else if (atkType === 'ballistic_missile') {
        sphereColor = 0xffea00;
        ring1Color = 0xff1744;
        ring2Color = 0xffffff;
        pCol1 = 0xff1744;
        pCol2 = 0xffea00;
        pCol3 = 0xffffff;
      } else if (atkType === 'meteor_hammer') {
        sphereColor = 0xff007f;
        ring1Color = 0xffe600;
        ring2Color = 0x00f3ff;
        pCol1 = 0xff007f;
        pCol2 = 0xffe600;
        pCol3 = 0x80ffdb;
      }

      const scaleFactor = isSecondaryChain ? 0.72 : 1.15;

      // 1. Expanding 3D Shockwave Sphere
      const shockGeo = new THREE.SphereGeometry(2.4 * scaleFactor, 16, 16);
      const shockMat = new THREE.MeshBasicMaterial({
        color: sphereColor,
        transparent: true,
        opacity: 0.94
      });
      const shockMesh = new THREE.Mesh(shockGeo, shockMat);
      shockMesh.position.copy(pos);
      this.scene.add(shockMesh);

      this.activeLasers.push({
        mesh: shockMesh,
        geo: shockGeo,
        mat: shockMat,
        isShockwave: true,
        age: 0,
        maxAge: isSecondaryChain ? 0.34 : 0.46
      });

      // 2. Dual Perpendicular Expanding Blast Rings
      const ringGeo1 = new THREE.TorusGeometry(2.8 * scaleFactor, 0.38 * scaleFactor, 10, 28);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: ring1Color,
        transparent: true,
        opacity: 0.96
      });
      const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
      ringMesh1.position.copy(pos);
      this.scene.add(ringMesh1);

      const ringGeo2 = new THREE.TorusGeometry(2.5 * scaleFactor, 0.32 * scaleFactor, 10, 28);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: ring2Color,
        transparent: true,
        opacity: 0.94
      });
      const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
      ringMesh2.position.copy(pos);
      ringMesh2.rotation.x = Math.PI / 2.4;
      ringMesh2.rotation.y = Math.PI / 5;
      this.scene.add(ringMesh2);

      this.activeLasers.push(
        { mesh: ringMesh1, geo: ringGeo1, mat: ringMat1, isShockwave: true, age: 0, maxAge: 0.48 },
        { mesh: ringMesh2, geo: ringGeo2, mat: ringMat2, isShockwave: true, age: 0, maxAge: 0.45 }
      );

      // 3. 3D Crossed X Hit-Marker on Boss
      this._spawnBossCrossHitMarker(pos, ring1Color);

      // 4. Violent 3D Boss Stagger, Knockback, Air-Pop, Spin-Yaw, Roll & Elastic Squash-and-Stretch!
      const sideSign = Math.random() < 0.5 ? 1 : -1;
      this.bossHitTimer = isSecondaryChain ? Math.max(this.bossHitTimer, 0.48) : 0.72;
      this.bossSquashTimer = isSecondaryChain ? Math.max(this.bossSquashTimer, 0.36) : 0.54;
      this.bossRecoilZ = isSecondaryChain ? Math.min(this.bossRecoilZ, -9.5) : -13.5;
      this.bossRecoilY = isSecondaryChain ? Math.max(this.bossRecoilY, 2.0) : 3.2;
      this.bossRecoilPitch = isSecondaryChain ? -0.65 : -0.92;
      this.bossRecoilYaw = sideSign * (isSecondaryChain ? 0.65 : 1.05);
      this.bossRecoilRoll = -sideSign * (isSecondaryChain ? 0.38 : 0.58);

      this.shakeIntensity = isSecondaryChain ? 0.78 : 1.08;
      this.shakeTimer = isSecondaryChain ? 0.32 : 0.48;
      this.cameraZoomPunch = isSecondaryChain ? 12.0 : 17.5;
      this.bossSpotlightTimer = Math.max(this.bossSpotlightTimer || 0, 0.95);

      if (this.bossImpactLight) {
        this.bossImpactLight.color.setHex(sphereColor);
        this.bossImpactLight.intensity = isSecondaryChain ? 6.5 : 9.0;
      }

      // 5. Exploding Roblox Bricks & High-Velocity Particle Fountain!
      const brickCnt = isSecondaryChain ? 28 : 64;
      this.spawnBrickExplosion(pos.x, pos.y, pos.z, brickCnt, true);
      this._spawnParticleBurst(pos.x, pos.y, pos.z, pCol1, isSecondaryChain ? 36 : 72, 2.2);
      this._spawnParticleBurst(pos.x, pos.y, pos.z, pCol2, isSecondaryChain ? 28 : 56, 1.9);
      this._spawnParticleBurst(pos.x, pos.y, pos.z, pCol3, isSecondaryChain ? 24 : 48, 1.7);

      // 6. Queue 2 secondary chain-detonations on the Boss's shoulders/hammer for BOOM-BOOM-BOOM impact!
      if (!isSecondaryChain && Array.isArray(this.bossChainExplosions)) {
        this.bossChainExplosions.push(
          { delay: 0.16, offsetX: -3.2, offsetY: 1.4, offsetZ: 0.6, attackType: atkType },
          { delay: 0.34, offsetX: 3.4, offsetY: -0.6, offsetZ: 1.0, attackType: atkType }
        );
      }

      if (global.SoundEngine && typeof global.SoundEngine.playBossHit === 'function') {
        global.SoundEngine.playBossHit(atkType);
      }
    },

    /**
     * Multi-Weapon Boss Attack Arsenal!
     * Cycles through:
     * 1) 🚀 Supersonic Ballistic Missile Salvo (초음속 다탄두 탄도미사일)
     * 2) 🔫💦 Super Soaker Hydro Water Gun Cannon (초강력 슈퍼 물총 대포)
     * 3) ⚡ Hyper Mega Plasma Laser Cannon & Orbital Strike (하이퍼 메가 레이저 캐논)
     * 4) 💣 Giant Round Super Bomb (특대형 동그란 슈퍼 폭탄)
     * 5) ☄️ Supernova Star Meteor Cannon (초신성 불꽃 메테오 캐논)
     */
    _fireLaserAtBoss: function (forcedType) {
      const THREE = global.THREE;
      if (!THREE || !this.scene || !this.bossGroup || !this.carGroup) return;

      const ARSENAL = [
        {
          type: 'ballistic_missile',
          name: '초음속 다탄두 탄도미사일',
          icon: '🚀💥',
          badgeTitle: '🚀 초음속 탄도미사일 보스 직격!! KABOOM!!',
          badgeSub: '🔥 3연장 다탄두 미사일 정밀 폭격!!',
          toastTitle: '🚀💥 초음속 다탄두 탄도미사일 발사 & 보스 직격!! KABOOM!!',
          tvMsg: '🚀 슈우웅―콰앙!! 이소윤 선수의 3연장 초음속 탄도미사일이 높은 궤적을 그리며 보스를 정밀 폭격했습니다!!'
        },
        {
          type: 'water_gun',
          name: '초강력 슈퍼 물총 대포',
          icon: '🔫💦🌊',
          badgeTitle: '🔫💦 초강력 슈퍼 물총 대포 강타!! SPLASH!!',
          badgeSub: '🌊 초고압 물줄기 & 특대형 물폭탄 직격!!',
          toastTitle: '🔫💦 초강력 슈퍼 물총 대포 발사 & 보스 물벼락 직격!! SPLASH!!',
          tvMsg: '🔫💦 쏴아아아―첨벙!! 이소윤 선수의 초고압 슈퍼 물총 대포와 특대형 물폭탄이 보스를 시원하게 날려버렸습니다!!'
        },
        {
          type: 'mega_laser',
          name: '하이퍼 메가 레이저 캐논',
          icon: '⚡🔦💥',
          badgeTitle: '⚡ 하이퍼 메가 레이저 보스 관통!! ZZZAP!!',
          badgeSub: '🔦 초고출력 플라즈마 & 우주 궤도 레이저!!',
          toastTitle: '⚡💥 하이퍼 메가 레이저 캐논 발사 & 보스 장갑 관통!! ZZZAP!!',
          tvMsg: '⚡ 지이이잉―번쩍!! 이소윤 선수의 초고출력 하이퍼 메가 레이저와 우주 궤도 광선이 보스를 뚫어버렸습니다!!'
        },
        {
          type: 'round_bomb',
          name: '특대형 동그란 슈퍼 폭탄',
          icon: '💣💥',
          badgeTitle: '💣 특대형 동그란 폭탄 보스 명중!! BOOM!!',
          badgeSub: '🔥 묵직한 초대형 화염 폭탄 대폭발!!',
          toastTitle: '💣💥 특대형 동그란 슈퍼 폭탄 투하 & 보스 명중!! BOOM!!',
          tvMsg: '💣 BOOM!! 이소윤 선수의 특대형 동그란 슈퍼 폭탄이 보스에게 정확히 박혀 대폭발을 일으켰습니다!!'
        },
        {
          type: 'meteor_hammer',
          name: '초신성 불꽃 메테오 캐논',
          icon: '☄️🌟💥',
          badgeTitle: '☄️ 초신성 불꽃 메테오 보스 강타!! CRASH!!',
          badgeSub: '🌟 우주 초신성 운석 폭격 대성공!!',
          toastTitle: '☄️💥 초신성 불꽃 메테오 발사 & 보스 대폭발!! CRASH!!',
          tvMsg: '☄️ 쿠구구궁!! 하늘에서 소환된 이소윤 선수의 초신성 불꽃 메테오가 보스를 정면으로 덮쳤습니다!!'
        }
      ];

      let chosen = null;
      if (forcedType) {
        chosen = ARSENAL.find((a) => a.type === forcedType) || null;
      }
      if (!chosen) {
        const idx = (this.bossAttackCycleIndex || 0) % ARSENAL.length;
        chosen = ARSENAL[idx];
        this.bossAttackCycleIndex = idx + 1;
      }
      this.lastBossAttackInfo = chosen;

      // Make Soyun cheer & Pet spin on every boss attack launch!
      this.avatarCheerTimer = 0.85;
      this.petSpinTimer = 0.85;

      const kartStart = new THREE.Vector3(
        this.carGroup.position.x,
        1.45,
        this.carGroup.position.z - 1.2
      );
      const petStart = new THREE.Vector3(
        this.carGroup.position.x + 1.65,
        2.2,
        this.carGroup.position.z + 0.2
      );
      const endPos = new THREE.Vector3(
        this.bossGroup.position.x,
        this.bossGroup.position.y + 0.5,
        this.bossGroup.position.z + 1.8
      );

      // Helper to spawn a 3D beam cylinder from startVec to targetVec
      const spawnBeam = (startVec, targetVec, colorHex, r1, r2, opacity, maxAge) => {
        const dist = startVec.distanceTo(targetVec);
        const beamGeo = new THREE.CylinderGeometry(r1, r2, dist, 12);
        beamGeo.rotateX(Math.PI / 2);
        const beamMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: opacity || 0.9
        });
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        beamMesh.position.copy(startVec).lerp(targetVec, 0.5);
        beamMesh.lookAt(targetVec);
        this.scene.add(beamMesh);
        this.activeLasers.push({
          mesh: beamMesh,
          geo: beamGeo,
          mat: beamMat,
          age: 0,
          maxAge: maxAge || 0.36
        });
      };

      if (chosen.type === 'ballistic_missile') {
        // 🚀 WEAPON 1: 3-Warhead Supersonic Ballistic Cruise Missile Salvo (High ICBM Arc + Left/Right Flanking Missiles)
        const mainMissile = this._createBallisticMissileMesh(1.48, 0xf8fafc, 0xff1744);
        mainMissile.group.position.copy(kartStart);
        this.scene.add(mainMissile.group);
        this.activeProjectiles.push({
          group: mainMissile.group,
          disposables: mainMissile.disposables,
          startPos: kartStart.clone(),
          endPos: endPos.clone(),
          arcHeight: 14.5,
          sideArcX: 0,
          spinSpeed: 10,
          trailColor: 0xffaa00,
          attackType: 'ballistic_missile',
          age: 0,
          duration: 0.40,
          isPrimaryBomb: true
        });

        const leftMissile = this._createBallisticMissileMesh(1.05, 0x00f3ff, 0xffe600);
        leftMissile.group.position.copy(kartStart);
        this.scene.add(leftMissile.group);
        this.activeProjectiles.push({
          group: leftMissile.group,
          disposables: leftMissile.disposables,
          startPos: kartStart.clone(),
          endPos: endPos.clone().add(new THREE.Vector3(-1.8, 0.6, 0)),
          arcHeight: 9.8,
          sideArcX: -6.5,
          spinSpeed: 14,
          trailColor: 0x00f3ff,
          attackType: 'ballistic_missile',
          age: 0,
          duration: 0.44,
          isPrimaryBomb: false
        });

        const rightMissile = this._createBallisticMissileMesh(1.05, 0xff2a85, 0xffe600);
        rightMissile.group.position.copy(petStart);
        this.scene.add(rightMissile.group);
        this.activeProjectiles.push({
          group: rightMissile.group,
          disposables: rightMissile.disposables,
          startPos: petStart.clone(),
          endPos: endPos.clone().add(new THREE.Vector3(1.8, 0.6, 0)),
          arcHeight: 9.8,
          sideArcX: 6.5,
          spinSpeed: 14,
          trailColor: 0xff2a85,
          attackType: 'ballistic_missile',
          age: 0,
          duration: 0.46,
          isPrimaryBomb: false
        });

        // Red Target-Lock Designator Laser
        spawnBeam(kartStart, endPos, 0xff1744, 0.12, 0.22, 0.85, 0.34);
      } else if (chosen.type === 'water_gun') {
        // 🔫💦 WEAPON 2: Super Soaker Hydro Water Cannon Stream + 3 Giant Aqua Water Bombs!
        spawnBeam(kartStart, endPos, 0xffffff, 0.28, 0.48, 0.96, 0.46);
        spawnBeam(kartStart, endPos, 0x00e5ff, 0.62, 1.15, 0.78, 0.50);
        spawnBeam(petStart, endPos, 0x80ffdb, 0.32, 0.58, 0.88, 0.46);

        // 6 Swirling Water Vortex Rings along the pressurized hydro stream
        for (let r = 1; r <= 6; r++) {
          const frac = r / 7;
          const ringPos = kartStart.clone().lerp(endPos, frac);
          const wRingGeo = new THREE.TorusGeometry(0.65 + frac * 1.1, 0.16, 8, 20);
          const wRingMat = new THREE.MeshBasicMaterial({
            color: r % 2 === 0 ? 0xffffff : 0x00e5ff,
            transparent: true,
            opacity: 0.92
          });
          const wRingMesh = new THREE.Mesh(wRingGeo, wRingMat);
          wRingMesh.position.copy(ringPos);
          wRingMesh.lookAt(endPos);
          this.scene.add(wRingMesh);
          this.activeLasers.push({
            mesh: wRingMesh,
            geo: wRingGeo,
            mat: wRingMat,
            isShockwave: true,
            age: 0,
            maxAge: 0.42
          });
        }

        // 3-Salvo Giant Aqua Water Balloons
        const mainWater = this._createWaterBalloonMesh(1.45);
        mainWater.group.position.copy(kartStart);
        this.scene.add(mainWater.group);
        this.activeProjectiles.push({
          group: mainWater.group,
          disposables: mainWater.disposables,
          startPos: kartStart.clone(),
          endPos: endPos.clone(),
          arcHeight: 4.8,
          sideArcX: 0,
          spinSpeed: 18,
          trailColor: 0x00e5ff,
          attackType: 'water_gun',
          age: 0,
          duration: 0.30,
          isPrimaryBomb: true
        });

        [-3.8, 3.8].forEach((sideX, idx) => {
          const subWater = this._createWaterBalloonMesh(1.05);
          subWater.group.position.copy(idx === 0 ? kartStart : petStart);
          this.scene.add(subWater.group);
          this.activeProjectiles.push({
            group: subWater.group,
            disposables: subWater.disposables,
            startPos: (idx === 0 ? kartStart : petStart).clone(),
            endPos: endPos.clone(),
            arcHeight: 6.2,
            sideArcX: sideX,
            spinSpeed: 20,
            trailColor: 0x90e0ef,
            attackType: 'water_gun',
            age: 0,
            duration: 0.36 + idx * 0.04,
            isPrimaryBomb: false
          });
        });
      } else if (chosen.type === 'mega_laser') {
        // ⚡ WEAPON 3: Hyper Mega Plasma Laser Cannon + Vertical Sky Orbital Ion Pillar!
        spawnBeam(kartStart, endPos, 0xffffff, 0.45, 0.62, 0.98, 0.52);
        spawnBeam(kartStart, endPos, 0x00f3ff, 1.05, 1.45, 0.72, 0.56);
        spawnBeam(petStart, endPos, 0xff007f, 0.52, 0.78, 0.90, 0.52);

        // Sky-to-Boss Vertical Orbital Satellite Laser Pillar!
        const skyTop = new THREE.Vector3(endPos.x, endPos.y + 26, endPos.z);
        spawnBeam(skyTop, endPos, 0xffffff, 0.65, 0.85, 0.98, 0.50);
        spawnBeam(skyTop, endPos, 0x00ffcc, 1.55, 2.1, 0.68, 0.55);

        // 7 Expanding Plasma Accelerator Rings along the Mega Laser shaft
        for (let r = 1; r <= 7; r++) {
          const frac = r / 8;
          const ringPos = kartStart.clone().lerp(endPos, frac);
          const lRingGeo = new THREE.TorusGeometry(0.85 + frac * 1.2, 0.2, 8, 24);
          const lRingMat = new THREE.MeshBasicMaterial({
            color: r % 3 === 0 ? 0xffe600 : (r % 2 === 0 ? 0xff007f : 0x00f3ff),
            transparent: true,
            opacity: 0.95
          });
          const lRingMesh = new THREE.Mesh(lRingGeo, lRingMat);
          lRingMesh.position.copy(ringPos);
          lRingMesh.lookAt(endPos);
          this.scene.add(lRingMesh);
          this.activeLasers.push({
            mesh: lRingMesh,
            geo: lRingGeo,
            mat: lRingMat,
            isShockwave: true,
            age: 0,
            maxAge: 0.46
          });
        }

        // Laser hits at light speed! Trigger immediate full Boss Impact!
        this._triggerBombBossImpact(endPos.clone(), 'mega_laser', false);
      } else if (chosen.type === 'meteor_hammer') {
        // ☄️ WEAPON 5: Supernova Star Meteor Cannon hurled from high above!
        const highStart = kartStart.clone().add(new THREE.Vector3(0, 3.8, 1.5));
        const mainMeteor = this._createMeteorProjectileMesh(1.52);
        mainMeteor.group.position.copy(highStart);
        this.scene.add(mainMeteor.group);
        this.activeProjectiles.push({
          group: mainMeteor.group,
          disposables: mainMeteor.disposables,
          startPos: highStart,
          endPos: endPos.clone(),
          arcHeight: 11.2,
          sideArcX: 0,
          spinSpeed: 28,
          trailColor: 0xffe600,
          attackType: 'meteor_hammer',
          age: 0,
          duration: 0.36,
          isPrimaryBomb: true
        });

        [-4.5, 4.5].forEach((sideX, idx) => {
          const subMeteor = this._createMeteorProjectileMesh(0.95);
          subMeteor.group.position.copy(petStart);
          this.scene.add(subMeteor.group);
          this.activeProjectiles.push({
            group: subMeteor.group,
            disposables: subMeteor.disposables,
            startPos: petStart.clone(),
            endPos: endPos.clone(),
            arcHeight: 8.5,
            sideArcX: sideX,
            spinSpeed: 32,
            trailColor: 0xff007f,
            attackType: 'meteor_hammer',
            age: 0,
            duration: 0.40 + idx * 0.04,
            isPrimaryBomb: false
          });
        });

        spawnBeam(kartStart, endPos, 0xffbe0b, 0.22, 0.38, 0.85, 0.34);
      } else {
        // 💣 WEAPON 4: Classic Giant Round Super Bomb + Pet Round Bomb!
        const mainBomb = this._createBombProjectileMesh(1.48, 0xff1e42);
        mainBomb.group.position.copy(kartStart);
        this.scene.add(mainBomb.group);

        this.activeProjectiles.push({
          group: mainBomb.group,
          disposables: mainBomb.disposables,
          startPos: kartStart.clone(),
          endPos: endPos.clone(),
          arcHeight: 7.2,
          sideArcX: 0,
          spinSpeed: 24,
          trailColor: 0xff9900,
          attackType: 'round_bomb',
          age: 0,
          duration: 0.34,
          isPrimaryBomb: true
        });

        const petBomb = this._createBombProjectileMesh(0.95, 0xff2a85);
        petBomb.group.position.copy(petStart);
        this.scene.add(petBomb.group);

        this.activeProjectiles.push({
          group: petBomb.group,
          disposables: petBomb.disposables,
          startPos: petStart.clone(),
          endPos: endPos.clone(),
          arcHeight: 5.4,
          sideArcX: 2.6,
          spinSpeed: 26,
          trailColor: 0xff2a85,
          attackType: 'round_bomb',
          age: 0,
          duration: 0.37,
          isPrimaryBomb: false
        });

        spawnBeam(kartStart, endPos, 0x00f3ff, 0.20, 0.34, 0.85, 0.30);
        spawnBeam(petStart, endPos, 0xff2a85, 0.16, 0.28, 0.85, 0.30);
      }

      // Immediate launch recoil + muzzle blast + 1.35s Boss Camera Spotlight!
      this.bossSpotlightTimer = Math.max(this.bossSpotlightTimer || 0, 1.35);
      if (this.bossImpactLight) {
        this.bossImpactLight.color.setHex(chosen.type === 'water_gun' ? 0x00e5ff : 0xffe600);
        this.bossImpactLight.intensity = 6.5;
      }
      this.bossHitTimer = Math.max(this.bossHitTimer, 0.55);
      this.bossSquashTimer = Math.max(this.bossSquashTimer, 0.32);
      this.bossRecoilZ = Math.min(this.bossRecoilZ, -2.2);
      this.bossRecoilY = Math.max(this.bossRecoilY, 0.32);
      this.bossRecoilPitch = -0.48;
      this.bossRecoilYaw = (Math.random() < 0.5 ? 1 : -1) * 0.52;
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.72);
      this.shakeTimer = Math.max(this.shakeTimer, 0.36);
      this.cameraZoomPunch = Math.max(this.cameraZoomPunch, 12.5);

      this.spawnBrickExplosion(endPos.x, endPos.y, endPos.z, 34, true);
      this._spawnParticleBurst(kartStart.x, kartStart.y, kartStart.z, chosen.type === 'water_gun' ? 0x00e5ff : 0xffe600, 32, 1.35);

      return chosen;
    },

    /**
     * Trigger massive Roblox Brick Shatter, FOV Zoom Punch, and Soyun + Pet celebration on correct answer!
     */
    triggerCorrectEffect: function (laneX) {
      const x = typeof laneX === 'number' ? laneX : this.carGroup ? this.carGroup.position.x : 0;
      const z = getCfg().GATE_PASS_Z;

      this.boostEffectTimer = 0.55;
      this.avatarCheerTimer = 0.65;
      this.petSpinTimer = 0.75;

      // Energetic Camera FOV Zoom Punch & Impact Shake ("타격감"!)
      this.cameraZoomPunch = 10.5;
      this.shakeIntensity = 0.42;
      this.shakeTimer = 0.24;

      // Burst 44+ 3D colorful Roblox Bricks + Golden Robux Coins out of the smashed gate!
      this.spawnBrickExplosion(x, 1.8, z - 1.2, 44, false);

      this._spawnParticleBurst(x, 1.6, z - 1.0, 0x00ff9d, 42, 1.25);
      this._spawnParticleBurst(x, 2.2, z - 1.5, 0xffe600, 32, 1.15);
      return this;
    },

    triggerBoostEffect: function () {
      return this.triggerCorrectEffect();
    },

    /**
     * Trigger camera shake, red car flash, 3D car hurt spin/wobble, and hazard impact particles on wrong answer or obstacle crash!
     */
    triggerDamageEffect: function (laneX, hazardType) {
      const THREE = global.THREE;
      const x = typeof laneX === 'number' ? laneX : this.carGroup ? this.carGroup.position.x : 0;
      const z = getCfg().GATE_PASS_Z;
      this.shakeIntensity = 0.96;
      this.shakeTimer = 0.54;
      this.damageFlashTimer = 0.88;
      this.carHurtTimer = 0.88;
      this.carHurtType = hazardType || 'block';
      this.cameraZoomPunch = -8.5;

      // Knock the car upward in a painful crash bounce!
      this.carJumpY = Math.max(this.carJumpY || 0, 1.15);
      this.carJumpVel = 8.8;

      if (THREE && typeof this._spawnBossCrossHitMarker === 'function') {
        this._spawnBossCrossHitMarker(
          new THREE.Vector3(x, 1.75, z - 0.5),
          hazardType === 'wide_fire' ? 0xff5500 : 0xff0044
        );
      }

      this.spawnBrickExplosion(x, 1.5, z - 0.8, 30, false);
      this._spawnParticleBurst(x, 1.4, z - 0.8, 0xff0044, 58, 1.55);
      this._spawnParticleBurst(x, 1.8, z - 0.5, 0xff6d00, 44, 1.35);
      this._spawnParticleBurst(x, 2.1, z - 0.3, 0x222222, 28, 1.1);
      return this;
    },

    /**
     * Trigger celebratory multi-burst fireworks & Roblox Brick fountain on stage clear
     */
    triggerStageClearEffect: function () {
      this.stageClearTimer = 1.2;
      this.boostEffectTimer = 1.0;
      this.avatarCheerTimer = 1.2;
      this.petSpinTimer = 1.2;
      this.spawnBrickExplosion(0, 3.5, -6, 50, true);
      this._spawnParticleBurst(-5, 5, -15, 0x00f3ff, 50, 1.6);
      this._spawnParticleBurst(5, 6, -18, 0xff007f, 50, 1.6);
      this._spawnParticleBurst(0, 7, -12, 0xffe600, 60, 1.8);
      return this;
    },

    /**
     * Spawn Stage Boss Mecha at BOSS_Z = -38, y = 2.8
     */
    spawnBoss: function (stageConfig) {
      if (!this.isInitialized) this.init();
      this.isBossActive = true;
      this.bossDefeating = false;
      this.bossHpRatio = 1.0;
      this.bossHitTimer = 0;
      this.bossRecoilZ = 0;
      this.bossRecoilY = 0;
      this.bossRecoilPitch = 0;
      this.bossRecoilYaw = 0;
      this.bossRecoilRoll = 0;
      this.bossSquashTimer = 0;
      this.bossFinisherSlowMoTimer = 0;
      this.isVictoryCruise = false;
      this.bossFinisherQueue = [];
      this.bossChainExplosions = [];

      // Switch 3D background to Hell & Erupting Lava theme!
      this._applyBossHellEnvironment(true);

      if (this.bossGroup) {
        this.bossGroup.visible = true;
        this.bossGroup.position.set(0, 2.8, getCfg().BOSS_Z - 26);
        this.bossGroup.rotation.set(0, 0, 0);
        this.bossGroup.scale.set(1, 1, 1);
      }

      if (stageConfig && this.bossArmorMat) {
        const tint = parseColorHex(
          stageConfig.bossColor || stageConfig.color || stageConfig.themeColor,
          this.currentTheme.secondary
        );
        this.bossArmorMat.emissive.setHex(tint);
        if (this.bossRing2 && this.bossRing2.material) {
          this.bossRing2.material.color.setHex(tint);
        }
      }

      this._updateBossHpBar(1.0);
      return this;
    },

    /**
     * Damage the active Stage Boss and fire multi-weapon attack arsenal
     */
    damageBoss: function (newHpRatio) {
      if (!this.isBossActive && this.bossGroup) {
        this.isBossActive = true;
        this.bossGroup.visible = true;
      }

      if (typeof newHpRatio === 'number') {
        this.bossHpRatio = Math.max(0, Math.min(1, newHpRatio));
      } else {
        this.bossHpRatio = Math.max(0, this.bossHpRatio - 0.25);
      }

      this._updateBossHpBar(this.bossHpRatio);

      const now = performance.now();
      if (now - this.lastAutoLaserTime > 120) {
        this._fireLaserAtBoss();
      } else {
        this.bossHitTimer = Math.max(this.bossHitTimer, 0.58);
      }
      return this;
    },

    _updateBossHpBar: function (ratio) {
      if (!this.bossHpFillMesh) return;
      const clamped = Math.max(0.001, Math.min(1, ratio));
      this.bossHpFillMesh.scale.x = clamped;
      this.bossHpFillMesh.position.x = -3.6 * (1 - clamped);
      if (clamped > 0.5) {
        this.bossHpFillMesh.material.color.setHex(0x00ff9d);
      } else if (clamped > 0.25) {
        this.bossHpFillMesh.material.color.setHex(0xffbe0b);
      } else {
        this.bossHpFillMesh.material.color.setHex(0xff0055);
      }
    },

    /**
     * Trigger 8-Second Slow-Motion All-Out Overwhelming Firepower Finisher Barrage on Boss when HP reaches 0!
     * Fires all 5 special weapons (Ballistic Missiles, Water Gun, Mega Laser, Round Bomb, Meteor) in rapid waves
     * in dramatic cinematic slow-motion (~0.36x time scale), culminating in the massive Boss supernova explosion!
     */
    triggerBossFinisherBarrage: function () {
      this._updateBossHpBar(0);
      this.bossDefeating = false;
      this.isVictoryCruise = false;
      this.bossFinisherSlowMoTimer = 8.0; // Exact 8.0s Slow-Motion Boss Finisher Barrage
      this.bossSpotlightTimer = 8.0;
      this.avatarCheerTimer = 8.0;
      this.petSpinTimer = 8.0;
      this.boostEffectTimer = 8.0;

      this.bossFinisherQueue = [
        { delay: 0.15, weapon: 'ballistic_missile' },
        { delay: 0.65, weapon: 'water_gun' },
        { delay: 1.15, weapon: 'mega_laser' },
        { delay: 1.65, weapon: 'round_bomb' },
        { delay: 2.15, weapon: 'meteor_hammer' },
        { delay: 2.65, weapon: 'ballistic_missile' },
        { delay: 3.15, weapon: 'water_gun' },
        { delay: 3.65, weapon: 'mega_laser' },
        { delay: 4.15, weapon: 'round_bomb' },
        { delay: 4.65, weapon: 'meteor_hammer' },
        { delay: 5.15, weapon: 'ballistic_missile' },
        { delay: 5.65, weapon: 'water_gun' },
        { delay: 6.10, weapon: 'mega_laser' },
        { delay: 6.50, weapon: 'round_bomb' },
        { delay: 6.85, weapon: 'meteor_hammer', isFinale: true }
      ];
      return this;
    },

    /**
     * Starts a calm, peaceful Victory Cruise animation after the 5-second slow-motion Boss finisher
     * that continues until the player clicks once to open the Boss Clear popup!
     */
    startGentleVictoryCruise: function () {
      this.hideBoss();
      this.bossFinisherSlowMoTimer = 0;
      this.bossSpotlightTimer = 0;
      this.shakeTimer = 0;
      this.cameraZoomPunch = 0;
      this.isVictoryCruise = true;
      this.victorySparkleTimer = 0.2;
      this.setLane(1);
      this.setSpeed(26);
      return this;
    },

    stopVictoryCruise: function () {
      this.isVictoryCruise = false;
      return this;
    },

    /**
     * Trigger dramatic multi-burst Boss defeat sequence with massive Roblox Brick explosion
     */
    defeatBoss: function (onComplete) {
      this._updateBossHpBar(0);
      this.bossDefeating = true;
      this.bossDefeatTimer = 0;
      this.bossDefeatCallback = typeof onComplete === 'function' ? onComplete : null;
      this.bossChainExplosions = [];
      this.bossFinisherQueue = [];

      if (this.bossGroup) {
        const bx = this.bossGroup.position.x;
        const by = this.bossGroup.position.y;
        const bz = this.bossGroup.position.z;
        this.spawnBrickExplosion(bx, by + 1, bz + 2, 110, true);
        this._spawnParticleBurst(bx, by, bz, 0xff0055, 95, 2.5);
        this._spawnParticleBurst(bx - 3, by + 1, bz + 2, 0xffe600, 80, 2.2);
        this._spawnParticleBurst(bx + 3, by - 1, bz + 2, 0x00f3ff, 80, 2.2);
      }

      if (global.SoundEngine && typeof global.SoundEngine.playBossDefeat === 'function') {
        global.SoundEngine.playBossDefeat();
      }

      this.shakeIntensity = 1.15;
      this.shakeTimer = 0.85;
      this.cameraZoomPunch = 18.0;
      return this;
    },

    /**
     * Hide/remove Boss immediately
     */
    hideBoss: function () {
      this.isBossActive = false;
      this.bossDefeating = false;
      this.bossFinisherSlowMoTimer = 0;
      this.bossDefeatCallback = null;
      this.bossChainExplosions = [];
      this.bossFinisherQueue = [];
      if (this.bossGroup) {
        this.bossGroup.visible = false;
      }
      this._applyBossHellEnvironment(false);
      while (this.activeProjectiles && this.activeProjectiles.length > 0) {
        const p = this.activeProjectiles.pop();
        if (p && p.group && this.scene) {
          this.scene.remove(p.group);
        }
        if (p && Array.isArray(p.disposables)) {
          p.disposables.forEach((d) => d && d.dispose && d.dispose());
        }
      }
      return this;
    },

    isBossSpawned: function () {
      return Boolean(this.isBossActive && this.bossGroup && this.bossGroup.visible);
    },

    /**
     * Computes portrait factor (0 on desktop/landscape, up to 1 on narrow mobile portrait screens)
     * Respects explicit user selection ('portrait' | 'landscape' | 'auto')
     */
    _getPortraitFactor: function () {
      if (this.viewOrientationMode === 'portrait') {
        return 0.96;
      }
      if (this.viewOrientationMode === 'landscape') {
        return 0.0;
      }
      const aspect = (this.camera && this.camera.aspect) ? this.camera.aspect : 1.77;
      return Math.max(0, Math.min(1, (1.15 - aspect) / 0.72));
    },

    /**
     * Computes adaptive 3D gate scale at normalized progress (0.0 at spawn -> 1.0 at player pass)
     * Ensures 3-lane signboards are huge from the start AND never clip horizontally on portrait phones.
     */
    _getAdaptiveGateScale: function (_progress) {
      const pf = this._getPortraitFactor();
      return Math.max(0.94, 1.0 - pf * 0.05);
    },

    /**
     * Handle window / container resize & mobile orientation changes
     */
    resize: function () {
      if (!this.container || !this.camera) return;
      const width = this.container.clientWidth || global.innerWidth || 1280;
      const height = this.container.clientHeight || global.innerHeight || 720;
      this.camera.aspect = width / Math.max(1, height);
      const pf = this._getPortraitFactor();
      this.camera.fov = 50 + pf * 12;
      this.camera.position.y = 4.5 + pf * 1.1;
      this.camera.position.z = 16.5 + pf * 5.0;
      this.camera.updateProjectionMatrix();
      if (this.renderer) {
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, width < 768 ? 1.75 : 2));
      }
    },

    /**
     * Render a single frame (useful when paused or right after init)
     */
    renderSingleFrame: function () {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    /**
     * Enables or disables live 3D attract/demo animation on the Main Screen
     * @param {boolean} enabled
     */
    setDemoMode: function (enabled) {
      this.isDemoMode = Boolean(enabled);
      if (this.isDemoMode) {
        this.demoTimer = 0.7;
        this.setPaused(false);
      }
      return this;
    },

    /**
     * Main 60fps animation & physics update loop
     */
    _animate: function () {
      if (!this.isRunning) {
        this.rafId = null;
        return;
      }
      this.rafId = requestAnimationFrame(() => this._animate());

      const rawDt = this.clock ? this.clock.getDelta() : 0.016;
      const dt = Math.min(rawDt, 0.08);

      if (!this.isPaused) {
        try { this.update(dt); } catch (_err) { console.warn("[Engine3D] update error:", _err); }
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    /**
     * Step physics, scrolling highway, Soyun avatar, pet, gates, boss, bricks, and camera by dt seconds
     */
    update: function (dt) {
      const realDt = dt;
      if (this.bossFinisherSlowMoTimer && this.bossFinisherSlowMoTimer > 0) {
        this.bossFinisherSlowMoTimer = Math.max(0, this.bossFinisherSlowMoTimer - realDt);
        dt = realDt * 0.36; // Cinematic Slow-Motion (0.36x time scale) for Boss Finisher Barrage!
      }
      const cfg = getCfg();
      const lanes = cfg.LANES;
      this.elapsedTime += dt;

      // Live Demo Animation on the Main Title Screen (automatic lane weaving, 3D jumps & sparkles!)
      if (this.isDemoMode && this.activeGates.length === 0 && this.activeObbyWaves.length === 0) {
        this.demoTimer -= dt;
        if (this.demoTimer <= 0) {
          this.demoTimer = 1.6 + Math.random() * 0.9;
          const nextLane = (this.targetLane + 1 + Math.floor(Math.random() * 2)) % 3;
          this.setLane(nextLane);
          this.avatarCheerTimer = 0.95;
          this.petSpinTimer = 0.85;
          if (Math.random() < 0.6) {
            this.jump();
          }
          const lx = lanes[nextLane] || 0;
          this._spawnParticleBurst(lx, 1.4, cfg.GATE_PASS_Z - 2, 0x00f3ff, 18, 0.9);
        }
      }

      // Calm & Gentle Victory Cruise Animation after 5s Boss Finisher (continues until player clicks!)
      if (this.isVictoryCruise) {
        this.avatarCheerTimer = Math.max(this.avatarCheerTimer, 0.5);
        this.victorySparkleTimer = (this.victorySparkleTimer || 0) - dt;
        if (this.victorySparkleTimer <= 0) {
          this.victorySparkleTimer = 0.45;
          const gentleColors = [0xffe600, 0x00ffaa, 0x88e5ff, 0xff99cc];
          const col = gentleColors[Math.floor(Math.random() * gentleColors.length)];
          const sx = (this.carGroup ? this.carGroup.position.x : 0) + (Math.random() - 0.5) * 7.0;
          const sy = 1.6 + Math.random() * 2.2;
          const sz = cfg.GATE_PASS_Z - 4 - Math.random() * 14;
          this._spawnParticleBurst(sx, sy, sz, col, 10, 1.2);
        }
      }

      // Smooth speed interpolation
      this.currentSpeed += (this.targetSpeed - this.currentSpeed) * Math.min(1, dt * 6);
      // Gate travel speed: distance is 82 units (-74 to +8).
      // At Stage 1 (36 KM/H), gateSpeedUnitsPerSec = 36 * 0.24 = 8.64 units/s -> 9.49 seconds per question (3.06x old 3.1s time!).
      // At Max Stage (53 KM/H), gateSpeedUnitsPerSec = 53 * 0.24 = 12.72 units/s -> 6.45 seconds (strictly > 2x old 3.1s time!).
      const gateSpeedUnitsPerSec = this.currentSpeed * 0.24;
      const worldUnitsPerSec = gateSpeedUnitsPerSec * 2.1;

      // Advance S-Curve phase so the road winds smoothly left and right as Soyun drives!
      this.roadCurvePhase = (this.roadCurvePhase || 0) + dt * 0.54;
      this._updateRoadCurveGeometry();

      // 1. Scroll Road Lane Dashes, Studded Curbs & Roadside Multi-Biome Scenery (following the curving road!)
      for (let i = 0; i < this.laneDashMeshes.length; i++) {
        const dash = this.laneDashMeshes[i];
        dash.position.z += worldUnitsPerSec * dt;
        if (dash.position.z > 28) {
          dash.position.z -= 240;
        }
        if (dash.userData && typeof dash.userData.baseX === 'number') {
          const z = dash.position.z;
          const wf = 1;
          const curveX = this._getRoadCurveX(z);
          const slope = this._getRoadCurveSlope(z);
          dash.position.x = dash.userData.baseX * wf + curveX;
          dash.rotation.z = -Math.atan(slope);
        }
      }

      for (let i = 0; i < this.curbMeshes.length; i++) {
        const curb = this.curbMeshes[i];
        curb.position.z += worldUnitsPerSec * dt;
        if (curb.position.z > 28) {
          curb.position.z -= 240;
        }
        if (curb.userData && typeof curb.userData.baseX === 'number') {
          const z = curb.position.z;
          const wf = 1;
          const curveX = this._getRoadCurveX(z);
          const slope = this._getRoadCurveSlope(z);
          curb.position.x = curb.userData.baseX * wf + curveX;
          curb.rotation.y = -Math.atan(slope);
        }
      }

      for (let i = 0; i < this.sceneryItems.length; i++) {
        const item = this.sceneryItems[i];
        item.position.z += worldUnitsPerSec * dt;
        if (item.position.z > 28) {
          item.position.z -= 216;
        }
        if (item.userData) {
          if (typeof item.userData.baseX === 'number') {
            item.position.x = item.userData.baseX + this._getRoadCurveX(item.position.z) * 0.88;
          }
          if (typeof item.userData.baseY === 'number') {
            item.position.y =
              item.userData.baseY + Math.sin(this.elapsedTime * 2.6 + item.userData.phase) * 0.35;
          }
        }
      }

      // 1b. Animate Roaming 3D Biome Animals beside the track (Lions walking in Jungle, Camels + Foxes roaming in Desert, Penguins waddling on Glacier, Dinosaurs stomping in Jurassic!)
      if (Array.isArray(this.roamingAnimals)) {
        for (let i = 0; i < this.roamingAnimals.length; i++) {
          const cluster = this.roamingAnimals[i];
          const u = cluster.userData || {};
          const phase = u.phase || 0;
          const side = u.side || 1;
          // Animals walk forward/backward along the roadside while the world scrolls
          const roamSpeed = Math.sin(this.elapsedTime * 0.9 + phase) * 2.8;
          cluster.position.z += (worldUnitsPerSec + roamSpeed) * dt;
          if (cluster.position.z > 28) {
            cluster.position.z -= 196;
          }
          const curveX = this._getRoadCurveX(cluster.position.z) * 0.88;
          const wanderX = Math.cos(this.elapsedTime * 1.35 + phase) * 1.15;
          cluster.position.x = (u.baseX || side * 10.8) + curveX + wanderX;
          // Gentle turning yaw as animal wanders along the road
          cluster.rotation.y = Math.sin(this.elapsedTime * 1.35 + phase) * 0.28;
        }
      }

      if (Array.isArray(this.biomeAnimalVariants)) {
        for (let i = 0; i < this.biomeAnimalVariants.length; i++) {
          const av = this.biomeAnimalVariants[i];
          const phase = i * 0.95;
          const walkCycle = this.elapsedTime * 9.5 + phase;
          const legSwing = Math.sin(walkCycle) * 0.55;
          const headBob = Math.cos(walkCycle * 0.5) * 0.08;

          if (Array.isArray(av.primaryWalkers)) {
            for (let w = 0; w < av.primaryWalkers.length; w++) {
              const walker = av.primaryWalkers[w];
              if (!walker || !walker.parent || !walker.parent.visible) continue;
              const wu = walker.userData;
              if (wu && Array.isArray(wu.legs) && wu.legs.length >= 2) {
                wu.legs[0].rotation.x = legSwing;
                wu.legs[1].rotation.x = -legSwing;
                if (wu.legs[2]) wu.legs[2].rotation.x = -legSwing;
                if (wu.legs[3]) wu.legs[3].rotation.x = legSwing;
              }
              if (wu && wu.headGroup) {
                wu.headGroup.rotation.x = headBob;
                wu.headGroup.rotation.y = Math.sin(this.elapsedTime * 2.2 + phase) * 0.18;
              }
              if (wu && wu.tail) {
                wu.tail.rotation.z = Math.sin(this.elapsedTime * 7.5 + phase) * 0.32;
              }
            }
          }

          if (Array.isArray(av.companions)) {
            for (let c = 0; c < av.companions.length; c++) {
              const comp = av.companions[c];
              if (!comp || !comp.parent || !comp.parent.visible) continue;
              const cPhase = phase + c * 1.7;
              const orbitAng = this.elapsedTime * 1.85 + cPhase;
              // Companion animals (Fennec Fox, Gazelle, Monkey, Penguin, Bunny) trot & hop around the main animal!
              comp.position.x = (c % 2 === 0 ? 2.1 : -1.75) + Math.cos(orbitAng) * 0.75;
              comp.position.z = (c % 2 === 0 ? -1.2 : 1.75) + Math.sin(orbitAng) * 0.95;
              comp.position.y = Math.abs(Math.sin(this.elapsedTime * 6.8 + cPhase)) * 0.36;
              comp.rotation.y = -orbitAng + Math.PI * 0.5;
              // Penguin side-to-side waddle
              comp.rotation.z = Math.sin(this.elapsedTime * 8.5 + cPhase) * 0.14;
              const cu = comp.userData;
              if (cu && Array.isArray(cu.legs) && cu.legs.length >= 2) {
                const cLeg = Math.sin(this.elapsedTime * 12 + cPhase) * 0.6;
                cu.legs[0].rotation.x = cLeg;
                cu.legs[1].rotation.x = -cLeg;
                if (cu.legs[2]) cu.legs[2].rotation.x = -cLeg;
                if (cu.legs[3]) cu.legs[3].rotation.x = cLeg;
              }
            }
          }
        }
      }

      // 2. Soyun's Roblox Super Kart, 3D Blocky Avatar & Floating Cube Pet Physics
      if (this.carGroup) {
        let targetX = lanes[this.targetLane] !== undefined ? lanes[this.targetLane] : 0;
        let targetBaseY = 0;
        if (this.isHeavenStairsActive && Array.isArray(this.heavenStairsSteps)) {
          // 1) 계단 3개 오른 뒤 시작계단부터 적당한 속도로 차례대로 무너지는 타이머 & 애니메이션
          if (this.heavenStairsCollapseActive && this.heavenStairsStepIndex < this.heavenStairsTotal) {
            const leadGap = this.heavenStairsStepIndex - this.heavenStairsCollapsedIndex;
            // 적당한 기본 붕괴 간격(0.68초/계단), 만약 플레이어가 6계단 이상 멀리 앞서가면 화면 안에서 보이도록 살짝 따라붙음(0.46초)
            const effectiveInterval = leadGap > 6 ? 0.46 : (this.heavenStairsCollapseInterval || 0.68);
            this.heavenStairsCollapseTimer = (this.heavenStairsCollapseTimer || 0) + dt;

            if (this.heavenStairsCollapseTimer >= effectiveInterval) {
              this.heavenStairsCollapseTimer = 0;
              this.heavenStairsCollapsedIndex += 1;
              const collapsingStep = this.heavenStairsSteps[this.heavenStairsCollapsedIndex];
              if (collapsingStep) {
                collapsingStep.isCollapsing = true;
                collapsingStep.collapseAnim = 0;
                const worldZ = (this.heavenStairsGroup ? this.heavenStairsGroup.position.z : cfg.GATE_PASS_Z) + collapsingStep.z;
                this._spawnParticleBurst(collapsingStep.x, collapsingStep.y + 0.3, worldZ, 0xff5500, 14, 0.85);
              }

              // 무너지는 계단이 현재 서 있는 계단까지 따라잡은 경우: 피 1 감소 후 즉시 천국의 계단 종료!
              if (!this.heavenStairsFailed && this.heavenStairsCollapsedIndex >= this.heavenStairsStepIndex && this.heavenStairsStepIndex < this.heavenStairsTotal) {
                this.heavenStairsFailed = true;
                this.heavenStairsCollapseActive = false;
                if (this.heavenNextStepRing) {
                  this.heavenNextStepRing.visible = false;
                }
                const curSt = this.heavenStairsSteps[this.heavenStairsStepIndex] || { x: 0, y: 0 };
                this.triggerDamageEffect(curSt.x, 'stair_miss');

                if (typeof this.onHeavenStairStep === 'function') {
                  this.onHeavenStairStep({
                    cleared: false,
                    collapsedCatchup: true,
                    isFailedEnd: true,
                    isFinished: false,
                    stepIndex: this.heavenStairsStepIndex,
                    totalSteps: this.heavenStairsTotal,
                    facingDir: this.heavenStairsFacingDir,
                    nextRequiredDir: this.heavenStairsFacingDir
                  });
                }
              }
            }
          }

          // 2) 무너지는 계단 낙하·축소 연출 및 곧 무너질 다음 계단 흔들림 경고 연출
          const nextCollapseWarningIdx = this.heavenStairsCollapseActive ? (this.heavenStairsCollapsedIndex + 1) : -1;
          for (let s = 0; s < this.heavenStairsSteps.length; s++) {
            const st = this.heavenStairsSteps[s];
            if (!st || !st.stepMesh) continue;
            if (st.isCollapsing) {
              if (st.stepMesh.visible) {
                st.collapseAnim = (st.collapseAnim || 0) + dt * 2.8;
                st.stepMesh.position.y = st.y - st.collapseAnim * st.collapseAnim * 9.5;
                st.stepMesh.rotation.x = st.collapseAnim * 1.1;
                st.stepMesh.rotation.z = st.collapseAnim * 0.7;
                const sc = Math.max(0.01, 1 - st.collapseAnim * 0.85);
                st.stepMesh.scale.set(sc, sc, sc);
                if (st.collapseAnim >= 1.15) {
                  st.stepMesh.visible = false;
                }
              }
            } else if (s === nextCollapseWarningIdx && s <= this.heavenStairsStepIndex) {
              // 곧 사라질 계단 진동 경고
              st.stepMesh.position.x = st.x + Math.sin(this.elapsedTime * 46) * 0.12;
            } else {
              st.stepMesh.position.x = st.x;
            }
          }

          const curStepObj = this.heavenStairsSteps[this.heavenStairsStepIndex] || { x: 0, y: 0 };
          targetX = curStepObj.x;
          targetBaseY = curStepObj.y;
          if (this.heavenStairsGroup) {
            const baseCarZ = this.carGroup ? this.carGroup.position.z : (cfg.GATE_PASS_Z - 4.2);
            const targetGroupZ = baseCarZ + this.heavenStairsStepIndex * 2.5;
            this.heavenStairsGroup.position.z += (targetGroupZ - this.heavenStairsGroup.position.z) * Math.min(1, dt * 11.5);
          }
          if (this.heavenNextStepRing) {
            const pulse = 1 + Math.sin(this.elapsedTime * 10) * 0.12;
            this.heavenNextStepRing.scale.set(pulse, pulse, pulse);
          }
        }
        this.stairClimbedY = (this.stairClimbedY || 0) + (targetBaseY - (this.stairClimbedY || 0)) * Math.min(1, dt * 11.5);

        const dx = targetX - this.carGroup.position.x;

        // Spring-lerp horizontal position
        this.carGroup.position.x += dx * Math.min(1, dt * 13.5);

        // Dynamic banking roll & steering yaw proportional to lateral velocity (or facing direction on Heaven Stairs!)
        this.carGroup.rotation.z = -dx * 0.085;
        if (this.isHeavenStairsActive) {
          const targetYaw = -(this.heavenStairsFacingDir || 1) * 0.38;
          this.carGroup.rotation.y += (targetYaw - this.carGroup.rotation.y) * Math.min(1, dt * 14.0);
        } else {
          this.carGroup.rotation.y = -dx * 0.055;
        }

        // 360-degree Super Spin Animation during 2-Stage Super Jump!
        if (this.carSpinTimer && this.carSpinTimer > 0) {
          this.carSpinTimer = Math.max(0, this.carSpinTimer - dt);
          const spinProgress = 1 - this.carSpinTimer / 0.68;
          this.carGroup.rotation.y += Math.sin(spinProgress * Math.PI * 2) * 0.45;
          this.carGroup.rotation.z += (1 - spinProgress) * 0.35;
        }

        // High-speed suspension vibration + 3D Jump Physics (carJumpY)!
        if (this.isJumping || this.carJumpY > 0 || this.carJumpVel !== 0) {
          this.carJumpY += this.carJumpVel * dt;
          this.carJumpVel -= 38.0 * dt; // Gravity
          if (this.carJumpY <= 0) {
            this.carJumpY = 0;
            this.carJumpVel = 0;
            this.isJumping = false;
            this.isDoubleJumpActive = false;
            this.carGroup.rotation.x = 0;
            this._spawnParticleBurst(this.carGroup.position.x, this.stairClimbedY + 0.3, cfg.GATE_PASS_Z, 0xffe600, 16, 0.7);
          } else {
            // Pitch nose slightly on jump arc
            this.carGroup.rotation.x = Math.max(-0.28, Math.min(0.28, this.carJumpVel * 0.018));
          }
        } else {
          this.carGroup.rotation.x = 0;
        }

        const vibeFreq = 26 + this.currentSpeed * 0.1;
        this.carGroup.position.y = this.stairClimbedY + this.carJumpY + Math.sin(this.elapsedTime * vibeFreq) * 0.025;

        if (this.heavenFacingArrowGroup) {
          this.heavenFacingArrowGroup.position.set(
            this.carGroup.position.x,
            this.carGroup.position.y + 3.25 + Math.sin(this.elapsedTime * 9) * 0.15,
            this.carGroup.position.z
          );
        }

        // Hurt / Ouch Animation ("아픈 애니"): Car spins/tilts/bucks & Soyun shakes head/arms in pain when hitting a block or fire pit!
        if (this.carHurtTimer > 0) {
          this.carHurtTimer = Math.max(0, this.carHurtTimer - dt);
          const hurtEnv = Math.min(1, this.carHurtTimer * 1.6);
          this.carGroup.rotation.z += Math.sin(this.elapsedTime * 48) * 0.54 * hurtEnv;
          this.carGroup.rotation.y += Math.cos(this.elapsedTime * 38) * 0.48 * hurtEnv;
          this.carGroup.rotation.x += Math.sin(this.elapsedTime * 34) * 0.36 * hurtEnv;
        }

        // Steering wheel & Soyun's Blocky Avatar Arms/Head/Pigtails animation!
        if (this.steeringWheelMesh) {
          this.steeringWheelMesh.rotation.z = -dx * 0.35;
        }
        if (this.soyunHeadMesh) {
          if (this.carHurtTimer > 0) {
            this.soyunHeadMesh.rotation.y = Math.sin(this.elapsedTime * 52) * 0.65;
            this.soyunHeadMesh.rotation.z = Math.cos(this.elapsedTime * 44) * 0.42;
          } else {
            this.soyunHeadMesh.rotation.y = -dx * 0.12;
            this.soyunHeadMesh.rotation.z = -dx * 0.06;
          }
        }
        if (this.soyunLeftPigtail && this.soyunRightPigtail) {
          const bounce = Math.sin(this.elapsedTime * 18) * 0.08;
          this.soyunLeftPigtail.rotation.z = -0.1 + bounce - dx * 0.08;
          this.soyunRightPigtail.rotation.z = 0.1 - bounce - dx * 0.08;
        }
        if (this.soyunLeftArm && this.soyunRightArm) {
          if (this.carHurtTimer > 0) {
            const flail = Math.sin(this.elapsedTime * 56) * 0.55;
            this.soyunLeftArm.rotation.x = 2.95 + flail;
            this.soyunRightArm.rotation.x = 2.95 - flail;
          } else if (this.avatarCheerTimer > 0) {
            this.avatarCheerTimer -= dt;
            // Cheer with both arms raised high!
            const wave = Math.sin(this.elapsedTime * 28) * 0.25;
            this.soyunLeftArm.rotation.x = 2.65 + wave;
            this.soyunRightArm.rotation.x = 2.65 - wave;
          } else {
            this.soyunLeftArm.rotation.x = 1.15 + dx * 0.15;
            this.soyunRightArm.rotation.x = 1.15 - dx * 0.15;
          }
        }

        // Floating 3D Cube Pet bobbing, flapping wings & celebratory joy-spin!
        if (this.petGroup) {
          const petBob = Math.sin(this.elapsedTime * 5.8) * 0.22;
          this.petGroup.position.y = 1.9 + petBob + (this.petSpinTimer > 0 ? 0.35 : 0);

          if (this.petSpinTimer > 0) {
            this.petSpinTimer -= dt;
            this.petGroup.rotation.y += dt * 18;
          } else {
            this.petGroup.rotation.y += (0 - this.petGroup.rotation.y) * Math.min(1, dt * 8);
          }

          if (this.petLeftWing && this.petRightWing) {
            const flap = Math.sin(this.elapsedTime * 22) * 0.48;
            this.petLeftWing.rotation.z = flap;
            this.petRightWing.rotation.z = -flap;
          }
        }

        // Spin wheels & steer front wheels
        const wheelSpin = worldUnitsPerSec * dt * 1.6;
        for (let w = 0; w < this.carWheels.length; w++) {
          this.carWheels[w].rotation.x -= wheelSpin;
          if (w < 2) {
            this.carWheels[w].rotation.y = -dx * 0.08;
          }
        }

        // Animate articulated legs when riding Bicycle, Kickboard, Roller Skates, or Motorcycle!
        if (this.soyunLeftLeg && this.soyunRightLeg) {
          if (this.currentVehicleType === 'girl_bicycle' || this.currentVehicleType === 'girl_roller') {
            const stride = Math.sin(this.elapsedTime * 16) * 0.55;
            this.soyunLeftLeg.rotation.x = stride;
            this.soyunRightLeg.rotation.x = -stride;
          } else if (this.currentVehicleType === 'girl_kickboard') {
            this.soyunLeftLeg.rotation.x = 0.05;
            this.soyunRightLeg.rotation.x = Math.sin(this.elapsedTime * 12) * 0.35;
          }
        }

        // KartRider Nitro Booster 3D Animation (2.0s high-speed wheelie pitch + giant cyan nitro jet stream!)
        if (this.kartBoosterTimer && this.kartBoosterTimer > 0) {
          this.kartBoosterTimer = Math.max(0, this.kartBoosterTimer - dt);
          if (!this.isJumping) {
            this.carGroup.rotation.x -= 0.12 + Math.sin(this.elapsedTime * 48) * 0.03;
          }
          if (this.carFlameMat) {
            this.carFlameMat.color.setHex(0x00e5ff);
          }
          this.BoosterParticleTick = (this.BoosterParticleTick || 0) - dt;
          if (this.BoosterParticleTick <= 0) {
            this.BoosterParticleTick = 0.075;
            this._spawnParticleBurst(
              this.carGroup.position.x + (Math.random() - 0.5) * 0.9,
              Math.max(0.35, this.carGroup.position.y + 0.45),
              cfg.GATE_PASS_Z + 2.3,
              Math.random() < 0.65 ? 0x00e5ff : 0xffe600,
              10,
              0.85
            );
          }
        } else if (this.kartBrakeTimer && this.kartBrakeTimer > 0) {
          // Sudden Hard-Brake Screech 3D Animation (2.0s nose-dive pitch + skid fishtail + tire smoke!)
          this.kartBrakeTimer = Math.max(0, this.kartBrakeTimer - dt);
          if (!this.isJumping) {
            this.carGroup.rotation.x += 0.24 + Math.sin(this.elapsedTime * 42) * 0.04;
            this.carGroup.rotation.y += Math.sin(this.elapsedTime * 36) * 0.14;
          }
          if (this.carFlameMat) {
            this.carFlameMat.color.setHex(0xff1744);
          }
          this.brakeParticleTick = (this.brakeParticleTick || 0) - dt;
          if (this.brakeParticleTick <= 0) {
            this.brakeParticleTick = 0.085;
            this._spawnParticleBurst(
              this.carGroup.position.x + (Math.random() - 0.5) * 1.4,
              Math.max(0.2, this.carGroup.position.y + 0.2),
              cfg.GATE_PASS_Z + 1.4,
              Math.random() < 0.7 ? 0xe2e8f0 : 0xff5500,
              12,
              0.75
            );
          }
        } else if (this.carFlameMat) {
          this.carFlameMat.color.setHex(0x00f3ff);
        }

        // Scale twin/quad turbo exhaust flames with speed & KartRider booster
        const speedNorm = Math.max(0, (this.currentSpeed - 80) / 220);
        const isKartBoosting = (this.kartBoosterTimer && this.kartBoosterTimer > 0);
        const isKartBraking = (this.kartBrakeTimer && this.kartBrakeTimer > 0);
        const boostBonus = isKartBoosting ? 2.15 : (this.boostEffectTimer > 0 ? 0.95 : 0);
        for (let f = 0; f < this.carFlames.length; f++) {
          const pulse = 0.85 + Math.sin(this.elapsedTime * 55 + f) * 0.28;
          const flameScale = isKartBraking ? 0.45 : (0.75 + speedNorm * 1.2 + boostBonus) * pulse;
          const widthScale = isKartBoosting ? 1.55 : (isKartBraking ? 1.4 : 1.0);
          this.carFlames[f].scale.set(widthScale, flameScale, widthScale);
        }

        // Damage red flash vs boost glow
        if (this.damageFlashTimer > 0) {
          this.damageFlashTimer -= dt;
          const flashOn = Math.floor(this.damageFlashTimer * 24) % 2 === 0;
          this.carBodyMaterials.forEach((m) => {
            m.emissive.setHex(flashOn ? 0xff0033 : 0x3a0028);
            m.emissiveIntensity = flashOn ? 1.5 : 0.45;
          });
        } else if (this.boostEffectTimer > 0) {
          this.boostEffectTimer -= dt;
          this.carBodyMaterials.forEach((m) => {
            m.emissive.setHex(0x00ffaa);
            m.emissiveIntensity = 0.9;
          });
        } else {
          this.carBodyMaterials.forEach((m, idx) => {
            m.emissive.setHex(idx === 0 ? 0x3a0028 : 0x005577);
            m.emissiveIntensity = 0.45;
          });
        }

        if (this.carPointLight) {
          this.carPointLight.position.x = this.carGroup.position.x;
        }
      }

      // 3. Speed-Line Particles
      if (this.speedLineParticles) {
        const posAttr = this.speedLineParticles.geometry.getAttribute('position');
        const arr = posAttr.array;
        const lineSpeed = worldUnitsPerSec * 1.65;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 2] += lineSpeed * dt;
          if (arr[i + 2] > 20) {
            arr[i + 2] = -130 - Math.random() * 20;
            arr[i] = (Math.random() - 0.5) * 24;
            arr[i + 1] = 0.5 + Math.random() * 7;
          }
        }
        posAttr.needsUpdate = true;
      }

      // 4. Camera Follow, Dynamic FOV Zoom Punch & Impact Shake (Adaptive for Mobile Portrait & Desktop!)
      if (this.camera && this.carGroup) {
        const pf = this._getPortraitFactor();
        const followFactor = 0.36 + pf * 0.24;
        const targetCamX = this.carGroup.position.x * followFactor;
        const climbYOffset = (this.stairClimbedY || 0) * 0.95;
        this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1, dt * 8);
        this.camera.position.y = 4.5 + pf * 1.1 + climbYOffset;
        this.camera.position.z = 16.5 + pf * 5.0;

        if (this.shakeTimer > 0) {
          this.shakeTimer -= dt;
          this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity * 1.45;
          this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity * 1.15;
        }

        // Spring back cameraZoomPunch to 0
        if (Math.abs(this.cameraZoomPunch) > 0.05) {
          this.cameraZoomPunch += (0 - this.cameraZoomPunch) * Math.min(1, dt * 9.5);
        } else {
          this.cameraZoomPunch = 0;
        }

        const baseFov = 50 + pf * 12;
        const kartBoostFov = (this.kartBoosterTimer && this.kartBoosterTimer > 0) ? 13 : 0;
        const kartBrakeFov = (this.kartBrakeTimer && this.kartBrakeTimer > 0) ? -7 : 0;
        const targetFov =
          baseFov +
          Math.max(0, Math.min(16, (this.currentSpeed - 110) * 0.075)) +
          (this.boostEffectTimer > 0 ? 4 : 0) +
          kartBoostFov +
          kartBrakeFov +
          this.cameraZoomPunch;

        if (Math.abs(this.camera.fov - targetFov) > 0.08) {
          this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 12);
          this.camera.updateProjectionMatrix();
        }

        const lookCurveX = this._getRoadCurveX(-26) * 0.22;
        if (this.bossSpotlightTimer > 0 && this.isBossActive && this.bossGroup && this.bossGroup.visible) {
          this.bossSpotlightTimer = Math.max(0, this.bossSpotlightTimer - dt);
          const spotWeight = Math.min(1, this.bossSpotlightTimer * 2.2);
          const normalLookX = this.carGroup.position.x * (0.2 + pf * 0.12) + lookCurveX;
          const normalLookY = 1.8 - pf * 0.35;
          const bossLookX = this.bossGroup.position.x * 0.55;
          const bossLookY = this.bossGroup.position.y + 0.35;
          const bossLookZ = this.bossGroup.position.z;
          this.camera.lookAt(
            normalLookX + (bossLookX - normalLookX) * spotWeight,
            normalLookY + (bossLookY - normalLookY) * spotWeight,
            -30 + (bossLookZ - (-30)) * spotWeight * 0.65
          );
        } else if (this.isHeavenStairsActive) {
          this.camera.lookAt(
            this.carGroup.position.x * 0.38,
            2.1 + (this.stairClimbedY || 0) * 0.96,
            -16
          );
        } else {
          this.camera.lookAt(this.carGroup.position.x * (0.2 + pf * 0.12) + lookCurveX, 1.8 - pf * 0.35 + (this.stairClimbedY || 0) * 0.8, -30);
        }

        // Sync Ground-Projected Road Direction Pads (#lane-controls) horizontally with the moving 3D road (Fixed Y, slight X sway)
        if (!this._laneControlsDomEl) {
          this._laneControlsDomEl = document.getElementById('lane-controls');
        }
        if (this._laneControlsDomEl) {
          const roadCurveNearX = this._getRoadCurveX(-16) * 2.2;
          const rhythmSwayX = Math.sin((this.roadCurvePhase || 0) * 1.35) * 6.5;
          const steerShiftX = -(this.carGroup.position.x || 0) * 2.4;
          const totalGroundSwayX = Math.max(-18, Math.min(18, roadCurveNearX + rhythmSwayX + steerShiftX));
          this._laneControlsDomEl.style.setProperty('--road-ground-sway-x', totalGroundSwayX.toFixed(1) + 'px');
        }
      }

      // 5. Update 3-Lane Quiz Gates & Collision Check (gliding along the curved highway!)
      const spawnZ = cfg.GATE_SPAWN_Z;
      const passZ = cfg.GATE_PASS_Z;
      const despawnZ = cfg.GATE_DESPAWN_Z;

      for (let i = this.activeGates.length - 1; i >= 0; i--) {
        const gate = this.activeGates[i];
        const isSpeechWaiting = Boolean(gate.questionData && gate.questionData.isSpeech && !gate.questionData.speechPassed);
        const stepSpeed = isSpeechWaiting ? (gateSpeedUnitsPerSec * 0.62) : gateSpeedUnitsPerSec;
        gate.group.position.z += stepSpeed * dt;
        gate.group.position.x = this._getRoadCurveX(gate.group.position.z) * 0.45;
        gate.group.rotation.y = -this._getRoadCurveSlope(gate.group.position.z) * 0.25;

        const rawProgress = (gate.group.position.z - spawnZ) / Math.max(1, passZ - spawnZ);
        gate.progress = Math.max(0, Math.min(1, rawProgress));

        // Perspective distance scale compensation: starts large when far away so answers are BIG right from the start,
        // and adapts to screen aspect ratio so all 3 lanes fit inside mobile portrait & desktop viewports!
        const distScale = this._getAdaptiveGateScale(gate.progress);
        gate.group.scale.set(distScale, distScale, 1);

        if (!gate.passed && typeof this.onGateProgress === 'function') {
          this.onGateProgress(gate.progress, gate.questionData, gate.group.position.z);
        }

        if (!gate.passed && gate.group.position.z >= passZ) {
          this._evaluateGatePass(gate);
        }

        if (gate.group.position.z > despawnZ) {
          this._disposeGate(gate);
          this.activeGates.splice(i, 1);
        }
      }

      // 5b. Update 3-Lane Roblox Obby Action Mini-Game Obstacle Waves (1.2x of Current Speed!)
      const obbySpeedUnitsPerSec = gateSpeedUnitsPerSec;
      for (let i = this.activeObbyWaves.length - 1; i >= 0; i--) {
        const wave = this.activeObbyWaves[i];
        wave.group.position.z += obbySpeedUnitsPerSec * dt;
        wave.group.position.x = this._getRoadCurveX(wave.group.position.z) * 0.65;
        wave.group.rotation.y = -this._getRoadCurveSlope(wave.group.position.z) * 0.35;

        // Spin Robux rings in the wave
        if (Array.isArray(wave.coinMeshes)) {
          for (let c = 0; c < wave.coinMeshes.length; c++) {
            wave.coinMeshes[c].rotation.y += dt * 4.5;
          }
        }

        // Flicker roaring 3D flames in Fire Pit waves
        if (Array.isArray(wave.flameMeshes)) {
          for (let f = 0; f < wave.flameMeshes.length; f++) {
            const fl = wave.flameMeshes[f];
            if (!fl) continue;
            const ud = fl.userData || {};
            const baseSY = ud.baseScaleY || 1.0;
            const ph = ud.phase || 0;
            const flicker = baseSY * (0.82 + Math.sin(this.elapsedTime * 26 + ph) * 0.26);
            fl.scale.y = flicker;
            fl.rotation.y += dt * 3.5;
          }
        }

        // Spin laser rotors and giant rolling logs!
        if (Array.isArray(wave.spinnerMeshes)) {
          for (let s = 0; s < wave.spinnerMeshes.length; s++) {
            wave.spinnerMeshes[s].rotation.y += dt * 7.8;
          }
        }
        if (Array.isArray(wave.rollerMeshes)) {
          for (let r = 0; r < wave.rollerMeshes.length; r++) {
            wave.rollerMeshes[r].rotation.x += dt * 6.8;
          }
        }

        // Track explicit player jump input during ALL obstacle wave approaches (Laser Bar, Giant Log, Low Hurdle, Narrow Fire Pit)
        if (!wave.passed) {
          if (wave.group.position.z >= -52 && (this.isJumping || this.carJumpY > 0.35)) {
            wave.playerJumped = true;
            wave.maxJumpScale = Math.max(wave.maxJumpScale || 0, this.lastJumpScale || 1.1);
          }
          // If the player explicitly pressed Jump slightly early and landed just before the obstacle, sustain the hop smoothly!
          if (wave.playerJumped && wave.group.position.z >= passZ - 5.2 && wave.group.position.z < passZ - 0.8 && !this.isJumping && this.carJumpY < 0.5) {
            if (wave.waveType === 'high_log') {
              this.superJump();
            } else {
              this.jump(1.18);
            }
          }
        }

        if (!wave.passed && wave.group.position.z >= passZ - 0.8) {
          wave.passed = true;
          const playerLane = this.targetLane;
          const laneType = wave.lanes[playerLane] || 'coin';
          const laneX = lanes[playerLane] || 0;

          let cleared = true;
          let actionType = 'dodge';
          let outcome = 'coin';

          if (wave.waveType === 'low_laser' || wave.waveType === 'high_log') {
            const didJump = Boolean(wave.playerJumped || this.isJumping || this.carJumpY > 0.35);
            if (didJump) {
              cleared = true;
              actionType = wave.waveType === 'high_log' ? 'super_jumped_log' : 'jumped_laser';
              outcome = 'jump_clear';
              this.triggerCorrectEffect(laneX);
            } else {
              cleared = false;
              actionType = wave.waveType === 'high_log' ? 'hit_log' : 'hit_laser';
              outcome = actionType;
              this.triggerDamageEffect(laneX, actionType);
            }
          } else if (laneType === 'block') {
            cleared = false;
            actionType = 'hit_block';
            outcome = 'hit_block';
            this.triggerDamageEffect(laneX, 'block');
          } else if (laneType === 'wide_fire') {
            cleared = false;
            actionType = 'hit_fire';
            outcome = 'hit_fire';
            this.triggerDamageEffect(laneX, 'wide_fire');
          } else if (laneType === 'hurdle' || laneType === 'narrow_fire') {
            // 3rd Mini-Game (obby_rush): Must be in the correct lane AND actually press Jump!
            const didJump = Boolean(wave.playerJumped || this.isJumping || this.carJumpY > 0.35);
            if (didJump) {
              cleared = true;
              actionType = laneType === 'narrow_fire' ? 'jumped_fire' : 'jumped_hurdle';
              outcome = 'jump_clear';
              this.triggerCorrectEffect(laneX);
            } else {
              cleared = false;
              actionType = laneType === 'narrow_fire' ? 'hit_fire' : 'hit_hurdle';
              outcome = actionType;
              this.triggerDamageEffect(laneX, laneType === 'narrow_fire' ? 'wide_fire' : 'block');
            }
          } else {
            cleared = true;
            actionType = 'collected_coin';
            outcome = 'coin';
            this.spawnBrickExplosion(laneX, 1.5, passZ - 1, 20, false);
            this._spawnParticleBurst(laneX, 1.5, passZ - 1, 0x00ff88, 28, 1.1);
          }

          if (typeof this.onObbyWavePass === 'function') {
            this.onObbyWavePass({
              cleared: cleared,
              actionType: actionType,
              outcome: outcome,
              laneType: laneType,
              waveType: wave.waveType || 'obstacle_wall',
              lane: playerLane,
              waveIndex: wave.waveIndex,
              totalWaves: wave.totalWaves
            });
          }
        }

        if (wave.group.position.z > despawnZ) {
          if (wave.group && this.scene) {
            this.scene.remove(wave.group);
          }
          if (wave.disposables) {
            wave.disposables.geometries.forEach((g) => g && g.dispose && g.dispose());
            wave.disposables.materials.forEach((m) => m && m.dispose && m.dispose());
          }
          this.activeObbyWaves.splice(i, 1);
        }
      }

      // 6. Update Stage Boss 3D Blocky Roblox Mecha (at BOSS_Z = -38, y = 2.8) — Dynamic 1.5x Overdrive Action!
      if (this.isBossActive && this.bossGroup && this.bossGroup.visible) {
        if (this.bossDefeating) {
          this.bossDefeatTimer += dt;
          this.bossGroup.position.y += dt * 14;
          this.bossGroup.position.z -= dt * 36;
          this.bossGroup.rotation.z += dt * 9;
          this.bossGroup.rotation.x += dt * 5;
          const shrink = Math.max(0.05, 1 - this.bossDefeatTimer * 0.85);
          this.bossGroup.scale.set(shrink, shrink, shrink);

          if (Math.random() < 0.35) {
            this._spawnParticleBurst(
              this.bossGroup.position.x + (Math.random() - 0.5) * 4,
              this.bossGroup.position.y + (Math.random() - 0.5) * 3,
              this.bossGroup.position.z,
              0xffbe0b,
              18,
              1.4
            );
          }

          if (this.bossDefeatTimer >= 1.05) {
            const cb = this.bossDefeatCallback;
            this.hideBoss();
            if (cb) cb();
          }
        } else {
          // Recover from knockback recoil, air-pop, yaw spin, and roll stagger smoothly
          this.bossRecoilZ += (0 - this.bossRecoilZ) * Math.min(1, dt * 6.5);
          this.bossRecoilY += (0 - this.bossRecoilY) * Math.min(1, dt * 8.0);
          this.bossRecoilPitch += (0 - this.bossRecoilPitch) * Math.min(1, dt * 7.5);
          this.bossRecoilYaw += (0 - this.bossRecoilYaw) * Math.min(1, dt * 7.0);
          this.bossRecoilRoll += (0 - this.bossRecoilRoll) * Math.min(1, dt * 7.5);

          // Elastic Squash-and-Stretch Deformation when Boss takes a hit!
          // Keep Boss compact (0.62) while question gates are active so it NEVER covers the 3 answer signboards!
          const isFinisherBarrage = Boolean(this.bossFinisherSlowMoTimer && this.bossFinisherSlowMoTimer > 0);
          const activeQuizGate = this.activeGates && this.activeGates.find((g) => !g.passed);
          const baseBossScale = isFinisherBarrage ? 0.84 : 0.62;
          if (this.bossSquashTimer > 0) {
            this.bossSquashTimer = Math.max(0, this.bossSquashTimer - dt);
            const sqWave = Math.sin(this.bossSquashTimer * 26) * (this.bossSquashTimer * 0.72);
            this.bossGroup.scale.set(
              baseBossScale * Math.max(0.65, 1 + sqWave),
              baseBossScale * Math.max(0.65, 1 - sqWave * 0.85),
              baseBossScale * Math.max(0.65, 1 + sqWave)
            );
          } else {
            this.bossGroup.scale.set(baseBossScale, baseBossScale, baseBossScale);
          }

          if (this.bossImpactLight && this.bossImpactLight.intensity > 0) {
            this.bossImpactLight.intensity = Math.max(0, this.bossImpactLight.intensity - dt * 12);
          }

          // Process 5-second Slow-Motion All-Out Boss Finisher Barrage Queue (timed in real seconds)!
          if (Array.isArray(this.bossFinisherQueue) && this.bossFinisherQueue.length > 0) {
            for (let fq = this.bossFinisherQueue.length - 1; fq >= 0; fq--) {
              const fItem = this.bossFinisherQueue[fq];
              fItem.delay -= realDt;
              if (fItem.delay <= 0) {
                this.bossFinisherQueue.splice(fq, 1);
                this._fireLaserAtBoss(fItem.weapon);
                if (global.SoundEngine && typeof global.SoundEngine.playLaserShot === 'function') {
                  global.SoundEngine.playLaserShot(fItem.weapon);
                }
                if (global.UIManager && typeof global.UIManager.triggerImpactEffect === 'function') {
                  global.UIManager.triggerImpactEffect('boss', {
                    attackInfo: { type: fItem.weapon }
                  });
                }
                if (fItem.isFinale) {
                  this.defeatBoss();
                }
              }
            }
          }

          // Process queued multi-stage chain detonations on Boss shoulders & hammer!
          if (Array.isArray(this.bossChainExplosions) && this.bossChainExplosions.length > 0) {
            for (let c = this.bossChainExplosions.length - 1; c >= 0; c--) {
              const chain = this.bossChainExplosions[c];
              chain.delay -= dt;
              if (chain.delay <= 0) {
                this.bossChainExplosions.splice(c, 1);
                if (global.THREE) {
                  const cPos = new global.THREE.Vector3(
                    this.bossGroup.position.x + (chain.offsetX || 0),
                    this.bossGroup.position.y + (chain.offsetY || 0),
                    this.bossGroup.position.z + (chain.offsetZ || 1.2)
                  );
                  this._triggerBombBossImpact(cPos, chain.attackType, true);
                }
              }
            }
          }

          // Smart Answer-Signboard-Evading Boss Movement:
          // 1) Stay in the near foreground (z = -12.5 ~ -15.5) and low to the road (y = 0.28 ~ 0.65)
          //    so the Boss's top & HP bar stay strictly BELOW the camera line-of-sight to the overhead 3-lane Answer Signboards (y = 2.38 ~ 6.32)!
          // 2) Favor the left/right outer road shoulders (|x| = 5.4 ~ 7.8) and duck extra low when crossing the center,
          //    stepping out to the side shoulder whenever an Answer Gate approaches so the 3 choices are NEVER blocked!
          let roamZ = -13.8 + Math.sin(this.elapsedTime * 1.65) * 1.8;
          let rawSwing = Math.sin(this.elapsedTime * 1.45);
          // Push lateral patrol toward outer shoulders so Boss doesn't linger in the center signboard view
          const sideSign = rawSwing >= 0 ? 1 : -1;
          let roamX = sideSign * (4.8 + Math.pow(Math.abs(rawSwing), 0.65) * 2.8) + Math.cos(this.elapsedTime * 2.9) * 0.65;

          if (activeQuizGate && activeQuizGate.group) {
            const gz = activeQuizGate.group.position.z;
            // When the gate is in mid-to-close range (-44 to +6), step out further toward the outer shoulder
            if (gz > -44 && gz < 6) {
              const evadeWeight = Math.min(1, (gz + 44) / 20);
              const shoulderX = sideSign * 7.6;
              roamX = roamX * (1 - evadeWeight * 0.75) + shoulderX * (evadeWeight * 0.75);
            }
          } else if (isFinisherBarrage) {
            // During the 8s Boss Finisher Barrage (no question gates), roam center-stage for dramatic explosions!
            roamZ = -18.5 + Math.sin(this.elapsedTime * 2.1) * 2.5;
            roamX = Math.sin(this.elapsedTime * 2.2) * 3.8;
          }

          const targetBossZ = roamZ + Math.max(-2.5, this.bossRecoilZ);
          this.bossGroup.position.z += (targetBossZ - this.bossGroup.position.z) * Math.min(1, dt * 8.5);
          this.bossGroup.position.x += (roamX - this.bossGroup.position.x) * Math.min(1, dt * 7.5);

          // Duck lower when crossing near the center lanes (|x| < 4.8) so center answer signboard is 100% clear
          const centerDuck = Math.max(0, 1 - Math.abs(this.bossGroup.position.x) / 5.2) * 0.28;
          const baseLowY = isFinisherBarrage ? 1.15 : (0.52 - centerDuck);
          const bobY = Math.abs(Math.sin(this.elapsedTime * 3.4)) * (isFinisherBarrage ? 0.42 : 0.22);
          this.bossGroup.position.y = baseLowY + bobY + Math.min(0.35, this.bossRecoilY);
          this.bossGroup.rotation.z = Math.cos(this.elapsedTime * 2.1) * -0.12 + this.bossRecoilRoll;
          this.bossGroup.rotation.x = this.bossRecoilPitch + Math.sin(this.elapsedTime * 3.1) * 0.06;
          this.bossGroup.rotation.y = this.bossRecoilYaw + Math.sin(this.elapsedTime * 1.65) * 0.2;

          // Swing the giant Roblox Ban-Hammer rapidly — or flail wildly when hit!
          if (this.bossHitTimer > 0) {
            const flail = Math.sin(this.elapsedTime * 48) * 1.15;
            if (this.bossRightArm) {
              this.bossRightArm.rotation.x = -1.25 + flail;
              this.bossRightArm.rotation.z = -0.55 + Math.cos(this.elapsedTime * 42) * 0.45;
            }
            if (this.bossLeftArm) {
              this.bossLeftArm.rotation.x = -1.15 - flail;
              this.bossLeftArm.rotation.z = 0.55 - Math.cos(this.elapsedTime * 42) * 0.45;
            }
            if (this.bossRing1) this.bossRing1.rotation.z += dt * 19.0;
            if (this.bossRing2) this.bossRing2.rotation.y -= dt * 22.0;
          } else {
            if (this.bossRightArm) {
              this.bossRightArm.rotation.x = 0.55 + Math.sin(this.elapsedTime * 6.8) * 0.85;
              this.bossRightArm.rotation.z = 0;
            }
            if (this.bossLeftArm) {
              this.bossLeftArm.rotation.x = Math.PI / 3 + Math.cos(this.elapsedTime * 5.4) * 0.45;
              this.bossLeftArm.rotation.z = 0;
            }
            if (this.bossRing1) this.bossRing1.rotation.z += dt * 3.2;
            if (this.bossRing2) this.bossRing2.rotation.y -= dt * 4.2;
          }

          // Animate Erupting Hell Lava Geysers & Spewing Magma Sparks during Boss Fight!
          if (this.bossLavaGroup && this.bossLavaGroup.visible) {
            if (this.bossLavaRiverMat) {
              const lavaPulse = Math.sin(this.elapsedTime * 6.5) > 0 ? 0xff3300 : 0xff5500;
              this.bossLavaRiverMat.color.setHex(lavaPulse);
            }
            if (Array.isArray(this.bossLavaGeysers)) {
              for (let g = 0; g < this.bossLavaGeysers.length; g++) {
                const geyser = this.bossLavaGeysers[g];
                geyser.position.z += worldUnitsPerSec * dt;
                if (geyser.position.z > 24) {
                  geyser.position.z -= 216;
                }
                const eruptScale = 0.55 + Math.abs(Math.sin(this.elapsedTime * 5.2 + geyser.userData.phase)) * 1.35;
                geyser.scale.set(1, eruptScale, 1);
              }
            }
            if (Math.random() < 0.45) {
              const side = Math.random() < 0.5 ? -1 : 1;
              const lx = side * (9.5 + Math.random() * 6);
              const lz = -10 - Math.random() * 65;
              this._spawnParticleBurst(lx, 1.2, lz, Math.random() < 0.5 ? 0xff4500 : 0xffcc00, 8, 1.25);
            }
          }

          if (this.bossHitTimer > 0) {
            this.bossHitTimer -= dt;
            this.bossGroup.position.x += (Math.random() - 0.5) * 2.35;
            this.bossGroup.position.y += (Math.random() - 0.5) * 1.15;
            if (this.bossArmorMat) {
              const strobePhase = Math.floor(this.bossHitTimer * 32) % 3;
              const strobeHex = strobePhase === 0 ? 0xffffff : (strobePhase === 1 ? 0x00f3ff : 0xff0044);
              this.bossArmorMat.emissive.setHex(strobeHex);
              this.bossArmorMat.emissiveIntensity = 2.6;
            }
          } else if (this.bossArmorMat) {
            this.bossArmorMat.emissive.setHex(this.currentTheme.secondary);
            this.bossArmorMat.emissiveIntensity = 0.6;
          }
        }
      }

      // 6b. Update Flying 3D Projectiles (Bombs, Ballistic Missiles, Water Globes, Meteors) arcing toward the Boss!
      for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
        const proj = this.activeProjectiles[i];
        proj.age += dt;
        const t = Math.min(1, proj.age / Math.max(0.05, proj.duration));

        // Track live boss position if boss is active
        if (this.bossGroup && this.bossGroup.visible) {
          proj.endPos.set(
            this.bossGroup.position.x,
            this.bossGroup.position.y + 0.5,
            this.bossGroup.position.z + 1.8
          );
        }

        // 3D Parabolic + Lateral Curve interpolation
        const sideCurve = Math.sin(t * Math.PI) * (proj.sideArcX || 0);
        const curX = proj.startPos.x + (proj.endPos.x - proj.startPos.x) * t + sideCurve;
        const curZ = proj.startPos.z + (proj.endPos.z - proj.startPos.z) * t;
        const baseLinearY = proj.startPos.y + (proj.endPos.y - proj.startPos.y) * t;
        const arcY = Math.sin(t * Math.PI) * (proj.arcHeight || 5.5);
        const curY = baseLinearY + arcY;

        proj.group.position.set(curX, curY, curZ);

        // Orient projectile nose along 3D trajectory tangent & spin barrel
        const nextT = Math.min(1, t + 0.04);
        const nextSideCurve = Math.sin(nextT * Math.PI) * (proj.sideArcX || 0);
        const nextX = proj.startPos.x + (proj.endPos.x - proj.startPos.x) * nextT + nextSideCurve;
        const nextZ = proj.startPos.z + (proj.endPos.z - proj.startPos.z) * nextT;
        const nextY = proj.startPos.y + (proj.endPos.y - proj.startPos.y) * nextT + Math.sin(nextT * Math.PI) * (proj.arcHeight || 5.5);
        proj.group.lookAt(nextX, nextY, nextZ);
        proj.group.rotation.z += dt * (proj.spinSpeed || 22);

        // Emit weapon-specific contrail particles along the flight path
        if (Math.random() < 0.92) {
          const tCol = proj.trailColor || (proj.isPrimaryBomb ? 0xff9900 : 0xff2a85);
          this._spawnParticleBurst(curX, curY, curZ + 0.6, tCol, 6, 0.52);
        }

        if (t >= 1) {
          // Projectile slams into Boss!
          if (proj.isPrimaryBomb) {
            this._triggerBombBossImpact(proj.endPos.clone(), proj.attackType, false);
          } else {
            this._spawnParticleBurst(proj.endPos.x, proj.endPos.y, proj.endPos.z, proj.trailColor || 0xffe600, 28, 1.5);
          }
          if (proj.group && this.scene) {
            this.scene.remove(proj.group);
          }
          if (Array.isArray(proj.disposables)) {
            proj.disposables.forEach((d) => d && d.dispose && d.dispose());
          }
          this.activeProjectiles.splice(i, 1);
        }
      }

      // 7. Update Active Laser Beams & Explosion Shockwave Spheres
      for (let i = this.activeLasers.length - 1; i >= 0; i--) {
        const laser = this.activeLasers[i];
        laser.age += dt;
        const lifeRatio = 1 - laser.age / laser.maxAge;
        if (lifeRatio <= 0) {
          this.scene.remove(laser.mesh);
          laser.geo.dispose();
          laser.mat.dispose();
          this.activeLasers.splice(i, 1);
        } else if (laser.isShockwave) {
          laser.mat.opacity = lifeRatio * 0.9;
          const expandScale = 1 + (1 - lifeRatio) * 3.4;
          laser.mesh.scale.set(expandScale, expandScale, expandScale);
        } else {
          laser.mat.opacity = lifeRatio;
          laser.mesh.scale.set(lifeRatio * 1.5, lifeRatio * 1.5, 1);
        }
      }

      // 8. Update 3D Shattered Roblox Bricks & Golden Robux Rings (with Road Bounce!)
      for (let i = this.activeBricks.length - 1; i >= 0; i--) {
        const b = this.activeBricks[i];
        b.age += dt;
        if (b.age >= b.maxAge) {
          this.scene.remove(b.mesh);
          this.activeBricks.splice(i, 1);
          continue;
        }

        b.mesh.position.x += b.vx * dt;
        b.mesh.position.y += b.vy * dt;
        b.mesh.position.z += b.vz * dt;
        b.vy -= 28 * dt; // strong arcade gravity

        // Bounce off the highway surface (y = 0.22)!
        if (b.mesh.position.y < 0.22 && b.vy < 0) {
          b.mesh.position.y = 0.22;
          b.vy = -b.vy * 0.58;
          b.vx *= 0.88;
        }

        b.mesh.rotation.x += b.rx * dt;
        b.mesh.rotation.y += b.ry * dt;
        b.mesh.rotation.z += b.rz * dt;

        const lifeLeft = 1 - b.age / b.maxAge;
        if (lifeLeft < 0.3) {
          const s = Math.max(0.01, b.baseScale * (lifeLeft / 0.3));
          b.mesh.scale.set(s, s, s);
        }
      }

      // 9. Update 3D Particle Bursts
      for (let i = this.particleBursts.length - 1; i >= 0; i--) {
        const burst = this.particleBursts[i];
        burst.age += dt;
        if (burst.age >= burst.maxAge) {
          this.scene.remove(burst.points);
          burst.geo.dispose();
          burst.mat.dispose();
          this.particleBursts.splice(i, 1);
          continue;
        }

        const posAttr = burst.geo.getAttribute('position');
        const arr = posAttr.array;
        for (let p = 0; p < burst.velocities.length; p++) {
          const v = burst.velocities[p];
          arr[p * 3] += v.vx * dt;
          arr[p * 3 + 1] += v.vy * dt;
          arr[p * 3 + 2] += v.vz * dt;
          v.vy -= 18 * dt;
        }
        posAttr.needsUpdate = true;
        burst.mat.opacity = 1 - burst.age / burst.maxAge;
      }
    }
  };

  global.Engine3D = Engine3D;
})(typeof window !== 'undefined' ? window : this);
