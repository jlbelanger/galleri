import { galleriUrl } from '../../support/functions';

describe('edit image', () => {
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
			cy.visit(galleriUrl('images-only'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
			cy.get('#galleri-modal-cancel').click();
			cy.get('.galleri-modal').should('not.exist');
		});
	});

	describe('when not making any changes', () => {
		it('closes the popup', () => {
			cy.visit(galleriUrl('images-only'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
			cy.get('#galleri-modal-close').click();
			cy.get('.galleri-modal').should('not.exist');
			cy.get('.galleri-toast-text').should('have.text', 'Nothing to save.');
		});
	});

	describe('when the input is invalid', () => {
		describe('when removing the filename', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear();
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when removing the filename and folder', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear();
				cy.get('#galleri-input-folder').select('');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: This field is required.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when changing the filename to one that already exists', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('400x400.png');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: File "images-only/400x400.png" already exists.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when changing the folder to one where the filename already exists', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-folder').select('Images And Folders');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: File "images-and-folders/400x500.png" already exists.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when filename begins with a slash', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('/400x400.png');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: Filename cannot contain slashes.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when filename ends with a slash', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('400x400.png/');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: Filename cannot contain slashes.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when filename has a mid slash', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('400/400.png');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: Filename cannot contain slashes.');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});

		describe('when filename has no extension', () => {
			it('shows an error', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('400x400');
				cy.get('#galleri-modal-close').click();
				cy.get('#galleri-error-galleri-input-filename').should('have.text', 'Error: Filename is missing a file extension (eg. JPG, PNG).');
				cy.get('#galleri-error-galleri-input-folder').should('not.exist');
			});
		});
	});

	describe('when the input is valid', () => {
		afterEach(() => {
			cy.setUploads();
		});

		describe('when changing the filename', () => {
			it('updates the image', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('new-filename.png');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

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
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-folder').select('Folders Only');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="folders-only/400x500.png"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit(galleriUrl('folders-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/400x500.png"]').should('exist');
			});
		});

		describe('when removing the folder', () => {
			it('removes the image', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-folder').select('');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="400x500.png"]').should('not.exist');

				// Adds the image to the root folder.
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="400x500.png"]').should('exist');
			});
		});

		describe('when adding a folder', () => {
			it('removes the image', () => {
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#galleri-create-image').click();
				cy.get('#galleri-input-upload').attachFile('500x500.jpg');
				cy.get('#galleri-modal-close').click();
				cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);
				cy.get('.galleri-toast-close').click();
				cy.get('#galleri-modal-cancel').click();
				cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-folder').select('Folders Only');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');
				cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit(galleriUrl('folders-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('exist');
			});
		});

		describe('when changing the filename and folder', () => {
			it('removes the image', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-filename').clear().type('new-filename.png');
				cy.get('#galleri-input-folder').select('Folders Only');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Removes the image.
				cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="images-only/new-filename.png"]').should('not.exist');
				cy.get('[data-path="400x500.png"]').should('not.exist');
				cy.get('[data-path="new-filename.png"]').should('not.exist');
				cy.get('[data-path="folders-only/400x500.png"]').should('not.exist');
				cy.get('[data-path="folders-only/new-filename.png"]').should('not.exist');

				// Adds the image to the other folder.
				cy.visit(galleriUrl('folders-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="folders-only/new-filename.png"]').should('exist');
			});
		});

		describe('when adding, changing, removing the title', () => {
			it('updates the alt', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				// Adding title.
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-title').type('Example');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Updates the alt.
				cy.get('[data-path="images-only/400x500.png"] img').should('have.attr', 'alt', 'Example');

				// Shows the new alt after a refresh.
				cy.reload();
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"] img').should('have.attr', 'alt', 'Example');

				// Changing title.
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-title').clear().type('Foo');
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Updates the alt.
				cy.get('[data-path="images-only/400x500.png"] img').should('have.attr', 'alt', 'Foo');

				// Shows the new alt after a refresh.
				cy.reload();
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"] img').should('have.attr', 'alt', 'Foo');

				// Removing title.
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Edit').click();
				cy.get('#galleri-input-title').clear();
				cy.get('#galleri-modal-close').click();

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Image updated successfully.');

				// Hides the modal.
				cy.get('.galleri-modal').should('not.exist');

				// Updates the alt.
				cy.get('[data-path="images-only/400x500.png"] img').should('not.have.attr', 'alt');

				// Shows the new alt after a refresh.
				cy.reload();
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"] img').should('not.have.attr', 'alt');
			});
		});
	});
});
