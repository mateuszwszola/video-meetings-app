import io from 'socket.io-client';
import { SERVER_URL } from 'config';

let socket;

export const initiateSocket = () => {
  socket = io(SERVER_URL);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
