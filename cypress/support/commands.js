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
	cy.exec(`sed -i.bak "s|UPLOADS_PATH=.*|UPLOADS_PATH=${Cypress.env('upload_path')}/public/images2|" ${Cypress.env('project_path')}/.env`);
	cy.exec(`sed -i.bak "s|UPLOADS_FOLDER=.*|UPLOADS_FOLDER=images2|" ${Cypress.env('project_path')}/.env`);
	cy.exec(`sed -i.bak "s|JSON_PATH=.*|JSON_PATH=${Cypress.env('upload_path')}/public/json2|" ${Cypress.env('project_path')}/.env`);
});

Cypress.Commands.add('setUploads', (uploadsFolder = 'cypress/fixtures/original') => {
	cy.exec(`mkdir -p ${Cypress.env('project_path')}/public/images2`);
	cy.exec(`rm -r ${Cypress.env('project_path')}/public/images2`);
	cy.exec(`cp -r ${uploadsFolder} ${Cypress.env('project_path')}/public/images2`);
});

Cypress.Commands.add('resetPaths', () => {
	cy.exec(`sed -i.bak "s|UPLOADS_PATH=.*|UPLOADS_PATH=${Cypress.env('upload_path')}/public/images|" ${Cypress.env('project_path')}/.env`);
	cy.exec(`sed -i.bak "s|UPLOADS_FOLDER=.*|UPLOADS_FOLDER=images|" ${Cypress.env('project_path')}/.env`);
	cy.exec(`sed -i.bak "s|JSON_PATH=.*|JSON_PATH=${Cypress.env('upload_path')}/public/json|" ${Cypress.env('project_path')}/.env`);
});

Cypress.Commands.add('resetJson', () => {
	cy.exec(`rm -f ${Cypress.env('project_path')}/public/json/folders.json`);
	cy.exec(`rm -f ${Cypress.env('project_path')}/public/json/images.json`);
	cy.exec(`rm -f ${Cypress.env('project_path')}/public/json2/folders.json`);
	cy.exec(`rm -f ${Cypress.env('project_path')}/public/json2/images.json`);
});

Cypress.Commands.add('setupApi', () => {
	cy.intercept('GET', /\/json\/folders\.json\??/).as('getFolders');
	cy.intercept('GET', '/api.php?type=folders').as('getFolders2');
	cy.intercept('GET', /\/json\/images\.json\??/).as('getImages');
	cy.intercept('GET', '/api.php?type=images').as('getImages2');
	cy.intercept('GET', '/api.php?type=images').as('getImagesSubfolder');
	cy.intercept('POST', '/api.php?type=images').as('uploadImage');
	cy.intercept('POST', '/api.php?type=folders').as('createFolder');
});
