import RedisManager from '../utils/redisManager.js';
import { CLIENT_VERSION } from '../constants.js';
import { v4 as uuidv4 } from 'uuid';

/*==== 아이템 생성, 스테이지 생성.(db에 새로운 아이템 추가하는용도. 로직에 상관x) ====*/
export const createItem = async ()=>  {
  // redis 인스턴스 연결.
  const redisManager = RedisManager.getInstance();

  await redisManager.createData("item:gem", {score: 100,} );
  await redisManager.createData("item:cherry", {score: 100,} );

  await redisManager.createData("stage:1", {nextStageScore: 1000, timeLimit : 180 } );
  await redisManager.createData("stage:2", {nextStageScore: 1000, timeLimit : 150 } );
  await redisManager.createData("stage:3", {nextStageScore: 1000, timeLimit : 120 } );
  await redisManager.createData("stage:4", {nextStageScore: 1000, timeLimit : 90 } );
  await redisManager.createData("stage:5", {nextStageScore: 1000, timeLimit : 60 } );
};
/*===================================================================*/

// 변수 선언
let isItemSpawnActive = false;  // 메시지 전송 여부를 체크하는 변수
const items = ['gem','cherry'];


export const spawnItem = async (io, socket) => {

  // 아이템 타입

  
  setInterval(() => {
    if (!isItemSpawnActive) {

      // 1. name은 아이템이 추가될껄 대비해서 0 ~ 인덱스 최대치
      // 1-1. 클라쪽에서 이름을 가지고 해당 아이템 생성. 
      // 2. 좌표는 초기에는 반응형 처럼 환경에따라 0 ~ 1 비율로 지정
      // 2-1. 반응형 웹사이트마냥 환경에따라 크기다르게 할려고했던 흔적.. 슬픕니다 ㅜㅜ
      
      const uuid = uuidv4();
      const itemId = items[Math.floor(Math.random() * items.length)] + ':' + uuid;

      const data = {
        name : itemId,
        x : Math.random(),
        y : Math.random() * 0.1,
      }

      io.emit('spawnItem', {
        userId: socket.id,
        clientVersion: CLIENT_VERSION,
        handlerId: 9,
        payload: { status: 'success', message: data },
      });

      // 일정 시간 후 메시지 전송 상태를 다시 초기화
      setTimeout(() => {
        isItemSpawnActive = false;
      }, 5000); // 5초마다 한번만 메시지 전송
    }

  }, 5000); // 1000ms = 1초
};
