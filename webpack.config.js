module.exports = {
  entry: './examples/swisstopo.js',
  devtool: 'source-map',
  resolve: {symlinks: false},
  output: {
    filename: 'main.js'
  }
};
