import RedisManager from '../../redisManager.js';
import { v4 as uuidv4 } from 'uuid';

export const nicknameEvent = async (data, userInfo) => {
  if (userInfo.current_info.stage === 0 && data.payload.status === 'success') {
    // 찾는다.
    let user = await RedisManager.getExampleData('user:' + data.payload.message);

    // 조회했는데 없다.? 그럼 새로생성.
    if (!user) {
      // 정보 변수 선언.
      const userId = uuidv4();

      // 처음이면 새로 생성.
      let info = {
        uuid: userId,
        health: userInfo.health,
        speed: userInfo.speed,
        current_info: {
          stage: userInfo.current_info.stage,
          score: null,
        },
        best_info: {
          stage: null,
          score: null,
        },
        x: null,
        y: null,
      };

      await RedisManager.createExampleData('user:' + data.payload.message, info);
      return info;
    } else {
      // 이미존재 한다면
      return JSON.parse(JSON.stringify(user));
    }
  }
};
