describe('auth', () => {
	before(() => {
		cy.setUploads();
		cy.setPaths();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	after(() => {
		cy.resetPaths();
	});

	it('works', () => {
		cy.visit('/dark.html');
		cy.wait('@getFolders');
		cy.wait('@getFolders2');
		cy.wait('@getImages');

		// Hides admin controls initially.
		cy.get('.robroy-admin').should('not.exist');

		cy.contains('Log In').click();

		// Shows admin controls after login.
		cy.get('.robroy-admin').should('be.visible');

		cy.contains('Log Out').click();

		// Hide admin controls after logout.
		cy.get('.robroy-admin').should('not.exist');
	});
});
