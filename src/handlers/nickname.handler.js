import RedisManager from '../utils/redisManager.js';
import { v4 as uuidv4 } from 'uuid';

export const nicknameEvent = async (data, userInfo) => {
  if (userInfo.current_info.stage === 0 && data.payload.status === 'success') {
    const redisManager = RedisManager.getInstance();

    // 찾는다.
    let user = await redisManager.getAllData('user:' + data.payload.message);

    // 조회했는데 없다.? 그럼 새로생성.
    if (!user || Object.keys(user).length === 0) {
      // 정보 변수 선언.
      const userId = uuidv4();

      // 처음이면 새로 생성.
      let info = {
        uuid: userId,
        health: userInfo.health,
        speed: userInfo.speed,
        current_info: {
          stage: userInfo.current_info.stage,
          score: 0,
        },
        best_info: {
          stage: 0,
          score: 100,
        },
        x: 0,
        y: 0,
      };

      // 키
      const userKey = 'user:' + data.payload.message;

      // 데이터를 한 번에 저장
      await redisManager.createData(userKey, info);

      return info;
    } else {
      // 이미존재 한다면
      return JSON.parse(JSON.stringify(user));
    }
  }
};
