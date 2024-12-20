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
    const spawnItem = handlerMappings[9];
    const updateUserInfo = handlerMappings[10];
    const removeCollectedItem = handlerMappings[11];
    const updateUserAction = handlerMappings[12];
    const removeUser = handlerMappings[13];

    // 로그 보내기.
    gameLog(io, socketUser.socket, 2, `게임에 접속하신걸 환영합니다.`);
    gameLog(io, socketUser.socket, 2, `닉네임을 입력하시고 버튼을 누르면 게임을 실행합니다.`);
    gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);
    gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);

    // 랭킹보내기
    rankings(io, socketUser.socket, 'cumulativeRankings', await cumulativeRankings());

    // redis 인스턴스 연결.
    const redisManager = RedisManager.getInstance();


    //// 0. 닉네임 검증. nicknameValidation
    socket.on('nicknameValidation', async (data) => {
      const name = 'user:' + data.payload.message;
      let userName = await redisManager.getAllData(name);
      socket.emit('nicknameValidation',{status: 'success', message: userName});

    });

    //// 1. 메인스테이지 메세지 처리.
    socket.on('nicknameEvent', async (data) => {
      // 1-1. 존재하는 닉네임인지 확인하고 없다면 새로 생성, 있다면 기존에 있는 걸 가져온다.
      const info = await nicknameEvent(data, socketUser.userInfo);

      console.log(info);
      
      // 1-2. 가져왔는데 스테이지가 메인스테이지가 아니면 접속중이다.
      if (info.current_info.stage === 0 && info.current_info.score === 0 ) {
        socketUser.initializeUser(info);
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
        rankings(io, socketUser.socket, 'realTimeRankings', await realTimeRankings());
      } else {
        // 중복입장 막기.
        sendErrorMessage(socketUser.socket, 0, '이미 접속한 유저입니다.');
      }
    });

    // 스테이지 1
    // 아이템 스폰.
    spawnItem(io, socketUser.socket, connectedSocketsCount);

    // 유저 아이템 획득
    socket.on('itemPickedUp', async (data) => {
      // 1. 일단 데이터를 가져오자 현재 스테이지, 현재 점수.
      const userName = 'user:' + socketUser.name;
      let current_info = await redisManager.getData(userName, 'current_info');

      // 2. 아이템의 점수를 가져오자.
      const itemName = 'item:' + data.payload.message.split(':')[0];
      let itemScore = await redisManager.getData(itemName, 'score');

      // 3. 점수를 계산 한다. (시간이 없어서 간단하게 아이템점수*스테이지 )
      const collectedScore = itemScore * current_info.stage;
      current_info.score = current_info.score + collectedScore;

      // 4. 현재 점수가 스테이지를 넘을 수 있는가 확인.
      const stageName = 'stage:' + current_info.stage;
      let nextStageScore = await redisManager.getData(stageName, 'nextStageScore');

      if (current_info.score >= nextStageScore) {
        if (current_info.stage !== 5) {
          current_info.stage = current_info.stage + 1;

          // 스테이지 이동시 전체로그
          const str = ` ${socketUser.name}님이 ${current_info.stage}스테이지로 이동하셨습니다. `;

          gameLog(io, socketUser.socket, 0, str);
        }
      }

      // 5. 유저의 데이터를 갱신한다.
      await redisManager.updateData(userName, 'current_info', current_info);

      // 6. 갱신한 정보를 유저에게 보낸다.
      updateUserInfo(socketUser.socket, current_info);

      // 7. 실시간 랭킹도 갱신하자.
      rankings(io, socketUser.socket, 'realTimeRankings', await realTimeRankings());

      // 8. 리스폰된 아이템 갱신
      removeCollectedItem(socketUser.socket, data.payload.message);
    });

    // 유저 포지션
    socket.on('sendPosition', async (data) => {
      // 바로 유저들에게 정보 전달.
      updateUserAction(socketUser.socket, data.payload.message);
    });

    // 클라이언트에서 접속헤제 했을때 이벤트
    socket.on('disconnect', async () => {
      connectedSocketsCount--;

      // 닉네임이 없다는건 게임 실행을 안했다는것 저장할 필요가없다.
      if (socketUser.currentStage !== 0) {
        try {
          const userName = 'user:' + socketUser.name;
          let current_info = await redisManager.getData(userName, 'current_info');
          let best_info = await redisManager.getData(userName, 'best_info');

          const defaultValues = {
            stage: 0,
            score: 0,
          };

          // 기록이 갱신 했다면.
          if (current_info.score > best_info.score) {
            best_info.stage = current_info.stage;
            best_info.score = current_info.score;

            await redisManager.updateData(userName, 'best_info', best_info);
            await redisManager.updateData(userName, 'current_info', defaultValues);
          } else {
            await redisManager.updateData(userName, 'current_info', defaultValues);
          }

          removeUser(socketUser.socket, socketUser.name);
          gameLog(io, socketUser.socket, 0, `${socketUser.name}님이 접속을 종료했습니다.`);
        } catch (error) {


          console.log("에러입니다.");
        }
      }

      gameLog(io, socketUser.socket, 0, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);
      gameLog(io, socketUser.socket, 1, `현재 접속인원은 ${connectedSocketsCount}명입니다.`);
    });
  });
};

export default stageHandler;
