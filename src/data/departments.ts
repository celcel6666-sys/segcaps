// 각 학과의 담당 캐릭터 이미지 임포트
import deumiDefault from '../assets/characters/deumi_default.png';

// 🎬 미디어과 컷씬 이미지 임포트
import cutsceneStory1 from '../assets/컷씬/미디과/스토리1.jpg';
import cutsceneStory2 from '../assets/컷씬/미디과/스토리2.jpg';
import cutsceneStory3 from '../assets/컷씬/미디과/스토리3.jpg';
import cutsceneStory4 from '../assets/컷씬/미디과/스토리4.jpg';
import cutsceneStory5 from '../assets/컷씬/미디과/스토리5.jpg';
import cutsceneSuccess1 from '../assets/컷씬/미디과/성공.jpg';
import cutsceneSuccess2 from '../assets/컷씬/미디과/성공2.jpg';
import cutsceneFail1 from '../assets/컷씬/미디과/실패.jpg';

// ✈️ 항공전자과 컷씬 이미지 임포트
import avionicsStory1 from '../assets/컷씬/항공전자과/스토리1.jpg';
import avionicsStory2 from '../assets/컷씬/항공전자과/스토리2.jpg';
import avionicsStory3 from '../assets/컷씬/항공전자과/스토리3.jpg';
import avionicsStory4 from '../assets/컷씬/항공전자과/스토리4.jpg';
import avionicsSuccess1 from '../assets/컷씬/항공전자과/성공1.png';
import avionicsSuccess2 from '../assets/컷씬/항공전자과/성공2.png';
import avionicsFail1 from '../assets/컷씬/항공전자과/실패1.png';
import avionicsFail2 from '../assets/컷씬/항공전자과/실패2.png';

// 🏗️ 건축과 컷씬 이미지 임포트
import archStory1 from '../assets/컷씬/건축과/스토리1.png';
import archStory2 from '../assets/컷씬/건축과/스토리2.png';
import archStory3 from '../assets/컷씬/건축과/스토리3.png';
import archStory4 from '../assets/컷씬/건축과/스토리4.png';
import archSuccess1 from '../assets/컷씬/건축과/성공1.png';
import archSuccess2 from '../assets/컷씬/건축과/성공2.png';
import archFail1 from '../assets/컷씬/건축과/실패.webp';

// ⚡ 반도체과 컷씬 이미지 임포트
import semiconStory1 from '../assets/컷씬/반도체과/스토리1.webp';
import semiconStory2 from '../assets/컷씬/반도체과/스토리2.webp';
import semiconStory3 from '../assets/컷씬/반도체과/스토리3.webp';
import semiconStory4 from '../assets/컷씬/반도체과/스토리4.webp';
import semiconSuccess1 from '../assets/컷씬/반도체과/성공1.webp';
import semiconSuccess2 from '../assets/컷씬/반도체과/성공2.webp';
import semiconFail1 from '../assets/컷씬/반도체과/실패.webp';

// 🪖 군특성화과 컷씬 이미지 임포트
import militaryStory1 from '../assets/컷씬/군특성화/스토리1.webp';
import militaryStory2 from '../assets/컷씬/군특성화/스토리2.webp';
import militaryStory3 from '../assets/컷씬/군특성화/스토리3.webp';
import militaryStory4 from '../assets/컷씬/군특성화/스토리4.webp';

// 🚗 자동차과 컷씬 이미지 임포트
import autoStory1 from '../assets/컷씬/자동차과/스토리1.webp';
import autoStory2 from '../assets/컷씬/자동차과/스토리2.webp';
import autoStory3 from '../assets/컷씬/자동차과/스토리3.webp';
import autoStory4 from '../assets/컷씬/자동차과/스토리4.webp';

export const MEDIA_CUTSCENES: Record<string, string> = {
  story1: cutsceneStory1,
  story2: cutsceneStory2,
  story3: cutsceneStory3,
  story4: cutsceneStory4,
  story5: cutsceneStory5,
  success1: cutsceneSuccess1,
  success2: cutsceneSuccess2,
  fail: cutsceneFail1,
};

