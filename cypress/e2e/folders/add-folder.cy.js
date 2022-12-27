import { robroyUrl } from '../../support/functions';

describe('add folder', () => {
	before(() => {
		cy.setUploads();
		cy.build();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	describe('with the root folder', () => {
		describe('when the input is invalid', () => {
			describe('when the name is blank', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-id').clear().type('new-folder');
					cy.get('#robroy-modal-close').click();
					cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: This field is required.');
					cy.get('#robroy-error-robroy-input-id').should('not.exist');
					cy.get('#robroy-error-robroy-input-parent').should('not.exist');
				});
			});

			describe('when the ID is blank', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-name').clear().type('New Folder');
					cy.get('#robroy-input-id').clear();
					cy.get('#robroy-modal-close').click();
					cy.get('#robroy-error-robroy-input-name').should('not.exist');
					cy.get('#robroy-error-robroy-input-id').should('have.text', 'Error: This field is required.');
					cy.get('#robroy-error-robroy-input-parent').should('not.exist');
				});
			});
			describe('when the name and ID are blank', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-modal-close').click();
					cy.get('#robroy-error-robroy-input-name').should('have.text', 'Error: This field is required.');
					cy.get('#robroy-error-robroy-input-id').should('not.exist');
					cy.get('#robroy-error-robroy-input-parent').should('not.exist');
				});
			});

			describe('when the folder already exists', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-name').clear().type('New Folder');
					cy.get('#robroy-input-id').clear().type('folders-only');
					cy.get('#robroy-modal-close').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 422);
					cy.get('#robroy-error-robroy-input-name').should('not.exist');
					cy.get('#robroy-error-robroy-input-id').should('have.text', 'Error: Folder "folders-only" already exists.');
					cy.get('#robroy-error-robroy-input-parent').should('not.exist');
				});
			});

			describe('when the folder matches the thumbnails folder', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-name').clear().type('New Folder');
					cy.get('#robroy-input-id').clear().type('thumbnails');
					cy.get('#robroy-modal-close').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 422);
					cy.get('#robroy-error-robroy-input-name').should('not.exist');
					cy.get('#robroy-error-robroy-input-id').should('have.text', 'Error: ID cannot be the same as the thumbnails folder.');
					cy.get('#robroy-error-robroy-input-parent').should('not.exist');
				});
			});
		});

		describe('when the input is valid', () => {
			afterEach(() => {
				cy.setUploads();
			});

			describe('when the parent is the current folder', () => {
				it('creates the folder', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-name').clear().type('New Folder');
					cy.get('#robroy-modal-close').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

					// Shows a toast.
					cy.get('.robroy-toast-text').should('have.text', 'Folder created successfully.');

					// Clears the name and ID fields.
					cy.get('#robroy-input-name').invoke('val').should('equal', '');
					cy.get('#robroy-input-id').invoke('val').should('equal', '');

					// Does not clear the parent field.
					cy.get('#robroy-input-parent option:selected').should('have.text', '');

					// Adds the folder to the folder list.
					const items = [
						'Folders Only',
						'Images And Folders',
						'Images Only',
						'New Folder',
						'No Images Or Folders',
					];
					cy.get('.robroy-folder-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Adds the new folder to the parent list.
					const options = [
						'',
						'Folders Only',
						'Folders Only > Subfolder',
						'Folders Only > Subfolder 2',
						'Images And Folders',
						'Images And Folders > Subfolder',
						'Images Only',
						'New Folder',
						'No Images Or Folders',
					];
					cy.get('#robroy-input-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', options[index]);
					});

					// Shows the new folder after a refresh.
					cy.reload();
					cy.wait('@getFolders');
					cy.wait('@getImages');
					cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');
				});
			});

			describe('when the parent is another folder', () => {
				it('creates the folder', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-folder').click();
					cy.get('#robroy-input-name').clear().type('New Folder');
					cy.get('#robroy-input-parent').select('Folders Only');
					cy.get('#robroy-modal-close').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

					// Shows a toast.
					cy.get('.robroy-toast-text').should('have.text', 'Folder created successfully.');

					// Clears the name and ID fields.
					cy.get('#robroy-input-name').invoke('val').should('equal', '');
					cy.get('#robroy-input-id').invoke('val').should('equal', '');

					// Does not clear the parent field.
					cy.get('#robroy-input-parent option:selected').should('have.text', 'Folders Only');

					// Does not add the folder to the folder list.
					const items = [
						'Folders Only',
						'Images And Folders',
						'Images Only',
						'No Images Or Folders',
					];
					cy.get('.robroy-folder-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Adds the new folder to the create parent list.
					const options = [
						'',
						'Folders Only',
						'Folders Only > New Folder',
						'Folders Only > Subfolder',
						'Folders Only > Subfolder 2',
						'Images And Folders',
						'Images And Folders > Subfolder',
						'Images Only',
						'No Images Or Folders',
					];
					cy.get('#robroy-input-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', options[index]);
					});

					// Adds the folder to the subfolder.
					cy.visit(robroyUrl('folders-only'));
					cy.wait('@getFolders');
					cy.wait('@getImages');
					cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');
				});
			});
		});
	});

	describe('with a non-root folder', () => {
		afterEach(() => {
			cy.setUploads();
		});

		describe('when the parent is the current folder', () => {
			it('creates the folder', () => {
				cy.visit(robroyUrl('no-images-or-folders'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-create-folder').click();
				cy.get('#robroy-input-name').clear().type('New Folder');
				cy.get('#robroy-modal-close').click();
				cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Folder created successfully.');

				// Clears the name and ID fields.
				cy.get('#robroy-input-name').invoke('val').should('equal', '');
				cy.get('#robroy-input-id').invoke('val').should('equal', '');

				// Does not clear the parent field.
				cy.get('#robroy-input-parent option:selected').should('have.text', 'No Images Or Folders');

				// Adds the folder to the folder list.
				const items = [
					'New Folder',
				];
				cy.get('.robroy-folder-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Adds the new folder to the create parent list.
				const options = [
					'',
					'Folders Only',
					'Folders Only > Subfolder',
					'Folders Only > Subfolder 2',
					'Images And Folders',
					'Images And Folders > Subfolder',
					'Images Only',
					'No Images Or Folders',
					'No Images Or Folders > New Folder',
				];
				cy.get('#robroy-input-parent option').each((item, index) => {
					cy.wrap(item).should('have.text', options[index]);
				});

				// Hides the delete folder button.
				cy.get('#robroy-modal-cancel').click();
				cy.get('#robroy-delete-folder').should('not.be.visible');

				// Adds the new folder to the edit parent list.
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent option').each((item, index) => {
					cy.wrap(item).should('have.text', options[index]);
				});

				// Shows the new folder after a refresh.
				cy.reload();
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');
			});
		});

		describe('when the parent is another folder', () => {
			it('creates the folder', () => {
				cy.visit(robroyUrl('no-images-or-folders'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();
				cy.get('#robroy-create-folder').click();
				cy.get('#robroy-input-name').clear().type('New Folder');
				cy.get('#robroy-input-parent').select('Folders Only');
				cy.get('#robroy-modal-close').click();
				cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Folder created successfully.');

				// Clears the name and ID fields.
				cy.get('#robroy-input-name').invoke('val').should('equal', '');
				cy.get('#robroy-input-id').invoke('val').should('equal', '');

				// Does not clear the parent field.
				cy.get('#robroy-input-parent option:selected').should('have.text', 'Folders Only');

				// Does not add the folder to the folder list.
				cy.get('.robroy-folder-link').should('not.exist');

				// Adds the new folder to the create parent list.
				const options = [
					'',
					'Folders Only',
					'Folders Only > New Folder',
					'Folders Only > Subfolder',
					'Folders Only > Subfolder 2',
					'Images And Folders',
					'Images And Folders > Subfolder',
					'Images Only',
					'No Images Or Folders',
				];
				cy.get('#robroy-input-parent option').each((item, index) => {
					cy.wrap(item).should('have.text', options[index]);
				});

				// Does not hide the delete folder button.
				cy.get('#robroy-modal-cancel').click();
				cy.get('#robroy-delete-folder').should('be.visible');

				// Adds the new folder to the edit parent list.
				cy.get('#robroy-edit-folder').click();
				cy.get('#robroy-input-parent option').each((item, index) => {
					cy.wrap(item).should('have.text', options[index]);
				});

				// Adds the folder to the subfolder.
				cy.visit(robroyUrl('folders-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');
			});
		});
	});
});
