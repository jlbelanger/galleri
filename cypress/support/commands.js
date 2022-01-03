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

Cypress.Commands.add('setUploadPath', (folder) => {
	cy.exec(`sed -i.bak "s|UPLOADS_PATH=.*|UPLOADS_PATH=${Cypress.env('upload_path')}/${folder}|" demo/.env`);
});

Cypress.Commands.add('resetFiles', () => {
	cy.exec('mkdir -p cypress/fixtures/current');
	cy.exec('rm -r cypress/fixtures/current');
	cy.exec('mkdir cypress/fixtures/current');
	cy.exec('cp -r cypress/fixtures/original/* cypress/fixtures/current');
});