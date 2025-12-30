import { galleriAbsoluteUrl, galleriUrl } from '../../support/functions.js';

describe('delete folder', () => {
	before(() => {
		cy.setUploads();
		cy.build();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	afterEach(() => {
		cy.setUploads();
	});

	describe('with a top-level folder', () => {
		it('redirects to the index', () => {
			cy.visit(galleriUrl('no-images-or-folders'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// When clicking the cancel button.
			cy.get('#galleri-delete-folder').click();
			cy.get('#galleri-modal-cancel').click();

			// Hides the modal.
			cy.get('.galleri-modal').should('not.exist');

			// Does not redirect.
			cy.location('href').should('eq', galleriAbsoluteUrl('no-images-or-folders'));

			// When deleting the folder.
			cy.get('#galleri-delete-folder').click();
			cy.get('#galleri-modal-close').click();

			// Redirects.
			cy.location('href').should('eq', galleriAbsoluteUrl('/'));
			cy.wait('@getFolders');
			cy.wait('@getImages');

			// Does not show the folder in the folder list.
			const items = ['Folders Only', 'Images And Folders', 'Images Only'];
			cy.get('.galleri-folder-link').each((item, index) => {
				cy.wrap(item).should('have.text', items[index]);
			});
		});
	});

	describe('with a second-level folder', () => {
		it('redirects to the parent folder', () => {
			cy.visit(galleriUrl('folders-only/subfolder'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#galleri-delete-folder').click();
			cy.get('#galleri-modal-close').click();

			// Redirects.
			cy.location('href').should('eq', galleriAbsoluteUrl('folders-only'));
			cy.wait('@getFolders');
			cy.wait('@getImages');

			// Does not show the folder in the folder list.
			const items = ['Subfolder 2'];
			cy.get('.galleri-folder-link').each((item, index) => {
				cy.wrap(item).should('have.text', items[index]);
			});
		});
	});
});
