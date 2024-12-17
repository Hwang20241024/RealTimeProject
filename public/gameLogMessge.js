export function addGameLogMessage(message) {
  const gameLog = document.getElementById('game-log');

  // 새로운 로그 메시지 추가
  const newMessage = document.createElement('p');
  newMessage.textContent = message;
  gameLog.appendChild(newMessage);

  // 스크롤을 항상 맨 아래로 이동
  gameLog.scrollTop = gameLog.scrollHeight;
}


export function clearAllLogMessages() {
  const gameLog = document.getElementById('game-log');
  gameLog.innerHTML = ''; // 모든 <p> 태그 제거
}