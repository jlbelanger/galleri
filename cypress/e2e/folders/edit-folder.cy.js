import { galleriAbsoluteUrl, galleriUrl } from '../../support/functions.js';

describe('edit folder', () => {
	before(() => {
		cy.setUploads();
		cy.build();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	describe('when clicking the cancel button', () => {
		it('closes the popup', () => {
			cy.visit(galleriUrl('folders-only/subfolder'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#galleri-edit-folder').click();
			cy.get('#galleri-modal-cancel').click();
			cy.get('.galleri-modal').should('not.exist');
		});
	});

	describe('when not making any changes', () => {
		it('closes the popup', () => {
			cy.visit(galleriUrl('folders-only/subfolder'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#galleri-edit-folder').click();
			cy.get('#galleri-modal-close').click();
			cy.get('.galleri-modal').should('not.exist');
			cy.get('.galleri-toast-text').should('have.text', 'Nothing to save.');
		});
	});

	describe('when the input is invalid', () => {
		describe('when removing the name', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-name').clear();
				cy.get('#galleri-input-id').clear().type('subfolder');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-id').should('not.exist');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when removing the ID', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-id').clear();
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('not.exist');
				cy.get('#galleri-error-galleri-input-id').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when removing the ID and name', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-name').clear();
				cy.get('#galleri-input-id').clear();
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-id').should('not.exist');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when removing the ID and parent', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-id').clear();
				cy.get('#galleri-input-parent').select('');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('not.exist');
				cy.get('#galleri-error-galleri-input-id').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when changing the ID to one that already exists', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-id').clear().type('subfolder-2');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('not.exist');
				cy.get('#galleri-error-galleri-input-id').should('have.text', 'Error: Folder "folders-only/subfolder-2" already exists.');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when changing the ID to the thumbnails folder', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-id').clear().type('thumbnails');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('not.exist');
				cy.get('#galleri-error-galleri-input-id').should('have.text', 'Error: ID cannot be the same as the thumbnails folder.');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});

		describe('when changing the parent to one where the folder already exists', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('folders-only/subfolder'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-parent').select('Images And Folders');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-name').should('not.exist');
				cy.get('#galleri-error-galleri-input-id').should('have.text', 'Error: Folder "images-and-folders/subfolder" already exists.');
				cy.get('#galleri-error-galleri-input-parent').should('not.exist');
			});
		});
	});

	describe('when the input is valid', () => {
		afterEach(() => {
			cy.setUploads();
		});

		describe('when changing the name', () => {
			it('redirects to the new URL', () => {
				cy.visit(galleriUrl('folders-only/subfolder-2'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-name').clear().type('New Name');
				cy.get('#galleri-modal-close').click();

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('folders-only/new-name'));
			});
		});

		describe('when changing the name for a folder with images and folders', () => {
			it('redirects to the new URL', () => {
				cy.visit(galleriUrl('images-and-folders'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');

				// Shows the folders.
				const items = ['Subfolder'];
				cy.get('.galleri-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="images-and-folders/400x400.png"]').should('be.visible');
				cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-name').clear().type('New Name');
				cy.get('#galleri-modal-close').click();

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('new-name'));

				// Shows the folders.
				cy.get('.galleri-folder-link').each((item, index) => {
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
				cy.visit(galleriUrl('folders-only/subfolder-2'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-parent').select('Images And Folders');
				cy.get('#galleri-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('images-and-folders/subfolder-2'));
			});
		});

		describe('when removing the parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
				cy.visit(galleriUrl('folders-only/subfolder-2'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-parent').select('');
				cy.get('#galleri-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('subfolder-2'));
			});
		});

		describe('when adding a parent', () => {
			it('redirects to the new URL', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=images-and-folders').as('updateFolder');
				cy.visit(galleriUrl('images-and-folders'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.wait('@getImages2');

				// Shows the folders.
				const items = ['Subfolder'];
				cy.get('.galleri-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the images.
				cy.get('[data-path="images-and-folders/400x400.png"]').should('be.visible');
				cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-parent').select('Folders Only');
				cy.get('#galleri-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('folders-only/images-and-folders'));
				// Shows the folders.
				cy.get('.galleri-folder-link').each((item, index) => {
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
				cy.visit(galleriUrl('folders-only/subfolder-2'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-edit-folder').click();
				cy.get('#galleri-input-name').clear().type('New Name');
				cy.get('#galleri-input-parent').select('Images And Folders');
				cy.get('#galleri-modal-close').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Redirects.
				cy.location('href').should('eq', galleriAbsoluteUrl('images-and-folders/new-name'));
			});
		});
	});
});
