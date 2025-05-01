import express from 'express';
import cors from 'cors';
import { Server as HttpServer, createServer as createHttpServer } from 'http';
import startSocketServer from './SocketServer';

const app = express();

app.use(cors());
app.use(express.json());

let httpServer: HttpServer;
httpServer = createHttpServer(app);

startSocketServer(httpServer);

httpServer.listen(3005, () => {
  console.info(`Listening on 3005`);
});
