import { robroyUrl } from '../../support/functions';

describe('add image', () => {
	before(() => {
		cy.setUploads();
		cy.build();
	});

	beforeEach(() => {
		cy.setupApi();
		cy.resetJson();
	});

	describe('with the root folder', () => {
		it('does not show thumbnail buttons', () => {
			cy.visit('/');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// Upload an image.
			cy.get('#robroy-create-image').click();
			cy.get('#robroy-input-upload').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-modal-close').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);
			cy.get('#robroy-modal-cancel').click();

			// Check buttons.
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button').contains('View').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button').contains('Edit').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button').contains('Delete').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button').contains('Make Thumbnail').should('not.exist');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .robroy-button').contains('Remove Thumbnail').should('not.exist');
		});
	});

	describe('with a non-root folder', () => {
		it('shows thumbnail buttons', () => {
			cy.visit(robroyUrl('images-only'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Make Thumbnail').should('be.visible');
			cy.get('[data-path="images-only/400x400.png"] .robroy-button').contains('Make Thumbnail').should('be.visible');
		});

		describe('when clicking thumbnail button', () => {
			it.only('sets folder thumbnail', () => {
				cy.intercept('PUT', '/api.php?type=folders&id=images-only').as('updateFolder');
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.get('[data-path="images-only"]').should('be.visible');
				cy.get('[data-path="images-only"] [src]').should('not.exist');
				cy.contains('Log In').click();

				// Make thumbnail.
				cy.visit(robroyUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Make Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Thumbnail updated successfully.');

				// Changes button label.
				cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Remove Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Make Thumbnail').should('not.exist');

				// Sets folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"] [src="/images/images-only/thumbnails/400x500.png"]').should('be.visible');

				// Change thumbnail.
				cy.visit(robroyUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x400.png"] .robroy-button').contains('Make Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Thumbnail updated successfully.');

				// Changes button label.
				cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Make Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x500.png"] .robroy-button').contains('Remove Thumbnail').should('not.exist');
				cy.get('[data-path="images-only/400x400.png"] .robroy-button').contains('Remove Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x400.png"] .robroy-button').contains('Make Thumbnail').should('not.exist');

				// Sets folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"] [src="/images/images-only/thumbnails/400x400.png"]').should('be.visible');

				// Remove thumbnail.
				cy.visit(robroyUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x400.png"] .robroy-button').contains('Remove Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Thumbnail removed successfully.');

				// Removes folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"]').should('be.visible');
				cy.get('[data-path="images-only"] [src]').should('not.exist');
			});
		});
	});
});
