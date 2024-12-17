// 맵핑된 핸들러 연결
import handlerMappings from './handlerMapping.js';


// 소캣 사용자 정보 저장용.
class StageManager {
  constructor(socket) {
    this.socket = socket;


    // 각종 정보를 저장해 놓자.
    this.userInfo = {
      uuid: null,
      health: 3,
      speed: 1,
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
  initializeUser(info) {
    this.userInfo = {
      uuid: info.uuid,
      health: info.health,
      speed: info.speed,
      current_info: {
        stage: info.current_info.stage,
        score: info.current_info.score,
      },
      best_info: {
        stage: info.best_info.stage,
        score: info.best_info.score,
      },
      x: info.x,
      y: info.y,
    };
  }

  // 스테이지 전환
  switchStage(stage) {
    switch (stage) {
      case 1:
        this.userInfo.current_info.stage = 0;
        break;
      case 2:
        this.userInfo.current_info.stage = 1;
        break;
      case 3:
        this.userInfo.current_info.stage = 2;
        break;
      case 4:
        this.userInfo.current_info.stage = 3;
        break;
      case 5:
        this.userInfo.current_info.stage = 4;
        break;
      case 6:
        this.userInfo.current_info.stage = 5;
        break;
    }
  }
}

let connectedSocketsCount = 0; // 연결된 소켓의 수를 추적하는 변수

const stageHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(`유저가 서버에 접속했습니다. [${socket.id}]`);

    // 서버에 총 접속인원.
    connectedSocketsCount++;

    // 스테이지 매니저 인스턴스 생성
    const stageManager = new StageManager(socket);

    // 초기에는 메인스테이지 시작
    stageManager.switchStage(1);

    socket.emit('connected', '게임에 접속하신걸 환영합니다.'); // 클라이언트로 응답 보내기
    socket.emit('connected', '닉네임을 입력하시고 버튼을 누르면 게임을 실행합니다.');

    // 게임로그 .
    const gameLog = handlerMappings[4];
    if(gameLog) {
      gameLog(io, stageManager.socket, 0, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
      gameLog(io, stageManager.socket, 1, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
    }


    // 랭킹보내기
    const cumulativeRankings = handlerMappings[2];
    const rankings = handlerMappings[6]; 
    if(cumulativeRankings && rankings) {
      rankings(io, stageManager.socket, 'cumulativeRankings', await cumulativeRankings());
    }
    

    //// 1. 메인스테이지 메세지 처리.
    socket.on('nicknameEvent', async (data) => {
      // 1-1. 닉네임 생성.
      const nicknameEvent = handlerMappings[1];
      const mainUserInfo = handlerMappings[5];
      
      if(nicknameEvent && mainUserInfo){
        // 이미 존재한다면 기존 정보를 db에서 가져온다.
        const info = await nicknameEvent(data, stageManager.userInfo);
        stageManager.initializeUser(info);

        // 생성된 정보를 유저에게 보내자.
        mainUserInfo(stageManager.socket, info, data.payload.message);
      }

      // 1-2. 스테이지 체인지.
      const seneChange = handlerMappings[7];
      if(seneChange){
        stageManager.switchStage(2);
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
      gameLog(io, stageManager.socket, 0, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
      gameLog(io, stageManager.socket, 1, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
    });
  });
};

export default stageHandler;
