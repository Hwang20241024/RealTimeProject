import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import RedisManager from './redisManager.js';

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

//await RedisManager.createExampleData('user:123', { name: 'John Doe4', age: 30 });
//await RedisManager.createExampleData('user:1234', { name: 'John Doe4', age: 30 });

//await RedisManager.deleteExampleData('user:123');
//await RedisManager.deleteExampleData('user:1234');
await RedisManager.getDataByPrefix("user");

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

});
