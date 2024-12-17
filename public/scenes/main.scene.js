export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
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
    const titleText = this.add.text(400, 250, 'SPARTA.io', {
      font: '48px Arial',
      fill: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });

    titleText.setOrigin(0.5, 0.5);
  }
}