export const AVIONICS_CUTSCENES: Record<string, string> = {
  story1: avionicsStory1,
  story2: avionicsStory2,
  story3: avionicsStory3,
  story4: avionicsStory4,
  success1: avionicsSuccess1,
  success2: avionicsSuccess2,
  fail1: avionicsFail1,
  fail2: avionicsFail2,
};

export const ARCH_CUTSCENES: Record<string, string> = {
  story1: archStory1,
  story2: archStory2,
  story3: archStory3,
  story4: archStory4,
  success1: archSuccess1,
  success2: archSuccess2,
  fail: archFail1,
};

export const SEMICON_CUTSCENES: Record<string, string> = {
  story1: semiconStory1,
  story2: semiconStory2,
  story3: semiconStory3,
  story4: semiconStory4,
  success1: semiconSuccess1,
  success2: semiconSuccess2,
  fail: semiconFail1,
};

export const MILITARY_CUTSCENES: Record<string, string> = {
  story1: militaryStory1,
  story2: militaryStory2,
  story3: militaryStory3,
  story4: militaryStory4,
};

export const AUTO_CUTSCENES: Record<string, string> = {
  story1: autoStory1,
  story2: autoStory2,
  story3: autoStory3,
  story4: autoStory4,
};

import deumiPaint from '../assets/characters/deumi_paint.png';
import deumiPaintSmile from '../assets/characters/deumi_paint_smile.png';
import deumiPaintSurprised from '../assets/characters/deumi_paint_surprised.png';
import deumiPaintWorried from '../assets/characters/deumi_paint_worried.png';
import deumiPaintWink from '../assets/characters/deumi_paint_wink.png';
import deumiPaintAngry from '../assets/characters/deumi_paint_angry.png';

import nyangiNursing from '../assets/characters/nyangi_nursing.png';
import nyangiNursingSmile from '../assets/characters/nyangi_nursing_smile.png';
import nyangiNursingSad from '../assets/characters/nyangi_nursing_sad.png';
import nyangiNursingWorried from '../assets/characters/nyangi_nursing_worried.png';
import nyangiNursingAngry from '../assets/characters/nyangi_nursing_angry.png';

// 도기 미래자동차과 (운전 버전)
import dogiAuto from '../assets/characters/dogi_auto.png';
import dogiAutoSmile from '../assets/characters/dogi_auto_smile.png';
import dogiAutoSad from '../assets/characters/dogi_auto_sad.png';
import dogiAutoAngry from '../assets/characters/dogi_auto_angry.png';

// 도기 디지털정보부사관과 (제복 버전)
import dogiMilitary from '../assets/characters/dogi_military.png';
import dogiMilitarySmile from '../assets/characters/dogi_military_smile.png';
import dogiMilitarySad from '../assets/characters/dogi_military_sad.png';
import dogiMilitaryAngry from '../assets/characters/dogi_military_angry.png';

// 버리 스마트항공전자과 (비행사 버전)
import beoriAvionics from '../assets/characters/beori_avionics.png';
import beoriAvionicsSmile from '../assets/characters/beori_avionics_smile.png';
import beoriAvionicsSad from '../assets/characters/beori_avionics_sad.png';
import beoriAvionicsAngry from '../assets/characters/beori_avionics_angry.png';
import beoriAvionicsWorried from '../assets/characters/beori_avionics_worried.png';

// 버리 건축디자인과 (안전모 버전)
import beoriArch from '../assets/characters/beori_arch.png';
import beoriArchSmile from '../assets/characters/beori_arch_smile.png';
import beoriArchSad from '../assets/characters/beori_arch_sad.png';
import beoriArchAngry from '../assets/characters/beori_arch_angry.png';
import beoriArchWorried from '../assets/characters/beori_arch_worried.png';

// 토리 반도체디스플레이과
import toriSemicon from '../assets/characters/tori_semicon.png';
import toriSemiconSmile from '../assets/characters/tori_semicon_smile.png';
import toriSemiconSad from '../assets/characters/tori_semicon_sad.png';
import toriSemiconAngry from '../assets/characters/tori_semicon_angry.png';

