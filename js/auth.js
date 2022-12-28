import GalleriApi from './api';
import GalleriFolder from './folder';
import GalleriImage from './image';
import GalleriModal from './modal';
import GalleriUtilities from './utilities';

export default class GalleriAuth {
	static init() {
		if (!window.GALLERI.elements.$authenticateButton) {
			return;
		}
		window.GALLERI.elements.$authenticateButton.addEventListener('click', () => { GalleriAuth.authenticate(); });
		GalleriAuth.handleAuthentication();
	}

	static authenticate() {
		if (GalleriUtilities.isLoggedIn()) {
			GalleriAuth.logout();
		} else {
			GalleriAuth.login();
		}
	}

	static logout() {
		if (window.navigator.userAgent.indexOf('Safari') > -1) {
			// Safari shows the login screen again if we try to make an invalid request.
			GalleriAuth.logoutCallback();
			return;
		}

		const url = [
			window.location.protocol,
			'//log:out@',
			window.location.host,
			`${window.GALLERI.args.apiPath}?type=sessions`,
		].join('');
		GalleriApi.request({
			method: 'DELETE',
			url,
			noParse: true,
			callback: () => {
				GalleriAuth.logoutCallback();
			},
			errorCallback: () => {
				GalleriAuth.logoutCallback();
			},
		});
	}

	static logoutCallback() {
		window.localStorage.clear();
		GalleriAuth.handleLogout();
	}

	static login() {
		GalleriApi.request({
			method: 'POST',
			url: `${window.GALLERI.args.apiPath}?type=sessions`,
			noParse: true,
			callback: (_response, status) => {
				if (status !== 204) {
					GalleriModal.show(window.GALLERI.lang.error + window.GALLERI.lang.errorInvalidUsername);
					return;
				}
				window.localStorage.setItem(window.GALLERI.args.localStorageKey, true);
				this.handleLogin();
			},
		});
	}

	static handleAuthentication() {
		if (GalleriUtilities.isLoggedIn()) {
			GalleriAuth.handleLogin();
		} else {
			GalleriAuth.handleLogout();
		}
	}

	static handleLogin() {
		window.GALLERI.elements.$authenticateButton.innerText = window.GALLERI.lang.logOut;

		document.body.classList.add('galleri-is-admin');

		GalleriAuth.addAdminBar();

		GalleriImage.getImages().forEach(($container) => {
			const id = $container.getAttribute('data-path');
			GalleriImage.addAdminControls($container, window.GALLERI.currentImages[id]);
		});

		GalleriUtilities.callback('afterLogin');
	}

	static handleLogout() {
		window.GALLERI.elements.$authenticateButton.innerText = window.GALLERI.lang.logIn;

		document.body.classList.remove('galleri-is-admin');

		let $elems = document.querySelectorAll('.galleri-admin');
		$elems.forEach((elem) => {
			elem.remove();
		});

		if (window.GALLERI.args.removePointerEventsOnLogin) {
			$elems = document.querySelectorAll('.galleri-link');
			$elems.forEach(($elem) => {
				$elem.removeAttribute('tabindex');
				$elem.style.pointerEvents = '';
			});
		}

		GalleriUtilities.callback('afterLogout');
	}

	static addAdminBar() {
		const $container = document.createElement('div');
		$container.setAttribute('id', 'galleri-admin');
		$container.setAttribute('class', 'galleri-admin');
		window.GALLERI.elements.$container.prepend($container);

		const $div = document.createElement('div');
		$div.setAttribute('class', 'galleri-button-container');
		$div.setAttribute('id', 'galleri-admin-buttons');
		$container.prepend($div);

		const $uploadButton = document.createElement('button');
		$uploadButton.setAttribute('class', 'galleri-button');
		$uploadButton.setAttribute('id', 'galleri-create-image');
		$uploadButton.setAttribute('type', 'button');
		$uploadButton.innerText = window.GALLERI.lang.uploadImage;
		$uploadButton.addEventListener('click', GalleriImage.showCreateForm);
		$div.append($uploadButton);

		const $createButton = document.createElement('button');
		$createButton.setAttribute('class', 'galleri-button galleri-button--secondary');
		$createButton.setAttribute('id', 'galleri-create-folder');
		$createButton.setAttribute('type', 'button');
		$createButton.innerText = window.GALLERI.lang.createFolder;
		$createButton.addEventListener('click', GalleriFolder.showCreateForm);
		$div.append($createButton);

		if (window.GALLERI.currentFolder.id) {
			const $editButton = document.createElement('button');
			$editButton.setAttribute('class', 'galleri-button galleri-button--secondary');
			$editButton.setAttribute('id', 'galleri-edit-folder');
			$editButton.setAttribute('type', 'button');
			$editButton.innerText = window.GALLERI.lang.editFolder;
			$editButton.addEventListener('click', GalleriFolder.showEditForm);
			$div.append($editButton);

			const $deleteButton = document.createElement('button');
			$deleteButton.setAttribute('class', 'galleri-button galleri-button--danger');
			$deleteButton.setAttribute('id', 'galleri-delete-folder');
			$deleteButton.setAttribute('type', 'button');
			$deleteButton.innerText = window.GALLERI.lang.deleteFolder;
			if (!GalleriUtilities.isEmpty()) {
				$deleteButton.style.display = 'none';
			}
			$deleteButton.addEventListener('click', GalleriFolder.delete);
			$div.append($deleteButton);
		}

		GalleriUtilities.modifier('adminBar', { element: $div });
	}
}
