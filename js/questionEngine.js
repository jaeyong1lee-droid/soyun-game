/**
 * Run & Learn Racer 3D (런앤런 레이서 3D)
 * Elementary 5th~6th Grade Progressive Quiz Generator & Spaced Repetition System
 *
 * Features:
 * 1. Step-by-Step Progressive Elementary Math (Stage 1 ~ 20+):
 *    - Stage 1~2 : 2-digit Addition/Subtraction with carry/borrow, Basic 2-digit × 1-digit, Division
 *    - Stage 3~5 : Intermediate Multiplication/Division, 5th-Grade Mixed Operations (혼합계산), Basic GCD/LCM (최대공약수·최소공배수)
 *    - Stage 6~9 : Fraction Reduction (약분) & Decimal Operations (소수 연산), Polygon Area (다각형 넓이), Intermediate Mixed Ops & GCD/LCM
 *    - Stage 10~14: 6th-Grade Proportions (비례식 a:b=c:□), Percentages (백분율 %), Fraction ×/÷ Whole Numbers, Decimal ×/÷
 *    - Stage 15+ : Unknown □ Equations (등식 □ 구하기), Averages (평균), & Full 5th~6th Grade Mastery Mix
 * 2. Step-by-Step Progressive Elementary English (Stage 1 ~ 20+):
 *    - Sliding-window vocabulary levels (Level 1 -> Level 5, phasing out overly easy words as Stage increases)
 *    - 5th~6th Grade Irregular Past Tense / Antonyms / Key Idioms & Prepositions (replacing toddler phonetic reading on higher stages)
 *    - Progressive Conversational English & Q&A Responses (Level 1 -> Level 4)
 * 3. Spaced Repetition Wrong Answer Re-Appearance System (Every 3rd question, stage-aware)
 */
