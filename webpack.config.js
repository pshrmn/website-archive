module.exports = {
  context: __dirname + "/dev/jsx",
  entry: "./app.jsx",
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  externals: {
    "react": "React",
    "socket.io": "io"
  },
  output: {
    path: __dirname + "/public/js/",
    filename: "bundle.js",
  },
  module: {
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader?stage=0"
      }
    ]
  }
};
