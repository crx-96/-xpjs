import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';

const commonConfig = {
  input: './esm/index.js',
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
  plugins: [...commonConfig.plugins],
  output: [
    {
      name: 'XPDate',
      file: 'bundle/dayjs.umd.js',
      format: 'umd',
      sourcemap: false,
      exports: 'named',
    },
    {
      name: 'XPDate',
      file: 'bundle/dayjs.umd.min.js',
      format: 'umd',
      sourcemap: false,
      exports: 'named',
      plugins: [terser()],
    },
  ],
};
