describe('index', () => {
	before(() => {
		cy.exec('mkdir -p cypress/fixtures/current');
		cy.exec('rm -r cypress/fixtures/current');
		cy.exec('mkdir cypress/fixtures/current');
		cy.exec('cp -r cypress/fixtures/original/* cypress/fixtures/current');
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

				// TODO: No breadcrumb.

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

				// TODO: No breadcrumb.

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

				// TODO: No breadcrumb.

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

				// TODO: No breadcrumb.

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
			// it.todo('adds the image to the list');

			// it.todo('resets the upload form (clears the file input, removes the filenames, hides the button)');

			// TODO: When the image already exists.
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

				// TODO: Shows the breadcrumb.

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

				// TODO: Shows the breadcrumb.

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

			describe('when deleting an image', () => {
				// it.todo('removes the image from the list');
			});

			describe('when deleting the last image', () => {
				// it.todo('hides the image list');

				// it.todo('shows the "no images" message');

				// it.todo('shows the delete folder button');
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

				// TODO: Shows the breadcrumb.

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

			describe('when deleting an image', () => {
				// it.todo('removes the image from the list');
			});

			describe('when deleting the last image', () => {
				// it.todo('hides the image list');

				// it.todo('shows the "no images" message');

				// it.todo('does not show the delete folder button');
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

				// TODO: Shows the breadcrumb.

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
				// it.todo('shows image list, hides no-images message, adds the image to the list');

				// it.todo('resets the upload form (clears the file input, removes the filenames, hides the button)');

				// it.todo('hides the delete folder button');
			});

			describe('when deleting the folder', () => {
				// it.todo('redirects to the index');
			});
		});

		describe('when editing the folder', () => {
			describe('when removing the name', () => {
				// it.todo('shows an error');
			});

			describe('when removing the name and parent', () => {
				// it.todo('shows an error');
			});

			describe('when not changing the name or parent', () => {
				// it.todo('shows an error');
			});

			describe('when changing the name', () => {
				// it.todo('redirects to the new URL with the images and folders');
			});

			describe('when changing the parent', () => {
				// it.todo('redirects to the new URL with the images and folders');
			});

			describe('when removing the parent', () => {
				// it.todo('redirects to the new URL with the images and folders');
			});

			describe('when changing the name and parent', () => {
				// it.todo('redirects to the new URL with the images and folders');
			});
		});

		describe('when it is a subfolder', () => {
			describe('when deleting the folder', () => {
				// it.todo('redirects to the parent folder');
			});
		});
	});
});
