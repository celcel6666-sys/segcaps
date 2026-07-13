// 🎵 전역 사운드 재생 관리 매니저 클래스 (싱글톤)
class SoundManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // SSR이나 테스트 환경 대응
    if (typeof window !== 'undefined') {
      this.bgmAudio = new Audio('/sounds/bgm/main_theme.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.25; // 쾌적한 볼륨 조절
    }
  }

  // 1. 배경음악(BGM) 재생 (사용자 상호작용 후 호출)
  public playBGM() {
    if (!this.bgmAudio || this.isBgmPlaying) return;
    
    this.bgmAudio.play()
      .then(() => {
        this.isBgmPlaying = true;
      })
      .catch(err => {
        console.warn('BGM Autoplay 차단됨 (사용자 터치 대기):', err.message);
      });
  }

  // 2. 배경음악 일시정지/종료
  public stopBGM() {
    if (!this.bgmAudio || !this.isBgmPlaying) return;
    this.bgmAudio.pause();
    this.isBgmPlaying = false;
  }

  // 3. 효과음 재생 (즉각적이고 단발적 재생 지원)
  public playEffect(type: 'click' | 'correct' | 'incorrect') {
    if (typeof window === 'undefined') return;

    let path = '';
    let volume = 0.4;

    switch (type) {
      case 'click':
        path = '/sounds/effects/click.mp3';
        volume = 0.35;
        break;
      case 'correct':
        path = '/sounds/effects/correct.mp3';
        volume = 0.45;
        break;
      case 'incorrect':
        path = '/sounds/effects/incorrect.mp3';
        volume = 0.4;
        break;
    }

    if (path) {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.play().catch(e => {
        // 단발성 플레이어 예외 안전 래핑
        console.warn(`${type} 효과음 재생 차단:`, e.message);
      });
    }
  }
}

export const sound = new SoundManager();
