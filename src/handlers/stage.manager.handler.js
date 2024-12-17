import { v4 as uuidv4 } from 'uuid';
import { gameLog } from './helper.js';
import RedisManager from '../redisManager.js';

// 스테이지 연결
import { mainHandler } from './stage/main.handler.js';
// 임시
// import { stage1Handler } from './stage/stage1.handler.js';
// import { stage2Handler } from './stage/stage2.handler.js';
// import { stage3Handler } from './stage/stage3.handler.js';
// import { stage4Handler } from './stage/stage4.handler.js';
// import { stage5Handler } from './stage/stage5.handler.js';

// 소캣 사용자 정보 저장용.
class StageManager {
  constructor(socket) {
    this.socket = socket;
    this.currentStage = null; // 현재 활성화된 핸들러

    // 각종 정보를 저장해 놓자.
    this.userInfo = {
      uuid: null,
      health: null,
      speed: null,
      current_info: {
        stage: null,
        score: null,
      },
      best_info: {
        stage: null,
        score: null,
      },
      x: null,
      y: null,
    };
  }

  // 유저 초기화
  initializeUser(uuid, health, speed, current_info, best_info, x, y) {
    this.userInfo = {
      uuid: uuid,
      health: health,
      speed: speed,
      current_info: {
        stage: current_info.stage,
        score: current_info.score,
      },
      best_info: {
        stage: best_info.stage,
        score: best_info.score,
      },
      x: x,
      y: y,
    };
  }

  // 스테이지 전환
  switchStage(stage, uuid, SocketsCount, date = null) {
    switch (stage) {
      case 1:
        this.currentStage = 'main';
        mainHandler(this.socket, uuid, SocketsCount, date);
        break;
      case 2:
        this.currentStage = 'stage';
        stage1Handler(this.socket);
        break;
    }
  }
}

let connectedSocketsCount = 0; // 연결된 소켓의 수를 추적하는 변수

// 게임로그 종류
const gameLogType = ['_DEFAULT', '_CURRENT_USERS'];

const stageHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`유저가 서버에 접속했습니다. [${socket.id}]`);

    // 서버에 총 접속인원.
    connectedSocketsCount++;

    // 스테이지 매니저 인스턴스 생성
    const stageManager = new StageManager(socket);

    // 초기에는 메인스테이지 시작
    stageManager.switchStage(1);

    socket.emit('connected', '게임에 접속하신걸 환영합니다.'); // 클라이언트로 응답 보내기
    socket.emit('connected', '닉네임을 입력하시고 버튼을 누르면 게임을 실행합니다.');

    gameLog(
      io,
      stageManager.socket,
      gameLogType[0],
      `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`,
    );
    gameLog(
      io,
      stageManager.socket,
      gameLogType[1],
      `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`,
    );

    // 메인스테이지 메세지 처리.
    socket.on('nicknameEvent', async (data) => {
      if (stageManager.currentStage === 'main' && data.payload.status === 'success') {
        let user = await RedisManager.getExampleData("user:" +data.payload.message);

        console.log(user);
        // 조회 했는데 없다.? 그럼 새로생성.
        if (!user) {
          // 정보 변수 선언.
          const userId = uuidv4();

          // 유저 초기화.
          stageManager.initializeUser(userId, 3, 1, { stage: 1, score: 0 }, { stage: 1, score: 0 }, 0, 0);

          console.log("user:" + data.payload.message);
          // 데이터 생성.
          await RedisManager.createExampleData("user:" + data.payload.message, stageManager.userInfo);
        } else {
          // 존재한다면? 
          Object.assign(stageManager.userInfo, user);
        }
      }
    });

    // 스테이지 1

    // 스테이지 2

    // 스테이지 3

    // 스테이지 4

    // 스테이지 5

    // 클라이언트에서 접속헤제 했을때 이벤트
    socket.on('disconnect', () => {
      connectedSocketsCount--;
      gameLog(
        io,
        stageManager.socket,
        gameLogType[0],
        `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`,
      );
      gameLog(
        io,
        stageManager.socket,
        gameLogType[1],
        `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`,
      );
    });
  });
};

export default stageHandler;
