import { galleriUrl } from '../support/functions.js';

describe('index', () => {
	before(() => {
		cy.build();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	describe('with the root folder', () => {
		describe('with folders only', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/folders-only');
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// No meta title.
					cy.title().should('eq', 'Galleri Demo');

					// Does not show the breadcrumb.
					cy.get('.galleri-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#galleri-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#galleri-folders').should('be.visible');

					// Does not show the image list.
					cy.get('#galleri-images').should('not.be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(0 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images only', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/images-only');
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// No meta title.
					cy.title().should('eq', 'Galleri Demo');

					// Does not show the breadcrumb.
					cy.get('.galleri-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#galleri-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#galleri-folders').should('not.be.visible');

					// Shows the image list.
					cy.get('#galleri-images').should('be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(2 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images and folders', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/images-and-folders');
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// No meta title.
					cy.title().should('eq', 'Galleri Demo');

					// Does not show the breadcrumb.
					cy.get('.galleri-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#galleri-editfolder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#galleri-folders').should('be.visible');

					// Shows the image list.
					cy.get('#galleri-images').should('be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(2 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with no images or folders', () => {
			it('shows the correct elements', () => {
				cy.setUploads('cypress/fixtures/current/no-images-or-folders');
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// No meta title.
					cy.title().should('eq', 'Galleri Demo');

					// Does not show the breadcrumb.
					cy.get('.galleri-breadcrumb').should('not.exist');

					// Does not show the edit folder button.
					cy.get('#galleri-edit-folder').should('not.exist');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.exist');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#galleri-folders').should('not.be.visible');

					// Does not show the image list.
					cy.get('#galleri-images').should('not.be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(0 images)');

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
				cy.visit(galleriUrl('folders-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// Sets the meta title.
					cy.title().should('eq', 'Folders Only | Galleri Demo');

					// Shows the breadcrumb.
					cy.get('.galleri-breadcrumb').should('be.visible');
					const items = [
						{ text: 'Home', href: '/' },
						{ text: 'Folders Only', href: '/folders-only' },
					];
					cy.get('.galleri-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index].text);
						cy.wrap(item).should('have.attr', 'href', items[index].href);
					});

					// Shows the edit folder button.
					cy.get('#galleri-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Shows the folder list.
					cy.get('#galleri-folders').should('be.visible');

					// Does not show the image list.
					cy.get('#galleri-images').should('not.be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(0 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images only', () => {
			it('shows the correct elements', () => {
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// Sets the meta title.
					cy.title().should('eq', 'Images Only | Galleri Demo');

					// Shows the breadcrumb.
					cy.get('.galleri-breadcrumb').should('be.visible');
					const items = [
						{ text: 'Home', href: '/' },
						{ text: 'Images Only', href: '/images-only' },
					];
					cy.get('.galleri-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index].text);
						cy.wrap(item).should('have.attr', 'href', items[index].href);
					});

					// Shows the edit folder button.
					cy.get('#galleri-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#galleri-folders').should('not.be.visible');

					// Shows the image list.
					cy.get('#galleri-images').should('be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(2 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with images and folders', () => {
			it('shows the correct elements', () => {
				cy.visit(galleriUrl('images-and-folders'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// Sets the meta title.
					cy.title().should('eq', 'Images And Folders | Galleri Demo');

					// Shows the breadcrumb.
					cy.get('.galleri-breadcrumb').should('be.visible');
					const items = [
						{ text: 'Home', href: '/' },
						{ text: 'Images And Folders', href: '/images-and-folders' },
					];
					cy.get('.galleri-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index].text);
						cy.wrap(item).should('have.attr', 'href', items[index].href);
					});

					// Shows the edit folder button.
					cy.get('#galleri-edit-folder').should('be.visible');

					// Does not show the delete folder button.
					cy.get('#galleri-delete-folder').should('not.be.visible');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Show the folder list.
					cy.get('#galleri-folders').should('be.visible');

					// Shows the image list.
					cy.get('#galleri-images').should('be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(2 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});

		describe('with no images or folders', () => {
			it('shows the correct elements', () => {
				cy.visit(galleriUrl('no-images-or-folders'));
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				for (let i = 0; i < 2; i += 1) {
					// Sets the meta title.
					cy.title().should('eq', 'No Images Or Folders | Galleri Demo');

					// Shows the breadcrumb.
					cy.get('.galleri-breadcrumb').should('be.visible');
					const items = [
						{ text: 'Home', href: '/' },
						{ text: 'No Images Or Folders', href: '/no-images-or-folders' },
					];
					cy.get('.galleri-breadcrumb-link').each((item, index) => {
						cy.wrap(item).should('have.text', items[index].text);
						cy.wrap(item).should('have.attr', 'href', items[index].href);
					});

					// Shows the edit folder button.
					cy.get('#galleri-edit-folder').should('be.visible');

					// Shows the delete folder button.
					cy.get('#galleri-delete-folder').should('be.visible');

					// Shows the create folder button.
					cy.get('#galleri-create-folder').should('be.visible');

					// Shows the create image button.
					cy.get('#galleri-create-image').should('be.visible');

					// Does not show the folder list.
					cy.get('#galleri-folders').should('not.be.visible');

					// Does not show the image list.
					cy.get('#galleri-images').should('not.be.visible');
					cy.get('#galleri-folder-num').should('have.text', '(0 images)');

					// Repeat assertions when already logged in.
					cy.reload();
				}
			});
		});
	});

	describe('with a second-level folder', () => {
		it('shows the correct elements', () => {
			cy.visit(galleriUrl('folders-only/subfolder'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			for (let i = 0; i < 2; i += 1) {
				// Sets the meta title.
				cy.title().should('eq', 'Subfolder | Galleri Demo');

				// Shows the breadcrumb.
				cy.get('.galleri-breadcrumb').should('be.visible');
				const items = [
					{ text: 'Home', href: '/' },
					{ text: 'Folders Only', href: '/folders-only' },
					{ text: 'Subfolder', href: '/folders-only/subfolder' },
				];
				cy.get('.galleri-breadcrumb-link').each((item, index) => {
					cy.wrap(item).should('have.text', items[index].text);
					cy.wrap(item).should('have.attr', 'href', items[index].href);
				});

				// Shows the edit folder form.
				cy.get('#galleri-edit-folder').should('be.visible');

				// Shows the delete folder button.
				cy.get('#galleri-delete-folder').should('be.visible');

				// Shows the create folder form.
				cy.get('#galleri-create-folder').should('be.visible');

				// Shows the create image form.
				cy.get('#galleri-create-image').should('be.visible');

				// Does not shows the folder list.
				cy.get('#galleri-folders').should('not.be.visible');

				// Does not show the image list.
				cy.get('#galleri-images').should('not.be.visible');
				cy.get('#galleri-folder-num').should('have.text', '(0 images)');

				// Repeat assertions when already logged in.
				cy.reload();
			}
		});
	});
});
