import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../client/components/app';

export default function handleRender(req, res) {
  // Render the component to a string
  const html = renderToString(<App />);
  // Send the rendered page back to the client
  res.send(renderFullPage(html));
}

function renderFullPage(html) {
  return `<!doctype html>
<html>
  <head>
    <title>We Play</title>
    <link href='//fonts.googleapis.com/css?family=Fugaz+One|Oxygen' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="static/css/index.css">
    <link rel="stylesheet" type="text/css" href="static/css/games.css">
  </head>
  <body>
    <header>
      <a id="home" href="/index.html">We Play</a>
    </header>
    <div id="content">${html}</div>
    <footer>
      made by <a href="http://pshrmn.com">pshrmn.com</a>
    </footer>
    <script src="static/js/vendor.js"></script>
    <script src="static/js/bundle.js"></script>
  </body>
</html>`;
}