(function (window) {
  'use strict';

  /**
   * Curated Elementary School English Vocabulary (165+ words across 5 progressive difficulty levels)
   * - Level 1: Stage 1~3 Warm-up (Elementary 3~4 core)
   * - Level 2: Stage 2~6 Core (Elementary 4~5 core)
   * - Level 3: Stage 4~10 Intermediate (Elementary 5 core)
   * - Level 4: Stage 7~15 Advanced (Elementary 6 core)
   * - Level 5: Stage 11+ Mastery (Elementary 6 Challenge ~ Middle 1)
   */
  const ENGLISH_DICTIONARY = [
    // Level 1: Warm-up Core Words (Stage 1~3 only; phased out from Stage 4+)
    { en: 'school', kr: '학교', pron: '스쿨', emoji: '🏫', theme: 'school', level: 1 },
    { en: 'teacher', kr: '선생님', pron: '티처', emoji: '👩‍🏫', theme: 'school', level: 1 },
    { en: 'student', kr: '학생', pron: '스튜던트', emoji: '🧑‍🎓', theme: 'school', level: 1 },
    { en: 'notebook', kr: '공책', pron: '노트북', emoji: '📓', theme: 'school', level: 1 },
    { en: 'family', kr: '가족', pron: '패밀리', emoji: '👨‍👩‍👧‍👦', theme: 'family', level: 1 },
    { en: 'friend', kr: '친구', pron: '프렌드', emoji: '🤝', theme: 'family', level: 1 },
    { en: 'water', kr: '물', pron: '워터', emoji: '💧', theme: 'food', level: 1 },
    { en: 'bread', kr: '빵', pron: '브레드', emoji: '🍞', theme: 'food', level: 1 },
    { en: 'cheese', kr: '치즈', pron: '치즈', emoji: '🧀', theme: 'food', level: 1 },
    { en: 'watermelon', kr: '수박', pron: '워터멜론', emoji: '🍉', theme: 'food', level: 1 },
    { en: 'strawberry', kr: '딸기', pron: '스트로베리', emoji: '🍓', theme: 'food', level: 1 },
    { en: 'tiger', kr: '호랑이', pron: '타이거', emoji: '🐯', theme: 'animal', level: 1 },
    { en: 'rabbit', kr: '토끼', pron: '래빗', emoji: '🐰', theme: 'animal', level: 1 },
    { en: 'monkey', kr: '원숭이', pron: '멍키', emoji: '🐵', theme: 'animal', level: 1 },
    { en: 'horse', kr: '말', pron: '홀스', emoji: '🐴', theme: 'animal', level: 1 },
    { en: 'clock', kr: '시계', pron: '클락', emoji: '⏰', theme: 'object', level: 1 },
    { en: 'window', kr: '창문', pron: '윈도우', emoji: '🪟', theme: 'object', level: 1 },
    { en: 'cloud', kr: '구름', pron: '클라우드', emoji: '☁️', theme: 'nature', level: 1 },
    { en: 'wind', kr: '바람', pron: '윈드', emoji: '🌬️', theme: 'nature', level: 1 },
    { en: 'music', kr: '음악', pron: '뮤직', emoji: '🎵', theme: 'subject', level: 1 },

    // Level 2: Elementary 4~5 Core Words (Stage 1~6)
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
    { en: 'autumn', kr: '가을', pron: '오텀', emoji: '🍁', theme: 'nature', level: 2 },
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

    // Level 3: Elementary 5th Grade Essential Vocabulary (Stage 3~10)
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

    // Level 4: Elementary 5th~6th Grade Core & Advanced Vocabulary (Stage 6~15)
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

    // Level 5: Elementary 6th Mastery ~ Middle School 1st Grade Bridge (Stage 10+)
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
   * 5th~6th Grade Essential Grammar, Irregular Verbs, Antonyms & Key Idioms (단계별 출제)
   * - Replaces toddler phonetic reading ("APPLE -> 애플") from Stage 3+!
   */
  const GRAMMAR_AND_WORD_RELATIONS = [
    // Level 1 (Stage 2~5): Basic Past Tense & Antonyms
    { level: 1, prompt: "🔤 동사 'go (가다)'의 과거형은?", answer: 'went', d1: 'goed', d2: 'gone', label: '초등 영문법 · 불규칙 과거형' },
    { level: 1, prompt: "🔤 동사 'see (보다)'의 과거형은?", answer: 'saw', d1: 'seed', d2: 'seen', label: '초등 영문법 · 불규칙 과거형' },
    { level: 1, prompt: "🔤 동사 'eat (먹다)'의 과거형은?", answer: 'ate', d1: 'eated', d2: 'eaten', label: '초등 영문법 · 불규칙 과거형' },
    { level: 1, prompt: "🔤 동사 'have (가지다)'의 과거형은?", answer: 'had', d1: 'haved', d2: 'has', label: '초등 영문법 · 불규칙 과거형' },
    { level: 1, prompt: "🔤 동사 'make (만들다)'의 과거형은?", answer: 'made', d1: 'maked', d2: 'making', label: '초등 영문법 · 불규칙 과거형' },
    { level: 1, prompt: "🔤 'fast (빠른)'의 반대말(반의어)은?", answer: 'slow', d1: 'high', d2: 'long', label: '초등 어휘 · 반대말 찾기' },
    { level: 1, prompt: "🔤 'easy (쉬운)'의 반대말(반의어)은?", answer: 'difficult', d1: 'different', d2: 'delicious', label: '초등 어휘 · 반대말 찾기' },
    { level: 1, prompt: "🔤 'hot (뜨거운)'의 반대말(반의어)은?", answer: 'cold', d1: 'cool', d2: 'warm', label: '초등 어휘 · 반대말 찾기' },

    // Level 2 (Stage 4~9): 5th Grade Irregular Past, Comparatives & Antonyms
    { level: 2, prompt: "🔤 동사 'buy (사다)'의 과거형은?", answer: 'bought', d1: 'buyed', d2: 'brought', label: '초등 5학년 · 불규칙 과거형' },
    { level: 2, prompt: "🔤 동사 'take (가져가다)'의 과거형은?", answer: 'took', d1: 'taked', d2: 'taken', label: '초등 5학년 · 불규칙 과거형' },
    { level: 2, prompt: "🔤 동사 'write (쓰다)'의 과거형은?", answer: 'wrote', d1: 'writed', d2: 'written', label: '초등 5학년 · 불규칙 과거형' },
    { level: 2, prompt: "🔤 동사 'run (달리다)'의 과거형은?", answer: 'ran', d1: 'runned', d2: 'running', label: '초등 5학년 · 불규칙 과거형' },
    { level: 2, prompt: "🔤 동사 'swim (수영하다)'의 과거형은?", answer: 'swam', d1: 'swimmed', d2: 'swum', label: '초등 5학년 · 불규칙 과거형' },
    { level: 2, prompt: "🔤 'expensive (비싼)'의 반대말은?", answer: 'cheap', d1: 'heavy', d2: 'rich', label: '초등 5학년 · 반의어 퀴즈' },
    { level: 2, prompt: "🔤 'heavy (무거운)'의 반대말은?", answer: 'light', d1: 'short', d2: 'weak', label: '초등 5학년 · 반의어 퀴즈' },
    { level: 2, prompt: "🔤 'dangerous (위험한)'의 반대말은?", answer: 'safe', d1: 'strong', d2: 'careful', label: '초등 5학년 · 반의어 퀴즈' },
    { level: 2, prompt: "🔤 'early (이른/일찍)'의 반대말은?", answer: 'late', d1: 'fast', d2: 'last', label: '초등 5학년 · 반의어 퀴즈' },
    { level: 2, prompt: "🔤 'good (좋은)'의 비교급(더 좋은)은?", answer: 'better', d1: 'gooder', d2: 'best', label: '초등 5~6학년 · 비교급' },

    // Level 3 (Stage 7~14): 6th Grade Irregular Verbs, Superlatives & Key Idioms
    { level: 3, prompt: "🔤 동사 'teach (가르치다)'의 과거형은?", answer: 'taught', d1: 'teached', d2: 'thought', label: '초등 6학년 · 불규칙 과거형' },
    { level: 3, prompt: "🔤 동사 'catch (잡다)'의 과거형은?", answer: 'caught', d1: 'catched', d2: 'coated', label: '초등 6학년 · 불규칙 과거형' },
    { level: 3, prompt: "🔤 동사 'bring (가져오다)'의 과거형은?", answer: 'brought', d1: 'bringed', d2: 'bought', label: '초등 6학년 · 불규칙 과거형' },
    { level: 3, prompt: "🔤 동사 'think (생각하다)'의 과거형은?", answer: 'thought', d1: 'thinked', d2: 'taught', label: '초등 6학년 · 불규칙 과거형' },
    { level: 3, prompt: "🔤 동사 'speak (말하다)'의 과거형은?", answer: 'spoke', d1: 'speaked', d2: 'spoken', label: '초등 6학년 · 불규칙 과거형' },
    { level: 3, prompt: "🔤 'borrow (빌리다)'의 반대말(빌려주다)은?", answer: 'lend', d1: 'send', d2: 'spend', label: '초등 6학년 · 핵심 반의어' },
    { level: 3, prompt: '🔤 빈칸: "I am interested ___ science." (~에 관심 있다)', answer: 'in', d1: 'on', d2: 'at', label: '초등 6학년 · 핵심 숙어' },
    { level: 3, prompt: '🔤 빈칸: "She is good ___ swimming." (~을 잘하다)', answer: 'at', d1: 'in', d2: 'for', label: '초등 6학년 · 핵심 숙어' },
    { level: 3, prompt: '🔤 빈칸: "Please take care ___ my dog." (~을 돌보다)', answer: 'of', d1: 'to', d2: 'with', label: '초등 6학년 · 핵심 숙어' },
    { level: 3, prompt: '🔤 빈칸: "I am looking ___ my bag." (~을 찾다)', answer: 'for', d1: 'at', d2: 'after', label: '초등 6학년 · 핵심 숙어' },

    // Level 4 (Stage 11+): Advanced 6th Grade ~ Middle 1 Grammar & Idioms
    { level: 4, prompt: '🔤 빈칸: "I am proud ___ you!" (~을 자랑스러워하다)', answer: 'of', d1: 'for', d2: 'with', label: '초6 심화 · 필수 숙어' },
    { level: 4, prompt: '🔤 빈칸: "I look forward ___ the trip." (~을 학수고대하다)', answer: 'to', d1: 'for', d2: 'at', label: '초6 심화 · 필수 숙어' },
    { level: 4, prompt: '🔤 빈칸: "Turn ___ the light, please." (불을 끄다)', answer: 'off', d1: 'out', d2: 'down', label: '초6 심화 · 필수 숙어' },
    { level: 4, prompt: "🔤 'important (중요한)'의 비교급 표현은?", answer: 'more important', d1: 'importanter', d2: 'most important', label: '초6 심화 · 비교급 문법' },
    { level: 4, prompt: "🔤 동사 'choose (선택하다)'의 과거형은?", answer: 'chose', d1: 'choosed', d2: 'chosen', label: '초6 심화 · 불규칙 과거형' },
    { level: 4, prompt: "🔤 동사 'forget (잊다)'의 과거형은?", answer: 'forgot', d1: 'forgetted', d2: 'forgotten', label: '초6 심화 · 불규칙 과거형' }
  ];

  /**
   * Curated Elementary Conversational / Everyday English Expressions (생활영어 회화 & Q&A 응답)
   */
  const DAILY_ENGLISH_EXPRESSIONS = [
    // Level 1: Basic Everyday Expressions (Stage 1~4 only)
    { en: "It's my turn.", kr: '내 차례야', emoji: '🎲', theme: 'turn', level: 1 },
    { en: 'Wait a minute.', kr: '잠시만 기다려', emoji: '⏳', theme: 'daily', level: 1 },
    { en: 'Watch out!', kr: '조심해!', emoji: '⚠️', theme: 'daily', level: 1 },
    { en: 'Hurry up!', kr: '서둘러!', emoji: '🏃', theme: 'daily', level: 1 },
    { en: 'Cheer up!', kr: '힘내!', emoji: '💪', theme: 'praise', level: 1 },
    { en: "I'm ready!", kr: '준비됐어!', emoji: '🚀', theme: 'turn', level: 1 },
    { en: 'Are you ready?', kr: '준비됐니?', emoji: '🏁', theme: 'turn', level: 1 },
    { en: 'Follow me.', kr: '나를 따라와', emoji: '👣', theme: 'daily', level: 1 },
    { en: 'See you later.', kr: '나중에 봐', emoji: '👋', theme: 'greeting', level: 1 },
    { en: "Don't worry.", kr: '걱정하지 마', emoji: '💖', theme: 'praise', level: 1 },
    { en: 'Excuse me.', kr: '실례합니다', emoji: '🙇', theme: 'greeting', level: 1 },

    // Level 2: Practical Elementary 4~5 Conversation (Stage 2~8)
    { en: 'Calm down.', kr: '진정해', emoji: '😌', theme: 'feeling', level: 2 },
    { en: 'Have a nice day!', kr: '좋은 하루 보내!', emoji: '☀️', theme: 'greeting', level: 2 },
    { en: 'Go ahead.', kr: '먼저 해 / 어서 해', emoji: '💁', theme: 'turn', level: 2 },
    { en: 'Hold on!', kr: '잠깐만 기다려!', emoji: '✋', theme: 'daily', level: 2 },
    { en: 'Never mind.', kr: '신경 쓰지 마 / 괜찮아', emoji: '🙂', theme: 'opinion', level: 2 },
    { en: 'Of course!', kr: '물론이지!', emoji: '⭕', theme: 'opinion', level: 2 },
    { en: 'No way!', kr: '말도 안 돼!', emoji: '😲', theme: 'feeling', level: 2 },
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

    // Level 3: Elementary 5~6 Conversational Expressions (Stage 5~13)
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
    { en: 'How long does it take?', kr: '시간이 얼마나 걸리나요?', emoji: '⏱️', theme: 'question', level: 3 },

    // Level 4: Elementary 6th Grade Key Situational Dialogues (Stage 9+)
    { en: 'What do you recommend?', kr: '무엇을 추천하시나요?', emoji: '🍽️', theme: 'shopping', level: 4 },
    { en: 'Could you explain that again?', kr: '다시 한번 설명해 주실래요?', emoji: '🙋', theme: 'request', level: 4 },
    { en: "I'm looking forward to it.", kr: '그것이 정말 기대돼요', emoji: '🌟', theme: 'feeling', level: 4 },
    { en: 'Practice makes perfect.', kr: '연습이 완벽을 만든다', emoji: '🏆', theme: 'praise', level: 4 },
    { en: 'Better late than never.', kr: '늦더라도 안 하는 것보다 낫다', emoji: '⏰', theme: 'opinion', level: 4 },
    { en: 'Why don’t we join the club?', kr: '우리 동아리에 함께 가입하는 게 어때?', emoji: '🤝', theme: 'question', level: 4 },
    { en: 'May I take your order?', kr: '주문하시겠어요?', emoji: '🧾', theme: 'shopping', level: 4 },
    { en: 'How can I get to the museum?', kr: '박물관에 어떻게 가나요?', emoji: '🗺️', theme: 'question', level: 4 }
  ];

  // Track recent prompts to prevent immediate back-to-back duplicates
  const _recentIds = [];
  const MAX_RECENT = 14;
  let _currentQuestion = null;

  // Spaced repetition counter: serve a review question every 3rd question so current-stage progression stays strong!
  const REVIEW_INTERVAL = 3;
  let _questionsSinceLastReview = 0;

  // Per-stage cap for special reading/grammar questions
  const _stageReadingTracker = {
    stage: 0,
    count: 0,
    limit: 3
  };

  function ensureStageReadingTracker(stageNum) {
    const stg = Math.max(1, parseInt(stageNum, 10) || 1);
    if (_stageReadingTracker.stage !== stg) {
      _stageReadingTracker.stage = stg;
      _stageReadingTracker.count = 0;
      _stageReadingTracker.limit = randomInt(2, 4);
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
    } else if (opType === 'division' || opType === 'gcd_lcm' || opType === 'equation' || opType === 'proportion') {
      candidates.push(correctVal + 1, correctVal - 1, correctVal + 2, correctVal - 2);
      candidates.push(correctVal + 3, correctVal - 3, correctVal + 4, correctVal - 4, correctVal + 6, correctVal - 6);
      if (correctVal >= 6) candidates.push(correctVal * 2, Math.max(2, Math.floor(correctVal / 2)));
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
      candidates.push(correctVal + 9, correctVal - 9, correctVal + 3, correctVal - 3, correctVal + 5, correctVal - 5);
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

  function gcd(x, y) {
    let a = Math.abs(x);
    let b = Math.abs(y);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  /**
   * Generates a Stage-Progressive Elementary 5th~6th Grade Math Question!
   * Difficulty rises moderately and smoothly stage-by-stage (Stage 1 -> Stage 20+):
   * - Stage 1~2 : 2-digit +/-, Basic ×/÷ (4th~5th warm-up)
   * - Stage 3~5 : Intermediate ×/÷ + 5th Grade Mixed Calculation (혼합계산) + Basic GCD/LCM (약수·배수)
   * - Stage 6~9 : Fraction Reduction (약분) + Decimal +/-/× (소수 연산) + Polygon Area (도형 넓이) + Mixed Ops
   * - Stage 10~14: 6th Grade Proportions (비례식 a:b=c:□) + Percentages (백분율 %) + Fraction ×/÷
   * - Stage 15+ : Unknown □ Equations (방정식 □) + Averages (평균) + Full 5th~6th Mastery
   */
  function generateMathQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);

    // Smooth stage-by-stage weighted pool of math question types
    let weightedTypes = [];
    if (stage === 1) {
      weightedTypes = ['addition', 'addition', 'subtraction', 'subtraction', 'multiplication', 'division'];
    } else if (stage === 2) {
      weightedTypes = ['addition', 'subtraction', 'multiplication', 'multiplication', 'division', 'division'];
    } else if (stage === 3) {
      weightedTypes = ['addition', 'subtraction', 'multiplication', 'multiplication', 'division', 'division', 'mixed_calc'];
    } else if (stage === 4) {
      weightedTypes = ['multiplication', 'multiplication', 'division', 'division', 'mixed_calc', 'mixed_calc', 'gcd_lcm'];
    } else if (stage === 5) {
      weightedTypes = ['multiplication', 'division', 'mixed_calc', 'mixed_calc', 'gcd_lcm', 'gcd_lcm', 'decimal_op'];
    } else if (stage <= 7) {
      weightedTypes = ['multiplication', 'division', 'mixed_calc', 'mixed_calc', 'gcd_lcm', 'fraction_reduce', 'decimal_op', 'polygon_area'];
    } else if (stage <= 9) {
      weightedTypes = ['mixed_calc', 'gcd_lcm', 'fraction_reduce', 'fraction_op', 'decimal_op', 'polygon_area', 'proportion'];
    } else if (stage <= 12) {
      weightedTypes = ['mixed_calc', 'gcd_lcm', 'fraction_op', 'decimal_op', 'polygon_area', 'proportion', 'proportion', 'percentage'];
    } else if (stage <= 15) {
      weightedTypes = ['mixed_calc', 'fraction_op', 'decimal_op', 'proportion', 'percentage', 'percentage', 'equation_box'];
    } else {
      weightedTypes = ['mixed_calc', 'fraction_op', 'decimal_op', 'proportion', 'percentage', 'equation_box', 'equation_box', 'average_stat'];
    }

    const chosenOp = weightedTypes[randomInt(0, weightedTypes.length - 1)];

    for (let attempt = 0; attempt < 25; attempt++) {
      let prompt = '';
      let subPrompt = '암산하여 정답 게이트로 차선을 변경하세요!';
      let categoryLabel = '초등 5~6학년 수학';
      let answerStr = '';
      let d1 = '';
      let d2 = '';
      let qId = '';

      if (chosenOp === 'mixed_calc') {
        // 5학년 1학기 1단원: 자연수의 혼합계산 (곱셈·나눗셈 먼저, 또는 괄호 먼저!)
        categoryLabel = '초등 5학년 수학 · 자연수의 혼합계산';
        subPrompt = '곱셈·나눗셈이나 괄호 안을 먼저 계산하세요!';
        const pat = randomInt(1, stage >= 7 ? 4 : 3);
        if (pat === 1) {
          // c + a × b
          const a = randomInt(3, Math.min(9, 4 + Math.floor(stage / 2)));
          const b = randomInt(2, Math.min(8, 3 + Math.floor(stage / 3)));
          const c = randomInt(6, 25);
          const ans = c + a * b;
          prompt = `🧮 ${c} + ${a} × ${b} = ?`;
          answerStr = String(ans);
          // Common mistake: (c + a) * b
          const wrongOrder = (c + a) * b;
          const dists = generateMathDistractors(ans, a, b, 'addition');
          d1 = wrongOrder !== ans ? String(wrongOrder) : dists[0];
          d2 = dists[1] !== d1 ? dists[1] : String(ans + 4);
          qId = `math_mix1_${c}_${a}_${b}`;
        } else if (pat === 2) {
          // c - a × b (ensure positive result)
          const a = randomInt(2, 7);
          const b = randomInt(2, 6);
          const c = a * b + randomInt(5, 24);
          const ans = c - a * b;
          prompt = `🧮 ${c} - ${a} × ${b} = ?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, a, b, 'subtraction');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_mix2_${c}_${a}_${b}`;
        } else if (pat === 3) {
          // (a + b) ÷ c
          const c = randomInt(2, 6);
          const ans = randomInt(4, 12);
          const sum = c * ans;
          const a = randomInt(Math.floor(sum * 0.3), Math.floor(sum * 0.7));
          const b = sum - a;
          prompt = `🧮 (${a} + ${b}) ÷ ${c} = ?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, a, c, 'division');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_mix3_${a}_${b}_${c}`;
        } else {
          // a × b - c ÷ d
          const a = randomInt(4, 8);
          const b = randomInt(3, 6);
          const d = randomInt(2, 5);
          const q = randomInt(2, 5);
          const c = d * q;
          const ans = a * b - q;
          prompt = `🧮 ${a} × ${b} - ${c} ÷ ${d} = ?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, a, b, 'subtraction');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_mix4_${a}_${b}_${c}_${d}`;
        }
      } else if (chosenOp === 'gcd_lcm') {
        // 5학년 1학기 2단원: 최대공약수(GCD) & 최소공배수(LCM)
        const pairs = stage <= 6
          ? [
              [4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [6, 15], [9, 12], [10, 15]
            ]
          : [
              [6, 8], [8, 12], [9, 12], [12, 16], [12, 18], [15, 20], [14, 21], [16, 24], [18, 24]
            ];
        const pair = pairs[randomInt(0, pairs.length - 1)];
        const x = pair[0];
        const y = pair[1];
        const g = gcd(x, y);
        const l = (x * y) / g;
        const askLcm = Math.random() < 0.5;
        if (askLcm) {
          categoryLabel = '초등 5학년 수학 · 최소공배수';
          subPrompt = '두 수의 공통된 배수 중 가장 작은 수를 찾으세요!';
          prompt = `🧮 ${x}과(와) ${y}의 최소공배수는?`;
          answerStr = String(l);
          d1 = String(x * y !== l ? x * y : l + x);
          d2 = String(g !== l ? (l + y) : l + 4);
          if (d1 === answerStr) d1 = String(l + 6);
          if (d2 === answerStr || d2 === d1) d2 = String(Math.max(4, l - g));
          qId = `math_lcm_${x}_${y}`;
        } else {
          categoryLabel = '초등 5학년 수학 · 최대공약수';
          subPrompt = '두 수를 동시에 나누는 가장 큰 약수를 찾으세요!';
          prompt = `🧮 ${x}과(와) ${y}의 최대공약수는?`;
          answerStr = String(g);
          const dists = generateMathDistractors(g, x, y, 'gcd_lcm');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_gcd_${x}_${y}`;
        }
      } else if (chosenOp === 'fraction_reduce') {
        // 5학년 1학기 4단원: 약분과 통분 (기약분수 만들기)
        categoryLabel = '초등 5학년 수학 · 분수의 약분';
        subPrompt = '분자와 분모를 최대공약수로 나누어 기약분수로 만드세요!';
        const baseFracs = [
          { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 },
          { n: 1, d: 4 }, { n: 3, d: 4 }, { n: 2, d: 5 },
          { n: 3, d: 5 }, { n: 4, d: 5 }, { n: 3, d: 7 }
        ];
        const f = baseFracs[randomInt(0, baseFracs.length - 1)];
        const mult = randomInt(2, stage >= 9 ? 5 : 3);
        const rawN = f.n * mult;
        const rawD = f.d * mult;
        prompt = `🧮 분수 ${rawN}/${rawD} 을 기약분수로 약분하면?`;
        answerStr = `${f.n}/${f.d}`;
        d1 = `${Math.min(f.d - 1, f.n + 1)}/${f.d + 1}`;
        d2 = `${f.n}/${f.d + 2}`;
        if (d1 === answerStr) d1 = `${f.n + 1}/${f.d + 2}`;
        qId = `math_red_${rawN}_${rawD}`;
      } else if (chosenOp === 'fraction_op') {
        // 5~6학년: 분수의 곱셈·나눗셈 (자연수 결과가 나오는 깔끔한 암산 문제!)
        categoryLabel = '초등 5~6학년 수학 · 분수의 곱셈·나눗셈';
        subPrompt = '분모와 자연수를 먼저 약분하면 암산이 쉬워요!';
        const isDiv = stage >= 10 && Math.random() < 0.45;
        if (!isDiv) {
          // Whole * (num/den)
          const den = randomInt(3, 7);
          const num = randomInt(1, den - 1);
          const k = randomInt(2, 5);
          const whole = den * k;
          const ans = num * k;
          prompt = `🧮 ${whole} × ${num}/${den} = ?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, num, den, 'division');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_fmult_${whole}_${num}_${den}`;
        } else {
          // Whole ÷ (1/den) or Whole ÷ (num/den)
          const den = randomInt(2, 6);
          const whole = randomInt(2, 6);
          const ans = whole * den;
          prompt = `🧮 ${whole} ÷ 1/${den} = ?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, whole, den, 'multiplication');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_fdiv_${whole}_${den}`;
        }
      } else if (chosenOp === 'decimal_op') {
        // 5~6학년: 소수의 덧셈·뺄셈·곱셈·나눗셈
        categoryLabel = '초등 5~6학년 수학 · 소수 암산';
        subPrompt = '소수점의 위치를 잘 보고 계산하세요!';
        if (stage <= 7) {
          // Decimal addition or subtraction: e.g. 0.6 + 0.8 = 1.4, 2.3 - 0.7 = 1.6
          const a10 = randomInt(4, 18);
          const b10 = randomInt(3, 14);
          const isAdd = Math.random() < 0.55 || a10 <= b10 + 1;
          const ans10 = isAdd ? (a10 + b10) : (a10 - b10);
          const fmt = function (v) { return (v / 10).toFixed(1).replace(/\.0$/, ''); };
          prompt = `🧮 ${(a10 / 10).toFixed(1)} ${isAdd ? '+' : '-'} ${(b10 / 10).toFixed(1)} = ?`;
          answerStr = (ans10 / 10).toFixed(1);
          d1 = ((ans10 + 2) / 10).toFixed(1);
          d2 = (Math.max(1, ans10 - 1) / 10).toFixed(1);
          if (d2 === answerStr) d2 = ((ans10 + 4) / 10).toFixed(1);
          qId = `math_dec1_${a10}_${b10}_${isAdd ? 'p' : 'm'}`;
        } else {
          // Decimal multiplication or division: e.g. 1.5 × 4 = 6, 3.6 ÷ 0.9 = 4
          if (Math.random() < 0.5) {
            const pairs = [
              ['0.5', 4, '2'], ['0.5', 6, '3'], ['1.5', 2, '3'], ['1.5', 4, '6'],
              ['2.5', 2, '5'], ['2.5', 4, '10'], ['1.2', 5, '6'], ['0.4', 5, '2'],
              ['0.8', 5, '4'], ['1.5', 6, '9']
            ];
            const p = pairs[randomInt(0, pairs.length - 1)];
            prompt = `🧮 ${p[0]} × ${p[1]} = ?`;
            answerStr = p[2];
            const ansNum = parseInt(p[2], 10);
            d1 = String(ansNum + 2);
            d2 = String(Math.max(1, ansNum - 1));
            qId = `math_decm_${p[0]}_${p[1]}`;
          } else {
            const d = randomInt(2, 9);
            const q = randomInt(3, 9);
            const prod10 = d * q;
            prompt = `🧮 ${(prod10 / 10).toFixed(1)} ÷ 0.${d} = ?`;
            answerStr = String(q);
            const dists = generateMathDistractors(q, d, q, 'division');
            d1 = dists[0];
            d2 = dists[1];
            qId = `math_decd_${prod10}_${d}`;
          }
        }
      } else if (chosenOp === 'polygon_area') {
        // 5학년 1학기 6단원: 다각형의 둘레와 넓이 (직사각형, 평행사변형, 삼각형 넓이)
        categoryLabel = '초등 5학년 수학 · 도형의 넓이';
        const isTriangle = Math.random() < 0.5;
        if (isTriangle) {
          const base = randomInt(2, 6) * 2; // even base so base*height/2 is integer
          const height = randomInt(3, 9);
          const ans = (base * height) / 2;
          prompt = `📐 밑변 ${base}cm, 높이 ${height}cm인 삼각형의 넓이는?`;
          subPrompt = '삼각형의 넓이 = (밑변 × 높이) ÷ 2';
          answerStr = String(ans);
          d1 = String(base * height); // common mistake: forgetting ÷ 2
          d2 = String(ans + base);
          qId = `math_tri_${base}_${height}`;
        } else {
          const w = randomInt(4, 11);
          const h = randomInt(3, 9);
          const ans = w * h;
          prompt = `📐 가로 ${w}cm, 세로 ${h}cm인 직사각형의 넓이는?`;
          subPrompt = '직사각형의 넓이 = 가로 × 세로';
          answerStr = String(ans);
          d1 = String((w + h) * 2); // perimeter mistake
          d2 = String(ans + w);
          if (d1 === answerStr) d1 = String(ans - h);
          qId = `math_rect_${w}_${h}`;
        }
      } else if (chosenOp === 'proportion') {
        // 6학년 2학기 4단원: 비례식과 비례배분 (a : b = c : □)
        categoryLabel = '초등 6학년 수학 · 비례식';
        subPrompt = '전항과 후항에 같은 수를 곱하거나 외항의 곱 = 내항의 곱을 이용하세요!';
        const a = randomInt(2, 6);
        const b = randomInt(a + 1, 9);
        const k = randomInt(2, 5);
        const c = a * k;
        const ans = b * k;
        prompt = `🧮 비례식 ${a} : ${b} = ${c} : □ 에서 □는?`;
        answerStr = String(ans);
        const dists = generateMathDistractors(ans, a, b, 'proportion');
        d1 = dists[0];
        d2 = dists[1];
        qId = `math_prop_${a}_${b}_${k}`;
      } else if (chosenOp === 'percentage') {
        // 6학년 1학기 4단원: 비와 비율 · 백분율(%)
        categoryLabel = '초등 6학년 수학 · 비율과 백분율(%)';
        subPrompt = '백분율(%)은 기준량을 100으로 할 때의 비율입니다!';
        if (Math.random() < 0.5) {
          const fracPct = [
            { f: '1/2', p: 50 }, { f: '1/4', p: 25 }, { f: '3/4', p: 75 },
            { f: '1/5', p: 20 }, { f: '2/5', p: 40 }, { f: '3/5', p: 60 },
            { f: '4/5', p: 80 }, { f: '3/10', p: 30 }, { f: '7/10', p: 70 }
          ];
          const item = fracPct[randomInt(0, fracPct.length - 1)];
          prompt = `🧮 분수 ${item.f} 을 백분율(%)로 나타내면?`;
          answerStr = `${item.p}%`;
          d1 = `${Math.min(95, item.p + 15)}%`;
          d2 = `${Math.max(5, item.p - 10)}%`;
          qId = `math_pctf_${item.f}`;
        } else {
          const bases = [100, 200, 300, 500];
          const base = bases[randomInt(0, bases.length - 1)];
          const pcts = [10, 20, 25, 30, 40, 50];
          const pct = pcts[randomInt(0, pcts.length - 1)];
          const ans = (base * pct) / 100;
          prompt = `🧮 ${base}의 ${pct}%는 얼마일까요?`;
          answerStr = String(ans);
          const dists = generateMathDistractors(ans, 10, 5, 'addition');
          d1 = dists[0];
          d2 = dists[1];
          qId = `math_pctv_${base}_${pct}`;
        }
      } else if (chosenOp === 'equation_box') {
        // 초6 심화 ~ 중1 일차방정식 기초: a × □ + b = c
        categoryLabel = '초등 6학년 심화 · 미지수 □ 구하기';
        subPrompt = '등식이 성립하도록 □ 안에 들어갈 알맞은 수를 암산하세요!';
        const a = randomInt(2, 6);
        const x = randomInt(3, 9);
        const b = randomInt(3, 12);
        const c = a * x + b;
        prompt = `🧮 ${a} × □ + ${b} = ${c} 에서 □는?`;
        answerStr = String(x);
        const dists = generateMathDistractors(x, a, b, 'equation');
        d1 = dists[0];
        d2 = dists[1];
        qId = `math_eq_${a}_${x}_${b}`;
      } else if (chosenOp === 'average_stat') {
        // 5학년 2학기 6단원: 평균과 가능성
        categoryLabel = '초등 5~6학년 수학 · 평균 구하기';
        subPrompt = '세 수의 합을 3으로 나누거나 가운데 기준값을 찾으세요!';
        const mid = randomInt(6, 18) * 5;
        const step = randomInt(1, 4) * 5;
        const n1 = mid - step;
        const n2 = mid;
        const n3 = mid + step;
        prompt = `📊 세 수 (${n1}, ${n2}, ${n3})의 평균은?`;
        answerStr = String(mid);
        d1 = String(mid + 5);
        d2 = String(mid - 5);
        qId = `math_avg_${n1}_${n2}_${n3}`;
      } else {
        // Core arithmetic (+, -, ×, ÷) with smooth stage scaling
        let a = 20;
        let b = 15;
        let answerVal = 35;
        let opSymbol = '+';

        if (chosenOp === 'multiplication') {
          opSymbol = '×';
          categoryLabel = '초등 수학 · 두 자리 곱셈 암산';
          subPrompt = '십의 자리와 일의 자리를 나누어 암산해 보세요!';
          const diffStep = Math.min(12, Math.floor((stage - 1) * 0.75));
          if (diffStep <= 1) {
            const easyPoolA = [12, 13, 14, 15, 16, 20, 21, 25];
            a = easyPoolA[randomInt(0, easyPoolA.length - 1)];
            b = randomInt(2, 4);
          } else {
            const maxA = Math.min(35, 16 + diffStep);
            a = randomInt(12, maxA);
            b = a >= 25 ? randomInt(2, 4) : randomInt(3, Math.min(7, 3 + Math.floor(diffStep / 2)));
          }
          answerVal = a * b;
        } else if (chosenOp === 'division') {
          opSymbol = '÷';
          categoryLabel = '초등 수학 · 나눗셈 암산';
          subPrompt = '나누어떨어지는 나눗셈의 몫을 찾으세요!';
          const diffStep = Math.min(12, Math.floor((stage - 1) * 0.75));
          const maxB = Math.min(9, 5 + Math.floor(diffStep * 0.5));
          const minQ = Math.min(9, 4 + Math.floor(diffStep * 0.5));
          const maxQ = Math.min(24, 11 + diffStep);
          b = randomInt(3, maxB);
          const quotient = randomInt(minQ, maxQ);
          a = b * quotient;
          answerVal = quotient;
        } else if (chosenOp === 'addition') {
          opSymbol = '+';
          categoryLabel = '초등 수학 · 두 자리 덧셈 암산';
          const diffStep = Math.min(12, stage);
          const maxNum = Math.min(88, 32 + diffStep * 5);
          a = randomInt(16, maxNum);
          b = randomInt(14, Math.min(68, maxNum));
          answerVal = a + b;
        } else {
          opSymbol = '-';
          categoryLabel = '초등 수학 · 두 자리 뺄셈 암산';
          const diffStep = Math.min(12, stage);
          const maxNum = Math.min(96, 42 + diffStep * 5);
          a = randomInt(32, maxNum);
          b = randomInt(14, a - 8);
          answerVal = a - b;
        }

        prompt = `🧮 ${a} ${opSymbol} ${b} = ?`;
        answerStr = String(answerVal);
        const dists = generateMathDistractors(answerVal, a, b, chosenOp);
        d1 = dists[0];
        d2 = dists[1];
        qId = `math_${chosenOp}_${a}_${b}`;
      }

      if (!_recentIds.includes(qId) || attempt === 24) {
        rememberQuestionId(qId);
        const laneData = buildThreeLaneChoices(answerStr, d1, d2);
        return {
          id: qId,
          category: 'math',
          categoryLabel: categoryLabel,
          subType: chosenOp,
          stage: stage,
          prompt: prompt,
          subPrompt: subPrompt,
          choices: laneData.choices,
          correctLane: laneData.correctLane,
          answerText: answerStr,
          correctAnswer: answerStr,
          isReview: false,
          wrongCount: 0
        };
      }
    }
  }

  /**
   * Generates a Stage-Progressive Conversational English question
   * Uses a sliding window [minExprLevel, maxExprLevel] so easy phrases phase out on higher stages!
   */
  function generateDailyEnglishQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);
    const minExprLevel = stage <= 3 ? 1 : (stage <= 8 ? 2 : 3);
    const maxExprLevel = stage <= 2 ? 1 : (stage <= 5 ? 2 : (stage <= 9 ? 3 : 4));

    let eligiblePool = DAILY_ENGLISH_EXPRESSIONS.filter(function (item) {
      return item.level >= minExprLevel && item.level <= maxExprLevel;
    });
    if (eligiblePool.length < 5) {
      eligiblePool = DAILY_ENGLISH_EXPRESSIONS.filter(function (item) {
        return item.level <= maxExprLevel;
      });
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
        categoryLabel: '초등 5~6학년 생활영어 · 한영 회화',
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
        categoryLabel: '초등 5~6학년 생활영어 · 영한 해석',
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

  /**
   * Generates a 5th~6th Grade Grammar / Irregular Past / Antonym / Idiom Question
   */
  function generateGrammarRelationQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);
    const minLv = stage <= 4 ? 1 : (stage <= 8 ? 2 : 3);
    const maxLv = stage <= 3 ? 1 : (stage <= 6 ? 2 : (stage <= 10 ? 3 : 4));

    let pool = GRAMMAR_AND_WORD_RELATIONS.filter(function (g) {
      return g.level >= minLv && g.level <= maxLv;
    });
    if (pool.length < 4) {
      pool = GRAMMAR_AND_WORD_RELATIONS.filter(function (g) {
        return g.level <= maxLv;
      });
    }

    let item = pool[randomInt(0, pool.length - 1)];
    for (let attempt = 0; attempt < 20; attempt++) {
      const cand = pool[randomInt(0, pool.length - 1)];
      const cid = `gram_${cand.answer}_${cand.d1}`;
      if (!_recentIds.includes(cid)) {
        item = cand;
        rememberQuestionId(cid);
        break;
      }
    }

    const laneData = buildThreeLaneChoices(item.answer, item.d1, item.d2);
    return {
      id: `gram_${item.answer}_${item.d1}`,
      category: 'english',
      categoryLabel: item.label || '초등 5~6학년 핵심 영문법·어휘',
      subType: 'grammar_relation',
      stage: stage,
      prompt: item.prompt,
      subPrompt: '문법과 어휘 관계에 맞는 정답 레인으로 달리세요!',
      choices: laneData.choices,
      correctLane: laneData.correctLane,
      answerText: item.answer,
      correctAnswer: item.answer,
      isReview: false,
      wrongCount: 0
    };
  }

  /**
   * Stage-progressive English Pronunciation (Speaking) Word List
   */
  const PRONUNCIATION_WORDS = [
    { en: 'apple', kr: '사과', pron: '애플', emoji: '🍎', level: 1, aliases: ['apples', '애플', '사과'] },
    { en: 'library', kr: '도서관', pron: '라이브러리', emoji: '📚', level: 2, aliases: ['라이브러리', '도서관'] },
    { en: 'hospital', kr: '병원', pron: '하스피털', emoji: '🏥', level: 2, aliases: ['하스피털', '병원'] },
    { en: 'adventure', kr: '모험', pron: '어드벤처', emoji: '🧭', level: 3, aliases: ['어드벤처', '모험'] },
    { en: 'environment', kr: '환경', pron: '인바이런먼트', emoji: '🌱', level: 4, aliases: ['인바이런먼트', '환경'] }
  ];

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
   * Generates a Stage-Progressive Elementary 5th~6th Grade English Question:
   * - Sliding Window [minWordLevel, maxWordLevel] so Stage 4+ automatically phases out Level 1 words!
   *   - Stage 1~2 : Level 1 ~ 2
   *   - Stage 3~4 : Level 2 ~ 3
   *   - Stage 5~7 : Level 2 ~ 3 (mostly Level 3)
   *   - Stage 8~10: Level 3 ~ 4 (no Level 1 or 2!)
   *   - Stage 11~14: Level 4 ~ 5
   *   - Stage 15+ : Level 4 ~ 5 Mastery
   */
  function generateEnglishQuestion(stageNum) {
    const stage = Math.max(1, parseInt(stageNum, 10) || 1);
    ensureStageReadingTracker(stage);

    // 1. Everyday Conversational English (~26% -> 34%)
    const dailyExprProb = Math.min(0.34, 0.24 + (stage - 1) * 0.01);
    if (Math.random() < dailyExprProb) {
      return generateDailyEnglishQuestion(stage);
    }

    // 2. From Stage 2+, include 5th~6th Grade Grammar / Irregular Past / Antonyms / Idioms (2~4 per stage)
    if (stage >= 2 && _stageReadingTracker.count < _stageReadingTracker.limit && Math.random() < 0.34) {
      _stageReadingTracker.count += 1;
      return generateGrammarRelationQuestion(stage);
    }

    // 3. Sliding-Window Vocabulary Level Selection (Gradually rises with Stage!)
    let minWordLevel = 1;
    let maxWordLevel = 2;
    if (stage === 1) {
      minWordLevel = 1; maxWordLevel = 2;
    } else if (stage === 2) {
      minWordLevel = 1; maxWordLevel = 2;
    } else if (stage <= 4) {
      minWordLevel = 2; maxWordLevel = 3;
    } else if (stage <= 6) {
      minWordLevel = 2; maxWordLevel = 3;
    } else if (stage <= 9) {
      minWordLevel = 3; maxWordLevel = 4;
    } else if (stage <= 13) {
      minWordLevel = 3; maxWordLevel = 5;
    } else {
      minWordLevel = 4; maxWordLevel = 5;
    }

    let eligiblePool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.level >= minWordLevel && w.level <= maxWordLevel;
    });
    if (eligiblePool.length < 8) {
      eligiblePool = ENGLISH_DICTIONARY.filter(function (w) {
        return w.level <= maxWordLevel;
      });
    }

    let targetWord = eligiblePool[randomInt(0, eligiblePool.length - 1)];
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = eligiblePool[randomInt(0, eligiblePool.length - 1)];
      const candidateId = `eng_${candidate.en}`;
      if (!_recentIds.includes(candidateId)) {
        targetWord = candidate;
        rememberQuestionId(candidateId);
        break;
      }
    }

    // Prefer distractors from the same difficulty band & theme for plausible challenge
    const sameBandThemePool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr &&
             Math.abs(w.level - targetWord.level) <= 1 && w.theme === targetWord.theme;
    });
    const sameBandPool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr &&
             Math.abs(w.level - targetWord.level) <= 1 && w.theme !== targetWord.theme;
    });
    const fallbackPool = ENGLISH_DICTIONARY.filter(function (w) {
      return w.en !== targetWord.en && w.kr !== targetWord.kr;
    });

    const combinedDistractorPool = shuffleArray(sameBandThemePool)
      .concat(shuffleArray(sameBandPool))
      .concat(shuffleArray(fallbackPool));
    const distractorWords = [combinedDistractorPool[0], combinedDistractorPool[1]];

    // Stage 1 only: allow 1~2 phonetic warm-up questions if still under tracker limit
    if (stage === 1 && _stageReadingTracker.count < 2 && Math.random() < 0.25 && targetWord.pron) {
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
        categoryLabel: '초등 영어 · 영단어 발음 퀴즈',
        subType: 'en_to_pron',
        stage: stage,
        prompt: `🔊 "${upperEn}" 어떻게 읽을까요?`,
        subPrompt: `영어 단어 "${upperEn}"(${targetWord.kr})의 발음 레인으로 달리세요!`,
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
        categoryLabel: `초등 영어 Lv.${targetWord.level} · 한영 어휘`,
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
        categoryLabel: `초등 영어 Lv.${targetWord.level} · 영한 어휘`,
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
        ? (isExpr ? '🔄 오답 복습 · 실전 생활영어' : '🔄 오답 복습 · 초등 필수 영어')
        : '🔄 오답 복습 · 초등 수학',
      subType: queuedItem.subType || 'review',
      stage: stageNum || 1,
      prompt: cleanPrompt,
      subPrompt: '⚠️ 이전에 틀렸던 문제입니다! 이번엔 꼭 맞혀서 오답 노트를 비워보세요!',
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
          // Prefer review items that were missed recently or closer to current stage
          const sortedQueue = activeQueue.slice().sort(function (a, b) {
            return (b.stage || 1) - (a.stage || 1);
          });
          const queuedItem = sortedQueue[0] || activeQueue[0];
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
          if (idx >= 0) {
            const picked = state.wrongAnswerQueue.splice(idx, 1)[0];
            state.wrongAnswerQueue.push(picked);
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
      _stageReadingTracker.limit = randomInt(2, 4);
    },

    getDictionaryCount: function () {
      return ENGLISH_DICTIONARY.length;
    }
  };

  window.QuestionEngine = QuestionEngine;
})(window);
