import { robroyAbsoluteUrl, robroyUrl } from '../../support/functions';

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
			cy.visit(robroyUrl('no-images-or-folders'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// When clicking the cancel button.
			cy.get('#robroy-delete-folder').click();
			cy.get('#robroy-modal-cancel').click();

			// Hides the modal.
			cy.get('.robroy-modal').should('not.exist');

			// Does not redirect.
			cy.location('href').should('eq', robroyAbsoluteUrl('no-images-or-folders'));

			// When deleting the folder.
			cy.get('#robroy-delete-folder').click();
			cy.get('#robroy-modal-close').click();

			// Redirects.
			cy.location('href').should('eq', robroyAbsoluteUrl('/'));
			cy.wait('@getFolders');
			cy.wait('@getImages');

			// Does not show the folder in the folder list.
			const items = ['Folders Only', 'Images And Folders', 'Images Only'];
			cy.get('.robroy-folder-link').each((item, index) => {
				cy.wrap(item).should('have.text', items[index]);
			});
		});
	});

	describe('with a second-level folder', () => {
		it('redirects to the parent folder', () => {
			cy.visit(robroyUrl('folders-only/subfolder'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();
			cy.get('#robroy-delete-folder').click();
			cy.get('#robroy-modal-close').click();

			// Redirects.
			cy.location('href').should('eq', robroyAbsoluteUrl('folders-only'));
			cy.wait('@getFolders');
			cy.wait('@getImages');

			// Does not show the folder in the folder list.
			const items = ['Subfolder 2'];
			cy.get('.robroy-folder-link').each((item, index) => {
				cy.wrap(item).should('have.text', items[index]);
			});
		});
	});
});
