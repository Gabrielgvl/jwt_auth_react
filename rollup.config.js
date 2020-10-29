import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-react-jsx-self',
        '@babel/plugin-proposal-object-rest-spread'],
    }),
    commonjs({
      include: ['src', 'node_modules/**'],
    }),
    typescript({ objectHashIgnoreUnknownHack: false }),
  ],
  external: ['react', 'react-dom'],
};
