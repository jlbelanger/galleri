const path = require('path');

module.exports = {
	entry: './js/robroy.js',
	mode: 'production',
	output: {
		library: 'Robroy',
		filename: 'robroy.min.js',
		path: path.resolve(__dirname, 'dist/js'),
	},
};
