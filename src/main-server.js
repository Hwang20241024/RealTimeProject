import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import RedisManager from './utils/redisManager.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // 이거 클라 안만들어서 주석
initSocket(server); // 소켓 추가

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});



server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

});
