const path = require('path');

module.exports = {
	entry: './js/galleri.js',
	mode: 'production',
	output: {
		library: 'Galleri',
		filename: 'galleri.min.js',
		path: path.resolve(__dirname, 'dist/js'),
	},
};
