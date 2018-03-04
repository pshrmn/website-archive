import * as types from '../constants/ActionTypes';

export default function(state = {}, action) {
  switch ( action.type ) {
  case types.UPDATE_ROOM:
    return Object.assign({}, state, {
      room: action.room,
      error: undefined
    });
  case types.LEFT_ROOM:
    return Object.assign({}, state, {
      room: undefined,
      game: undefined,
      error: undefined
    });
  case types.HAD_ERROR:
    return Object.assign({}, state, {
      error: action.error
    })
  case types.UPDATE_GAME:
    return Object.assign({}, state, {
      game: action.game
    });
  default:
    return state;
  }
}