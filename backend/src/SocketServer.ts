import {Server as SocketServer, Socket} from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, { cors: {} });

  const onConnection = async (socket: Socket) => {
    // Socket connection started
    console.log('Connection started with socket id: ' + socket.id);
  };

  io.on('connection', onConnection);
};

export default startSocketServer;
