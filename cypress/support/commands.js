// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload'; // eslint-disable-line import/no-extraneous-dependencies

Cypress.Commands.add('setPaths', () => {
	cy.exec(`sed -i.bak "s|UPLOADS_PATH=.*|UPLOADS_PATH=${Cypress.env('upload_path')}/demo/public/images2|" demo/.env`);
	cy.exec('sed -i.bak "s|UPLOADS_FOLDER=.*|UPLOADS_FOLDER=images2|" demo/.env');
	cy.exec(`sed -i.bak "s|JSON_PATH=.*|JSON_PATH=${Cypress.env('upload_path')}/demo/public/json2|" demo/.env`);
});

Cypress.Commands.add('setUploads', (uploadsFolder = 'cypress/fixtures/original') => {
	cy.exec('mkdir -p demo/public/images2');
	cy.exec('rm -r demo/public/images2');
	cy.exec(`cp -r ${uploadsFolder} demo/public/images2`);
});

Cypress.Commands.add('resetPaths', () => {
	cy.exec(`sed -i.bak "s|UPLOADS_PATH=.*|UPLOADS_PATH=${Cypress.env('upload_path')}/demo/public/images|" demo/.env`);
	cy.exec('sed -i.bak "s|UPLOADS_FOLDER=.*|UPLOADS_FOLDER=images|" demo/.env');
	cy.exec(`sed -i.bak "s|JSON_PATH=.*|JSON_PATH=${Cypress.env('upload_path')}/demo/public/json|" demo/.env`);
});

Cypress.Commands.add('resetJson', () => {
	cy.exec('rm -f demo/public/json/folders.json');
	cy.exec('rm -f demo/public/json2/folders.json');
});

Cypress.Commands.add('setupApi', () => {
	cy.intercept('GET', '/json/folders.json').as('getFolders');
	cy.intercept('GET', '/api.php?type=folders').as('getFolders2');
	cy.intercept('GET', '/api.php?type=images&*').as('getImages');
	cy.intercept('GET', '/api.php?type=images*/*').as('getImagesSubfolder');
	cy.intercept('POST', '/api.php?type=images').as('uploadImage');
	cy.intercept('POST', '/api.php?type=folders').as('createFolder');
});
