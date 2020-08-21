import client from './api-client';

function createRoom(roomName) {
  return client('room', { body: { roomName } });
}

function getRoom(roomName) {
  return client(`room/${roomName}`);
}

export { createRoom, getRoom };
