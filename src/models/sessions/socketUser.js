// 소캣 사용자 정보 저장용.
export default class SocketUser {
  constructor(socket) {
    this._socket = socket;
    this._name = null;
    this._keyInput = null; 
    this._isjump = false;

    // 각종 정보를 저장해 놓자.
    this._userInfo = {
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

  /*====[ 유저 초기화 ]====*/
  initializeUser(info) {
    this._userInfo = {
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
  /*==================*/

  /*====[ GET 함수 ]====*/

  // (GET) 유저 정보.
  get socket() {
    return this._socket;
  }

  // (GET) 유저 정보.
  get userInfo() {
    return this._userInfo;
  }

  // (GET) uuid.
  get uuid() {
    return this._userInfo.uuid;
  }

  // (GET) 체력.
  get health() {
    return this._userInfo.health;
  }

  // (GET) 스피드.
  get speed() {
    return this._userInfo.speed;
  }
  
  // (GET) 스테이지.
  get currentStage() {
    return this._userInfo.current_info.stage;
  }

  // (GET) 점수.
  get currentScore() {
    return this._userInfo.current_info.score;
  }

  // (GET) 최고기록_스테이지.
  get bestStage() {
    return this._userInfo.best_info.stage;
  }

  // (GET) 최고기록_점수.
  get bestScore() {
    return this._userInfo.best_info.score;
  }

  // (GET) 좌표.
  get position() {
    const position = {
      x : this._userInfo.x,
      y : this._userInfo.y
    }
    return position;
  }

  // (GET) 이름.
  get name() {
    return this._name;
  }

  // (GET) 키입력.
  get keyInput() {
    return this._keyInput;
  }

  // (GET) 점프확인.
  get isjump() {
    return this._isjump;
  }
  /*==================*/
  

  /*====[ SET 함수 ]====*/
  // (SET) uuid.
  set uuid(value) {
    this._userInfo.uuid = value;
  }

  // (SET) 체력.
  set health(value) {
    this._userInfo.health = value;
  }

  // (SET) 스피드.
  set speed(value) {
    this._userInfo.speed = value;
  }
  
  // (SET) 스테이지.
  set currentStage(value) {
    this._userInfo.current_info.stage = value;
  }

  // (SET) 점수.
  set currentScore(value) {
    this._userInfo.current_info.score = value;
  }

  // (SET) 스테이지.
  set bestStage(value) {
    this._userInfo.best_info.stage = value;
  }

  // (SET) 점수.
  set bestScore(value) {
    this._userInfo.best_info.score = value;
  }

  // (SET) 좌표.
  set position(value) {
    this._userInfo.x = value.x;
    this._userInfo.y = value.y;
  }

  // (SET) 이름.
  set name(value) {
    this._name = value;
  }

  // (SET) 키입력.
  set keyInput(value) {
    this._keyInput = value;
  }

  // (SET) 점프확인.
  set isjump(value) {
    this._isjump = value;
  }
  /*==================*/
  
}
