export interface QuizItem {
  id: number;
  question: string;
  options?: string[]; // 객관식일 때의 4지선다 문항
  correctAnswer: string;
  explanation: string;
  type: 'OX' | 'MULTIPLE';
  points?: number; // 각 문제의 배점 (미입력 시 기본 25점, 학과 내 4문제 합산 100점 기준)
}

export interface DeptQuizData {
  introDialogue: { text: string; expression: string; choices: string[]; isCutscene?: boolean; cutsceneImage?: string }[];
  quizzes: QuizItem[];
  outroDialogueSuccess: { text: string; expression: string; choices: string[]; isCutscene?: boolean; cutsceneImage?: string }[];
  outroDialogueFail: { text: string; expression: string; choices: string[]; isCutscene?: boolean; cutsceneImage?: string }[];
}

export const QUIZZES_DATA: Record<string, DeptQuizData> = {
  MEDIA: {
    introDialogue: [
      { text: "자, 이제부터 멋진 디자인을 시작해 볼까? 듬이의 크리에이티브한 실력을 보여줄게!", expression: 'paint', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "쓱싹쓱싹... 쓱싹... 여기는 이 색깔을 넣고, 저기는 붓으로 영차영차...", expression: 'paint', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "어... 어라? 화면에 그려진 그림 상태가 왜 이렇지...? 분명 완벽하게 그렸는데...", expression: 'worried', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "큰일 났다, 어떡하지 어떡하지... 이대로는 실격이야...", expression: 'worried', choices: [], isCutscene: true, cutsceneImage: 'story4' },
      { text: "아하하... 혹시 네가 나 대신 디자인 퀴즈를 풀고 도와줄 수 있을까? 부탁할게!", expression: 'worried', choices: ["좋아, 도와줄게! 🔥"], isCutscene: true, cutsceneImage: 'story5' }
    ],
    quizzes: [
      {
        id: 1,
        question: "디자인에서 로고나 캐릭터를 그릴 때, 크기를 아무리 크게 확대해도 화질이 깨지지 않는 방식을 '벡터(Vector)' 방식이라고 한다.",
        correctAnswer: "O",
        explanation: "벡터(Vector) 방식은 수학적인 선으로 그려져서 크기를 아무리 크게 늘려도 화질이 뭉개지지 않고 선명하게 노출되는 아주 유용한 방식이야!",
        type: 'OX',
        points: 20
      },
      {
        id: 2,
        question: "시각 디자인에서 글자와 글자 사이의 미세한 간격을 보기 좋게 조정하여 가독성을 높이는 작업을 무엇이라 할까?",
        options: ["레이어링", "자간 조정", "블렌딩", "그라데이션"],
        correctAnswer: "자간 조정",
        explanation: "글자와 글자 사이의 어색한 틈을 세밀하게 조율하는 작업을 '자간 조정(커닝)'이라고 해. 디자인을 훨씬 더 깔끔하게 만들어 주지!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 3,
        question: "영상 편집을 할 때, 다음 중 컴퓨터가 멈추지 않도록 프로젝트 진행 중에 '가장 자주' 해야 하는 중요 습관은?",
        options: ["수시로 임시 저장하기", "화면 밝기 최대로 낮추기", "영상 효과 무작정 섞기", "컴퓨터 먼지 털기"],
        correctAnswer: "수시로 임시 저장하기",
        explanation: "영상 작업은 용량이 아주 커서 컴퓨터가 멈추기 쉬워. 따라서 수시로 저장(Ctrl+S)하는 습관이 디자이너의 가장 핵심적인 규칙이란다!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 4,
        question: "디자인에서 서로 반대되거나 대비되는 색상(예: 빨강과 초록, 노랑과 보라)을 조합하여 강렬한 인상을 주는 배색 기법을 무엇이라 부를까?",
        options: ["보색 대비", "모노톤 배색", "파스텔 톤", "투명 그라데이션"],
        correctAnswer: "보색 대비",
        explanation: "색상환에서 서로 마주 보는 보색을 함께 사용하면 서로의 색을 돋보이게 하여 역동적이고 주목성 높은 디자인을 만들 수 있어!",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "우와아...! 네가 도와준 덕분에 엄청 멋진 디자인이 완성되었어! 대박이야!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "헤헤, 역시 내 안목이 틀리지 않았어! 고마워, 넌 정말 훌륭한 비주얼 감각을 가졌어!", expression: 'smile', choices: ["고마워, 디자인 정말 매력적이다! 🎨"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "아쉽지만 디자인 미션 통과 실패야... 그래도 너무 상심하지 마, 천천히 연습해서 다시 해보자!", expression: 'worried', choices: ["다시 연습해서 해볼게! ✊"], isCutscene: true, cutsceneImage: 'fail' }
    ]
  },
  NURSING: {
    introDialogue: [
      { text: "안녕! 이곳은 보건과야. 큰일이야! 응급상황이 발생한 것 같아!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "서둘러야 해! 응급가방을 열어서 필요한 도구부터 꺼내 보자!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "앗! 붕대가 몸에 감겨 버렸어... 이러면 응급처치를 할 수 없잖아!", expression: 'worried', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "혹시 나 좀 도와줄 수 있을까? 보건과 퀴즈를 풀어서 응급처치를 도와줘!", expression: 'worried', choices: ["좋아, 도와줄게! 🚑"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "생명이 위급한 환자에게 심폐소생술(CPR)을 시행할 때, '가슴 압박 15회'와 '인공호흡 5회'의 비율로 주기를 반복해야 한다.",
        correctAnswer: "X",
        explanation: "아니다냥! 인명구조 골든타임에는 가슴 압박 30번과 인공호흡 2번의 비율(30:2)을 맞추어 쉼 없이 실시해야 뇌로 산소가 잘 공급된다구냥!",
        type: 'OX',
        points: 30
      },
      {
        id: 2,
        question: "일반적인 건강한 성인의 정상적인 평균 체온 범위로 가장 알맞은 온도는 몇 도일까냥?",
        options: ["34.5℃ ~ 35.0℃", "36.5℃ ~ 37.5℃", "38.0℃ ~ 39.0℃", "39.5℃ ~ 40.0℃"],
        correctAnswer: "36.5℃ ~ 37.5℃",
        explanation: "인간의 기본 정상 체온은 36.5℃ 전후다냥! 이보다 너무 낮거나 높으면 몸에 이상 신호가 온 것이니 주의해야 해냥.",
        type: 'MULTIPLE',
        points: 20
      },
      {
        id: 3,
        question: "평소에 외출하고 돌아왔을 때, 감기나 감염병을 예방하기 위해 가장 쉽고 확실하게 실천할 수 있는 건강 수칙은?",
        options: ["향수 온몸에 뿌리기", "손 깨끗이 씻기", "시원한 콜라 마시기", "뜨거운 물로 양치하기"],
        correctAnswer: "손 깨끗이 씻기",
        explanation: "흐르는 물에 30초 이상 손을 깨끗이 씻는 것만으로도 대부분의 유해 세균과 감염병을 확실히 차단할 수 있다냥! 기본 중의 기본이다냥.",
        type: 'MULTIPLE',
        points: 20
      },
      {
        id: 4,
        question: "병원에서 환자의 상태를 파악하기 위해 측정하는 '4대 활력징후(Vital Signs)'에 해당하지 않는 것은?",
        options: ["체온", "맥박", "혈압", "시력"],
        correctAnswer: "시력",
        explanation: "환자의 생명 상태를 나타내는 가장 중요한 4대 활력징후는 체온, 맥박, 호흡, 혈압이다냥! 시력은 일반 검사 항목이다냥.",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "휴~ 응급처치가 무사히 끝났어! 정말 다행이야!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "응급처치 성공! 너라면 훌륭한 의료인이 될 수 있겠는걸!", expression: 'smile', choices: ["돌봄의 가치를 배운 것 같아! 👋"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "어... 아직 응급처치가 제대로 끝나지 않은 것 같아...", expression: 'sad', choices: [], isCutscene: true, cutsceneImage: 'fail1' },
      { text: "괜찮아! 다시 도전해서 이번에는 응급처치를 꼭 성공시켜 보자!", expression: 'worried', choices: ["더 꼼꼼하게 복습해 올게냥!"], isCutscene: true, cutsceneImage: 'fail2' }
    ]
  },
  AUTOMOTIVE: {
    introDialogue: [
      { text: "여기는 자동차과야. 큰일이야! 자동차가 갑자기 고장 나 버렸어!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "서둘러야 해! 어디가 고장 났는지 하나씩 확인해 보자!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "음... 어떤 부분을 먼저 확인해야 하지? 점점 더 헷갈리네...", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "혹시 나 좀 도와줄 수 있을까? 자동차과 퀴즈를 풀어서 자동차를 다시 움직일 수 있게 도와줘!", expression: 'default', choices: ["좋아, 도와줄게! 🚗"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "겨울철에 기온이 갑자기 급강하하면 자동차 배터리가 평소보다 빨리 방전될 가능성이 높아진다.",
        correctAnswer: "O",
        explanation: "겨울철 저온 환경에서는 배터리 내부 액체 화학 반응이 느려져서 충전 효율이 낮아지고 방전이 훨씬 잘 일어나니 조심해야 한다!",
        type: 'OX',
        points: 20
      },
      {
        id: 2,
        question: "주행 중에 계기판에 빨간색 '배터리 모양 경고등'이 켜졌다면, 어떤 부품에 문제가 생겼을 확률이 가장 높은가?",
        options: ["타이어 펑크", "발전기 고장 및 충전 불가", "브레이크 패드 마모", "엔진 오일 누유"],
        correctAnswer: "발전기 고장 및 충전 불가",
        explanation: "계기판 배터리 모양 빨간 경고등은 발전기(알터네이터)가 작동을 멈춰서 배터리가 더 이상 충전되지 않고 있다는 긴급 발전 경보라네!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 3,
        question: "안전한 주행을 위해 타이어 마모 상태와 함께 정기적으로 압력을 체크해야 하는 이 요소는 무엇일까?",
        options: ["타이어 공기압", "엔진 마력 수치", "와이퍼 고무 크기", "차량 번호판 청소"],
        correctAnswer: "타이어 공기압",
        explanation: "타이어 내부의 공기 압력(공기압)이 너무 낮거나 높으면 연비가 나빠지고 미끄러짐 사고 유발 등 위험해지므로 수시로 단속해야 해!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 4,
        question: "전기 자동차(EV)가 주행 중 브레이크를 밟거나 감속할 때, 모터가 발전기로 변해 운동 에너지를 전기로 바꾸어 배터리를 다시 충전하는 기술은?",
        options: ["회생 제동 시스템", "공회전 차단 시스템", "터보 차저 부스터", "유압 스티어링"],
        correctAnswer: "회생 제동 시스템",
        explanation: "회생 제동(Regenerative Braking)은 멈추려는 운동 에너지를 전기에너지로 회수하여 배터리를 충전하는 전기차의 핵심 연비 향상 기술이라네!",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "오! 자동차가 다시 정상적으로 작동하기 시작했어!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "자동차 정비 성공! 너라면 훌륭한 자동차 정비사가 될 수 있겠는걸!", expression: 'smile', choices: ["멋진 자동차를 만들어 보고 싶어!"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "으악! 자동차가 완전히 망가져버렸어!", expression: 'sad', choices: [], isCutscene: true, cutsceneImage: 'fail1' },
      { text: "이번엔 실패했네... 그래도 포기하지 말고 다시 도전해서 자동차를 고쳐 보자!", expression: 'sad', choices: ["반복 정비 실습, 다시 하러 갈게!"], isCutscene: true, cutsceneImage: 'fail2' }
    ]
  },
  AVIONICS: {
    introDialogue: [
      { text: "안녕! 나는 버리고, 여기는 항공전자과야!. 드론과 항공전자 기술을 배우며 직접 설계하고 조종하는 곳이지!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "좋아! 이제 드론을 조종해 볼게. 천천히… 방향도 맞추고… 이제 날려볼까?", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "으악! 조종을 잘못해서 드론이 고장 나버렸어… 이대로는 비행을 계속할 수 없어!", expression: 'sad', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "혹시 나 좀 도와줄수 있을까? 항공전자과 퀴즈를 풀어서 드론을 다시 날릴 수 있게 도와줘!", expression: 'worried', choices: ["좋아, 도와줄게! ⚡"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "공중을 날아다니는 현대식 드론은 모든 날개의 회전 속도를 똑같이 고정한 상태에서 프로펠러 각도만 비틀어서 비행 방향을 바꾼다.",
        correctAnswer: "X",
        explanation: "아니라네! 드론은 각도가 고정된 날개들의 모터 회전 속도를 각기 다르게 제어하면서 발생하는 양력의 압력차로 기우뚱하며 비행 방향을 바꾼단다!",
        type: 'OX',
        points: 20
      },
      {
        id: 2,
        question: "항공기 조종석 앞유리에 가상의 비행 속도, 고도, 방위 경로 선명한 그래픽을 투사하여 조종사 시선을 전방에 유지시키는 장치는?",
        options: ["내비게이션", "전방 표시 장치", "디지털 오디오", "속도 제어 레버"],
        correctAnswer: "전방 표시 장치",
        explanation: "Head-Up Display(HUD)는 비행 계기 정보를 조종사 앞유리에 바로 비춰 주어 조종사가 고개를 내리지 않고 전방만 주시할 수 있게 해 준단다!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 3,
        question: "번개가 치는 악천후 비행 중에도 비행기 동체 표면을 따라 전류가 흘러 나가도록 설계하여 내부 승객과 장비를 안전하게 지키는 성질은?",
        options: ["자석 정렬 현상", "피뢰 정전 방출", "엔진 강력 회전", "무선 차단 장치"],
        correctAnswer: "피뢰 정전 방출",
        explanation: "비행기는 정전기 방출 장치(Static Discharger)를 탑재하고 번개를 맞아도 전류가 기체 겉면을 스치듯 뒤로 빠져나가 비행기가 타지 않는단다!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 4,
        question: "항공기나 비행체의 고도, 자세, 방향 변화를 정밀하게 감지하여 자동 비행 제어 시스템의 균형을 유지시키는 핵심 전자기계 센서는?",
        options: ["자이로스코프 센서", "지문 인식 센서", "온도 조절 장치", "블루투스 수신기"],
        correctAnswer: "자이로스코프 센서",
        explanation: "자이로스코프(Gyroscope) 센서는 회전과 기울기를 미세하게 감지하여 비행기와 드론이 흔들림 없이 균형을 잡도록 돕는 필수 비행 전자센서라네!",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "해냈어! 네 덕분에 드론이 완벽하게 비행에 성공했어!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "멋진 조종 실력이야! 이제 너도 항공전자과의 드론 파일럿이 된 거나 다름없어!", expression: 'smile', choices: ["드론 파일럿, 최고야! ⚡"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "이런! 드론이 끝까지 비행하지 못했어...", expression: 'sad', choices: [], isCutscene: true, cutsceneImage: 'fail1' },
      { text: "이번 비행은 아쉽게 실패했어! 다시 한 번 도전해서 드론을 멋지게 하늘로 날려보자!", expression: 'worried', choices: ["다시 꼼꼼하게 점검하고 도전할게!"], isCutscene: true, cutsceneImage: 'fail2' }
    ]
  },
  ARCHITECTURE: {
    introDialogue: [
      { text: "안녕! 여기는 건축과야. 건물을 설계하고 모형을 제작하며 안전한 구조를 배우는 곳이지!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "좋아! 설계도를 그리면서 건축 모형도 함께 만들어 볼게. 이번에는 멋지게 완성될 것 같은데!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "앗! 모형이 무너지고 있어! 안 돼... 이대로면 전부 무너질 것 같아!", expression: 'worried', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "결국 모형이 무너져 버렸어... 혹시 나 좀 도와줄 수 있을까? 건축과 퀴즈를 풀어서 건축 모형을 다시 완성할 수 있게 도와줘!", expression: 'sad', choices: ["좋아, 도와줄게! 📐"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "건물을 설계할 때 기둥이나 대들보 없이 삼각형 그물망 구조로만 하중을 골고루 분산시켜 지탱하는 방식을 '트러스' 구조라고 한다.",
        correctAnswer: "O",
        explanation: "삼각형은 외력이 작용해도 외형이 찌그러지지 않는 가장 안정적인 기하학 도형이야! 체육관 지붕이나 다리를 트러스 삼각형으로 설계하지.",
        type: 'OX',
        points: 25
      },
      {
        id: 2,
        question: "설계 도면을 그리거나 빌딩 구조를 한눈에 파악하기 위해 현재 널리 쓰이는 컴퓨터 활용 설계 지원 프로그램을 무엇이라 부를까?",
        options: ["비디오 재생기", "컴퓨터 지원 설계", "문서 작성기", "인터넷 브라우저"],
        correctAnswer: "컴퓨터 지원 설계",
        explanation: "CAD(Computer Aided Design)는 건축 도면을 오차 없이 2D/3D로 정밀하게 설계하도록 돕는 가장 필수적인 디자이너 도구야!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 3,
        question: "건축가가 건물의 외관뿐만 아니라 지진 피해를 버텨낼 수 있도록 보강재를 심고 구조를 강화하여 짓는 설계를 무엇이라 할까?",
        options: ["냉난방 설계", "내진 설계", "방음 설계", "외벽 페인트 설계"],
        correctAnswer: "내진 설계",
        explanation: "내진 설계는 지진의 흔들림을 유연하게 흡수하거나 버텨낼 수 있게 기둥과 보를 특수 공법으로 보강하는 재해 예방 설계란다!",
        type: 'MULTIPLE',
        points: 20
      },
      {
        id: 4,
        question: "건물을 짓기 전 일조량, 통풍, 주변 경관과 사람이 거주하는 동선을 고려하여 최적의 방과 창문 배치를 구상하는 단계를 무엇이라 할까?",
        options: ["공간 평면 계획", "외벽 타일 도장", "철거 조경 공사", "단열 시공 단계"],
        correctAnswer: "공간 평면 계획",
        explanation: "거주자의 편리한 움직임과 쾌적한 빛/바람의 흐름을 고려하여 방의 배치와 동선을 짜는 평면 계획(Floor Plan)은 건축 설계의 출발점이야!",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "오! 멋진 건축 모형이 완벽하게 완성됐어!", expression: 'smile', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "최고야! 덕분에 멋진 건축물을 완성했어. 정말 고마워!", expression: 'smile', choices: ["나만의 공간을 멋지게 설계해 볼게!"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "아쉽게도 건축 모형을 완성하지 못했어... 그래도 실망하지 마, 연습하고 다시 도전해서 멋진 건축물을 완성해봐", expression: 'default', choices: ["다시 도전할게!"], isCutscene: true, cutsceneImage: 'fail' }
    ]
  },
  MILITARY: {
    introDialogue: [
      { text: "여기는 군특성화과야. 군인의 기본인 사격 훈련에 도전해 보자!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "좋아! 자세를 바로잡고 표적을 향해 조준해 볼게. 침착하게 집중해야 해!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "으으... 막상 쏘려고 하니까 너무 떨려... 과녁을 맞힐 수 있을지 자신이 없어!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "혹시 나 좀 도와줄 수 있을까? 군특성화과 퀴즈를 풀어서 과녁을 정확히 명중할 수 있게 도와줘!", expression: 'default', choices: ["좋아, 도와줄게! 🪖"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "대한민국 국군의 부사관은 작전 명령 권한만 가지며, 부대 실무 장비 운용 및 병사들과의 직접 소통 훈련에는 참여하지 않는다.",
        correctAnswer: "X",
        explanation: "아니다! 부사관은 실전 전투 지휘와 하이테크 장비 운용 실무를 직접 맡으며, 병사들을 이끌고 장교를 보좌하는 국군의 든든한 척추 역할을 맡고 있다!",
        type: 'OX',
        points: 20
      },
      {
        id: 2,
        question: "국방 정보화 시대에 맞추어 네트워크를 통해 적군의 악성 코드 침투나 해킹 위협을 감시하고 아군 전산망을 수호하는 분야는?",
        options: ["보급 수송 작전", "사이버 보안 작전", "화약 무기 조립", "야간 경계 순찰"],
        correctAnswer: "사이버 보안 작전",
        explanation: "현대 전쟁은 컴퓨터망 공격도 주 표적이야. 따라서 해커들의 위협을 아군 전산망에서 수호하는 사이버 보안 전력이 아주 중요하지!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 3,
        question: "군대에서 분대원들이 협동하여 목표물을 탐색하고 안전하게 전술 이동을 할 때 가장 기본이 되는 군사 훈련은 무엇일까?",
        options: ["체스 보드 게임", "각개전투 및 소대 전술", "서류 결재 연습", "군대 급식 요리"],
        correctAnswer: "각개전투 및 소대 전술",
        explanation: "개인의 전술 이동과 은폐 요령을 익히는 '각개전투'는 국가와 동료를 지키기 위해 몸으로 체득해야 할 부사관의 필수 훈련이다!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 4,
        question: "군대 지휘 통제 작전에서 아군의 위치 정보, 정찰 드론 영상, 전술 지휘 체계를 첨단 통신망으로 연결하여 실시간 판단을 내리는 디지털 체계는?",
        options: ["C4I 지휘통제체계", "수동 우편 송달", "무전 모스 부호", "지류 작전 지도"],
        correctAnswer: "C4I 지휘통제체계",
        explanation: "지휘, 통제, 통신, 컴퓨터 및 정보 체계를 통합한 'C4I 시스템'은 첨단 디지털 전장에서 빠르고 정확하게 승리를 이끄는 신경망이다!",
        type: 'MULTIPLE',
        points: 30
      }
    ],
    outroDialogueSuccess: [
      { text: "확인해 보니 정확하게 명중했네!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "사격 성공! 너라면 훌륭한 군 전문 인재가 될 수 있겠는걸!", expression: 'default', choices: ["국가를 수호하는 명예를 배운 것 같습니다!"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "어...? 과녁을 맞히지 못했네...", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'fail1' },
      { text: "이번엔 조금 아쉬웠네... 다시 도전하면 분명 성공할 수 있을 거야!", expression: 'default', choices: ["정신일도 하사불성, 다시 전술 공부하겠습니다!"], isCutscene: true, cutsceneImage: 'fail2' }
    ]
  },
  SEMICONDUCTOR: {
    introDialogue: [
      { text: "안녕! 여기는 반도체과야. 반도체를 직접 조립해서 회로를 완성해 볼게!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story1' },
      { text: "으악! 갑자기 하고 터져 버렸어! 대체 무엇이 잘못된 거지?!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story2' },
      { text: "침착하게 다시 고쳐보자... 음... 아무리 해도 제대로 작동하지 않아...", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'story3' },
      { text: "혹시 나 좀 도와줄 수 있을까? 반도체과 퀴즈를 풀어서 반도체를 다시 완성할 수 있게 도와줘!", expression: 'default', choices: ["좋아, 도와줄게! ⚡"], isCutscene: true, cutsceneImage: 'story4' }
    ],
    quizzes: [
      {
        id: 1,
        question: "반도체 공정 라인은 머리카락보다 1만 배 작은 미세 먼지 하나로도 칩 회로가 끊어질 수 있어, 방진 시설이 있는 '클린룸'에서 일한다.",
        correctAnswer: "O",
        explanation: "정밀 회로를 보호하기 위해 정밀 공기 필터와 방진복 착용이 필수인 무균 먼지 차단 공간인 '클린룸'에서 반도체를 만든다 칩!",
        type: 'OX',
        points: 20
      },
      {
        id: 2,
        question: "도체(전기가 매우 잘 통함)와 부도체(전기가 통하지 않음)의 중간 성질을 가지고 있어, 전류의 흐름을 자유롭게 차단/연결 통제하는 물질은?",
        options: ["플라스틱", "반도체", "유리창", "고무줄"],
        correctAnswer: "반도체",
        explanation: "반도체(Semiconductor)는 도체와 부도체의 중간적 특성을 지녀, 인간이 전압을 조절해 정보를 전송할 수 있는 마법의 하이테크 물질이다 칩!",
        type: 'MULTIPLE',
        points: 30
      },
      {
        id: 3,
        question: "실리콘 반도체 원판에 사진을 찍듯이 아주 얇고 미세한 회로 패턴을 새겨 넣는 가장 핵심적인 반도체 제조 공정을 무엇이라 할까?",
        options: ["페인팅 칠 공정", "광학 노광 (노광 공정)", "진공 청소 공정", "상자 패키징 공정"],
        correctAnswer: "광학 노광 (노광 공정)",
        explanation: "빛을 쬐어서 웨이퍼(원판) 위에 정밀 나노 회로 지도를 정교하게 복사해 부착해 놓는 과정을 노광(Photolithography) 공정이라고 한다 칩!",
        type: 'MULTIPLE',
        points: 25
      },
      {
        id: 4,
        question: "반도체 칩에서 전기가 통하는 나노 회로를 완성하기 위해 불필요하게 덮여 있는 박막 영역을 화학 용액이나 플라즈마로 정밀하게 깎아내는 공정은?",
        options: ["식각 (에칭) 공정", "세척 건조 공정", "금속 배선 공정", "웨이퍼 절단 공정"],
        correctAnswer: "식각 (에칭) 공정",
        explanation: "노광으로 그린 회로도대로 필요 없는 부분을 정교하게 깎아내어 실리콘 웨이퍼에 나노 길을 조각하는 핵심 과정을 식각(Etching) 공정이라 한다 칩!",
        type: 'MULTIPLE',
        points: 25
      }
    ],
    outroDialogueSuccess: [
      { text: "좋아! 모든 회로가 정상적으로 연결됐어!", expression: 'default', choices: [], isCutscene: true, cutsceneImage: 'success1' },
      { text: "반도체 제작에 성공했어! 너의 꼼꼼한 실력이 빛을 발했어!", expression: 'default', choices: ["반도체 제작 성공! ⚡"], isCutscene: true, cutsceneImage: 'success2' }
    ],
    outroDialogueFail: [
      { text: "아쉽게도 반도체를 완성하지 못했어... 그래도 포기하지 말고 다시 도전해서 꼭 성공해 보자!", expression: 'default', choices: ["다시 도전! ⚡"], isCutscene: true, cutsceneImage: 'fail' }
    ]
  }
};
