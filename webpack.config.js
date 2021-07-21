const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  devtool: "source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
            ],
            plugins: ["@babel/proposal-class-properties"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
