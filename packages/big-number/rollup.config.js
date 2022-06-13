import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const commonConfig = {
  input: './lib/index.ts',
  external: [/@babel\/runtime/],
  plugins: [
    clear({
      targets: ['bundle'],
    }),
    resolve(),
    commonjs(),
  ],
};

export default {
  ...commonConfig,
  input: './cjs/index.js',
  plugins: [
    ...commonConfig.plugins,
    babel({
      // 编译库使用
      babelHelpers: 'runtime',
      // 只转换源代码，不转换外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS],
    }),
  ],
  output: [
    {
      name: 'XPNumber',
      file: 'bundle/number.umd.js',
      format: 'umd',
      sourcemap: false,
      exports: 'named',
    },
    {
      name: 'XPNumber',
      file: 'bundle/number.umd.min.js',
      format: 'umd',
      sourcemap: false,
      exports: 'named',
      plugins: [terser()],
    },
  ],
};
