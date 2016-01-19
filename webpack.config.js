module.exports = {
  entry: [
    './app'
  ],
  output: {
    path: 'assets',
    filename: 'bundle.js',
    publicPath: 'assets'
  },
  module: {
    loaders: [
      { test: /.js$/, loaders: ['babel?cacheDirectory'], exclude: /node_modules/ }
    ]
  }
}
