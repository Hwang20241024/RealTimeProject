import SocketManager from './socket.manager.js';

// 버튼 클릭 이벤트 처리
document.getElementById('start-button').addEventListener('click', async () => {
  const socket = SocketManager.getInstance();

  if (socket.currentStage === 0 || socket.currentStage === null) {
    const inputElement = document.getElementById('username-input');
    const nickname = inputElement.value.trim(); // 입력 값 가져오기

    const regex = /^[a-zA-Z0-9가-힣]{3,15}$/; // 한글, 영어 대소문자, 숫자만 허용, 3~15자

    if (!regex.test(nickname)) {
      alert(
        '닉네임은 한글, 영어 대소문자, 숫자만 포함해야 하며, 3자 이상 15자 이하로 입력해주세요.',
      );

      // 입력값 초기화
      inputElement.value = '';
    } else {
      // 닉네임이 접속해 있는지 확인하자.
      // socket.sendEvent('nicknameValidation', 1, { status: 'success', message: nickname });

      // let validationName = '';
      // socket.socket.on('nicknameValidation', (data) => {
      //   validationName = data.payload.message;
      // });

      // if (validationName !== validationName) {
      //   // 유효하면 소켓을 통해 서버로 닉네임 전송
      //   socket.sendEvent('nicknameEvent', 1, { status: 'success', message: nickname });
      // }

      // 유효하면 소켓을 통해 서버로 닉네임 전송
      socket.sendEvent('nicknameEvent', 1, { status: 'success', message: nickname });

      // 입력값 초기화
      inputElement.value = '';
    }
  }
});
