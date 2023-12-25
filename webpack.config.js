const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	devtool: false,
	entry: {
		galleri: './index.js',
		dark: './scss/dark.scss',
		light: './scss/light.scss',
		minimal: './scss/galleri.scss',
	},
	output: {
		filename: 'js/[name].min.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].min.css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'autoprefixer',
									'cssnano',
									'postcss-preset-env',
								],
							},
						},
					},
					'sass-loader',
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
		splitChunks: {
			cacheGroups: {
				dark: {
					name: 'dark',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'dark'),
					enforce: true,
				},
				light: {
					name: 'light',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'light'),
					enforce: true,
				},
				minimal: {
					name: 'minimal',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'minimal'),
					enforce: true,
				},
			},
		},
	},
};
