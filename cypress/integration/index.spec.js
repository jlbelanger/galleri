describe('index', () => {
	before(() => {
		cy.setPaths();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	after(() => {
		cy.resetPaths();
	});

	describe('with the root folder', () => {
		describe('with folders only', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/folders-only');
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// No meta title.
					cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

					// Does not show the breadcrumb.
					cy.get('.robroy-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#robroy-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#robroy-folders').should('be.visible');

					// Does not show the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images only', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/images-only');
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// No meta title.
					cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

					// Does not show the breadcrumb.
					cy.get('.robroy-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#robroy-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#robroy-folders').should('not.be.visible');

					// Shows the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images and folders', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/images-and-folders');
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// No meta title.
					cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

					// Does not show the breadcrumb.
					cy.get('.robroy-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#robroy-editfolder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#robroy-folders').should('be.visible');

					// Shows the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with no images or folders', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/no-images-or-folders');
				cy.visit('/dark.html');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// No meta title.
					cy.title().should('eq', 'Robroy Photo Gallery Demo - Dark Theme');

					// Does not show the breadcrumb.
					cy.get('.robroy-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#robroy-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#robroy-folders').should('not.be.visible');

					// Does not show the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});
	});

	describe('with a top-level folder', () => {
		before(() => {
			cy.setUploads();
		});

		describe('with folders only', () => {
			it('shows the correct elements', () => {
				cy.visit('/dark.html?folder=folders-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// Sets the meta title.
					cy.title().should('eq', 'Folders Only | Robroy Photo Gallery Demo - Dark Theme');

					// Shows the breadcrumb.
					cy.get('.robroy-breadcrumb').should('be.visible');
					const items = ['Home', 'Folders Only'];
					cy.get('.robroy-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Shows the edit folder button.
					cy.get('#robroy-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#robroy-folders').should('be.visible');

					// Does not show the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images only', () => {
			it('shows the correct elements', () => {
				cy.visit('/dark.html?folder=images-only');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// Sets the meta title.
					cy.title().should('eq', 'Images Only | Robroy Photo Gallery Demo - Dark Theme');

					// Shows the breadcrumb.
					cy.get('.robroy-breadcrumb').should('be.visible');
					const items = ['Home', 'Images Only'];
					cy.get('.robroy-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Shows the edit folder button.
					cy.get('#robroy-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#robroy-folders').should('not.be.visible');

					// Shows the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images and folders', () => {
			it('shows the correct elements', () => {
				cy.visit('/dark.html?folder=images-and-folders');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// Sets the meta title.
					cy.title().should('eq', 'Images And Folders | Robroy Photo Gallery Demo - Dark Theme');

					// Shows the breadcrumb.
					cy.get('.robroy-breadcrumb').should('be.visible');
					const items = ['Home', 'Images And Folders'];
					cy.get('.robroy-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Shows the edit folder button.
					cy.get('#robroy-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#robroy-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Show the folder list.
					cy.get('#robroy-folders').should('be.visible');

					// Shows the image list.
					cy.get('#robroy-images').should('be.visible');
					cy.get('#robroy-num').should('have.text', '2 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with no images or folders', () => {
			it('shows the correct elements', () => {
				cy.visit('/dark.html?folder=no-images-or-folders');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i++) {
					// Sets the meta title.
					cy.title().should('eq', 'No Images Or Folders | Robroy Photo Gallery Demo - Dark Theme');

					// Shows the breadcrumb.
					cy.get('.robroy-breadcrumb').should('be.visible');
					const items = ['Home', 'No Images Or Folders'];
					cy.get('.robroy-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index]);
					});

					// Shows the edit folder button.
					cy.get('#robroy-edit-folder').should('be.visible');

					// Shows the delete folder button.
					cy.get('#robroy-delete-folder').should('be.visible');

					// Shows the create folder button.
					cy.get('#robroy-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#robroy-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#robroy-folders').should('not.be.visible');

					// Does not show the image list.
					cy.get('#robroy-images').should('not.be.visible');
					cy.get('#robroy-num').should('have.text', '0 images');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});
	});

	describe('with a second-level folder', () => {
		it('shows the correct elements', () => {
			cy.visit('/dark.html?folder=folders-only/subfolder');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImagesSubfolder');
			cy.contains('Log In').click();

			for (let i = 0; i < 2; i++) {
				// Sets the meta title.
				cy.title().should('eq', 'Subfolder | Robroy Photo Gallery Demo - Dark Theme');

				// Shows the breadcrumb.
				cy.get('.robroy-breadcrumb').should('be.visible');
				const items = ['Home', 'Folders Only', 'Subfolder'];
				cy.get('.robroy-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index]);
				});

				// Shows the edit folder form.
				cy.get('#robroy-edit-folder').should('be.visible');

				// Shows the delete folder button.
				cy.get('#robroy-delete-folder').should('be.visible');

				// Shows the create folder form.
				cy.get('#robroy-create-folder').should('be.visible');

				// Shows the create image form.
				cy.get('#robroy-create-image').should('be.visible');

				// Does not shows the folder list.
				cy.get('#robroy-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#robroy-images').should('not.be.visible');
				cy.get('#robroy-num').should('have.text', '0 images');

				// Repeat assertions when already logged in.
				cy.reload();
			}
		});
	});
});
