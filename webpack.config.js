const path = require('path');

module.exports = {
  entry: './examples/swisstopo.js',
  devtool: 'source-map',
  resolve: {symlinks: false},
  output: {
    filename: 'main.js'
  },
  devServer: {
        static: path.resolve(__dirname, 'dist'),
  }
};
