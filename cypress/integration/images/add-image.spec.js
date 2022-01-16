describe('add image', () => {
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

	afterEach(() => {
		cy.setUploads();
	});

	describe('with the root folder', () => {
		it('adds the image to the list', () => {
			cy.visit('/dark.html');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();

			// When the image does not exist.
			cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-create-image-button').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);

			// Shows the image list.
			cy.get('#robroy-images').should('be.visible');
			cy.get('#robroy-num').should('have.text', '1 image');

			// Adds the image to the list.
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');

			// Resets the upload form.
			cy.get('#robroy-create-image-input').invoke('val').should('equal', '');
			cy.get('#robroy-create-image-text').should('have.text', 'Drag files or click here to upload.');
			cy.get('#robroy-create-image-button').should('not.be.visible');

			// When the image already exists.
			cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-create-image-button').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 422);

			// Shows an error.
			cy.get('.robroy-modal-text').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');
		});
	});

	describe('with a non-root folder', () => {
		it('adds the image to the list', () => {
			cy.visit('/dark.html?folder=no-images-or-folders');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();

			// When the image does not exist.
			cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-create-image-button').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);

			// Shows the image list.
			cy.get('#robroy-images').should('be.visible');
			cy.get('#robroy-num').should('have.text', '1 image');

			// Adds the image to the list.
			cy.get('[data-path="no-images-or-folders/2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');

			// Resets the upload form.
			cy.get('#robroy-create-image-input').invoke('val').should('equal', '');
			cy.get('#robroy-create-image-text').should('have.text', 'Drag files or click here to upload.');
			cy.get('#robroy-create-image-button').should('not.be.visible');

			// Hides the delete folder button.
			cy.get('#robroy-delete-folder').should('not.be.visible');

			// When the image already exists.
			cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-create-image-button').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 422);

			// Shows an error.
			cy.get('.robroy-modal-text').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');
		});
	});
});
