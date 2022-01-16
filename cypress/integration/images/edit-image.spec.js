describe('edit image', () => {
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

	describe('when clicking the cancel button', () => {
		it('closes the popup', () => {
			cy.visit('/dark.html?folder=images-only');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();
			cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
			cy.get('#robroy-modal-cancel').click();
			cy.get('.robroy-modal').should('not.exist');
		});
	});

	describe('when not making any changes', () => {
		it('closes the popup', () => {
			cy.visit('/dark.html?folder=images-only');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();
			cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
			cy.get('#robroy-edit-image-submit').click();
			cy.get('.robroy-modal').should('not.exist');
		});
	});

	describe('when the input is invalid', () => {
		describe('when removing the filename', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear();
				cy.get('#robroy-edit-image-submit').click();
				cy.get('#robroy-error-robroy-edit-image-filename').should('have.text', 'Error: Please enter a filename.');
			});
		});

		describe('when removing the filename and folder', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear();
				cy.get('#robroy-edit-image-folder').select('');
				cy.get('#robroy-edit-image-submit').click();
				cy.get('#robroy-error-robroy-edit-image-filename').should('have.text', 'Error: Please enter a filename.');
				cy.get('#robroy-error-robroy-edit-image-folder').should('not.exist');
			});
		});

		describe('when changing the filename to one that already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear().type('400x400.png');
				cy.get('#robroy-edit-image-submit').click();
				cy.get('.robroy-modal + .robroy-modal .robroy-modal-text').should(
					'have.text',
					'Error: File "images-only/400x400.png" already exists.',
				);
			});
		});

		describe('when changing the folder to one where the filename already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-folder').select('Images And Folders');
				cy.get('#robroy-edit-image-submit').click();
				cy.get('.robroy-modal + .robroy-modal .robroy-modal-text').should(
					'have.text',
					'Error: File "images-and-folders/400x500.png" already exists.',
				);
				cy.get('#robroy-error-robroy-edit-image-folder').should('not.exist');
			});
		});
	});

	describe('when the input is valid', () => {
		afterEach(() => {
			cy.setUploads();
		});

		describe('when changing the filename', () => {
			it('updates the image', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear().type('new-filename.png');
				cy.get('#robroy-edit-image-submit').click();

				// Hides the modal.
				cy.get('.robroy-modal').should('not.exist');

				// Updates the path.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="images-only/new-filename.png"]').should('exist');

				// Shows the new filename after a refresh.
				cy.reload();
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="images-only/new-filename.png"]').should('exist');
			});
		});

		describe('when changing the folder', () => {
			it('removes the image', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-folder').select('Folders Only');
				cy.get('#robroy-edit-image-submit').click();

				// Hides the modal.
				cy.get('.robroy-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="folders-only/400x500.png"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit('/dark.html?folder=folders-only');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/400x500.png"]').should('exist');
			});
		});

		describe('when removing the folder', () => {
			it('removes the image', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-folder').select('');
				cy.get('#robroy-edit-image-submit').click();

				// Hides the modal.
				cy.get('.robroy-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="400x500.png"]').should('not.exist');

				// Adds the image to the root folder.
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="400x500.png"]').should('exist');
			});
		});

		describe('when adding a folder', () => {
			it('removes the image', () => {
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
				cy.get('#robroy-create-image-button').click();
				cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);
				cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-folder').select('Folders Only');
				cy.get('#robroy-edit-image-submit').click();

				// Hides the modal.
				cy.get('.robroy-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');
				cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit('/dark.html?folder=folders-only');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('exist');
			});
		});

		describe('when changing the filename and folder', () => {
			it('removes the image', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear().type('new-filename.png');
				cy.get('#robroy-edit-image-folder').select('Folders Only');
				cy.get('#robroy-edit-image-submit').click();

				// Hides the modal.
				cy.get('.robroy-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="images-only/new-filename.png"]').should('not.exist');
				cy.get('[data-path="400x500.png"]').should('not.exist');
				cy.get('[data-path="new-filename.png"]').should('not.exist');
				cy.get('[data-path="folders-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="folders-only/new-filename.png"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit('/dark.html?folder=folders-only');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/new-filename.png"]').should('exist');
			});
		});
	});
});
