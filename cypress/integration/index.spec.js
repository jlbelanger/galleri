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
				cy.get('#robroy-empty').should('be.visible');
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
				cy.get('#robroy-empty').should('not.exist');
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
				cy.get('#robroy-empty').should('not.exist');
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
				cy.get('#robroy-empty').should('be.visible');
			});
		});

		describe('when uploading an image', () => {
			describe('when the image already exists', () => {
				// it.todo('shows an error');
			});

			describe('when the input is valid', () => {
				// it.todo('adds the image to the list');

				// it.todo('resets the upload form (clears the file input, removes the filenames, hides the button)');
			});
		});

		describe('when creating a folder', () => {
			describe('when the name is blank', () => {
				it('shows an error', () => {
					cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
					cy.intercept('GET', '/api.php?type=folders').as('getFolders');
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8').as('getImages');
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
					cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8').as('getImages');
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
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8').as('getImages');
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

						cy.resetFiles();
					});
				});

				describe('when creating a folder in another folder', () => {
					it('creates the folder', () => {
						cy.intercept('GET', '/api.php?type=folders&id=').as('getFolder');
						cy.intercept('GET', '/api.php?type=folders').as('getFolders');
						cy.intercept('GET', '/api.php?type=images&page[number]=1&page[size]=8').as('getImages');
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
				cy.get('#robroy-empty').should('be.visible');
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
				cy.get('#robroy-empty').should('not.exist');
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
					cy.get('#robroy-empty').should('not.exist');

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
					cy.get('#robroy-empty').should('not.exist');

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
					cy.get('#robroy-empty').should('be.visible');

					// Shows the delete folder button.
					cy.get('#robroy-delete-folder').should('be.visible');

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
				cy.get('#robroy-empty').should('not.exist');
			});

			describe('when deleting images', () => {
				it('works', () => {
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
					cy.get('#robroy-empty').should('not.exist');

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
					cy.get('#robroy-empty').should('not.exist');

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
					cy.get('#robroy-empty').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

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
				cy.get('#robroy-empty').should('be.visible');
			});

			describe('when uploading an image', () => {
				describe('when the image already exists', () => {
					// it.todo('shows an error');
				});

				describe('when the input is valid', () => {
					// it.todo('shows image list, hides no-images message, adds the image to the list');

					// it.todo('resets the upload form (clears the file input, removes the filenames, hides the button)');

					// it.todo('hides the delete folder button');
				});
			});

			describe('when creating a folder in this folder', () => {
				// it.todo('clears the name field');

				// it.todo('adds the folder to the folder list');

				// it.todo('hides the delete folder button');
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

			describe('when not changing the name or parent', () => {
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

			describe('when changing the parent when another folder with that name already exists', () => {
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
				cy.get('#robroy-create-folder-parent option:selected').should('have.text', 'Subfolder');

				// Shows the create image form.
				cy.get('#robroy-create-image-form').should('be.visible');
				cy.get('#robroy-create-image-input').invoke('val').should('equal', '');

				// Does not shows the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-empty').should('be.visible');
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
});
