import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'https://username:password@galleri.jennybelanger.local',
		experimentalRunAllSpecs: true,
		viewportWidth: 1024,
		viewportHeight: 768,
	},
});
