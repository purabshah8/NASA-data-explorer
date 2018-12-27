const path = require('path');

module.exports = {
  context: __dirname,
  entry: './nasa_data_explorer.jsx',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  }
};