export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // 예: 리소스 로드
    this.load.image('forest-road', './assets/forest-road.png');
  }

  create() {
    // 리소스를 로드한 후 초기화 작업
    this.scene.start('MainScene'); // MainScene으로 넘어가기
  }
}
