import io from 'socket.io-client';
import { API_URL } from 'config';

let socket;

export const initiateSocket = () => {
  socket = io(API_URL);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
