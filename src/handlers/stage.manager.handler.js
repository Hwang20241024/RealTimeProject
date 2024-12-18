import handlerMappings from './handlerMapping.js';
import SocketUser from '../models/sessions/socketUser.js';
import RedisManager from '../utils/redisManager.js';

// 연결된 소켓의 수를 추적하는 변수
let connectedSocketsCount = 0;

const stageHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(`유저가 서버에 접속했습니다. [${socket.id}]`);

    // 서버에 총 접속인원.
    connectedSocketsCount++;

    // 유저 정보 추가.
    const socketUser = new SocketUser(socket);

    // 현재 스테이지 지정 (0은 메인화면 )
    socketUser.currentStage = 0;

    // 사용할 함수 선언.
    const gameLog = handlerMappings[4];
    const nicknameEvent = handlerMappings[1];
    const mainUserInfo = handlerMappings[5];
    const seneChange = handlerMappings[7];
    const sendErrorMessage = handlerMappings[8];
    const cumulativeRankings = handlerMappings[2];
    const realTimeRankings = handlerMappings[3];
    const rankings = handlerMappings[6];

    // 로그 보내기.
    gameLog(io, socketUser.socket, 2, `게임에 접속하신걸 환영합니다.`);
    gameLog(io, socketUser.socket, 2, `닉네임을 입력하시고 버튼을 누르면 게임을 실행합니다.`);
    gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);
    gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);

    // 랭킹보내기
    rankings(socketUser.socket, 'cumulativeRankings', await cumulativeRankings());

    // redis 인스턴스 연결.
    const redisManager = RedisManager.getInstance();

    //// 1. 메인스테이지 메세지 처리.
    socket.on('nicknameEvent', async (data) => {
      // 1-1. 존재하는 닉네임인지 확인하고 없다면 새로 생성, 있다면 기존에 있는 걸 가져온다.
      const info = await nicknameEvent(data, socketUser.userInfo);
      socketUser.initializeUser(info);

      // 1-2. 가져왔는데 스테이지가 메인스테이지가 아니면 접속중이다.
      if (socketUser.currentStage === 0) {
        // 1-3. 소캣 스테이지 정보를 1로 바꾼다.
        socketUser.currentStage = 1;

        // 1-4. 생성된 정보를 유저에게 보내자.
        mainUserInfo(socketUser.socket, socketUser.userInfo, data.payload.message);
        socketUser.name = data.payload.message;

        // 1-5. redis저장되어있는 데이터 갱신.
        const currentInfo = {
          stage: socketUser.currentStage,
          score: socketUser.currentScore,
        };
        const str = 'user:' + socketUser.name;
        await redisManager.updateData(str, 'current_info', currentInfo);

        // 1-6. 바뀐 스테이지 정보를 유저에게 보낸다.
        seneChange(socketUser.socket, socketUser.currentStage);

        // 1-7. 게임 로그를 유저에게 보낸다.
        let str1 = `${socketUser.name}님이 ${socketUser.currentStage}스테이지에 입장하셨습니다.`;
        let str2 = `최고기록 ( 스테이지 : ${socketUser.bestStage}  점수 : ${socketUser.bestScore} )`;
        gameLog(io, socketUser.socket, 0, str1);
        gameLog(io, socketUser.socket, 3, str2);

        // 1-8. 각종 ui 변경.
        gameLog(io, socketUser.socket, 4, `[실시간 랭킹]`);
        rankings(socketUser.socket, 'realTimeRankings', await realTimeRankings());
      } else {
        // 중복입장 막기.
        sendErrorMessage(socketUser.socket, 0, '이미 접속한 유저입니다.');
      }
    });

    // 스테이지 1

    // 스테이지 2

    // 스테이지 3

    // 스테이지 4

    // 스테이지 5

    // 클라이언트에서 접속헤제 했을때 이벤트
    socket.on('disconnect', async () => {
      connectedSocketsCount--;
      gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);
      gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);

      const currentInfo = {
        stage: 0,
        score: 0,
      };
      const str = 'user:황만석';
      await redisManager.updateData(str, 'current_info', currentInfo);
    });
  });
};

export default stageHandler;
