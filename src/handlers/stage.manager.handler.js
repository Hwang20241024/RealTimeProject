// 맵핑된 핸들러 연결
import handlerMappings from './handlerMapping.js';

import SocketUser from '../models/sessions/socketUser.js';

// 연결된 소켓의 수를 추적하는 변수
let connectedSocketsCount = 0;

const stageHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(`유저가 서버에 접속했습니다. [${socket.id}]`);

    // 서버에 총 접속인원.
    connectedSocketsCount++;

    // 유저 정보 추가.
    const socketUser = new SocketUser(socket);
    // 현재 스테이지 지정 (1은 메인화면 )
    socketUser.currentStage = 0;

    socket.emit('connected', '게임에 접속하신걸 환영합니다.'); // 클라이언트로 응답 보내기
    socket.emit('connected', '닉네임을 입력하시고 버튼을 누르면 게임을 실행합니다.');

    // 게임로그 .
    const gameLog = handlerMappings[4];
    if (gameLog) {
      gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
      gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
    }

    // 랭킹보내기
    const cumulativeRankings = handlerMappings[2];
    const realTimeRankings = handlerMappings[3];
    const rankings = handlerMappings[6];
    if (cumulativeRankings && rankings) {
      
      rankings(io, socketUser.socket, 'cumulativeRankings', await cumulativeRankings());
    }

    //// 1. 메인스테이지 메세지 처리.
    socket.on('nicknameEvent', async (data) => {
      // 1-0. 유저가 메인메뉴에 있어야 한다.
      if (socketUser.currentStage === 0) {
        // 1-1. 닉네임 생성 
        const nicknameEvent = handlerMappings[1];
        const mainUserInfo = handlerMappings[5];
        
        if (nicknameEvent && mainUserInfo) {

          // 이미 존재한다면 기존 정보를 db에서 가져온다.
          const info = await nicknameEvent(data, socketUser.userInfo);
          socketUser.initializeUser(info);

          socketUser.currentStage = 1; // 위치 바꾸자. 

          // 생성된 정보를 유저에게 보내자.
          mainUserInfo(socketUser.socket, socketUser.userInfo, data.payload.message);
          socketUser.name = data.payload.message;

        }

        // 1-2. 스테이지 체인지.
        const seneChange = handlerMappings[7];
        if (seneChange) {
          // 바뀐 스테이지를 유저에게 보내자.
          seneChange(socketUser.socket, socketUser.currentStage);

          // 다른 유저에게도 보이자.
          gameLog(
            io,
            socketUser.socket,
            0,
            ` ${socketUser.name}님이 ${socketUser.currentStage}스테이지에 입장하셨습니다.`,
          );

          gameLog(io, socketUser.socket, 3, `현재 최고점수는 [ 스테이지 : ${socketUser.bestStage} 점수 : ${socketUser.bestScore} ]`);
          gameLog(io, socketUser.socket, 4, `[실시간 랭킹]`);

          if(realTimeRankings){
            rankings(io, socketUser.socket, 'realTimeRankings', await realTimeRankings());
          }
          


        }
      } else {
        console.log(`${socketUser.name}님은 메인메뉴가 아닙니다.`);
      };
    });

    // 스테이지 1

    // 스테이지 2

    // 스테이지 3

    // 스테이지 4

    // 스테이지 5

    // 클라이언트에서 접속헤제 했을때 이벤트
    socket.on('disconnect', () => {
      connectedSocketsCount--;
      gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
      gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount - 1}명입니다.`);
    });
  });
};

export default stageHandler;
