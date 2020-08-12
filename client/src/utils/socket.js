import io from 'socket.io-client';
import { API_URL } from 'config';

let socket;

export const initiateSocket = (room) => {
  socket = io(API_URL);
  if (socket && room) {
    socket.emit('JOIN_ROOM', { room });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const subscribeToRoom = ({ userJoinedCb, userLeftCb }) => {
  if (!socket) return;
  socket.on('USER_JOINED', (msg) => {
    return userJoinedCb(null, msg);
  });

  socket.on('USER_LEFT', (msg) => {
    return userLeftCb(null, msg);
  });
};
