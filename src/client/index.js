import ReactDOM from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router';

import routes from './routes';

ReactDOM.render(
  <Router history={browserHistory}
          routes={routes} />,
  document.getElementById('content')
);
