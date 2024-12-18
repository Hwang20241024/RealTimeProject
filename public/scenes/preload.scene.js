export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // 예: 리소스 로드
    this.load.image('forest-road', './assets/forest-road.png');
    this.load.image('forest-tiles', './assets/tiles.png');
    this.load.image('forest-middle', './assets/middle.png');
    this.load.image('forest-front', './assets/front.png');
    this.load.image('forest-back', './assets/back.png');

    // 아이템 (잼)
    for (let i = 1; i <= 5; i++) {
      this.load.image(`gem-${i}`, `./assets/items/gem/gem-${i}.png`);
    }

    // 아이템 (체리)
    for (let i = 1; i <= 7; i++) {
      this.load.image(`cherry-${i}`, `./assets/items/cherry/cherry-${i}.png`);
    }

    // 플레이어 (idle)
    for (let i = 1; i <= 4; i++) {
      this.load.image(`player-idle-${i}`, `./assets/players/foxy/idle/player-idle-${i}.png`);
    }

    // 플레이어 (jump)
    for (let i = 1; i <= 2; i++) {
      this.load.image(`player-jump-${i}`, `./assets/players/foxy/jump/player-jump-${i}.png`);
    }

    // 플레이어 (run)
    for (let i = 1; i <= 6; i++) {
      this.load.image(`player-run-${i}`, `./assets/players/foxy/run/player-run-${i}.png`);
    }
  }

  create() {
    // 애니메이션 미리등록 (아이템 - 잼)
    const gemFrames = [];
    for (let i = 1; i <= 5; i++) {
      gemFrames.push({ key: `gem-${i}` });
    }

    this.anims.create({
      key: 'gemAnimation',
      frames: gemFrames,
      frameRate: 10,
      repeat: -1,
    });

    // 애니메이션 미리등록 (아이템 - 체리)
    const cherryFrames = [];
    for (let i = 1; i <= 7; i++) {
      cherryFrames.push({ key: `cherry-${i}` });
    }

    this.anims.create({
      key: 'cherryAnimation',
      frames: cherryFrames,
      frameRate: 10,
      repeat: -1,
    });

    // 애니메이션 미리등록 (플레이어 - idle)
    const playerIdleFrames = [];
    for (let i = 1; i <= 4; i++) {
      playerIdleFrames.push({ key: `player-idle-${i}` });
    }

    this.anims.create({
      key: 'playerIdleAnimation',
      frames: playerIdleFrames,
      frameRate: 10,
      repeat: -1,
    });

    // 애니메이션 미리등록 (플레이어 - jump)
    const playerJumpFrames = [];
    for (let i = 1; i <= 2; i++) {
      playerJumpFrames.push({ key: `player-jump-${i}` });
    }

    this.anims.create({
      key: 'playerJumpAnimation',
      frames: playerJumpFrames,
      frameRate: 10,
      repeat: -1,
    });


    // 애니메이션 미리등록 (플레이어 - run)
    const playerRunFrames = [];
    for (let i = 1; i <= 2; i++) {
      playerRunFrames.push({ key: `player-run-${i}` });
    }

    this.anims.create({
      key: 'playerRunAnimation',
      frames: playerRunFrames,
      frameRate: 10,
      repeat: -1,
    });

    // 리소스를 로드한 후 초기화 작업
    this.scene.start('MainScene'); // MainScene으로 넘어가기
  }
}
