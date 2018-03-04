import * as types from '../constants/ActionTypes';

// emitting
export const joinRoom = (nickname, room, password) => ({
  type: types.JOIN_ROOM,
  nickname,
  room,
  password
});

export const leaveRoom = room => ({
  type: types.LEAVE_ROOM,
  room
});

export const setGame = (room, game) => ({
  type: types.SET_GAME,
  room,
  game
});

export const submitTurn = (room, turn) => ({
  type: types.SUBMIT_TURN,
  room,
  turn
});

export const toggleReady = room => ({
  type: types.TOGGLE_READY,
  room
});

// listening
export const updateRoom = room => ({
  type: types.UPDATE_ROOM,
  room
});

export const leftRoom = () => ({
  type: types.LEFT_ROOM
});

export const hadError = error => ({
  type: types.HAD_ERROR,
  error
});

export const updateGame = game => ({
  type: types.UPDATE_GAME,
  game
});
