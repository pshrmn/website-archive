import * as types from '../constants/ActionTypes';

/*
 * encapsulate the socket
 */
export default function socketMiddleware(socket) {
  const TARGET_TYPES = [
    types.JOIN_ROOM,
    types.LEAVE_ROOM,
    types.SET_GAME,
    types.SUBMIT_TURN,
    types.TOGGLE_READY
  ];

  return store => nextDispatch => action => {
    if ( !TARGET_TYPES.includes(action.type) ) {
      return nextDispatch(action);
    }
    // these actions don't hit the store, so there
    // is no need to pass them on
    switch ( action.type ) {
    case types.JOIN_ROOM:
      socket.emit('join', {
        nickname: action.nickname,
        room: action.room,
        password: action.password
      });
      break;
    case types.LEAVE_ROOM:
      socket.emit('leave', {
        room: action.room
      });
      break;
    case types.SET_GAME:
      socket.emit('set game', {
        room: action.room,
        game: action.game
      });
      break;
    case types.SUBMIT_TURN:
      socket.emit('submit turn', {
        room: action.room,
        turn: action.turn
      });
      break;
    case types.TOGGLE_READY:
      socket.emit('ready', {
        room: action.room
      });
      break;
    }
  }
}