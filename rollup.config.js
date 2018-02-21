import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';

const path = require('path');

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    alias({
      '@': path.join(__dirname, './src'),
      'resolve': ['.js', '.json']
    }),
    resolve(),
    commonjs(),
    json()
  ],
};