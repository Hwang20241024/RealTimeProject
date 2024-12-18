export default class Stage1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage1Scene' });
  }

  create() {
    const Matter = Phaser.Physics.Matter.Matter;

    // 물리 엔진 설정
    this.matter.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

    // 화면 크기 가져오기
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경 이미지 추가
    const background = this.add.image(0, 0, 'forest-road');
    background.setOrigin(0, 0);
    background.setDisplaySize(width, height);

    // 텍스트 추가
    const titleText = this.add.text(400, 250, '1스테이지', {
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

    // 스프라이트 추가
    const gem = this.add.sprite(100, 150, 'gem-1').setScale(2);
    const cherry = this.add.sprite(200, 150, 'cherry-1').setScale(2);

    // 애니메이션 실행
    gem.play('gemAnimation');
    cherry.play('cherryAnimation');

    // 바닥 이미지 (이미지는 충돌에 영향을 주지 않도록 설정)
    this.ground = this.add.image(0, this.sys.game.config.height - 272, 'forest-tiles');
    this.ground.setOrigin(0, 0);
    this.ground.setDisplaySize(this.sys.game.config.width, 272);

    // 플레이어 스프라이트 생성
    // 물리 엔진에서 Matter.Body로 플레이어 객체 생성
    this.player = this.matter.add.sprite(0, 300, 'player-idle-1').setScale(3);

    // 플레이어 충돌 박스 크기 설정
    // this.player.setBody(
    //   Matter.Bodies.rectangle(0, 0, 50, 50, { isSensor: false }), // 중심을 기준으로 50x50 충돌 박스 생성
    // );

    // 플레이어의 화면 위치도 설정 (필요한 경우)
    //this.player.setPosition(100, 300); // 화면상의 위치 설정

    // 플레이어 이동 범위 제한
    this.matter.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.player.setFixedRotation(); // 회전하지 않도록 설정 (옵션)

    // 바닥을 상자로 만들기 1 (그래픽 객체)
    this.groundCollider1 = this.matter.add.rectangle(
      100,
      this.sys.game.config.height - 35,
      this.sys.game.config.width / 4,
      40,
      { isStatic: true, render: { fillStyle: '#FFFF00' } },
    ); // 노란색 사각형

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider1, Phaser.Math.DegToRad(12));

    // 바닥을 상자로 만들기 2 (그래픽 객체)
    this.groundCollider2 = this.matter.add.rectangle(
      this.sys.game.config.width / 2,
      this.sys.game.config.height - 15,
      this.sys.game.config.width,
      40,
      { isStatic: true, render: { fillStyle: '#FFFF00' } },
    ); // 노란색 사각형
    this.groundCollider2.rotation = Phaser.Math.DegToRad(45); // 45도 회전

    // 바닥을 상자로 만들기 3 (그래픽 객체)
    this.groundCollider3 = this.matter.add.rectangle(
      540,
      this.sys.game.config.height - 30,
      this.sys.game.config.width / 8,
      30,
      { isStatic: true, render: { fillStyle: '#FFFF00' } },
    ); // 노란색 사각형

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider3, Phaser.Math.DegToRad(170));

    // 바닥을 상자로 만들기 4 (그래픽 객체)
    this.groundCollider4 = this.matter.add.rectangle(
      710,
      this.sys.game.config.height - 40,
      this.sys.game.config.width / 3.5,
      30,
      { isStatic: true, render: { fillStyle: '#FFFF00' } },
    ); // 노란색 사각형

    // 바닥을 상자로 만들기 5 (그래픽 객체)
    this.groundCollider5 = this.matter.add.rectangle(
      800,
      this.sys.game.config.height - 45,
      this.sys.game.config.width / 8,
      30,
      { isStatic: true, render: { fillStyle: '#FFFF00' } },
    ); // 노란색 사각형

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider5, Phaser.Math.DegToRad(170));

    // 애니메이션 실행
    this.player.play('playerIdleAnimation');

    // 방향키 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();

    // **디버그 그래픽 생성**
    this.matter.world.createDebugGraphic(); // 물리 엔진과 연결된 디버그 그래픽 생성
    // 디버그 설정
    this.matter.world.drawDebug = true;
    this.matter.world.debugGraphic.visible = true;
  }

  update() {
    // 플레이어 이동 처리
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-2);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(2);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-2); // 점프
    }
  }
}
