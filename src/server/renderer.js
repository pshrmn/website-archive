import React from 'react';
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";

import routes from "../client/routes";

export default function handleRender(req, res) {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res
        .status(500)
        .send(error.message);
    } else if (redirectLocation) {
      res
        .redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = renderToString(<RouterContext {...renderProps} />)
      res
        .status(200)
        .send(renderFullPage(html));
    } else {
      res
        .status(404)
        .send("Not found");
    }
  });
}

function renderFullPage(html) {
  return `<!doctype html>
<html>
  <head>
    <title>We Play</title>
    <link href='//fonts.googleapis.com/css?family=Fugaz+One|Oxygen' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="/static/css/index.css">
    <link rel="stylesheet" type="text/css" href="/static/css/games.css">
  </head>
  <body>
    <header>
      <a id="home" href="/index.html">We Play</a>
    </header>
    <div id="content">${html}</div>
    <footer>
      made by <a href="http://pshrmn.com">pshrmn.com</a>
    </footer>
    <script src="/static/js/polyfill.min.js"></script>
    <script src="/static/js/vendor.js"></script>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>`;
}