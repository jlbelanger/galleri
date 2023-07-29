import { galleriUrl } from '../../support/functions';

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
			cy.get('#galleri-create-image').click();
			cy.get('#galleri-input-upload').attachFile('500x500.jpg');
			cy.get('#galleri-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#galleri-modal-close').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);
			cy.get('#galleri-modal-cancel').click();

			// Check buttons.
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('View').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('Edit').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('Delete').should('be.visible');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('Make Thumbnail').should('not.exist');
			cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"] .galleri-button').contains('Remove Thumbnail').should('not.exist');
		});
	});

	describe('with a non-root folder', () => {
		it('shows thumbnail buttons', () => {
			cy.visit(galleriUrl('images-only'));
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Make Thumbnail').should('be.visible');
			cy.get('[data-path="images-only/400x400.png"] .galleri-button').contains('Make Thumbnail').should('be.visible');
		});

		describe('when clicking thumbnail button', () => {
			it('sets folder thumbnail', () => {
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
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Make Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Thumbnail updated successfully.');

				// Changes button label.
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Remove Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Make Thumbnail').should('not.exist');

				// Sets folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"] [src="/images/images-only/thumbnails/400x500.png"]').should('be.visible');

				// Change thumbnail.
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x400.png"] .galleri-button').contains('Make Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Thumbnail updated successfully.');

				// Changes button label.
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Make Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x500.png"] .galleri-button').contains('Remove Thumbnail').should('not.exist');
				cy.get('[data-path="images-only/400x400.png"] .galleri-button').contains('Remove Thumbnail').should('be.visible');
				cy.get('[data-path="images-only/400x400.png"] .galleri-button').contains('Make Thumbnail').should('not.exist');

				// Sets folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"] [src="/images/images-only/thumbnails/400x400.png"]').should('be.visible');

				// Remove thumbnail.
				cy.visit(galleriUrl('images-only'));
				cy.wait('@getFolders');
				cy.wait('@getImages');
				cy.get('[data-path="images-only/400x400.png"] .galleri-button').contains('Remove Thumbnail').click();
				cy.wait('@updateFolder').its('response.statusCode').should('equal', 200);

				// Shows a toast.
				cy.get('.galleri-toast-text').should('have.text', 'Thumbnail removed successfully.');

				// Removes folder thumbnail.
				cy.visit('/');
				cy.get('[data-path="images-only"]').should('be.visible');
				cy.get('[data-path="images-only"] [src]').should('not.exist');
			});
		});
	});
});
