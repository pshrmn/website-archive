import ReactDOM from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import io from 'socket.io-client';

import routes from './routes';
import reducers from './reducers';
import {
  hadError,
  leftRoom,
  updateRoom,
  updateGame
} from './actions';
import socketMiddleware from './middleware/socketMiddleware';

const socket = io();
const initialState = window.__INITIAL_STATE__ || {
  error: undefined,
  room: undefined,
  game: undefined
};

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    socketMiddleware(socket)
  )
);

socket.on('joined', resp => {
  if ( resp.error ) {
    store.dispatch(
      hadError(resp.reason)
    );
  } else {
    browserHistory.push({
      pathname: `/r/${resp.room}`
    })
  }
});

socket.on('left', resp => {
  store.dispatch(
    leftRoom()
  );
  browserHistory.push({
    pathname: '/'
  });
});


socket.on('roomState', resp => {
  store.dispatch(
    updateRoom(resp)
  );
});

socket.on('gameState', resp => {
  store.dispatch(
    updateGame(resp)
  );
});

ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory}
            routes={routes} />
  </Provider>,
  document.getElementById('content')
);
