// redisClient.js
import Redis from 'ioredis';

// Redis 연결 설정
const redis = new Redis({
  host: 'localhost', // Redis 서버 주소
  port: 6379, // 기본 포트
});

// Redis 연결 상태 확인
redis.on('connect', () => {
  console.log('Redis에 연결되었습니다!');
});

redis.on('error', (err) => {
  console.error('Redis 연결 오류:', err);
});

// 데이터 생성 (SET)
export const createData = (key, value) => {
  return new Promise((resolve, reject) => {
    redis.set(key, JSON.stringify(value), (err, result) => {
      if (err) {
        reject(new Error('데이터 저장 실패: ' + err)); // Error 객체로 reject
      } else {
        resolve(result); // "OK" 반환
      }
    });
  });
};

// 데이터 조회 (GET)
export const getData = (key) => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, result) => {
      if (err) {
        reject(new Error('데이터 조회 실패: ' + err)); // Redis 에러
        return;
      }

      if (result) {
        try {
          resolve(JSON.parse(result)); // JSON을 객체로 반환
        } catch (parseError) {
          reject(new Error('JSON 파싱 실패: ' + parseError.message)); // JSON 파싱 에러
        }
      } else {
        resolve(null); // 데이터가 없으면 null 반환
      }
    });
  });
};


// 접두어로 키 조회 (GET)
export const getKeyByPrefix = async (Key) => {
  let cursor = '0'; // SCAN 명령어의 커서
  const keys = [];

  try {
    // SCAN 명령어로 user:로 시작하는 모든 키를 찾기
    do {
      const result = await redis.scan(cursor, 'MATCH', Key + ':*', 'COUNT', 100);
      cursor = result[0]; // 새로운 커서 값
      keys.push(...result[1]); // 찾은 키들
    } while (cursor !== '0'); // 커서가 0으로 돌아오면 종료

    return keys;
  } catch (error) {
    console.error('Redis 키 조회 중 오류 발생:', error.message);
  }
};

// 접두어로 데이터 조회 (GET)
export const getDataByPrefix = async (Key) => {
  let cursor = '0'; // SCAN 명령어의 커서
  const keys = [];
  const userData = {};

  try {
    // SCAN 명령어로 user:로 시작하는 모든 키를 찾기
    do {
      const result = await redis.scan(cursor, 'MATCH', Key + ':*', 'COUNT', 100);
      cursor = result[0]; // 새로운 커서 값
      keys.push(...result[1]); // 찾은 키들
    } while (cursor !== '0'); // 커서가 0으로 돌아오면 종료

    // 찾은 키들에 대해 데이터 조회
    for (const key of keys) {
      const data = await redis.get(key); // 해당 키에 대한 값 가져오기
      userData[key] = JSON.parse(data); // 가져온 데이터 (문자열이라면 JSON.parse)
    }

    return userData;
  } catch (error) {
    console.error('Redis 데이터 조회 중 오류 발생:', error.message);
  }
};

// 전체 데이터 조회 (GET)
export const getAllData = async () => {
  try {
    const keys = await redis.keys('*'); // 모든 키 가져오기
    const data = await redis.mget(keys); // 여러 키에 대해 데이터를 한 번에 가져옴

    const allData = keys.map((key, index) => ({
      key,
      data: data[index],
    }));

    return allData;
  } catch (error) {
    console.error('데이터 조회 오류:', error);
  }
};

// 데이터 업데이트 (SET, 기존 데이터 덮어쓰기)
export const updateData = (key, value) => {
  return new Promise((resolve, reject) => {
    redis.set(key, JSON.stringify(value), (err, result) => {
      if (err) {
        reject(new Error('데이터 업데이트 실패: ' + err)); // Error 객체로 reject
      } else {
        resolve(result); // "OK" 반환
      }
    });
  });
};

// 데이터 삭제 (DEL)
export const deleteData = (key) => {
  return new Promise((resolve, reject) => {
    redis.del(key, (err, result) => {
      if (err) {
        reject(new Error('데이터 삭제 실패: ' + err)); // Error 객체로 reject
      } else {
        resolve(result); // 1이 반환되면 삭제 성공
      }
    });
  });
};

// Redis 연결 종료
export const closeConnection = () => {
  redis.quit(() => {
    console.log('Redis 연결 종료');
  });
};


