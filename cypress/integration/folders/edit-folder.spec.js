describe('edit folder', () => {
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

	describe('when not making any changes', () => {
		it('shows an error', () => {
			cy.visit('/dark.html?folder=folders-only/subfolder');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImagesSubfolder');
			cy.contains('Log In').click();
			cy.get('#robroy-edit-submit').click();
			cy.get('.robroy-modal-text').should('have.text', 'Nothing to update.');
		});
	});

	describe('when the input is invalid', () => {
		describe('when removing the name', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-name').clear();
				cy.get('#robroy-edit-submit').click();
				cy.get('#robroy-error-robroy-edit-folder-name').should('have.text', 'Error: This field is required.');
			});
		});

		describe('when removing the name and parent', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-name').clear();
				cy.get('#robroy-edit-folder-parent').select('');
				cy.get('#robroy-edit-submit').click();
				cy.get('#robroy-error-robroy-edit-folder-name').should('have.text', 'Error: This field is required.');
			});
		});

		describe('when changing the name to one that already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-name').clear().type('Subfolder 2');
				cy.get('#robroy-edit-submit').click();
				cy.get('.robroy-modal-text').should('have.text', 'Error: Folder "folders-only/subfolder-2" already exists.');
			});
		});

		describe('when changing the parent to one where the folder already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-parent').select('Images And Folders');
				cy.get('#robroy-edit-submit').click();
				cy.get('.robroy-modal-text').should('have.text', 'Error: Folder "images-and-folders/subfolder" already exists.');
			});
		});
	});

	describe('when the input is valid', () => {
		afterEach(() => {
			cy.setUploads();
		});

		describe('when changing the name', () => {
			it('redirects to the new URL', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-name').clear().type('New Name');
				cy.get('#robroy-edit-submit').click();

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=folders-only/new-name');
			});
		});

		describe('when changing the parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-parent').select('Images And Folders');
				cy.get('#robroy-edit-submit').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=images-and-folders/subfolder-2');
			});
		});

		describe('when removing the parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-parent').select('');
				cy.get('#robroy-edit-submit').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=subfolder-2');
			});
		});

		describe('when adding a parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=images-and-folders').as('updateFolder');
				cy.visit('/dark.html?folder=images-and-folders');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-parent').select('Folders Only');
				cy.get('#robroy-edit-submit').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=folders-only/images-and-folders');
			});
		});

		describe('when changing the name and parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImagesSubfolder');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder-name').clear().type('New Name');
				cy.get('#robroy-edit-folder-parent').select('Images And Folders');
				cy.get('#robroy-edit-submit').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=images-and-folders/new-name');
			});
		});
	});
});
