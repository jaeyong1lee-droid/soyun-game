/**
 * Run & Learn Racer 3D (런앤런 레이서 3D)
 * Fast Mental Arithmetic & Progressive Elementary English Quiz Engine (Infinite Stages)
 *
 * Design Principles:
 * 1. Fast Mental Math ("머리로 빠른 암산"):
 *    - 100% glanceable number equations (e.g. "38 + 27 = ?", "16 × 4 = ?", "72 ÷ 6 = ?", "12 + 4 × 3 = ?")
 *    - No wordy textbook sentences that slow down reading while driving!
 * 2. Ultra-Gradual Infinite-Stage Progression ("천천히 올려. 한단계 올랐다고 확 바꾸지 말고"):
 *    - Spread smoothly across 60+ stages (~1.6% nudge per stage) so Stage N and Stage N+1 feel natural and seamless.
 * 3. Spaced Repetition Wrong Answer Re-Appearance System
 */
(function (window) {
  'use strict';

  /**
   * Curated Elementary School English Vocabulary (165+ words across 5 progressive difficulty levels)
   * Scales gradually from Level 1 -> Level 5 across Stage 1 -> Stage 60+
   */
  const ENGLISH_DICTIONARY = [
    // Level 1: Stage 1~12 Warm-up & Basic Elementary Words
    { en: 'school', kr: '학교', pron: '스쿨', emoji: '🏫', theme: 'school', level: 1 },
    { en: 'teacher', kr: '선생님', pron: '티처', emoji: '👩‍🏫', theme: 'school', level: 1 },
    { en: 'student', kr: '학생', pron: '스튜던트', emoji: '🧑‍🎓', theme: 'school', level: 1 },
    { en: 'pencil', kr: '연필', pron: '펜슬', emoji: '✏️', theme: 'school', level: 1 },
    { en: 'notebook', kr: '공책', pron: '노트북', emoji: '📓', theme: 'school', level: 1 },
    { en: 'family', kr: '가족', pron: '패밀리', emoji: '👨‍👩‍👧‍👦', theme: 'family', level: 1 },
    { en: 'friend', kr: '친구', pron: '프렌드', emoji: '🤝', theme: 'family', level: 1 },
    { en: 'water', kr: '물', pron: '워터', emoji: '💧', theme: 'food', level: 1 },
    { en: 'bread', kr: '빵', pron: '브레드', emoji: '🍞', theme: 'food', level: 1 },
    { en: 'cheese', kr: '치즈', pron: '치즈', emoji: '🧀', theme: 'food', level: 1 },
    { en: 'watermelon', kr: '수박', pron: '워터멜론', emoji: '🍉', theme: 'food', level: 1 },
    { en: 'strawberry', kr: '딸기', pron: '스트로베리', emoji: '🍓', theme: 'food', level: 1 },
    { en: 'peach', kr: '복숭아', pron: '피치', emoji: '🍑', theme: 'food', level: 1 },
    { en: 'grape', kr: '포도', pron: '그레이프', emoji: '🍇', theme: 'food', level: 1 },
    { en: 'tiger', kr: '호랑이', pron: '타이거', emoji: '🐯', theme: 'animal', level: 1 },
    { en: 'rabbit', kr: '토끼', pron: '래빗', emoji: '🐰', theme: 'animal', level: 1 },
    { en: 'monkey', kr: '원숭이', pron: '멍키', emoji: '🐵', theme: 'animal', level: 1 },
    { en: 'horse', kr: '말', pron: '홀스', emoji: '🐴', theme: 'animal', level: 1 },
    { en: 'sheep', kr: '양', pron: '쉽', emoji: '🐑', theme: 'animal', level: 1 },
    { en: 'duck', kr: '오리', pron: '덕', emoji: '🦆', theme: 'animal', level: 1 },
    { en: 'clock', kr: '시계', pron: '클락', emoji: '⏰', theme: 'object', level: 1 },
    { en: 'window', kr: '창문', pron: '윈도우', emoji: '🪟', theme: 'object', level: 1 },
    { en: 'cloud', kr: '구름', pron: '클라우드', emoji: '☁️', theme: 'nature', level: 1 },
    { en: 'wind', kr: '바람', pron: '윈드', emoji: '🌬️', theme: 'nature', level: 1 },
    { en: 'music', kr: '음악', pron: '뮤직', emoji: '🎵', theme: 'subject', level: 1 },
    { en: 'happy', kr: '행복한', pron: '해피', emoji: '😊', theme: 'adjective', level: 1 },
    { en: 'fast', kr: '빠른', pron: '패스트', emoji: '⚡', theme: 'adjective', level: 1 },
    { en: 'slow', kr: '느린', pron: '슬로우', emoji: '🐢', theme: 'adjective', level: 1 },

    // Level 2: Elementary 4~5 Core Words
    { en: 'ruler', kr: '자(학용품)', pron: '룰러', emoji: '📏', theme: 'school', level: 2 },
    { en: 'scissors', kr: '가위', pron: '시저스', emoji: '✂️', theme: 'school', level: 2 },
    { en: 'calendar', kr: '달력', pron: '캘린더', emoji: '📅', theme: 'school', level: 2 },
    { en: 'blackboard', kr: '칠판', pron: '블랙보드', emoji: '🏫', theme: 'school', level: 2 },
    { en: 'elephant', kr: '코끼리', pron: '엘리펀트', emoji: '🐘', theme: 'animal', level: 2 },
    { en: 'giraffe', kr: '기린', pron: '지라프', emoji: '🦒', theme: 'animal', level: 2 },
    { en: 'dolphin', kr: '돌고래', pron: '돌핀', emoji: '🐬', theme: 'animal', level: 2 },
    { en: 'penguin', kr: '펭귄', pron: '펭귄', emoji: '🐧', theme: 'animal', level: 2 },
    { en: 'kangaroo', kr: '캥거루', pron: '캥거루', emoji: '🦘', theme: 'animal', level: 2 },
    { en: 'butterfly', kr: '나비', pron: '버터플라이', emoji: '🦋', theme: 'animal', level: 2 },
    { en: 'turtle', kr: '거북이', pron: '터틀', emoji: '🐢', theme: 'animal', level: 2 },
    { en: 'whale', kr: '고래', pron: '웨일', emoji: '🐋', theme: 'animal', level: 2 },
    { en: 'shark', kr: '상어', pron: '샤크', emoji: '🦈', theme: 'animal', level: 2 },
    { en: 'library', kr: '도서관', pron: '라이브러리', emoji: '📚', theme: 'place', level: 2 },
    { en: 'hospital', kr: '병원', pron: '하스피털', emoji: '🏥', theme: 'place', level: 2 },
    { en: 'museum', kr: '박물관', pron: '뮤지엄', emoji: '🏛️', theme: 'place', level: 2 },
    { en: 'bakery', kr: '빵집', pron: '베이커리', emoji: '🥐', theme: 'place', level: 2 },
    { en: 'airport', kr: '공항', pron: '에어포트', emoji: '🛫', theme: 'place', level: 2 },
    { en: 'market', kr: '시장', pron: '마켓', emoji: '🛒', theme: 'place', level: 2 },
    { en: 'umbrella', kr: '우산', pron: '엄브렐러', emoji: '☂️', theme: 'object', level: 2 },
    { en: 'bicycle', kr: '자전거', pron: '바이시클', emoji: '🚲', theme: 'vehicle', level: 2 },
    { en: 'airplane', kr: '비행기', pron: '에어플레인', emoji: '✈️', theme: 'vehicle', level: 2 },
    { en: 'subway', kr: '지하철', pron: '서브웨이', emoji: '🚇', theme: 'vehicle', level: 2 },
    { en: 'mirror', kr: '거울', pron: '미러', emoji: '🪞', theme: 'object', level: 2 },
    { en: 'morning', kr: '아침', pron: '모닝', emoji: '🌅', theme: 'time', level: 2 },
    { en: 'afternoon', kr: '오후', pron: '애프터눈', emoji: '☀️', theme: 'time', level: 2 },
    { en: 'evening', kr: '저녁', pron: '이브닝', emoji: '🌆', theme: 'time', level: 2 },
    { en: 'tomorrow', kr: '내일', pron: '투모로우', emoji: '📅', theme: 'time', level: 2 },
    { en: 'yesterday', kr: '어제', pron: '예스터데이', emoji: '⏪', theme: 'time', level: 2 },
    { en: 'breakfast', kr: '아침식사', pron: '브렉퍼스트', emoji: '🍳', theme: 'food', level: 2 },
    { en: 'lunch', kr: '점심식사', pron: '런치', emoji: '🍱', theme: 'food', level: 2 },
    { en: 'dinner', kr: '저녁식사', pron: '디너', emoji: '🍽️', theme: 'food', level: 2 },
    { en: 'rainbow', kr: '무지개', pron: '레인보우', emoji: '🌈', theme: 'nature', level: 2 },
    { en: 'mountain', kr: '산', pron: '마운틴', emoji: '⛰️', theme: 'nature', level: 2 },
    { en: 'river', kr: '강', pron: '리버', emoji: '🏞️', theme: 'nature', level: 2 },
    { en: 'ocean', kr: '바다/대양', pron: '오션', emoji: '🌊', theme: 'nature', level: 2 },
    { en: 'forest', kr: '숲', pron: '포레스트', emoji: '🌲', theme: 'nature', level: 2 },
    { en: 'weather', kr: '날씨', pron: '웨더', emoji: '⛅', theme: 'nature', level: 2 },
    { en: 'spring', kr: '봄', pron: '스프링', emoji: '🌸', theme: 'nature', level: 2 },
    { en: 'summer', kr: '여름', pron: '서머', emoji: '🌻', theme: 'nature', level: 2 },
    { en: 'autumn', kr: '가을', pron: '오텀', emoji: '🍁', theme: 'nature', level: 2 },
    { en: 'winter', kr: '겨울', pron: '윈터', emoji: '⛄', theme: 'nature', level: 2 },
    { en: 'brave', kr: '용감한', pron: '브레이브', emoji: '🦁', theme: 'adjective', level: 2 },
    { en: 'smart', kr: '똑똑한', pron: '스마트', emoji: '🧠', theme: 'adjective', level: 2 },
    { en: 'strong', kr: '강한', pron: '스트롱', emoji: '💪', theme: 'adjective', level: 2 },
    { en: 'kind', kr: '친절한', pron: '카인드', emoji: '💖', theme: 'adjective', level: 2 },
    { en: 'police', kr: '경찰', pron: '폴리스', emoji: '👮', theme: 'job', level: 2 },
    { en: 'pilot', kr: '조종사', pron: '파일럿', emoji: '🧑‍✈️', theme: 'job', level: 2 },
    { en: 'artist', kr: '예술가/화가', pron: '아티스트', emoji: '🧑‍🎨', theme: 'job', level: 2 },
    { en: 'science', kr: '과학', pron: '사이언스', emoji: '🔬', theme: 'subject', level: 2 },
    { en: 'question', kr: '질문/문제', pron: '퀘스천', emoji: '❓', theme: 'study', level: 2 },
    { en: 'answer', kr: '정답/대답', pron: '앤서', emoji: '⭕', theme: 'study', level: 2 },
    { en: 'homework', kr: '숙제', pron: '홈워크', emoji: '📝', theme: 'study', level: 2 },
    { en: 'earth', kr: '지구', pron: '어스', emoji: '🌍', theme: 'space', level: 2 },

    // Level 3: Elementary 5th Grade Essential Vocabulary
    { en: 'island', kr: '섬', pron: '아일랜드', emoji: '🏝️', theme: 'nature', level: 3 },
    { en: 'desert', kr: '사막', pron: '데저트', emoji: '🏜️', theme: 'nature', level: 3 },
    { en: 'valley', kr: '계곡/골짜기', pron: '밸리', emoji: '🏞️', theme: 'nature', level: 3 },
    { en: 'beautiful', kr: '아름다운', pron: '뷰티풀', emoji: '✨', theme: 'adjective', level: 3 },
    { en: 'delicious', kr: '맛있는', pron: '딜리셔스', emoji: '😋', theme: 'adjective', level: 3 },
    { en: 'important', kr: '중요한', pron: '임포턴트', emoji: '⭐', theme: 'adjective', level: 3 },
    { en: 'different', kr: '다른', pron: '디퍼런트', emoji: '🔀', theme: 'adjective', level: 3 },
    { en: 'difficult', kr: '어려운', pron: '디피컬트', emoji: '🧩', theme: 'adjective', level: 3 },
    { en: 'healthy', kr: '건강한', pron: '헬시', emoji: '🥗', theme: 'adjective', level: 3 },
    { en: 'famous', kr: '유명한', pron: '페이머스', emoji: '🌟', theme: 'adjective', level: 3 },
    { en: 'careful', kr: '조심하는', pron: '케어풀', emoji: '⚠️', theme: 'adjective', level: 3 },
    { en: 'expensive', kr: '비싼', pron: '익스펜시브', emoji: '💎', theme: 'adjective', level: 3 },
    { en: 'cheap', kr: '값싼/저렴한', pron: '칩', emoji: '🏷️', theme: 'adjective', level: 3 },
    { en: 'heavy', kr: '무거운', pron: '헤비', emoji: '🏋️', theme: 'adjective', level: 3 },
    { en: 'light', kr: '가벼운/빛', pron: '라이트', emoji: '🪶', theme: 'adjective', level: 3 },
    { en: 'dangerous', kr: '위험한', pron: '데인저러스', emoji: '🚨', theme: 'adjective', level: 3 },
    { en: 'safe', kr: '안전한', pron: '세이프', emoji: '🛡️', theme: 'adjective', level: 3 },
    { en: 'special', kr: '특별한', pron: '스페셜', emoji: '🎁', theme: 'adjective', level: 3 },
    { en: 'popular', kr: '인기 있는', pron: '파퓰러', emoji: '🔥', theme: 'adjective', level: 3 },
    { en: 'firefighter', kr: '소방관', pron: '파이어파이터', emoji: '🧑‍🚒', theme: 'job', level: 3 },
    { en: 'scientist', kr: '과학자', pron: '사이언티스트', emoji: '🧑‍🔬', theme: 'job', level: 3 },
    { en: 'astronaut', kr: '우주비행사', pron: '애스트로넛', emoji: '🧑‍🚀', theme: 'job', level: 3 },
    { en: 'engineer', kr: '기술자/엔지니어', pron: '엔지니어', emoji: '⚙️', theme: 'job', level: 3 },
    { en: 'history', kr: '역사', pron: '히스토리', emoji: '📜', theme: 'subject', level: 3 },
    { en: 'dictionary', kr: '사전', pron: '딕셔너리', emoji: '📕', theme: 'study', level: 3 },
    { en: 'vacation', kr: '방학/휴가', pron: '베이케이션', emoji: '🏖️', theme: 'study', level: 3 },
    { en: 'festival', kr: '축제', pron: '페스티벌', emoji: '🎪', theme: 'culture', level: 3 },
    { en: 'culture', kr: '문화', pron: '컬처', emoji: '🎎', theme: 'culture', level: 3 },
    { en: 'planet', kr: '행성', pron: '플래닛', emoji: '🪐', theme: 'space', level: 3 },
    { en: 'universe', kr: '우주', pron: '유니버스', emoji: '🌌', theme: 'space', level: 3 },
    { en: 'future', kr: '미래', pron: '퓨처', emoji: '🚀', theme: 'concept', level: 3 },
    { en: 'promise', kr: '약속', pron: '프라미스', emoji: '🤙', theme: 'concept', level: 3 },
    { en: 'treasure', kr: '보물', pron: '트레저', emoji: '💎', theme: 'concept', level: 3 },
    { en: 'adventure', kr: '모험', pron: '어드벤처', emoji: '🧭', theme: 'concept', level: 3 },
    { en: 'victory', kr: '승리', pron: '빅토리', emoji: '✌️', theme: 'concept', level: 3 },
    { en: 'champion', kr: '챔피언/우승자', pron: '챔피언', emoji: '🥇', theme: 'concept', level: 3 },
    { en: 'medicine', kr: '약(의약품)', pron: '메디슨', emoji: '💊', theme: 'object', level: 3 },
    { en: 'exercise', kr: '운동하다/운동', pron: '엑서사이즈', emoji: '🏃', theme: 'daily', level: 3 },

    // Level 4: Elementary 5th~6th Grade Core & Advanced Vocabulary
    { en: 'environment', kr: '환경/자연환경', pron: '인바이런먼트', emoji: '🌱', theme: 'nature', level: 4 },
    { en: 'temperature', kr: '온도/기온', pron: '템퍼러처', emoji: '🌡️', theme: 'science', level: 4 },
    { en: 'experiment', kr: '실험', pron: '익스페리먼트', emoji: '🧪', theme: 'science', level: 4 },
    { en: 'invention', kr: '발명/발명품', pron: '인벤션', emoji: '💡', theme: 'science', level: 4 },
    { en: 'telescope', kr: '망원경', pron: '텔레스코프', emoji: '🔭', theme: 'space', level: 4 },
    { en: 'microscope', kr: '현미경', pron: '마이크로스코프', emoji: '🔬', theme: 'science', level: 4 },
    { en: 'continent', kr: '대륙', pron: '컨티넌트', emoji: '🗺️', theme: 'nature', level: 4 },
    { en: 'volcano', kr: '화산', pron: '볼케이노', emoji: '🌋', theme: 'nature', level: 4 },
    { en: 'earthquake', kr: '지진', pron: '어스퀘이크', emoji: '🫨', theme: 'nature', level: 4 },
    { en: 'hurricane', kr: '태풍/허리케인', pron: '허리케인', emoji: '🌀', theme: 'nature', level: 4 },
    { en: 'passenger', kr: '승객', pron: '패신저', emoji: '🧳', theme: 'vehicle', level: 4 },
    { en: 'destination', kr: '목적지', pron: '데스티네이션', emoji: '🏁', theme: 'vehicle', level: 4 },
    { en: 'schedule', kr: '일정/시간표', pron: '스케줄', emoji: '🗓️', theme: 'study', level: 4 },
    { en: 'education', kr: '교육', pron: '에듀케이션', emoji: '🎓', theme: 'study', level: 4 },
    { en: 'knowledge', kr: '지식', pron: '날리지', emoji: '📘', theme: 'study', level: 4 },
    { en: 'experience', kr: '경험', pron: '익스피리언스', emoji: '🌟', theme: 'concept', level: 4 },
    { en: 'recycle', kr: '재활용하다', pron: '리사이클', emoji: '♻️', theme: 'nature', level: 4 },
    { en: 'protect', kr: '보호하다', pron: '프로텍트', emoji: '🛡️', theme: 'nature', level: 4 },
    { en: 'tradition', kr: '전통', pron: '트래디션', emoji: '🏮', theme: 'culture', level: 4 },
    { en: 'invitation', kr: '초대/초대장', pron: '인비테이션', emoji: '💌', theme: 'culture', level: 4 },
    { en: 'ingredient', kr: '요리 재료/성분', pron: '인그리디언트', emoji: '🥕', theme: 'food', level: 4 },
    { en: 'recipe', kr: '요리법/레시피', pron: '레시피', emoji: '📖', theme: 'food', level: 4 },
    { en: 'volunteer', kr: '자원봉사자', pron: '발런티어', emoji: '🤝', theme: 'job', level: 4 },
    { en: 'comfortable', kr: '편안한', pron: '컴퍼터블', emoji: '🛋️', theme: 'adjective', level: 4 },
    { en: 'convenient', kr: '편리한', pron: '컨비니언트', emoji: '⚡', theme: 'adjective', level: 4 },
    { en: 'nervous', kr: '긴장한/초조한', pron: '너버스', emoji: '💓', theme: 'adjective', level: 4 },
    { en: 'proud', kr: '자랑스러워하는', pron: '프라우드', emoji: '🏅', theme: 'adjective', level: 4 },
    { en: 'curious', kr: '호기심이 많은', pron: '큐리어스', emoji: '🧐', theme: 'adjective', level: 4 },

    // Level 5: Elementary 6th Mastery ~ Middle School 1st Grade Bridge
    { en: 'imagination', kr: '상상력', pron: '이매지네이션', emoji: '🦄', theme: 'concept', level: 5 },
    { en: 'communication', kr: '의사소통/대화', pron: '커뮤니케이션', emoji: '💬', theme: 'concept', level: 5 },
    { en: 'opportunity', kr: '기회', pron: '오퍼튜니티', emoji: '🚪', theme: 'concept', level: 5 },
    { en: 'responsibility', kr: '책임감', pron: '리스판서빌리티', emoji: '🛡️', theme: 'concept', level: 5 },
    { en: 'achievement', kr: '성취/달성', pron: '어치브먼트', emoji: '🏅', theme: 'concept', level: 5 },
    { en: 'encourage', kr: '격려하다', pron: '인커리지', emoji: '👏', theme: 'adjective', level: 5 },
    { en: 'independent', kr: '독립적인/자립적인', pron: '인디펜던트', emoji: '🦅', theme: 'adjective', level: 5 },
    { en: 'magnificent', kr: '장엄한/멋진', pron: '매그니피선트', emoji: '👑', theme: 'adjective', level: 5 },
    { en: 'constellation', kr: '별자리', pron: '컨스털레이션', emoji: '✨', theme: 'space', level: 5 },
    { en: 'civilization', kr: '문명', pron: '시빌라이제이션', emoji: '🏛️', theme: 'subject', level: 5 },
    { en: 'pollution', kr: '오염/공해', pron: '폴루션', emoji: '🏭', theme: 'nature', level: 5 },
    { en: 'electricity', kr: '전기', pron: '일렉트리시티', emoji: '⚡', theme: 'science', level: 5 },
    { en: 'gravity', kr: '중력', pron: '그래비티', emoji: '🍎', theme: 'science', level: 5 },
    { en: 'population', kr: '인구', pron: '파퓰레이션', emoji: '👥', theme: 'subject', level: 5 },
    { en: 'government', kr: '정부', pron: '거번먼트', emoji: '🏛️', theme: 'subject', level: 5 },
    { en: 'international', kr: '국제적인', pron: '인터내셔널', emoji: '🌐', theme: 'adjective', level: 5 },
    { en: 'appointment', kr: '약속/예약', pron: '어포인트먼트', emoji: '🕐', theme: 'concept', level: 5 },
    { en: 'disappointed', kr: '실망한', pron: '디서포인티드', emoji: '😞', theme: 'adjective', level: 5 },
    { en: 'recommend', kr: '추천하다', pron: '레커멘드', emoji: '👍', theme: 'concept', level: 5 },
    { en: 'appreciate', kr: '감사하다/진가를 알다', pron: '어프리시에이트', emoji: '🙏', theme: 'concept', level: 5 }
  ];

  /**
   * Curated Elementary Conversational / Everyday English Expressions
   */
  const DAILY_ENGLISH_EXPRESSIONS = [
    // Level 1: Essential Everyday Expressions
    { en: "It's my turn.", kr: '내 차례야', emoji: '🎲', theme: 'turn', level: 1 },
    { en: "It's your turn.", kr: '네 차례야', emoji: '👉', theme: 'turn', level: 1 },
    { en: 'Wait a minute.', kr: '잠시만 기다려', emoji: '⏳', theme: 'daily', level: 1 },
    { en: 'Watch out!', kr: '조심해!', emoji: '⚠️', theme: 'daily', level: 1 },
    { en: 'Good job!', kr: '잘했어!', emoji: '👍', theme: 'praise', level: 1 },
    { en: 'Hurry up!', kr: '서둘러!', emoji: '🏃', theme: 'daily', level: 1 },
    { en: 'Cheer up!', kr: '힘내!', emoji: '💪', theme: 'praise', level: 1 },
    { en: "I'm hungry.", kr: '배고파요', emoji: '🍔', theme: 'feeling', level: 1 },
    { en: "I'm thirsty.", kr: '목말라요', emoji: '🥤', theme: 'feeling', level: 1 },
    { en: "I'm ready!", kr: '준비됐어!', emoji: '🚀', theme: 'turn', level: 1 },
    { en: 'Are you ready?', kr: '준비됐니?', emoji: '🏁', theme: 'turn', level: 1 },
    { en: 'Follow me.', kr: '나를 따라와', emoji: '👣', theme: 'daily', level: 1 },
    { en: 'See you later.', kr: '나중에 봐', emoji: '👋', theme: 'greeting', level: 1 },
    { en: "Don't worry.", kr: '걱정하지 마', emoji: '💖', theme: 'praise', level: 1 },
    { en: 'Excuse me.', kr: '실례합니다', emoji: '🙇', theme: 'greeting', level: 1 },

    // Level 2: Practical Elementary Conversation
    { en: 'Calm down.', kr: '진정해', emoji: '😌', theme: 'feeling', level: 2 },
    { en: 'Have a nice day!', kr: '좋은 하루 보내!', emoji: '☀️', theme: 'greeting', level: 2 },
    { en: 'Go ahead.', kr: '먼저 해 / 어서 해', emoji: '💁', theme: 'turn', level: 2 },
    { en: 'Hold on!', kr: '잠깐만 기다려!', emoji: '✋', theme: 'daily', level: 2 },
    { en: 'Never mind.', kr: '신경 쓰지 마 / 괜찮아', emoji: '🙂', theme: 'opinion', level: 2 },
    { en: 'Of course!', kr: '물론이지!', emoji: '⭕', theme: 'opinion', level: 2 },
    { en: 'No way!', kr: '말도 안 돼!', emoji: '😲', theme: 'feeling', level: 2 },
    { en: 'What time is it?', kr: '지금 몇 시야?', emoji: '⌚', theme: 'question', level: 2 },
    { en: 'How much is it?', kr: '이거 얼마예요?', emoji: '💵', theme: 'shopping', level: 2 },
    { en: 'Where are you going?', kr: '어디 가고 있니?', emoji: '🧭', theme: 'question', level: 2 },
    { en: 'What happened?', kr: '무슨 일 있었어?', emoji: '❓', theme: 'question', level: 2 },
    { en: 'Can you help me?', kr: '나 좀 도와줄래?', emoji: '🤝', theme: 'request', level: 2 },
    { en: 'Do your best!', kr: '최선을 다해!', emoji: '🔥', theme: 'praise', level: 2 },
    { en: 'Take your time.', kr: '천천히 여유 있게 해', emoji: '🐢', theme: 'daily', level: 2 },
    { en: 'Sounds great!', kr: '그거 좋은 생각이다!', emoji: '🎵', theme: 'opinion', level: 2 },
    { en: 'Time is up.', kr: '시간이 다 됐어', emoji: '⌛', theme: 'turn', level: 2 },
    { en: 'May I help you?', kr: '무엇을 도와드릴까요?', emoji: '💁‍♀️', theme: 'shopping', level: 2 },
    { en: "How's the weather?", kr: '오늘 날씨가 어때?', emoji: '⛅', theme: 'question', level: 2 },

    // Level 3: Upper Elementary Conversational Expressions
    { en: 'I have no idea.', kr: '전혀 모르겠어', emoji: '🤷', theme: 'opinion', level: 3 },
    { en: "It's up to you.", kr: '네 마음대로 해 (너에게 달렸어)', emoji: '✨', theme: 'opinion', level: 3 },
    { en: 'Make yourself at home.', kr: '내 집처럼 편하게 있어', emoji: '🏠', theme: 'daily', level: 3 },
    { en: "That's too bad.", kr: '그거 참 안됐다 / 아쉽네', emoji: '😢', theme: 'feeling', level: 3 },
    { en: 'Long time no see.', kr: '정말 오랜만이야', emoji: '🙌', theme: 'greeting', level: 3 },
    { en: 'Put on your coat.', kr: '외투(코트)를 입어라', emoji: '🧥', theme: 'daily', level: 3 },
    { en: 'Turn off the light.', kr: '불을 꺼 줘', emoji: '💡', theme: 'request', level: 3 },
    { en: 'I agree with you.', kr: '네 말에 동의해', emoji: '👌', theme: 'opinion', level: 3 },
    { en: 'Count on me!', kr: '나만 믿어!', emoji: '😎', theme: 'praise', level: 3 },
    { en: 'Give it a try!', kr: '한번 시도해 봐!', emoji: '🎯', theme: 'praise', level: 3 },
    { en: "I'm looking for my bag.", kr: '내 가방을 찾고 있어요', emoji: '🎒', theme: 'daily', level: 3 },
    { en: 'Can I try this on?', kr: '이거 입어 봐도 될까요?', emoji: '👗', theme: 'shopping', level: 3 },
    { en: 'Keep your promise.', kr: '약속을 꼭 지켜라', emoji: '🤙', theme: 'daily', level: 3 },
    { en: 'How often do you exercise?', kr: '얼마나 자주 운동하니?', emoji: '🏃', theme: 'question', level: 3 },
    { en: 'How long does it take?', kr: '시간이 얼마나 걸리나요?', emoji: '⏱️', theme: 'question', level: 3 }
  ];

  const _recentIds = [];
  const MAX_RECENT = 14;
  let _currentQuestion = null;

  const REVIEW_INTERVAL = 3;
  let _questionsSinceLastReview = 0;

  const _stageReadingTracker = {
    stage: 0,
    count: 0,
    limit: 2
  };

  function ensureStageReadingTracker(stageNum) {
    const stg = Math.max(1, parseInt(stageNum, 10) || 1);
    if (_stageReadingTracker.stage !== stg) {
      _stageReadingTracker.stage = stg;
      _stageReadingTracker.count = 0;
      _stageReadingTracker.limit = randomInt(2, 3);
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function rememberQuestionId(id) {
    if (!id) return;
    _recentIds.push(id);
    if (_recentIds.length > MAX_RECENT) {
      _recentIds.shift();
    }
  }

  function buildThreeLaneChoices(correctAnswerStr, distractor1Str, distractor2Str) {
    const raw = [
      { text: String(correctAnswerStr), isCorrect: true },
      { text: String(distractor1Str), isCorrect: false },
      { text: String(distractor2Str), isCorrect: false }
    ];
    const shuffled = shuffleArray(raw);
    const choices = shuffled.map(function (item) { return item.text; });
    const correctLane = shuffled.findIndex(function (item) { return item.isCorrect; });
    return {
      choices: choices,
      correctLane: correctLane !== -1 ? correctLane : 0
    };
  }

  function generateMathDistractors(correctVal, a, b, opType) {
    const candidates = [];

    if (opType === 'multiplication') {
      candidates.push(correctVal + a, correctVal - a, correctVal + b, correctVal - b);
      candidates.push(correctVal + 10, correctVal - 10, correctVal + 2, correctVal - 2, correctVal + 1, correctVal - 1);
    } else if (opType === 'division') {
      candidates.push(correctVal + 1, correctVal - 1, correctVal + 2, correctVal - 2);
      candidates.push(correctVal + 3, correctVal - 3, correctVal + 4, correctVal - 4, correctVal + 10, correctVal - 10);
    } else {
      const isAddition = (opType === 'addition' || opType === true);
      candidates.push(correctVal + 10, correctVal - 10, correctVal + 1, correctVal - 1, correctVal + 2, correctVal - 2);
      if (!isAddition && (a % 10) < (b % 10)) {
        const borrowMistake = (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + ((b % 10) - (a % 10));
        candidates.push(borrowMistake);
      }
      if (isAddition && ((a % 10) + (b % 10) >= 10)) {
        candidates.push(correctVal - 10);
      }
      candidates.push(correctVal + 9, correctVal - 9, correctVal + 3, correctVal - 3);
    }

    const validDistinct = [];
    const shuffledCandidates = shuffleArray(candidates);
    for (let i = 0; i < shuffledCandidates.length; i++) {
      const val = shuffledCandidates[i];
      if (val >= 2 && val !== correctVal && !validDistinct.includes(val)) {
        validDistinct.push(val);
        if (validDistinct.length >= 2) break;
      }
    }

    let offset = 1;
    while (validDistinct.length < 2) {
      const fallback = correctVal + offset;
      if (fallback >= 2 && fallback !== correctVal && !validDistinct.includes(fallback)) {
        validDistinct.push(fallback);
      }
      offset = offset > 0 ? -offset : (-offset + 1);
    }

    return [String(validDistinct[0]), String(validDistinct[1])];
  }

  /**
   * Generates a Fast Mental Arithmetic Question ("머리로 빠른 암산" + "천천히 단계별 상승"):
   * - 100% instant equation format ("🧮 24 + 18 = ?", "🧮 14 × 3 = ?", "🧮 48 ÷ 4 = ?", "🧮 10 + 3 × 4 = ?")
   * - Spread across 60+ stages so going up 1 stage nudges number ranges by only ~1.5%!
   */
  function generateMathQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);

    // Smooth continuous weights across Stage 1 -> Stage 60+
    // Stage 1~11: Pure +, -, ×, ÷ mental arithmetic
    // Stage 12+ : Gradually mixes 10% -> 24% short 3-number mental chain (e.g., 10 + 4 × 3 = ?)
    const s = stage;
    const wAdd  = Math.max(18, Math.round(30 - s * 0.22));
    const wSub  = Math.max(18, Math.round(28 - s * 0.20));
    const wMult = Math.min(34, Math.round(22 + s * 0.22));
    const wDiv  = Math.min(34, Math.round(20 + s * 0.22));
    const wMix  = s < 12 ? 0 : Math.min(22, Math.round((s - 11) * 0.45));

    const table = [
      { op: 'addition',       w: wAdd },
      { op: 'subtraction',    w: wSub },
      { op: 'multiplication', w: wMult },
      { op: 'division',       w: wDiv },
      { op: 'mixed_calc',     w: wMix }
    ];

    let totalW = 0;
    for (let i = 0; i < table.length; i++) totalW += table[i].w;
    let roll = Math.random() * totalW;
    let chosenOp = 'addition';
    for (let i = 0; i < table.length; i++) {
      if (roll < table[i].w) {
        chosenOp = table[i].op;
        break;
      }
      roll -= table[i].w;
    }

    // Ultra-gradual progression index: rises by only 0.25 per stage (takes 48 stages to reach diffStep = 12!)
    const diffStep = Math.min(14, (stage - 1) * 0.25);

    let a = 20;
    let b = 15;
    let answerVal = 35;
    let promptStr = '';
    let categoryLabel = '초등 수학 · 빠른 암산';
    let subPrompt = '빠르게 머리로 암산하여 정답 차선으로 달리세요!';
    let candidateId = '';

    for (let attempt = 0; attempt < 25; attempt++) {
      if (chosenOp === 'multiplication') {
        categoryLabel = '초등 수학 · 곱셈 빠른 암산';
        // Stage 1~4: diffStep < 1 -> very easy mental multiplication (11~15 × 2~3, 20×2, 30×2)
        // Stage 5~16: diffStep 1~3.75 -> 11~22 × 2~4
        // Stage 17~36: diffStep 4~8.75 -> 12~28 × 2~5
        // Stage 37+: diffStep 9~14 -> 12~32 × 2~6
        if (diffStep < 1.2) {
          const easyPoolA = [11, 12, 13, 14, 15, 20, 21, 22, 30];
          a = easyPoolA[randomInt(0, easyPoolA.length - 1)];
          b = randomInt(2, 3);
        } else if (diffStep < 4.0) {
          const medPoolA = [11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 24, 25, 30];
          a = medPoolA[randomInt(0, medPoolA.length - 1)];
          b = a >= 22 ? randomInt(2, 3) : randomInt(2, 4);
        } else {
          const maxA = Math.min(32, Math.round(16 + diffStep));
          a = randomInt(11, maxA);
          b = a >= 24 ? randomInt(2, 3) : (a >= 18 ? randomInt(2, 4) : randomInt(2, Math.min(6, 3 + Math.floor(diffStep / 4))));
        }
        answerVal = a * b;
        promptStr = `🧮 ${a} × ${b} = ?`;
        candidateId = `math_mult_${a}_${b}`;
      } else if (chosenOp === 'division') {
        categoryLabel = '초등 수학 · 나눗셈 빠른 암산';
        const maxB = Math.min(9, 4 + Math.floor(diffStep * 0.4));
        const minQ = Math.min(8, 3 + Math.floor(diffStep * 0.35));
        const maxQ = Math.min(22, Math.round(9 + diffStep));
        b = randomInt(2, maxB);
        const quotient = randomInt(minQ, maxQ);
        a = b * quotient;
        answerVal = quotient;
        promptStr = `🧮 ${a} ÷ ${b} = ?`;
        candidateId = `math_div_${a}_${b}`;
      } else if (chosenOp === 'mixed_calc') {
        categoryLabel = '초등 수학 · 혼합 암산';
        subPrompt = '곱셈·나눗셈이나 괄호 안을 먼저 암산하세요!';
        const pat = randomInt(1, 3);
        if (pat === 1) {
          // c + a × b
          const m1 = randomInt(2, Math.min(8, 3 + Math.floor(diffStep * 0.4)));
          const m2 = randomInt(2, Math.min(6, 3 + Math.floor(diffStep * 0.3)));
          const c = randomInt(5, Math.min(30, Math.round(10 + diffStep * 1.5)));
          a = m1;
          b = m2;
          answerVal = c + m1 * m2;
          promptStr = `🧮 ${c} + ${m1} × ${m2} = ?`;
          candidateId = `math_mix1_${c}_${m1}_${m2}`;
        } else if (pat === 2) {
          // c - a × b
          const m1 = randomInt(2, Math.min(7, 3 + Math.floor(diffStep * 0.35)));
          const m2 = randomInt(2, Math.min(5, 3 + Math.floor(diffStep * 0.25)));
          const c = m1 * m2 + randomInt(4, Math.min(25, Math.round(8 + diffStep)));
          a = m1;
          b = m2;
          answerVal = c - m1 * m2;
          promptStr = `🧮 ${c} - ${m1} × ${m2} = ?`;
          candidateId = `math_mix2_${c}_${m1}_${m2}`;
        } else {
          // (x + y) ÷ b
          b = randomInt(2, 5);
          answerVal = randomInt(3, Math.min(12, Math.round(5 + diffStep * 0.5)));
          const sum = b * answerVal;
          const x = Math.max(2, Math.floor(sum * 0.4));
          const y = sum - x;
          a = sum;
          promptStr = `🧮 (${x} + ${y}) ÷ ${b} = ?`;
          candidateId = `math_mix3_${x}_${y}_${b}`;
        }
      } else if (chosenOp === 'addition') {
        categoryLabel = '초등 수학 · 두 자리 덧셈 암산';
        const maxNum = Math.min(82, Math.round(24 + diffStep * 4.2));
        const carryProb = Math.min(0.72, 0.15 + diffStep * 0.042);
        a = randomInt(11, maxNum);
        if (Math.random() > carryProb) {
          const maxOnesB = Math.max(0, 9 - (a % 10));
          const maxTensB = Math.max(1, Math.min(4, Math.floor((maxNum - 10) / 10)));
          b = randomInt(1, maxTensB) * 10 + randomInt(0, maxOnesB);
        } else {
          b = randomInt(11, Math.min(59, maxNum));
        }
        answerVal = a + b;
        promptStr = `🧮 ${a} + ${b} = ?`;
        candidateId = `math_add_${a}_${b}`;
      } else {
        categoryLabel = '초등 수학 · 두 자리 뺄셈 암산';
        const maxNum = Math.min(92, Math.round(30 + diffStep * 4.5));
        const borrowProb = Math.min(0.72, 0.15 + diffStep * 0.042);
        a = randomInt(24, maxNum);
        if (Math.random() > borrowProb && (a % 10) >= 1) {
          const tensA = Math.floor(a / 10);
          const onesA = a % 10;
          const tensB = randomInt(1, Math.max(1, tensA - 1));
          const onesB = randomInt(0, onesA);
          b = tensB * 10 + onesB;
        } else {
          b = randomInt(11, a - 6);
        }
        if (b < 10) b = 10;
        if (a <= b + 1) a = Math.min(99, b + randomInt(5, 18));
        answerVal = a - b;
        promptStr = `🧮 ${a} - ${b} = ?`;
        candidateId = `math_sub_${a}_${b}`;
      }

      if (!_recentIds.includes(candidateId)) {
        rememberQuestionId(candidateId);
        break;
      }
    }

    const answerStr = String(answerVal);
    const distractors = generateMathDistractors(answerVal, a, b, chosenOp);
    const laneData = buildThreeLaneChoices(answerStr, distractors[0], distractors[1]);

    return {
      id: candidateId,
      category: 'math',
      categoryLabel: categoryLabel,
      subType: chosenOp,
      stage: stage,
      prompt: promptStr,
      subPrompt: subPrompt,
      choices: laneData.choices,
      correctLane: laneData.correctLane,
      answerText: answerStr,
      correctAnswer: answerStr,
      isReview: false,
      wrongCount: 0
    };
  }

  /**
   * Generates a Conversational English question with ultra-gradual stage progression
   */
  function generateDailyEnglishQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);
    // Rises by only +0.04 per stage across 50+ stages!
    const targetLv = Math.min(3.0, 1.0 + (stage - 1) * 0.04);
    let eligiblePool = DAILY_ENGLISH_EXPRESSIONS.filter(function (item) {
      return Math.abs(item.level - targetLv) <= 1.1;
    });
    if (eligiblePool.length < 5) {
      eligiblePool = DAILY_ENGLISH_EXPRESSIONS;
    }

    let targetExpr = eligiblePool[randomInt(0, eligiblePool.length - 1)];
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = eligiblePool[randomInt(0, eligiblePool.length - 1)];
      const candidateId = `expr_${candidate.en}`;
      if (!_recentIds.includes(candidateId)) {
        targetExpr = candidate;
        rememberQuestionId(candidateId);
        break;
      }
    }

    const sameThemePool = DAILY_ENGLISH_EXPRESSIONS.filter(function (item) {
      return item.en !== targetExpr.en && item.kr !== targetExpr.kr && item.theme === targetExpr.theme;
    });
    const otherPool = DAILY_ENGLISH_EXPRESSIONS.filter(function (item) {
      return item.en !== targetExpr.en && item.kr !== targetExpr.kr && item.theme !== targetExpr.theme;
    });

    const combinedDistractorPool = shuffleArray(sameThemePool).concat(shuffleArray(otherPool));
    const distractorExprs = [combinedDistractorPool[0], combinedDistractorPool[1]];

    const isKrToEn = Math.random() < 0.5;
    const emojiPrefix = targetExpr.emoji ? `${targetExpr.emoji} ` : '💬 ';

    if (isKrToEn) {
      const answerStr = targetExpr.en;
      const laneData = buildThreeLaneChoices(
        answerStr,
        distractorExprs[0].en,
        distractorExprs[1].en
      );

      return {
        id: `expr_kr2en_${targetExpr.en}`,
        category: 'english',
        categoryLabel: '실전 생활영어 · 한영 회화 퀴즈',
        subType: 'expr_kr_to_en',
        stage: stage,
        prompt: `${emojiPrefix}"${targetExpr.kr}"를 영어로 하면?`,
        subPrompt: '알맞은 생활영어 표현이 적힌 레인으로 달리세요!',
        choices: laneData.choices,
        correctLane: laneData.correctLane,
        answerText: answerStr,
        correctAnswer: answerStr,
        isReview: false,
        wrongCount: 0
      };
    } else {
      const answerStr = targetExpr.kr;
      const laneData = buildThreeLaneChoices(
        answerStr,
        distractorExprs[0].kr,
        distractorExprs[1].kr
      );

      return {
        id: `expr_en2kr_${targetExpr.en}`,
        category: 'english',
        categoryLabel: '실전 생활영어 · 영한 뜻 퀴즈',
        subType: 'expr_en_to_kr',
        stage: stage,
        prompt: `${emojiPrefix}"${targetExpr.en}"의 알맞은 뜻은?`,
        subPrompt: '알맞은 한글 뜻이 적힌 레인으로 달리세요!',
        choices: laneData.choices,
        correctLane: laneData.correctLane,
        answerText: answerStr,
        correctAnswer: answerStr,
        isReview: false,
        wrongCount: 0
      };
    }
  }

  function levenshteinDistance(a, b) {
    const s = String(a || '');
    const t = String(b || '');
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const dp = [];
    for (let i = 0; i <= s.length; i++) dp[i] = [i];
    for (let j = 0; j <= t.length; j++) dp[0][j] = j;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        const cost = s[i - 1] === t[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[s.length][t.length];
  }

  /**
   * Generates an Elementary English Question with ultra-slow 60-stage progression
   */
  function generateEnglishQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);
    ensureStageReadingTracker(stage);

    const dailyExprProb = Math.min(0.36, 0.24 + (stage - 1) * 0.004);
    if (Math.random() < dailyExprProb) {
      return generateDailyEnglishQuestion(stage);
    }

    // Ultra-gradual center level: starts at 1.25 on Stage 1 and rises by only +0.06 per stage!
    // Stage 1: 1.25 -> Stage 5: 1.49 -> Stage 10: 1.79 -> Stage 20: 2.39 -> Stage 35: 3.29 -> Stage 50: 4.19 -> Stage 60+: 4.85
    const centerLv = Math.min(4.85, 1.25 + (stage - 1) * 0.06);
    const weightedWords = [];
    for (let i = 0; i < ENGLISH_DICTIONARY.length; i++) {
      const w = ENGLISH_DICTIONARY[i];
      const dist = Math.abs(w.level - centerLv);
      if (dist <= 1.35) {
        const copies = dist <= 0.55 ? 3 : (dist <= 0.95 ? 2 : 1);
        for (let c = 0; c < copies; c++) weightedWords.push(w);
      }
    }
    const eligiblePool = weightedWords.length >= 8 ? weightedWords : ENGLISH_DICTIONARY;

    const canAskReadingQuiz = _stageReadingTracker.count < _stageReadingTracker.limit;
    const isReadingQuiz = canAskReadingQuiz && (Math.random() < 0.25);

    const readingPool = isReadingQuiz
      ? eligiblePool.filter(function (w) { return Boolean(w.pron); })
      : eligiblePool;
    const activePool = readingPool.length > 0 ? readingPool : eligiblePool;

    let targetWord = activePool[randomInt(0, activePool.length - 1)];
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = activePool[randomInt(0, activePool.length - 1)];
      const candidateId = isReadingQuiz ? `eng_pron_${candidate.en}` : `eng_${candidate.en}`;
      if (!_recentIds.includes(candidateId)) {
        targetWord = candidate;
        rememberQuestionId(candidateId);
        break;
      }
    }

    const sameThemePool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr && w.pron !== targetWord.pron &&
             Math.abs(w.level - targetWord.level) <= 1 && w.theme === targetWord.theme;
    });
    const otherPool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr && w.pron !== targetWord.pron &&
             Math.abs(w.level - targetWord.level) <= 1 && w.theme !== targetWord.theme;
    });
    const fallbackPool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr && w.pron !== targetWord.pron;
    });

    const combinedDistractorPool = shuffleArray(sameThemePool)
      .concat(shuffleArray(otherPool))
      .concat(shuffleArray(fallbackPool));
    const distractorWords = [combinedDistractorPool[0], combinedDistractorPool[1]];

    if (isReadingQuiz && targetWord.pron) {
      _stageReadingTracker.count += 1;
      const upperEn = targetWord.en.toUpperCase();
      const answerStr = targetWord.pron;
      const laneData = buildThreeLaneChoices(
        answerStr,
        distractorWords[0].pron || distractorWords[0].kr,
        distractorWords[1].pron || distractorWords[1].kr
      );

      return {
        id: `eng_pron_${targetWord.en}`,
        category: 'english',
        categoryLabel: '초등 영어 · 영단어 발음 읽기 퀴즈',
        subType: 'en_to_pron',
        stage: stage,
        prompt: `🔊 "${upperEn}" 어떻게 읽을까요?`,
        subPrompt: `영어 단어 "${upperEn}"(${targetWord.kr})를 한국어로 읽은 발음 레인으로 달리세요!`,
        choices: laneData.choices,
        correctLane: laneData.correctLane,
        answerText: answerStr,
        correctAnswer: answerStr,
        isReview: false,
        wrongCount: 0
      };
    }

    const isKrToEn = Math.random() < 0.5;
    const emojiPrefix = targetWord.emoji ? `${targetWord.emoji} ` : '🔤 ';

    if (isKrToEn) {
      const answerStr = targetWord.en;
      const laneData = buildThreeLaneChoices(
        answerStr,
        distractorWords[0].en,
        distractorWords[1].en
      );

      return {
        id: `eng_kr2en_${targetWord.en}`,
        category: 'english',
        categoryLabel: '초등 영어 · 한영 어휘 퀴즈',
        subType: 'kr_to_en',
        stage: stage,
        prompt: `${emojiPrefix}'${targetWord.kr}'의 영어 단어는?`,
        subPrompt: '알맞은 영어 단어가 있는 레인으로 달리세요!',
        choices: laneData.choices,
        correctLane: laneData.correctLane,
        answerText: answerStr,
        correctAnswer: answerStr,
        isReview: false,
        wrongCount: 0
      };
    } else {
      const answerStr = targetWord.kr;
      const laneData = buildThreeLaneChoices(
        answerStr,
        distractorWords[0].kr,
        distractorWords[1].kr
      );

      return {
        id: `eng_en2kr_${targetWord.en}`,
        category: 'english',
        categoryLabel: '초등 영어 · 영한 뜻 퀴즈',
        subType: 'en_to_kr',
        stage: stage,
        prompt: `${emojiPrefix}'${targetWord.en}'의 알맞은 뜻은?`,
        subPrompt: '알맞은 한글 뜻이 있는 레인으로 달리세요!',
        choices: laneData.choices,
        correctLane: laneData.correctLane,
        answerText: answerStr,
        correctAnswer: answerStr,
        isReview: false,
        wrongCount: 0
      };
    }
  }

  function buildReviewQuestionFromQueueItem(queuedItem, stageNum) {
    const answerStr = String(
      queuedItem.answerText !== undefined
        ? queuedItem.answerText
        : (queuedItem.correctAnswer !== undefined ? queuedItem.correctAnswer : '')
    );

    const isSpeechItem =
      queuedItem.subType === 'pronunciation' ||
      Boolean(queuedItem.isSpeech) ||
      String(queuedItem.id || '').startsWith('speech_');

    if (isSpeechItem) {
      return generateEnglishQuestion(stageNum || 1);
    }

    let distractors = [];
    if (Array.isArray(queuedItem.choices)) {
      distractors = queuedItem.choices
        .map(String)
        .filter(function (c) { return c !== answerStr; });
    }
    const isExpr = String(queuedItem.id || '').startsWith('expr_') || String(queuedItem.subType || '').startsWith('expr_');
    const isPron = String(queuedItem.id || '').startsWith('eng_pron_') || queuedItem.subType === 'en_to_pron';
    while (distractors.length < 2) {
      if (queuedItem.category === 'math') {
        const numVal = parseInt(answerStr, 10) || 50;
        const fallbackVal = numVal + (distractors.length === 0 ? 10 : -1);
        distractors.push(String(Math.max(2, fallbackVal)));
      } else if (isExpr) {
        const fallbackExpr = DAILY_ENGLISH_EXPRESSIONS[randomInt(0, DAILY_ENGLISH_EXPRESSIONS.length - 1)];
        const candidate = /^[a-zA-Z\s',.!?-]+$/.test(answerStr) ? fallbackExpr.en : fallbackExpr.kr;
        if (candidate !== answerStr && !distractors.includes(candidate)) {
          distractors.push(candidate);
        }
      } else if (isPron) {
        const fallbackWord = ENGLISH_DICTIONARY[randomInt(0, ENGLISH_DICTIONARY.length - 1)];
        const candidate = fallbackWord.pron || fallbackWord.kr;
        if (candidate !== answerStr && !distractors.includes(candidate)) {
          distractors.push(candidate);
        }
      } else {
        const fallbackWord = ENGLISH_DICTIONARY[randomInt(0, ENGLISH_DICTIONARY.length - 1)];
        const candidate = /^[a-zA-Z\s-]+$/.test(answerStr) ? fallbackWord.en : fallbackWord.kr;
        if (candidate !== answerStr && !distractors.includes(candidate)) {
          distractors.push(candidate);
        }
      }
    }

    const laneData = buildThreeLaneChoices(answerStr, distractors[0], distractors[1]);
    const cleanPrompt = String(queuedItem.prompt || '').replace(/^\[오답\s*복습\]\s*/i, '');

    return {
      id: queuedItem.id || `review_${Date.now()}`,
      category: queuedItem.category || 'math',
      categoryLabel: queuedItem.category === 'english'
        ? (isExpr ? '🔄 오답 복습 · 실전 생활영어' : (isPron ? '🔄 오답 복습 · 영단어 발음 읽기' : '🔄 오답 복습 · 초등 영단어'))
        : '🔄 오답 복습 · 초등 수학 연산',
      subType: queuedItem.subType || 'review',
      stage: stageNum || 1,
      prompt: cleanPrompt,
      subPrompt: '⚠️ 이전에 틀렸던 문제입니다! 다시 도전해 마스터하세요!',
      choices: laneData.choices,
      correctLane: laneData.correctLane,
      answerText: answerStr,
      correctAnswer: answerStr,
      isReview: true,
      wrongCount: queuedItem.wrongCount || 1
    };
  }

  const QuestionEngine = {
    nextQuestion: function (stageOrOpts, subjectModeArg, optionsArg) {
      const saveState = (window.SaveManager && window.SaveManager.getState)
        ? window.SaveManager.getState()
        : null;

      let stage = saveState ? saveState.currentStage : 1;
      let subjectMode = saveState ? saveState.subjectMode : 'mixed';
      let options = {};

      if (typeof stageOrOpts === 'object' && stageOrOpts !== null) {
        options = stageOrOpts;
        if (options.stage !== undefined) stage = options.stage;
        if (options.subjectMode !== undefined) subjectMode = options.subjectMode;
      } else {
        if (typeof stageOrOpts === 'number' && !isNaN(stageOrOpts)) {
          stage = stageOrOpts;
        }
        if (typeof subjectModeArg === 'string' && subjectModeArg) {
          subjectMode = subjectModeArg;
        }
        if (typeof optionsArg === 'object' && optionsArg !== null) {
          options = optionsArg;
        }
      }

      const queue = (saveState && Array.isArray(saveState.wrongAnswerQueue))
        ? saveState.wrongAnswerQueue
        : [];

      if (queue.length > 0) {
        const matchingQueue = (subjectMode === 'math' || subjectMode === 'english')
          ? queue.filter(function (item) { return item && item.category === subjectMode; })
          : queue;

        const activeQueue = matchingQueue.length > 0 ? matchingQueue : queue;

        _questionsSinceLastReview += 1;
        if (options.forceReview || _questionsSinceLastReview >= REVIEW_INTERVAL) {
          _questionsSinceLastReview = 0;
          const queuedItem = activeQueue[0];
          if (queuedItem) {
            _currentQuestion = buildReviewQuestionFromQueueItem(queuedItem, stage);
            return _currentQuestion;
          }
        }
      } else {
        _questionsSinceLastReview = 0;
      }

      let chosenCategory = 'math';
      if (subjectMode === 'math') {
        chosenCategory = 'math';
      } else if (subjectMode === 'english') {
        chosenCategory = 'english';
      } else {
        chosenCategory = Math.random() < 0.5 ? 'math' : 'english';
      }

      if (chosenCategory === 'math') {
        _currentQuestion = generateMathQuestion(stage);
      } else {
        _currentQuestion = generateEnglishQuestion(stage);
      }

      return _currentQuestion;
    },

    generateQuestion: function (stage, subjectMode, options) {
      return this.nextQuestion(stage, subjectMode, options);
    },

    getQuestion: function (stage, subjectMode, options) {
      return this.nextQuestion(stage, subjectMode, options);
    },

    getCurrentQuestion: function () {
      if (!_currentQuestion) {
        return this.nextQuestion();
      }
      return _currentQuestion;
    },

    recordResult: function (questionOrLane, selectedLaneArg) {
      let q = _currentQuestion;
      let selectedLane = -1;

      if (typeof questionOrLane === 'number') {
        selectedLane = questionOrLane;
      } else if (questionOrLane && typeof questionOrLane === 'object') {
        q = questionOrLane;
        selectedLane = typeof selectedLaneArg === 'number' ? selectedLaneArg : -1;
      }

      if (!q) {
        q = this.nextQuestion();
      }

      const isCorrect = q.isSpeech
        ? Boolean(q.speechPassed)
        : (selectedLane === q.correctLane);
      const selectedChoiceText = q.isSpeech
        ? (q.speechPassed ? String(q.spokenText || q.answerText) : '발음 미인식')
        : ((Array.isArray(q.choices) && selectedLane >= 0 && selectedLane < q.choices.length)
            ? String(q.choices[selectedLane])
            : '시간 초과');

      if (window.SaveManager && typeof window.SaveManager.recordAnswer === 'function') {
        window.SaveManager.recordAnswer(q, selectedChoiceText, isCorrect);
      }

      if (!isCorrect && window.SaveManager) {
        const state = window.SaveManager.getState();
        if (state && Array.isArray(state.wrongAnswerQueue) && state.wrongAnswerQueue.length > 1) {
          const idx = state.wrongAnswerQueue.findIndex(function (item) {
            return item && (item.id === q.id || item.prompt === q.prompt);
          });
          if (idx === 0) {
            const first = state.wrongAnswerQueue.shift();
            state.wrongAnswerQueue.push(first);
            window.SaveManager.save();
          }
        }
      }

      return {
        isCorrect: isCorrect,
        correctLane: q.correctLane,
        answerText: q.answerText,
        selectedChoice: selectedChoiceText,
        isReview: Boolean(q.isReview),
        question: q
      };
    },

    checkSpeechMatch: function (transcript, questionObj) {
      const q = questionObj || _currentQuestion;
      if (!q || !transcript) return false;
      const targetEn = String(q.targetWord || q.answerText || '').toLowerCase().trim();
      if (!targetEn) return false;

      const cleanedRaw = String(transcript)
        .toLowerCase()
        .replace(/[.,!?'"`~()[\]{}-]/g, ' ')
        .trim();
      if (!cleanedRaw) return false;

      if (cleanedRaw.includes(targetEn)) return true;
      if (q.targetPron && cleanedRaw.includes(String(q.targetPron).trim())) return true;

      const aliases = Array.isArray(q.speechAliases) ? q.speechAliases : [];
      for (let i = 0; i < aliases.length; i++) {
        const alias = String(aliases[i] || '').toLowerCase().trim();
        if (alias && cleanedRaw.includes(alias)) return true;
      }

      const tokens = cleanedRaw.split(/\s+/).filter(Boolean);
      for (let t = 0; t < tokens.length; t++) {
        const tok = tokens[t];
        if (tok === targetEn) return true;
        const dist = levenshteinDistance(tok, targetEn);
        if (targetEn.length <= 4 && dist <= 1 && tok.length >= 2 && tok[0] === targetEn[0]) {
          return true;
        }
        if (targetEn.length >= 5 && dist <= 2) {
          return true;
        }
      }

      return false;
    },

    forceAddWrongQuestion: function (customQuestion) {
      const sample = (customQuestion && typeof customQuestion === 'object')
        ? customQuestion
        : generateMathQuestion(1);

      const wrongChoice = Array.isArray(sample.choices)
        ? (sample.choices.find(function (c) { return String(c) !== String(sample.answerText); }) || '오답')
        : '오답';

      if (window.SaveManager && typeof window.SaveManager.enqueueWrongQuestion === 'function') {
        window.SaveManager.enqueueWrongQuestion(sample, wrongChoice, true);
      }

      _questionsSinceLastReview = REVIEW_INTERVAL;
      return sample;
    },

    resetStageCounters: function (stageNum) {
      const stg = Math.max(1, parseInt(stageNum, 10) || 1);
      _stageReadingTracker.stage = stg;
      _stageReadingTracker.count = 0;
      _stageReadingTracker.limit = randomInt(2, 3);
    },

    getDictionaryCount: function () {
      return ENGLISH_DICTIONARY.length;
    }
  };

  window.QuestionEngine = QuestionEngine;
})(window);
