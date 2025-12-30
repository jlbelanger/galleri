import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default {
	mode: 'production',
	devtool: false,
	entry: {
		galleri: './index.js',
		theme: './css/theme.css',
		minimal: './css/galleri.css',
	},
	output: {
		filename: 'js/[name].min.js',
		path: path.resolve(process.cwd(), 'dist'),
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
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'@csstools/postcss-global-data',
										{
											files: [
												'./css/utilities/breakpoints.css',
											],
										},
									],
									'postcss-preset-env',
								],
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
			new CssMinimizerPlugin({
				minimizerOptions: {
					// Disable postcss-calc to avoid warnings about calc() inside hsl().
					// https://github.com/postcss/postcss-calc/issues/216
					preset: ['default', { calc: false }],
				},
			}),
		],
		splitChunks: {
			cacheGroups: {
				theme: {
					name: 'theme',
					type: 'css/mini-extract',
					chunks: (chunk) => (chunk.name === 'theme'),
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
