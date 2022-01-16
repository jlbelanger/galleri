describe('delete image', () => {
	before(() => {
		cy.setUploads();
		cy.setPaths();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	after(() => {
		cy.resetPaths();
	});

	afterEach(() => {
		cy.setUploads();
	});

	describe('when there are images only in the current folder', () => {
		it('works', () => {
			cy.intercept('DELETE', '/api.php?type=images&path=images-only/400x500.png').as('deleteImage1');
			cy.intercept('DELETE', '/api.php?type=images&path=images-only/400x500.png').as('deleteImage2');
			cy.visit('/dark.html?folder=images-only');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();

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
			cy.focused().should('have.attr', 'href', '/images2/images-only/400x400.png');

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
			cy.wait('@getFolders');
			cy.wait('@getImages');
			cy.get('[data-path="images-only/400x500.png"]').should('not.exist');
			cy.get('[data-path="images-only/400x400.png"]').should('not.exist');
		});
	});

	describe('when there are images and folders in the current folder', () => {
		it('works', () => {
			cy.intercept('DELETE', '/api.php?type=images&path=images-and-folders/400x500.png').as('deleteImage1');
			cy.intercept('DELETE', '/api.php?type=images&path=images-and-folders/400x500.png').as('deleteImage2');
			cy.visit('/dark.html?folder=images-and-folders');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.contains('Log In').click();

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
			cy.focused().should('have.attr', 'href', '/images2/images-and-folders/400x400.png');

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
			cy.wait('@getFolders');
			cy.wait('@getImages');
			cy.get('[data-path="images-and-folders/400x500.png"]').should('not.exist');
			cy.get('[data-path="images-and-folders/400x400.png"]').should('not.exist');
		});
	});
});