// 학과별 및 공통배경 이미지 임포트
import schoolGate from '../assets/backgrounds/school_gate.webp';
import schoolCampus from '../assets/backgrounds/school_campus.webp';
import mediaBg from '../assets/backgrounds/dept_media.webp';
import nursingBg from '../assets/backgrounds/dept_nursing.webp';
import autoBg from '../assets/backgrounds/dept_automotive.webp';
import avionicsBg from '../assets/backgrounds/dept_avionics.webp';
import semiconBg from '../assets/backgrounds/dept_semiconductor.png';
import archBg from '../assets/backgrounds/dept_architecture.webp';
import militaryBg from '../assets/backgrounds/dept_military.webp';

export interface ColorToken {
  primary: string;      // 메인 테마 색상 (Hex)
  shadow: string;       // 3D 입체 그림자 색상 (Hex)
  hover: string;        // 호버 시 배경색
  light: string;        // 대화창 배경 등 연한 톤
}

export interface Department {
  id: string;
  name: string;
  characterName: string;
  characterImage: string;
  characterExpressions?: {
    smile: string;   // 맞췄을 때 (기쁨/웃음)
    sad: string;     // 틀렸을 때 (슬픔/실망/아쉬움)
    worried?: string; // 걱정/불안
    angry?: string;  // 화남/지침
  };
  bgImage: string;
  badgeName: string;
  badgeIcon: string;     // 학과별 개성 있는 커스텀 뱃지 이모지
  color: ColorToken;
  scoreKey: string;      // 최종 진단 시 누적될 성향 지표 키
  resultTitle: string;   // 이 과가 추천 되었을 때의 성격 타이틀
  description: string;   // 학과 간단 소개
}

// 듬이의 5가지 실시간 감정시트 매핑 객체 (호환성용 유지)
export const DEUMI_EXPRESSIONS: Record<string, string> = {
  default: deumiDefault,
  paint: deumiPaint,
  smile: deumiPaintSmile,
  surprised: deumiPaintSurprised,
  worried: deumiPaintWorried,
  wink: deumiPaintWink,
  angry: deumiPaintAngry,
};

// 공통 학교 배경 및 안내자 듬이 정보
export const COMMON_ASSETS = {
  deumiIntroImage: deumiDefault,
  deumiPaintImage: deumiPaint,
  schoolGateBg: schoolGate,
  schoolCampusBg: schoolCampus,
};

