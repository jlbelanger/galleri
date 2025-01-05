import 'cypress-file-upload'; // eslint-disable-line import/no-extraneous-dependencies

Cypress.Commands.add('build', () => {
	const cssFolder = `${Cypress.env('project_path')}/build/css`;
	cy.exec(`(if [! -f ${cssFolder}/style.min.css]; then (cd ${Cypress.env('project_path')} && yarn install && yarn build); fi) || true`);
});

Cypress.Commands.add('setUploads', (uploadsFolder = 'cypress/fixtures/original') => {
	cy.exec(`mkdir -p ${Cypress.env('project_path')}/assets/images`);
	cy.exec(`rm -r ${Cypress.env('project_path')}/assets/images`);
	cy.exec(`cp -r ${uploadsFolder} ${Cypress.env('project_path')}/assets/images`);
});

Cypress.Commands.add('resetJson', () => {
	cy.exec(`mkdir -p ${Cypress.env('project_path')}/assets/json`);
	cy.exec(`rm -f ${Cypress.env('project_path')}/assets/json/folders.json`);
	cy.exec(`rm -f ${Cypress.env('project_path')}/assets/json/images.json`);
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
