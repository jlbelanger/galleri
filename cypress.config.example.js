const { defineConfig } = require('cypress'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = defineConfig({
	e2e: {
		baseUrl: 'https://username:password@galleri.jennybelanger.local',
		viewportWidth: 1024,
		viewportHeight: 768,
	},
});
