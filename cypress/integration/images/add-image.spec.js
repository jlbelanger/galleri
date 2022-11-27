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
		describe('when the input is invalid', () => {
			describe('when no files are selected', () => {
				it('shows an error', () => {
					cy.visit('/');
					cy.wait('@getFolders');
					cy.wait('@getFolders2');
					cy.wait('@getImages');
					cy.wait('@getImages2');
					cy.contains('Log In').click();
					cy.get('#robroy-create-image').click();
					cy.get('#robroy-modal-close').click();
					cy.get('#robroy-error-robroy-input-upload').should('have.text', 'Error: This field is required.');
				});
			});
		});

		describe('when the input is valid', () => {
			afterEach(() => {
				cy.setUploads();
			});

			it('adds the image to the list', () => {
				cy.visit('/');
				cy.wait('@getFolders');
				cy.wait('@getFolders2');
				cy.wait('@getImages');
				cy.wait('@getImages2');
				cy.contains('Log In').click();

				// When the image does not exist.
				cy.get('#robroy-create-image').click();
				cy.get('#robroy-input-upload').attachFile('500x500.jpg');
				cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
				cy.get('#robroy-modal-close').click();
				cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);

				// Resets the upload form.
				cy.get('#robroy-input-upload').invoke('val').should('equal', '');
				cy.get('#robroy-create-image-text').should('have.text', 'Drag images or click here to upload.');
				cy.get('#robroy-modal-cancel').click();

				// Shows a toast.
				cy.get('.robroy-toast-text').should('have.text', 'Image uploaded successfully.');

				// Shows the image list.
				cy.get('#robroy-images').should('be.visible');
				cy.get('#robroy-folder-num').should('have.text', '(1 image)');

				// Adds the image to the list.
				cy.get('[data-path="2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');

				// When the image already exists.
				cy.get('#robroy-create-image').click();
				cy.get('#robroy-input-upload').attachFile('500x500.jpg');
				cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
				cy.get('#robroy-modal-close').click();
				cy.wait('@uploadImage').its('response.statusCode').should('equal', 422);

				// Shows an error.
				cy.get('#robroy-error-robroy-input-upload').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');
			});
		});
	});

	describe('with a non-root folder', () => {
		afterEach(() => {
			cy.setUploads();
		});

		it('adds the image to the list', () => {
			cy.visit('/?folder=no-images-or-folders');
			cy.wait('@getFolders');
			cy.wait('@getFolders2');
			cy.wait('@getImages');
			cy.wait('@getImages2');
			cy.contains('Log In').click();

			// When the image does not exist.
			cy.get('#robroy-create-image').click();
			cy.get('#robroy-input-upload').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-modal-close').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 200);

			// Resets the upload form.
			cy.get('#robroy-input-upload').invoke('val').should('equal', '');
			cy.get('#robroy-create-image-text').should('have.text', 'Drag images or click here to upload.');
			cy.get('#robroy-modal-cancel').click();

			// Shows a toast.
			cy.get('.robroy-toast-text').should('have.text', 'Image uploaded successfully.');

			// Shows the image list.
			cy.get('#robroy-images').should('be.visible');
			cy.get('#robroy-folder-num').should('have.text', '(1 image)');

			// Adds the image to the list.
			cy.get('[data-path="no-images-or-folders/2020-01-01-12-00-00-500x500.jpg"]').should('be.visible');

			// Hides the delete folder button.
			cy.get('#robroy-delete-folder').should('not.be.visible');

			// When the image already exists.
			cy.get('#robroy-create-image').click();
			cy.get('#robroy-input-upload').attachFile('500x500.jpg');
			cy.get('#robroy-create-image-text').should('have.text', '500x500.jpg');
			cy.get('#robroy-modal-close').click();
			cy.wait('@uploadImage').its('response.statusCode').should('equal', 422);

			// Shows an error.
			cy.get('#robroy-error-robroy-input-upload').should('have.text', 'Error: File "2020-01-01-12-00-00-500x500.jpg" already exists.');
		});
	});
});
