import SocketManager from '../socket.manager.js';

export default class Stage1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage1Scene' });
    this.canJump = false;
    this.isJump = false;
    this.socket = SocketManager.getInstance().socket;

    //
    this.itmes = {};
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
    const titleText = this.add.text(0, 50, '1스테이지', {
      font: '48px Arial',
      fill: '#90EE90', // 연한 초록색
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });
    titleText.setOrigin(1, 0);
    titleText.setPosition(this.cameras.main.width - 20, 20);

    // 남은 체력 텍스트 추가
    const healthText = this.add.text(0, 50, '남은체력 : 3', {
      font: '24px Arial',
      fill: '#FFFFFF',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });

    // 좌측 상단에 텍스트 배치
    healthText.setOrigin(0, 0); // 좌측 상단 기준으로 위치 설정
    healthText.setPosition(10, 10); // 20px 여백을 두고 배치

    // 남은 체력 텍스트 추가
    const scoreText = this.add.text(0, 50, '점수 : 0', {
      font: '24px Arial',
      fill: '#FFFFFF',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    });

    // 좌측 상단에 텍스트 배치
    scoreText.setOrigin(0, 0); // 좌측 상단 기준으로 위치 설정
    scoreText.setPosition(10, 44); // 20px 여백을 두고 배치

    // 텍스트 위아래로 움직이게 하는 트윈 설정
    this.tweens.add({
      targets: titleText,
      y: '+=5', // 위로 20만큼 이동
      duration: 500, // 0.5초 동안
      yoyo: true, // 트윈이 끝나면 다시 원래 위치로 돌아옴
      repeat: -1, // 무한 반복
      ease: 'Sine.easeInOut', // 부드럽게 움직임
    });

    // 바닥 이미지 (이미지는 충돌에 영향을 주지 않도록 설정)
    this.ground = this.add.image(0, this.sys.game.config.height - 272, 'forest-tiles');
    this.ground.setOrigin(0, 0);
    this.ground.setDisplaySize(this.sys.game.config.width, 272);

    // 플레이어 스프라이트 생성
    // 물리 엔진에서 Matter.Body로 플레이어 객체 생성
    this.player = this.matter.add.sprite(0, 300, 'player-idle-1').setScale(3);

    // 플레이어 충돌 박스 크기 설정
    this.player.setBody(
      Matter.Bodies.rectangle(0, 0, 50, 50, { isSensor: false, label: 'player' }), // 중심을 기준으로 50x50 충돌 박스 생성
    );
    this.player.body.label = 'player'; // label을 직접 설정

    //this.player.setCollidesWith(this.ground);
    // 바닥을 상자로 만들기 1 (그래픽 객체)
    this.groundCollider1 = this.matter.add.rectangle(
      100,
      this.sys.game.config.height - 35,
      this.sys.game.config.width / 4,
      40,
      { isStatic: true },
    );

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider1, Phaser.Math.DegToRad(12));
    this.groundCollider1.label = 'groundCollider1'; // label을 직접 설정

    // 바닥을 상자로 만들기 2 (그래픽 객체)
    this.groundCollider2 = this.matter.add.rectangle(
      this.sys.game.config.width / 2,
      this.sys.game.config.height - 15,
      this.sys.game.config.width,
      40,
      { isStatic: true },
    );
    this.groundCollider2.rotation = Phaser.Math.DegToRad(45); // 45도 회전
    this.groundCollider2.label = 'groundCollider2'; // label을 직접 설정

    // 바닥을 상자로 만들기 3 (그래픽 객체)
    this.groundCollider3 = this.matter.add.rectangle(
      540,
      this.sys.game.config.height - 30,
      this.sys.game.config.width / 8,
      30,
      { isStatic: true },
    );

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider3, Phaser.Math.DegToRad(170));
    this.groundCollider3.label = 'groundCollider3'; // label을 직접 설정

    // 바닥을 상자로 만들기 4 (그래픽 객체)
    this.groundCollider4 = this.matter.add.rectangle(
      710,
      this.sys.game.config.height - 40,
      this.sys.game.config.width / 3.5,
      30,
      { isStatic: true },
    );
    this.groundCollider4.label = 'groundCollider4'; // label을 직접 설정

    // 바닥을 상자로 만들기 5 (그래픽 객체)
    this.groundCollider5 = this.matter.add.rectangle(
      800,
      this.sys.game.config.height - 45,
      this.sys.game.config.width / 8,
      30,
      { isStatic: true },
    );
    this.groundCollider5.label = 'groundCollider5'; // label을 직접 설정

    // 회전 적용
    Matter.Body.setAngle(this.groundCollider5, Phaser.Math.DegToRad(170));

    // 플레이어의 화면 위치도 설정 (필요한 경우)
    this.player.setPosition(100, 300); // 화면상의 위치 설정

    // 플레이어 이동 범위 제한
    this.matter.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.player.setFixedRotation(); // 회전하지 않도록 설정 (옵션)

    // 애니메이션 실행
    this.player.play('playerIdleAnimation');

    // 방향키 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();

    // **디버그 그래픽 생성**
    this.matter.world.createDebugGraphic(); // 물리 엔진과 연결된 디버그 그래픽 생성

    // 플레이어 충돌
    this.player.setOnCollide((collisionData) => {
      const bodyA = collisionData.bodyA;
      const bodyB = collisionData.bodyB;

      // 충돌 객체의 라벨 가져오기
      const collidedLabel = bodyA.label === 'player' ? bodyB.label : bodyA.label;

      // 'groundCollider' 라벨과 충돌했는지 확인
      if (
        collidedLabel === 'groundCollider1' ||
        collidedLabel === 'groundCollider2' ||
        collidedLabel === 'groundCollider3' ||
        collidedLabel === 'groundCollider4' ||
        collidedLabel === 'groundCollider5'
      ) {
        this.canJump = true; // 점프 가능 상태 설정
        this.isJump = false; // 점프중이아니다.
      }

      // 아이템 먹으면 메세지를 보내자.
      if (this.itmes[collidedLabel]) {
        this.itmes[collidedLabel].destroy(); // gem 객체 삭제
        delete this.itmes[collidedLabel]; // 객체에서 gem 삭제

        // 서버에 메세지 .
        SocketManager.getInstance().sendEvent('itemPickedUp', 9, {
          status: 'success',
          message: collidedLabel,
        });
      }
    });

    // 플레이어 이름을 나타내는 텍스트
    this.playerNameText = this.add
      .text(this.player.x, this.player.y - 30, SocketManager.getInstance().name, {
        font: '12px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    // 메세지 처리
    this.handleMessage(Matter, titleText, healthText, scoreText);
  }

  update() {
    // 플레이어 이름
    this.playerNameText.setPosition(this.player.x, this.player.y - 30); // 플레이어 위로 텍스트 위치 설정

    // 플레이어 이동 처리
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-2);
      this.player.flipX = true; // 이미지 좌우 반전
      if (!this.isJump) {
        this.player.anims.play('playerRunAnimation', true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(2);
      this.player.flipX = false;
      if (!this.isJump) {
        this.player.anims.play('playerRunAnimation', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (!this.isJump) {
        this.player.anims.play('playerIdleAnimation', true);
      }
    }

    // 플레이어 점프처리
    if (this.cursors.up.isDown && this.canJump) {
      this.player.setVelocityY(-10); // 점프
      this.canJump = false; // 점프 후 즉시 불가능
      this.isJump = true;
    }

    // 점프 올라가는 중일 때
    if (this.player.body.velocity.y < 0 && this.isJump) {
      // 점프 올라가는 동안의 스프라이트 유지
      this.player.setTexture('player-jumpUp'); // 점프 올라가는 스프라이트로 유지
    }

    // 점프 후 내려가는 중일 때
    if (this.player.body.velocity.y > 0 && this.isJump) {
      // 떨어지는 동안 스프라이트 변경
      this.player.setTexture('player-jumpDown'); // 점프 내려가는 스프라이트로 변경
    }
  }

  // 서버에서 받은 메세지 처리.
  handleMessage(Matter, titleText, healthText, scoreText) {
    // 아이템 생성.
    this.socket.on('spawnItem', (data) => {
      //데이터 처리
      const { name, x, y } = data.payload.message;
      const gameWidth = this.cameras.main.width;
      const gameHeight = this.cameras.main.height;

      // 실제 화면 크기 좌표로 변환
      const itemX = x * gameWidth;
      const itemY = y * gameHeight;

      // 스프라이트 추가
      const itme = this.matter.add.sprite(itemX, itemY, name + '-1').setScale(2);
      itme.setBody(
        Matter.Bodies.rectangle(0, 0, itme.width * 2, itme.height * 2, {
          isSensor: false,
          label: name,
        }), // 히트박스 크기 설정
      );
      itme.body.label = name; // label을 직접 설정
      itme.setFixedRotation(); // 회전하지 않도록 설정

      itme.play(name.split(':')[0] + 'Animation');

      // 생성된 아이템을 this.gems 배열에 추가
      this.itmes[itme.body.label] = itme;
    });

    this.socket.on('updateUserInfo', (data) => {
      // 데이터 처리.
      const { stage, score } = data.payload.message;

      // 현재 스테이지와 데이터로 받은 스테이지 정보가 다르다면?
      if (SocketManager.getInstance().currentStage !== stage) {
        // 스테이지를 변경한다.
        SocketManager.getInstance().currentStage = stage;
        titleText.setText(`${stage}스테이지`);
      }

      // 점수는 그냥 반영해도 된다.
      SocketManager.getInstance().currentScore = score;
      scoreText.setText(`점수 : ${score}`);
    });

    this.socket.on('removeCollectedItem', (data) => {
      const itemId = data.payload.message;
      console.log(itemId);

      console.log(this.itmes[itemId]);
      console.log(this.itmes[itemId].length);
      // 아이템 먹으면 메세지를 보내자.
      if (this.itmes[itemId]) {
        console.log('잘들어오나요?');
        this.itmes[itemId].destroy(); // 아이템 객체 삭제
        delete this.itmes[itemId]; // 객체에서 아이템 삭제
      }
    });
  }
}

// 1. 서버에서 아템 뿌린다.
// 2. 클라에서 아이템을 먹으면 서버에알린다.
// 3. 서버에서 점수를 db에 저장하고
// 4. 정보를 클라에 뿌린다. (점수 , 체력, 스테이지 등등.)
// 5. 클라는 정보를 갱신한다.