// 사용자 피드백이 완벽히 반영된 테마 컬러 토큰 및 학과 데이터 정의
export const DEPARTMENTS: Department[] = [
  {
    id: 'MEDIA',
    name: '크리에이티브미디어디자인과',
    characterName: '듬이',
    characterImage: deumiPaint,
    characterExpressions: {
      smile: deumiPaintSmile,
      sad: deumiPaintWorried,
      worried: deumiPaintWorried,
      angry: deumiPaintAngry
    },
    bgImage: mediaBg,
    badgeName: '미디과 붓 뱃지',
    badgeIcon: '🎨',
    scoreKey: 'artistic',
    resultTitle: '비주얼 크리에이티브 마스터',
    description: '컴퓨터 그래픽스, 영상 편집, 웹 디자인 등 디지털 시각 예술을 창조하는 크리에이티브 학과입니다.',
    color: {
      primary: '#3b82f6', // 파랑
      shadow: '#1d4ed8',
      hover: '#60a5fa',
      light: '#eff6ff',
    }
  },
  {
    id: 'NURSING',
    name: '보건간호과',
    characterName: '냥이',
    characterImage: nyangiNursing,
    characterExpressions: {
      smile: nyangiNursingSmile,
      sad: nyangiNursingSad,
      worried: nyangiNursingWorried,
      angry: nyangiNursingAngry
    },
    bgImage: nursingBg,
    badgeName: '보건과 구급상자 뱃지',
    badgeIcon: '🏥',
    scoreKey: 'caring',
    resultTitle: '날개 없는 천사',
    description: '체계적인 간호 지식과 따뜻한 인성을 겸비하여 생명을 존중하고 보살피는 간호 전문 인재를 양성합니다.',
    color: {
      primary: '#ff7fae', // 순수한 파스텔 핑크
      shadow: '#d14f7d',
      hover: '#ff9ebb',
      light: '#fff0f5',
    }
  },
  {
    id: 'AUTOMOTIVE',
    name: '미래자동차과',
    characterName: '도기',
    characterImage: dogiAuto,
    characterExpressions: {
      smile: dogiAutoSmile,
      sad: dogiAutoSad,
      angry: dogiAutoAngry
    },
    bgImage: autoBg,
    badgeName: '자동차과 렌치 뱃지',
    badgeIcon: '⚙️',
    scoreKey: 'technical',
    resultTitle: '도로 위의 마스터 엔지니어',
    description: '자동차 엔진 정비부터 자율주행 센서 융합까지 스마트 모빌리티의 미래를 개척하는 기술 학과입니다.',
    color: {
      primary: '#1e293b', // 미래지향 다크 슬레이트
      shadow: '#0f172a',
      hover: '#334155',
      light: '#f1f5f9',
    }
  },
  {
    id: 'AVIONICS',
    name: '스마트항공전자과',
    characterName: '버리',
    characterImage: beoriAvionics,
    characterExpressions: {
      smile: beoriAvionicsSmile,
      sad: beoriAvionicsSad,
      worried: beoriAvionicsWorried,
      angry: beoriAvionicsAngry
    },
    bgImage: avionicsBg,
    badgeName: '항공전자과 번개 드론 뱃지',
    badgeIcon: '⚡',
    scoreKey: 'precision',
    resultTitle: '창공을 제어하는 항전 전문가',
    description: '전기 전자 기초 회로 설계와 항공 정보 드론 제어 기술을 결합하여 항공 모빌리티 시대를 선도합니다.',
    color: {
      primary: '#14b8a6', // 청록
      shadow: '#0f766e',
      hover: '#2dd4bf',
      light: '#f0fdfa',
    }
  },
  {
    id: 'ARCHITECTURE',
    name: '건축디자인과',
    characterName: '버리',
    characterImage: beoriArch,
    characterExpressions: {
      smile: beoriArchSmile,
      sad: beoriArchSad,
      worried: beoriArchWorried,
      angry: beoriArchAngry
    },
    bgImage: archBg,
    badgeName: '건축과 설계 도면 뱃지',
    badgeIcon: '📐',
    scoreKey: 'spatial',
    resultTitle: '도시를 그리는 설계자',
    description: '2D/3D 건축 도면 설계 및 공간 환경 기획을 통해 쾌적하고 조화로운 미래 주거 공간을 구상합니다.',
    color: {
      primary: '#d97706', // 올리브 옐로우
      shadow: '#b45309',
      hover: '#f59e0b',
      light: '#fefbeb',
    }
  },
  {
    id: 'MILITARY',
    name: '디지털정보부사관과',
    characterName: '도기',
    characterImage: dogiMilitary,
    characterExpressions: {
      smile: dogiMilitarySmile,
      sad: dogiMilitarySad,
      angry: dogiMilitaryAngry
    },
    bgImage: militaryBg,
    badgeName: '부사관과 계급 견장 뱃지',
    badgeIcon: '🎖️',
    scoreKey: 'responsibility',
    resultTitle: '정예 스마트 안보 지휘관',
    description: '정보 통신 전력 운용 능력과 강인한 체력, 통솔 리더십을 갖춘 자랑스러운 대한민국 직할 군간부를 양성합니다.',
    color: {
      primary: '#556b2f', // 군사 올리브 카키
      shadow: '#3b4c20',
      hover: '#6b8e23',
      light: '#f5f7f1',
    }
  },
  {
    id: 'SEMICONDUCTOR',
    name: '반도체디스플레이과',
    characterName: '토리',
    characterImage: toriSemicon,
    characterExpressions: {
      smile: toriSemiconSmile,
      sad: toriSemiconSad,
      angry: toriSemiconAngry
    },
    bgImage: semiconBg,
    badgeName: '반도체 실리콘 칩 뱃지',
    badgeIcon: '💻',
    scoreKey: 'logical',
    resultTitle: '나노 소자 미세 공정 브레인',
    description: '첨단 산업의 쌀인 실리콘 반도체 디바이스 공정과 OLED 등 디스플레이 설계 능력을 배양하는 하이테크 공학 학과입니다.',
    color: {
      primary: '#eab308', // 노랑
      shadow: '#a16207',
      hover: '#fde047',
      light: '#fefce8',
    }
  }
];
