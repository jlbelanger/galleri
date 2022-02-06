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

	describe('when clicking the cancel button', () => {
		it('closes the popup', () => {
			cy.visit('/dark.html?folder=folders-only/subfolder');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#robroy-edit-folder').click();
			cy.get('#robroy-modal-cancel').click();
			cy.get('.robroy-modal').should('not.exist');
		});
	});

	describe('when not making any changes', () => {
		it('closes the popup', () => {
			cy.visit('/dark.html?folder=folders-only/subfolder');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#robroy-edit-folder').click();
			cy.get('#robroy-modal-close').click();
			cy.get('.robroy-modal').should('not.exist');
			cy.get('.robroy-toast-text').should('have.text', 'Nothing to save.');
		});
	});

	describe('when the input is invalid', () => {
		describe('when removing the name', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear();
				cy.get('#robroy-modal-close').click();
				cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: This field is required.');
				cy.get('#robroy-error-robroy-input-parent').should('not.exist');
			});
		});

		describe('when removing the name and parent', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear();
				cy.get('#robroy-input-parent').select('');
				cy.get('#robroy-modal-close').click();
				cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: This field is required.');
				cy.get('#robroy-error-robroy-input-parent').should('not.exist');
			});
		});

		describe('when changing the name to one that already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear().type('Subfolder 2');
				cy.get('#robroy-modal-close').click();
				cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: Folder "folders-only/subfolder-2" already exists.');
				cy.get('#robroy-error-robroy-input-parent').should('not.exist');
			});
		});

		describe('when changing the name to the thumbnails folder', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear().type('Thumbnails');
				cy.get('#robroy-modal-close').click();
				cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: Name cannot be the same as the thumbnails folder.');
				cy.get('#robroy-error-robroy-input-parent').should('not.exist');
			});
		});

		describe('when changing the parent to one where the folder already exists', () => {
			it('shows an error', () => {
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent').select('Images And Folders');
				cy.get('#robroy-modal-close').click();
				cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: Folder "images-and-folders/subfolder" already exists.');
				cy.get('#robroy-error-robroy-input-parent').should('not.exist');
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
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear().type('New Name');
				cy.get('#robroy-modal-close').click();

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=folders-only/new-name');
			});
		});

		describe('when changing the name for a folder with images and folders', () => {
			it('redirects to the new URL', () => {
				cy.visit('/dark.html?folder=images-and-folders');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');

				// Shows the folders.
				const items = ['Subfolder'];
				cy.get('.robroy-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="images-and-folders/400x400.png"]').should('be.visible');
				cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear().type('New Name');
				cy.get('#robroy-modal-close').click();

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=new-name');

				// Shows the folders.
				cy.get('.robroy-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="new-name/400x400.png"]').should('be.visible');
				cy.get('[data-path="new-name/400x500.png"]').should('be.visible');
			});
		});

		describe('when changing the parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent').select('Images And Folders');
				cy.get('#robroy-modal-close').click();
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
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent').select('');
				cy.get('#robroy-modal-close').click();
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
				cy.wait('@getImages2');

				// Shows the folders.
				const items = ['Subfolder'];
				cy.get('.robroy-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="images-and-folders/400x400.png"]').should('be.visible');
				cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent').select('Folders Only');
				cy.get('#robroy-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=folders-only/images-and-folders');
				// Shows the folders.
				cy.get('.robroy-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="folders-only/images-and-folders/400x400.png"]').should('be.visible');
				cy.get('[data-path="folders-only/images-and-folders/400x500.png"]').should('be.visible');
			});
		});

		describe('when changing the name and parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit('/dark.html?folder=folders-only/subfolder-2');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-name').clear().type('New Name');
				cy.get('#robroy-input-parent').select('Images And Folders');
				cy.get('#robroy-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('pathname').should('eq', '/dark.html');
				cy.location('search').should('eq', '?folder=images-and-folders/new-name');
			});
		});
	});
});
