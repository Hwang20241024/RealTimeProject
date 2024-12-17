import * as redisClient from './redisClient.js';

class RedisManager {
  // 데이터 생성
  static async createExampleData(key, value) {
    try {
      const existingData = await redisClient.getData(key);
      if (existingData) {
        console.log('데이터가 이미 존재합니다:', existingData);
        return; 
      }
    } catch (error) {
      console.error('데이터 생성 실패:', error.message);
    }

    
    try {
      const result = await redisClient.createData(key, value);
      console.log('데이터 생성 성공:', result);
    } catch (error) {
      console.error('데이터 생성 실패:', error.message);
    }
  }

  // 데이터 조회(키값지정)
  static async getExampleData(key) {
    try {
      const data = await redisClient.getData(key);
      console.log('조회된 데이터:', data);
      return data;
    } catch (error) {
      console.error('데이터 조회 실패:', error.message);
    }
  }

  // 키값 접두어 조회
  static async getKeyByPrefix(key) {
    try {
      const data = await redisClient.getKeyByPrefix(key);
      console.log('조회된 데이터:', data);
      return data;
    } catch (error) {
      console.error('데이터 조회 실패:', error.message);
    }
  }

  // 데이터 접두어 조회
  static async getDataByPrefix(key) {
    try {
      const data = await redisClient.getDataByPrefix(key);
      console.log('조회된 데이터:', data);
      return data;
    } catch (error) {
      console.error('데이터 조회 실패:', error.message);
    }
  }

  // 데이터 조회(전체데이터 조회)
  static async getExampleALLData() {
    try {
      const data = await redisClient.getAllData();
      console.log('조회된 데이터:', data);
      return data;
    } catch (error) {
      console.error('데이터 조회 실패:', error.message);
    }
  }

  // 데이터 업데이트
  static async updateExampleData(key, value) {
    try {
      const result = await redisClient.updateData(key, value);
      console.log('데이터 업데이트 성공:', result);
    } catch (error) {
      console.error('데이터 업데이트 실패:', error.message);
    }
  }

  // 데이터 삭제
  static async deleteExampleData(key) {
    try {
      const result = await redisClient.deleteData(key);
      console.log('데이터 삭제 성공:', result);
    } catch (error) {
      console.error('데이터 삭제 실패:', error.message);
    }
  }
}

export default RedisManager;
