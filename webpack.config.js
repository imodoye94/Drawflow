const path = require('path');
const webpackMajor = Number(require('webpack/package.json').version.split('.')[0]);

const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'drawflow.min.js',
  globalObject: "typeof self !== 'undefined' ? self : this",
};

if (webpackMajor >= 5) {
  output.library = {
    name: 'Drawflow',
    type: 'umd',
    export: 'default'
  };
} else {
  output.library = 'Drawflow';
  output.libraryTarget = 'umd';
  output.libraryExport = 'default';
}

module.exports = {
  entry: './src/drawflow.js',
  output
};
