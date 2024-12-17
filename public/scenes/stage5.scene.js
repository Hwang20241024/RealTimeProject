export default class Stage5Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage5Scene' });
  }

  preload() {
    // Stage01Scene 리소스 로드
  }

  create() {
    // 화면 크기 가져오기
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경 이미지 추가
    const background = this.add.image(0, 0, 'forest-road');
    background.setOrigin(0, 0);
    background.setDisplaySize(width, height);

    // 텍스트 추가
    const titleText = this.add.text(400, 250, '5스테이지', {
      font: '48px Arial',
      fill: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });

    titleText.setOrigin(0.5, 0.5);

    // 텍스트 위아래로 움직이게 하는 트윈 설정
    this.tweens.add({
      targets: titleText,
      y: '+=20', // 위로 20만큼 이동
      duration: 500, // 0.5초 동안
      yoyo: true, // 트윈이 끝나면 다시 원래 위치로 돌아옴
      repeat: -1, // 무한 반복
      ease: 'Sine.easeInOut', // 부드럽게 움직임
    });
  }

  update() {
    // Stage01Scene update가 매 프레임마다 호출됨
  }
}
