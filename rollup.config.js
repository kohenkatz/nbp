import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default [
	{
		input: pkg.browser,
		output: {
			file: 'dist/' + pkg.browser,
			format: 'umd'
		},
		name: 'nbp',
		browser: true,
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			}),
		]
	},
	{
		input: pkg.main,
		output: [
			{ file: 'dist/' + pkg.main, format: 'cjs' },
			{ file: 'dist/' + pkg.module, format: 'es' }
		]
	}
];