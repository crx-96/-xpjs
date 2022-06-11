import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const commonConfig = {
  input: 'index.ts',
  external: [/@babel\/runtime/],
  plugins: [
    clear({
      targets: ['bundle', 'cjs', 'esm'],
    }),
    resolve(),
    commonjs(),
  ],
};

export default [
  {
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({ outDir: 'esm', tsconfig: './tsconfig.esm.json' }),
      babel({
        // 编译库使用
        babelHelpers: 'runtime',
        // 只转换源代码，不转换外部依赖
        exclude: 'node_modules/**',
        // babel 默认不支持 ts 需要手动添加
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      }),
    ],
    output: [
      {
        dir: 'esm',
        format: 'esm',
        sourcemap: false,
        preserveModules: true,
        exports: 'auto',
      },
    ],
  },
  {
    ...commonConfig,
    plugins: [
      ...commonConfig.plugins,
      typescript({ outDir: 'cjs', tsconfig: './tsconfig.cjs.json' }),
      babel({
        // 编译库使用
        babelHelpers: 'runtime',
        // 只转换源代码，不转换外部依赖
        exclude: 'node_modules/**',
        // babel 默认不支持 ts 需要手动添加
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      }),
    ],
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        sourcemap: false,
        preserveModules: true,
        exports: 'auto',
      },
    ],
  },
  {
    ...commonConfig,
    input: './esm/index.js',
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
        name: 'XPCommon',
        file: 'bundle/common.umd.js',
        format: 'umd',
        sourcemap: false,
      },
      {
        name: 'XPCommon',
        file: 'bundle/common.umd.min.js',
        format: 'umd',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
  },
];
