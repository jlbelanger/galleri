import { galleriUrl } from '../../support/functions';

describe('delete image', () => {
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

	describe('when there are images only in the current folder', () => {
		it('works', () => {
			cy.intercept('DELETE', '/api.php?type=images&id=images-only/400x500.png').as('deleteImage1');
			cy.intercept('DELETE', '/api.php?type=images&id=images-only/400x500.png').as('deleteImage2');
			cy.visit(galleriUrl('images-only'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// When clicking the cancel button.
			cy.get('[data-path="images-only/400x500.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-cancel').click();

			// Hides the modal.
			cy.get('.galleri-modal').should('not.exist');

			// Does not remove the image from the list.
			cy.get('[data-path="images-only/400x500.png"]').should('be.visible');

			// Does not hide the image list.
			cy.get('#galleri-images').should('be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(2 images)');

			// Does not show the delete folder button.
			cy.get('#galleri-delete-folder').should('not.be.visible');

			// Sets focus to the next image.
			cy.get('[data-path="images-only/400x500.png"] .galleri-button--danger').should('have.focus');

			// When deleting one image.
			cy.get('[data-path="images-only/400x500.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-close').click();
			cy.wait('@deleteImage1').its('response.statusCode').should('equal', 204);

			// Shows a toast.
			cy.get('.galleri-toast-text').should('have.text', 'Image deleted successfully.');

			// Removes the image from the list.
			cy.get('[data-path="images-only/400x500.png"]').should('not.exist');

			// Does not hide the image list.
			cy.get('#galleri-images').should('be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(1 image)');

			// Does not show the delete folder button.
			cy.get('#galleri-delete-folder').should('not.be.visible');

			// Sets focus to the next image.
			cy.focused().closest('.galleri-figure').should('have.attr', 'data-path', 'images-only/400x400.png');

			// When deleting the last image.
			cy.get('.galleri-toast-close').click();
			cy.get('[data-path="images-only/400x400.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-close').click();
			cy.wait('@deleteImage2').its('response.statusCode').should('equal', 204);

			// Shows a toast.
			cy.get('.galleri-toast-text').should('have.text', 'Image deleted successfully.');

			// Hides the image list.
			cy.get('#galleri-images').should('not.be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(0 images)');

			// Shows the delete folder button.
			cy.get('#galleri-delete-folder').should('be.visible');

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
			cy.intercept('DELETE', '/api.php?type=images&id=images-and-folders/400x500.png').as('deleteImage1');
			cy.intercept('DELETE', '/api.php?type=images&id=images-and-folders/400x500.png').as('deleteImage2');
			cy.visit(galleriUrl('images-and-folders'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// When clicking the cancel button.
			cy.get('[data-path="images-and-folders/400x500.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-cancel').click();

			// Hides the modal.
			cy.get('.galleri-modal').should('not.exist');

			// Does not remove the image from the list.
			cy.get('[data-path="images-and-folders/400x500.png"]').should('be.visible');

			// Does not hide the image list.
			cy.get('#galleri-images').should('be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(2 images)');

			// Does not show the delete folder button.
			cy.get('#galleri-delete-folder').should('not.be.visible');

			// Sets focus to the next image.
			cy.get('[data-path="images-and-folders/400x500.png"] .galleri-button--danger').should('have.focus');

			// When deleting one image.
			cy.get('[data-path="images-and-folders/400x500.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-close').click();
			cy.wait('@deleteImage1').its('response.statusCode').should('equal', 204);

			// Shows a toast.
			cy.get('.galleri-toast-text').should('have.text', 'Image deleted successfully.');

			// Removes the image from the list.
			cy.get('[data-path="images-and-folders/400x500.png"]').should('not.exist');

			// Does not hide the image list.
			cy.get('#galleri-images').should('be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(1 image)');

			// Does not show the delete folder button.
			cy.get('#galleri-delete-folder').should('not.be.visible');

			// Sets focus to the next image.
			cy.focused().closest('.galleri-figure').should('have.attr', 'data-path', 'images-and-folders/400x400.png');

			// When deleting the last image.
			cy.get('.galleri-toast-close').click();
			cy.get('[data-path="images-and-folders/400x400.png"] .galleri-button--danger').click();
			cy.get('#galleri-modal-close').click();
			cy.wait('@deleteImage2').its('response.statusCode').should('equal', 204);

			// Shows a toast.
			cy.get('.galleri-toast-text').should('have.text', 'Image deleted successfully.');

			// Hides the image list.
			cy.get('#galleri-images').should('not.be.visible');
			cy.get('#galleri-folder-num').should('have.text', '(0 images)');

			// Does not show the delete folder button.
			cy.get('#galleri-delete-folder').should('not.be.visible');

			// Does not show the image after a refresh.
			cy.reload();
			cy.wait('@getFolders');
			cy.wait('@getImages');
			cy.get('[data-path="images-and-folders/400x500.png"]').should('not.exist');
			cy.get('[data-path="images-and-folders/400x400.png"]').should('not.exist');
		});
	});
});
