describe('index', () => {
	before(() => {
		cy.resetFiles();
	});

	describe('auth', () => {
		it('works', () => {
			cy.setUploadPath('demo/public/images');
			cy.visit('/dark.html');

			cy.get('#robroy-edit-folder-form').should('not.exist');
			cy.get('#robroy-delete-folder').should('not.exist');
			cy.get('#robroy-create-folder-form').should('not.exist');
			cy.get('#robroy-create-image-form').should('not.exist');
			cy.get('.robroy-figure .robroy-button--danger').should('not.exist');

			cy.contains('Log In').click();

			cy.get('#robroy-edit-folder-form').should('not.exist');
			cy.get('#robroy-delete-folder').should('not.exist');
			cy.get('#robroy-create-folder-form').should('be.visible');
			cy.get('#robroy-create-image-form').should('be.visible');
			cy.get('.robroy-figure .robroy-button--danger').should('be.visible');

			cy.contains('Log Out').click();

			cy.get('#robroy-edit-folder-form').should('not.exist');
			cy.get('#robroy-delete-folder').should('not.exist');
			cy.get('#robroy-create-folder-form').should('not.exist');
			cy.get('#robroy-create-image-form').should('not.exist');
			cy.get('.robroy-figure .robroy-button--danger').should('not.exist');
		});
	});

	describe('with the root folder', () => {
		describe('when it has folders only', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current/folders-only');
				cy.visit('/dark.html');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// No meta title.
				cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

				// Does not show the breadcrumb.
				cy.get('.robroy-breadcrumb').should('not.exist');

				// Does not show the edit folder form.
				cy.get('#robroy-edit-folder-form').should('not.exist');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.exist');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', '');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Shows the folder list.
				cy.get('#robroy-folders').should('be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');
			});
		});

		describe('when it has images only', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current/images-only');
				cy.visit('/dark.html');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// No meta title.
				cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

				// Does not show the breadcrumb.
				cy.get('.robroy-breadcrumb').should('not.exist');

				// Does not show the edit folder form.
				cy.get('#robroy-edit-folder-form').should('not.exist');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.exist');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', '');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not show the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Shows the image list.
				cy.get('#robroy-images').should('be.visible');
				cy.get('#robroy-num').should('have.text', '2 images');
			});
		});

		describe('when it has images and folders', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current/images-and-folders');
				cy.visit('/dark.html');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// No meta title.
				cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

				// Does not show the breadcrumb.
				cy.get('.robroy-breadcrumb').should('not.exist');

				// Does not show the edit folder form.
				cy.get('#robroy-edit-folder-form').should('not.exist');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.exist');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', '');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Shows the folder list.
				cy.get('#robroy-folders').should('be.visible');

				// Shows the image list.
				cy.get('#robroy-images').should('be.visible');
				cy.get('#robroy-num').should('have.text', '2 images');
			});
		});

		describe('when it has no images or folders', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current/no-images-or-folders');
				cy.visit('/dark.html');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// No meta title.
				cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

				// Does not show the breadcrumb.
				cy.get('.robroy-breadcrumb').should('not.exist');

				// Does not show the edit folder form.
				cy.get('#robroy-edit-folder-form').should('not.exist');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.exist');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', '');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not show the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');
			});
		});

		describe('when uploading an image', () => {
			describe('when the input is valid', () => {
				it('adds the image to the list', () => {
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
					cy.intercept('POST', '/api.php?type=images').as('uploadImage');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');

					// When the image does not exist.
					cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
					cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
					cy.get('#robroy-create-image-button').click();
					cy.wait('@uploadImage');

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
					cy.wait('@uploadImage');

					// Shows an error.
					cy.get('.robroy-modal-text').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');

					cy.resetFiles();
				});
			});
		});

		describe('when creating a folder', () => {
			describe('when the name is blank', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-create-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Error: Please enter a name.');
				});
			});

			describe('when the folder already exists', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
					cy.intercept('POST', '/api.php?type=folders').as('createFolder');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-create-folder-name').clear().type('Folders Only');
					cy.get('#robroy-create-submit').click();
					cy.wait('@createFolder');
					cy.get('.robroy-modal-text').should('have.text', 'Error: Folder "folders-only" already exists.');
				});
			});

			describe('when the input is valid', () => {
				describe('when creating a folder in the root folder', () => {
					it('creates the folder', () => {
						cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
						cy.intercept('POST', '/api.php?type=folders').as('createFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-create-folder-name').clear().type('New Folder');
						cy.get('#robroy-create-submit').click();
						cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

						// Clears the name field.
						cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');

						// Does not clear the parent field.
						cy.get('#robroy-create-folder-parent option:selected').should('have.text', '');

						// Adds the folder to the folder list.
						cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

						// Adds the new folder to the create parent list.
						const items = [
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
						cy.get('#robroy-create-folder-parent option').each((item, index) => {
							cy.wrap(item).should('have.text', items[index]);
						});

						// Shows the new folder after a refresh.
						cy.reload();
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

						cy.resetFiles();
					});
				});

				describe('when creating a folder in another folder', () => {
					it('creates the folder', () => {
						cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
						cy.intercept('POST', '/api.php?type=folders').as('createFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-create-folder-name').clear().type('New Folder');
						cy.get('#robroy-create-folder-parent').select('Folders Only');
						cy.get('#robroy-create-submit').click();
						cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

						// Clears the name field.
						cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');

						// Does not clear the parent field.
						cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Folders Only');

						// Does not add the folder to the folder list.
						cy.get('.robroy-folder-link').contains('New Folder').should('not.exist');

						// Adds the new folder to the create parent list.
						const items = [
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
						cy.get('#robroy-create-folder-parent option').each((item, index) => {
							cy.wrap(item).should('have.text', items[index]);
						});

						// Adds the folder to the subfolder.
						cy.intercept('GET', '/api.php?type=folders&id=folders-only').as('getFolder2');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only').as('getImages2');
						cy.visit('/dark.html?folder=folders-only');
						cy.wait('@getFolder2');
						cy.wait('@getImages2');
						cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

						cy.resetFiles();
					});
				});
			});
		});
	});

	describe('with a folder', () => {
		describe('when it has folders only', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=folders-only');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// Sets the meta title.
				cy.title().should('eq', 'Folders Only | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'Folders Only'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder-form').should('be.visible');
				cy.get('#robroy-edit-folder-name').invoke('val').should('equal', 'Folders Only');
				cy.get('#robroy-edit-folder-parent option:selected').should('have.text', '');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Folders Only');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Shows the folder list.
				cy.get('#robroy-folders').should('be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');
			});
		});

		describe('when it has images only', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// Sets the meta title.
				cy.title().should('eq', 'Images Only | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'Images Only'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder-form').should('be.visible');
				cy.get('#robroy-edit-folder-name').invoke('val').should('equal', 'Images Only');
				cy.get('#robroy-edit-folder-parent option:selected').should('have.text', '');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Images Only');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not show the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Shows the image list.
				cy.get('#robroy-images').should('be.visible');
				cy.get('#robroy-num').should('have.text', '2 images');
			});

			describe('when deleting images', () => {
				it('works', () => {
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('DELETE', '/api.php?type=images&path=images-only/400x500.png').as('deleteImage1');
					cy.intercept('DELETE', '/api.php?type=images&path=images-only/400x500.png').as('deleteImage2');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-only');
					cy.contains('Log In').click();
					cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

					// When clicking the cancel button.
					cy.get('[data-path="images-only/400x500.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-cancel').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Does not remove the image from the list.
					cy.get('[data-path="images-only/400x500.png"]').should('be.visible');

					// Does not hide the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Sets focus to the next image.
					cy.get('[data-path="images-only/400x500.png"] .robroy-button--danger').should('have.focus');

					// When deleting one image.
					cy.get('[data-path="images-only/400x500.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-close').click();
					cy.wait('@deleteImage1').its('response.statusCode').should('equal', 204);

					// Removes the image from the list.
					cy.get('[data-path="images-only/400x500.png"]').should('not.exist');

					// Does not hide the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '1 image');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Sets focus to the next image.
					cy.focused().should('have.attr', 'href', '/images/images-only/400x400.png');

					// When deleting the last image.
					cy.get('[data-path="images-only/400x400.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-close').click();
					cy.wait('@deleteImage2').its('response.statusCode').should('equal', 204);

					// Hides the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Shows the delete folder button.
					cy.get('#robroy-delete-folder').should('be.visible');

					// Does not show the image after a refresh.
					cy.reload();
					cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
					cy.get('[data-path="images-only/400x400.png"]').should('not.exist');

					cy.resetFiles();
				});
			});
		});

		describe('when it has images and folders', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-and-folders');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// Sets the meta title.
				cy.title().should('eq', 'Images And Folders | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'Images And Folders'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder-form').should('be.visible');
				cy.get('#robroy-edit-folder-name').invoke('val').should('equal', 'Images And Folders');
				cy.get('#robroy-edit-folder-parent option:selected').should('have.text', '');

				// Does not show the delete folder button.
				cy.get('#robroy-delete-folder').should('not.be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Images And Folders');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Show the folder list.
				cy.get('#robroy-folders').should('be.visible');

				// Shows the image list.
				cy.get('#robroy-images').should('be.visible');
				cy.get('#robroy-num').should('have.text', '2 images');
			});

			describe('when deleting images', () => {
				it('works', () => {
					cy.intercept('GET', '/api.php?type=images&*').as('getImages');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('DELETE', '/api.php?type=images&path=images-and-folders/400x500.png').as('deleteImage1');
					cy.intercept('DELETE', '/api.php?type=images&path=images-and-folders/400x500.png').as('deleteImage2');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-and-folders');
					cy.contains('Log In').click();
					cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

					// When clicking the cancel button.
					cy.get('[data-path="images-and-folders/400x500.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-cancel').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Does not remove the image from the list.
					cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

					// Does not hide the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Sets focus to the next image.
					cy.get('[data-path="images-and-folders/400x500.png"] .robroy-button--danger').should('have.focus');

					// When deleting one image.
					cy.get('[data-path="images-and-folders/400x500.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-close').click();
					cy.wait('@deleteImage1').its('response.statusCode').should('equal', 204);

					// Removes the image from the list.
					cy.get('[data-path="images-and-folders/400x500.png"]').should('not.exist');

					// Does not hide the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '1 image');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Sets focus to the next image.
					cy.focused().should('have.attr', 'href', '/images/images-and-folders/400x400.png');

					// When deleting the last image.
					cy.get('[data-path="images-and-folders/400x400.png"] .robroy-button--danger').click();
					cy.get('#robroy-modal-close').click();
					cy.wait('@deleteImage2').its('response.statusCode').should('equal', 204);

					// Hides the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Does not show the image after a refresh.
					cy.reload();
					cy.wait('@getImages');
					cy.get('[data-path="images-and-folders/400x500.png"]').should('not.exist');
					cy.get('[data-path="images-and-folders/400x400.png"]').should('not.exist');

					cy.resetFiles();
				});
			});
		});

		describe('when it has no images or folders', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&*').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=no-images-or-folders');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);
				cy.wait('@getImages').its('response.statusCode').should('equal', 200);

				// Sets the meta title.
				cy.title().should('eq', 'No Images Or Folders | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'No Images Or Folders'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder-form').should('be.visible');
				cy.get('#robroy-edit-folder-name').invoke('val').should('equal', 'No Images Or Folders');
				cy.get('#robroy-edit-folder-parent option:selected').should('have.text', '');

				// Shows the delete folder button.
				cy.get('#robroy-delete-folder').should('be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'No Images Or Folders');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not show the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');
			});

			describe('when uploading an image', () => {
				describe('when the input is valid', () => {
					it('adds the image to the list', () => {
						cy.intercept('GET', '/api.php?type=folders&id=no-images-or-folders').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=no-images-or-folders').as('getImages');
						cy.intercept('POST', '/api.php?type=images').as('uploadImage');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=no-images-or-folders');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');

						// When the image does not exist.
						cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
						cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
						cy.get('#robroy-create-image-button').click();
						cy.wait('@uploadImage');

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
						cy.wait('@uploadImage');

						// Shows an error.
						cy.get('.robroy-modal-text').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');

						cy.resetFiles();
					});
				});
			});

			describe('when creating a folder in this folder', () => {
				it('creates the folder', () => {
					cy.intercept('GET', '/api.php?type=folders&id=no-images-or-folders').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=no-images-or-folders').as('getImages');
					cy.intercept('POST', '/api.php?type=folders').as('createFolder');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=no-images-or-folders');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-create-folder-name').clear().type('New Folder');
					cy.get('#robroy-create-submit').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

					// Clears the name field.
					cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');

					// Does not clear the parent field.
					cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'No Images Or Folders');

					// Adds the folder to the folder list.
					cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

					// Adds the new folder to the create parent list.
					const items = [
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
					cy.get('#robroy-create-folder-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Adds the new folder to the edit parent list.
					cy.get('#robroy-edit-folder-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Hides the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Shows the new folder after a refresh.
					cy.reload();
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

					cy.resetFiles();
				});
			});

			describe('when creating a folder in another folder', () => {
				it('creates the folder', () => {
					cy.intercept('GET', '/api.php?type=folders&id=no-images-or-folders').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=no-images-or-folders').as('getImages');
					cy.intercept('POST', '/api.php?type=folders').as('createFolder');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=no-images-or-folders');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-create-folder-name').clear().type('New Folder');
					cy.get('#robroy-create-folder-parent').select('Folders Only');
					cy.get('#robroy-create-submit').click();
					cy.wait('@createFolder').its('response.statusCode').should('equal', 200);

					// Clears the name field.
					cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');

					// Does not clear the parent field.
					cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Folders Only');

					// Does not add the folder to the folder list.
					cy.get('.robroy-folder-link').should('not.exist');

					// Adds the new folder to the create parent list.
					const items = [
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
					cy.get('#robroy-create-folder-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Adds the new folder to the edit parent list.
					cy.get('#robroy-edit-folder-parent option').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Does not hide the delete folder button.
					cy.get('#robroy-delete-folder').should('be.visible');

					// Adds the folder to the subfolder.
					cy.intercept('GET', '/api.php?type=folders&id=folders-only').as('getFolder2');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only').as('getImages2');
					cy.visit('/dark.html?folder=folders-only');
					cy.wait('@getFolder2');
					cy.wait('@getImages2');
					cy.get('.robroy-folder-link').contains('New Folder').should('be.visible');

					cy.resetFiles();
				});
			});

			describe('when deleting the folder', () => {
				it('redirects to the index', () => {
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=no-images-or-folders');
					cy.contains('Log In').click();

					// When clicking the cancel button.
					cy.get('#robroy-delete-folder').click();
					cy.get('#robroy-modal-cancel').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Does not redirect.
					cy.location('pathname').should('eq', '/dark.html');
					cy.location('search').should('eq', '?folder=no-images-or-folders');

					// When deleting the folder.
					cy.get('#robroy-delete-folder').click();
					cy.get('#robroy-modal-close').click();

					// Redirects.
					cy.location('pathname').should('eq', '/dark.html');
					cy.location('search').should('eq', '');

					// Does not show the folder in the folder list.
					const items = ['Folders Only', 'Images And Folders', 'Images Only'];
					cy.get('.robroy-folder-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					cy.resetFiles();
				});
			});
		});

		describe('when editing the folder', () => {
			describe('when removing the name', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-edit-folder-name').clear();
					cy.get('#robroy-edit-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Error: Please enter a name.');
				});
			});

			describe('when removing the name and parent', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-edit-folder-name').clear();
					cy.get('#robroy-edit-folder-parent').select('');
					cy.get('#robroy-edit-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Error: Please enter a name.');
				});
			});

			describe('when not making any changes', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-edit-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Nothing to update.');
				});
			});

			describe('when changing the name to one that already exists', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-edit-folder-name').clear().type('Subfolder 2');
					cy.get('#robroy-edit-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Error: Folder "folders-only/subfolder-2" already exists.');
				});
			});

			describe('when changing the parent to one where the folder already exists', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-edit-folder-parent').select('Images And Folders');
					cy.get('#robroy-edit-submit').click();
					cy.get('.robroy-modal-text').should('have.text', 'Error: Folder "images-and-folders/subfolder" already exists.');
				});
			});

			describe('when the input is valid', () => {
				describe('when changing the name', () => {
					it('redirects to the new URL with the images and folders', () => {
						cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder-2').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder-2').as('getImages');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=folders-only/subfolder-2');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-edit-folder-name').clear().type('New Name');
						cy.get('#robroy-edit-submit').click();

						// Redirects.
						cy.location('pathname').should('eq', '/dark.html');
						cy.location('search').should('eq', '?folder=folders-only/new-name');

						cy.resetFiles();
					});
				});

				describe('when changing the parent', () => {
					it('redirects to the new URL with the images and folders', () => {
						cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder-2').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder-2').as('getImages');
						cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=folders-only/subfolder-2');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-edit-folder-parent').select('Images And Folders');
						cy.get('#robroy-edit-submit').click();
						cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

						// Redirects.
						cy.location('pathname').should('eq', '/dark.html');
						cy.location('search').should('eq', '?folder=images-and-folders/subfolder-2');

						cy.resetFiles();
					});
				});

				describe('when removing the parent', () => {
					it('redirects to the new URL with the images and folders', () => {
						cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder-2').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder-2').as('getImages');
						cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=folders-only/subfolder-2');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-edit-folder-parent').select('');
						cy.get('#robroy-edit-submit').click();
						cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

						// Redirects.
						cy.location('pathname').should('eq', '/dark.html');
						cy.location('search').should('eq', '?folder=subfolder-2');

						cy.resetFiles();
					});
				});

				describe('when adding a parent', () => {
					it('redirects to the new URL with the images and folders', () => {
						cy.intercept('GET', '/api.php?type=folders&id=images-and-folders').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-and-folders').as('getImages');
						cy.intercept('PUT', '/api.php?type=folders&id=images-and-folders').as('updateFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=images-and-folders');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-edit-folder-parent').select('Folders Only');
						cy.get('#robroy-edit-submit').click();
						cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

						// Redirects.
						cy.location('pathname').should('eq', '/dark.html');
						cy.location('search').should('eq', '?folder=folders-only/images-and-folders');

						cy.resetFiles();
					});
				});

				describe('when changing the name and parent', () => {
					it('redirects to the new URL with the images and folders', () => {
						cy.intercept('GET', '/api.php?type=folders&id=folders-only/subfolder-2').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only/subfolder-2').as('getImages');
						cy.intercept('PUT', '/api.php?type=folders&id=folders-only/subfolder-2').as('updateFolder');
						cy.setUploadPath('cypress/fixtures/current');
						cy.visit('/dark.html?folder=folders-only/subfolder-2');
						cy.wait('@getFolder');
						cy.wait('@getImages');
						cy.contains('Log In').click();
						cy.wait('@getFolders');
						cy.get('#robroy-edit-folder-name').clear().type('New Name');
						cy.get('#robroy-edit-folder-parent').select('Images And Folders');
						cy.get('#robroy-edit-submit').click();
						cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

						// Redirects.
						cy.location('pathname').should('eq', '/dark.html');
						cy.location('search').should('eq', '?folder=images-and-folders/new-name');

						cy.resetFiles();
					});
				});
			});
		});

		describe('when it is a subfolder', () => {
			it('shows the correct elements', () => {
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=folders-only/subfolder');
				cy.contains('Log In').click();
				cy.wait('@getFolders').its('response.statusCode').should('equal', 200);

				// Sets the meta title.
				cy.title().should('eq', 'Subfolder | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'Folders Only', 'Subfolder'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder-form').should('be.visible');
				cy.get('#robroy-edit-folder-name').invoke('val').should('equal', 'Subfolder');
				cy.get('#robroy-edit-folder-parent option:selected').should('have.text', 'Folders Only');

				// Shows the delete folder button.
				cy.get('#robroy-delete-folder').should('be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder-form').should('be.visible');
				cy.get('#robroy-create-folder-name').invoke('val').should('equal', '');
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Folders Only > Subfolder');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not shows the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');
			});

			describe('when deleting the folder', () => {
				it('redirects to the parent folder', () => {
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=folders-only/subfolder');
					cy.contains('Log In').click();
					cy.get('#robroy-delete-folder').click();
					cy.get('#robroy-modal-close').click();

					// Redirects.
					cy.location('pathname').should('eq', '/dark.html');
					cy.location('search').should('eq', '?folder=folders-only');

					// Does not show the folder in the folder list.
					const items = ['Subfolder 2'];
					cy.get('.robroy-folder-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					cy.resetFiles();
				});
			});
		});
	});

	describe('when editing an image', () => {
		describe('when clicking the cancel button', () => {
			it('closes the popup', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-modal-cancel').click();
				cy.get('.robroy-modal').should('not.exist');
			});
		});

		describe('when removing the filename', () => {
			it('shows an error', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear();
				cy.get('#robroy-edit-image-submit').click();
				cy.get('#robroy-error-robroy-edit-image-filename').should('have.text', 'Error: Please enter a filename.');
			});
		});

		describe('when removing the filename and folder', () => {
			it('shows an error', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear();
				cy.get('#robroy-edit-image-folder').select('');
				cy.get('#robroy-edit-image-submit').click();
				cy.get('#robroy-error-robroy-edit-image-filename').should('have.text', 'Error: Please enter a filename.');
				cy.get('#robroy-error-robroy-edit-image-folder').should('not.exist');
			});
		});

		describe('when not making any changes', () => {
			it('closes the popup', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-submit').click();
				cy.get('.robroy-modal').should('not.exist');
			});
		});

		describe('when changing the filename to one that already exists', () => {
			it('shows an error', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
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
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
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

		describe('when setting the folder to one where the filename already exists', () => {
			it('shows an error', () => {
				cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
				cy.intercept('GET', '/api.php?type=folders').as('getFolders');
				cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
				cy.setUploadPath('cypress/fixtures/current');
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolder');
				cy.wait('@getImages');
				cy.contains('Log In').click();
				cy.wait('@getFolders');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
				cy.get('#robroy-edit-image-filename').clear().type('400x400.png');
				cy.get('#robroy-edit-image-folder').select('Images And Folders');
				cy.get('#robroy-edit-image-submit').click();
				cy.get('.robroy-modal + .robroy-modal .robroy-modal-text').should(
					'have.text',
					'Error: File "images-and-folders/400x400.png" already exists.',
				);
				cy.get('#robroy-error-robroy-edit-image-folder').should('not.exist');
			});
		});

		describe('when the input is valid', () => {
			describe('when changing the filename', () => {
				it('updates the image', () => {
					cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-only');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
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
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
					cy.get('[data-path="images-only/new-filename.png"]').should('exist');

					cy.resetFiles();
				});
			});

			describe('when changing the folder', () => {
				it('removes the image', () => {
					cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-only');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
					cy.get('#robroy-edit-image-folder').select('Folders Only');
					cy.get('#robroy-edit-image-submit').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Removes the image.
					cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
					cy.get('[data-path="folders-only/400x500.png"]').should('not.exist');

					// Adds the image to the other folder.
					cy.intercept('GET', '/api.php?type=folders&id=folders-only').as('getFolder2');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only').as('getImages2');
					cy.visit('/dark.html?folder=folders-only');
					cy.wait('@getFolder2');
					cy.wait('@getImages2');
					cy.get('[data-path="folders-only/400x500.png"]').should('exist');

					cy.resetFiles();
				});
			});

			describe('when removing the folder', () => {
				it('removes the image', () => {
					cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-only');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('[data-path="images-only/400x500.png"] .robroy-button--secondary').click();
					cy.get('#robroy-edit-image-folder').select('');
					cy.get('#robroy-edit-image-submit').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Removes the image.
					cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
					cy.get('[data-path="400x500.png"]').should('not.exist');

					// Adds the image to the root folder.
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder2');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages2');
					cy.visit('/dark.html');
					cy.wait('@getFolder2');
					cy.wait('@getImages2');
					cy.get('[data-path="400x500.png"]').should('exist');

					cy.resetFiles();
				});
			});

			describe('when adding a folder', () => {
				it('removes the image', () => {
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=').as('getImages');
					cy.intercept('POST', '/api.php?type=images').as('uploadImage');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
					cy.get('#robroy-create-image-input').attachFile('500x500.jpg');
					cy.get('#robroy-create-image-button').click();
					cy.wait('@uploadImage');
					cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button--secondary').click();
					cy.get('#robroy-edit-image-folder').select('Folders Only');
					cy.get('#robroy-edit-image-submit').click();

					// Hides the modal.
					cy.get('.robroy-modal').should('not.exist');

					// Removes the image.
					cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');
					cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('not.exist');

					// Adds the image to the other folder.
					cy.intercept('GET', '/api.php?type=folders&id=folders-only').as('getFolder2');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only').as('getImages2');
					cy.visit('/dark.html?folder=folders-only');
					cy.wait('@getFolder2');
					cy.wait('@getImages2');
					cy.get('[data-path="folders-only/2020-01-01-12-00-00-500x500.jpg"]').should('exist');

					cy.resetFiles();
				});
			});

			describe('when changing the filename and folder', () => {
				it('removes the image', () => {
					cy.intercept('GET', '/api.php?type=folders&id=images-only').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=images-only').as('getImages');
					cy.setUploadPath('cypress/fixtures/current');
					cy.visit('/dark.html?folder=images-only');
					cy.wait('@getFolder');
					cy.wait('@getImages');
					cy.contains('Log In').click();
					cy.wait('@getFolders');
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
					cy.intercept('GET', '/api.php?type=folders&id=folders-only').as('getFolder2');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8&parent=folders-only').as('getImages2');
					cy.visit('/dark.html?folder=folders-only');
					cy.wait('@getFolder2');
					cy.wait('@getImages2');
					cy.get('[data-path="folders-only/new-filename.png"]').should('exist');

					cy.resetFiles();
				});
			});
		});
	});
});
