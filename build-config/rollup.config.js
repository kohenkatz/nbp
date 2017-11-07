import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
	{
		input: 'src/index-browser.js',
		name: 'nbp',
		browser: true,
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			})
		],
		output: [
			{file: 'dist/nbp.js', format: 'iife'},
			{file: 'lib/nbp.browser.es.js', format: 'es'},
			{file: 'lib/nbp.browser.cjs.js', format: 'cjs'},
		],
	},
	{
		input: 'src/index-node.js',
		name: 'nbp',
		browser: false,
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			})
		],
		output: [
			{file: 'lib/nbp.es.js', format: 'es'},
			{file: 'lib/nbp.cjs.js', format: 'cjs'},
		],
	},
]
