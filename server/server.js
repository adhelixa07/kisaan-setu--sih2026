import http from 'http';
import { createServer as createExpressServer } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisaan-setu';

const app = createExpressServer();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  const token = socket.handshake?.auth?.token || socket.handshake?.headers?.authorization;
  const userId = token ? token.split(':')[0] || 'anonymous' : 'anonymous';

  socket.join(`user:${userId}`);

  socket.on('message:send', (payload) => {
    socket.emit('message:new', {
      success: true,
      data: {
        message: payload,
      },
    });
  });
});

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    server.listen(PORT, () => {
      console.log(`Kisaan Setu API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failure:', error.message);
    process.exit(1);
  }
};

start();

export { app, server, io };
