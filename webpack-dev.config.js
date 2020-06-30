const config = require('./webpack.config');

module.exports = {
	...config,
	mode: 'none',
	optimization: {
		minimize: false,
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/,
	},
};
