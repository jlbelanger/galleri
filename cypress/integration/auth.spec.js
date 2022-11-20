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
		cy.visit('/');
		cy.wait('@getFolders');
		cy.wait('@getFolders2');
		cy.wait('@getImages');
		cy.wait('@getImages2');

		// Hides admin controls initially.
		cy.get('.robroy-admin').should('not.exist');

		cy.contains('Log In').click();

		// Shows admin controls after login.
		cy.get('.robroy-admin').should('be.visible');

		cy.contains('Log Out').click();

		// Hide admin controls after logout.
		cy.get('.robroy-admin').should('not.exist');

		cy.contains('Log In').click();
		cy.reload();

		// Shows admin controls initially if logged in.
		cy.get('.robroy-admin').should('be.visible');
	});
});
