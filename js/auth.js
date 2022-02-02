import RobroyApi from './api';
import RobroyFolder from './folder';
import RobroyImage from './image';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyAuth {
	static init() {
		if (!window.ROBROY.elements.$authenticateButton) {
			return;
		}
		window.ROBROY.elements.$authenticateButton.addEventListener('click', () => { RobroyAuth.authenticate(); });
		RobroyAuth.handleAuthentication();
	}

	static authenticate() {
		if (RobroyUtilities.isLoggedIn()) {
			RobroyAuth.logout();
		} else {
			RobroyAuth.login();
		}
	}

	static logout() {
		if (window.navigator.userAgent.indexOf('Safari') > -1) {
			// Safari shows the login screen again if we try to make an invalid request.
			RobroyAuth.logoutCallback();
			return;
		}

		const url = [
			window.location.protocol,
			'//log:out@',
			window.location.host,
			`${window.ROBROY.args.apiPath}?type=sessions`,
		].join('');
		RobroyApi.request({
			method: 'DELETE',
			url: url,
			noParse: true,
			callback: () => {
				RobroyAuth.logoutCallback();
			},
			errorCallback: () => {
				RobroyAuth.logoutCallback();
			},
		});
	}

	static logoutCallback() {
		window.localStorage.clear();
		RobroyAuth.handleLogout();
	}

	static login() {
		RobroyApi.request({
			method: 'POST',
			url: `${window.ROBROY.args.apiPath}?type=sessions`,
			noParse: true,
			callback: (_response, status) => {
				if (status !== 204) {
					RobroyModal.show(window.ROBROY.lang.error + window.ROBROY.lang.errorInvalidUsername);
					return;
				}
				window.localStorage.setItem(window.ROBROY.args.localStorageKey, true);
				this.handleLogin();
			},
		});
	}

	static handleAuthentication() {
		if (RobroyUtilities.isLoggedIn()) {
			RobroyAuth.handleLogin();
		} else {
			RobroyAuth.handleLogout();
		}
	}

	static handleLogin() {
		window.ROBROY.elements.$authenticateButton.innerText = window.ROBROY.lang.logOut;

		RobroyAuth.addAdminBar();

		RobroyImage.getImages().forEach(($container) => {
			RobroyImage.addAdminControls($container);
		});

		RobroyUtilities.callback('afterLogin');
	}

	static handleLogout() {
		window.ROBROY.elements.$authenticateButton.innerText = window.ROBROY.lang.logIn;

		let $elems = document.querySelectorAll('.robroy-admin');
		$elems.forEach((elem) => {
			elem.remove();
		});

		if (window.ROBROY.args.removePointerEventsOnLogin) {
			$elems = document.querySelectorAll('.robroy-link');
			$elems.forEach(($elem) => {
				$elem.removeAttribute('tabindex');
				$elem.style.pointerEvents = '';
			});
		}

		RobroyUtilities.callback('afterLogout');
	}

	static addAdminBar() {
		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-admin robroy-button-container');
		$div.setAttribute('id', 'robroy-admin');
		window.ROBROY.elements.$container.prepend($div);

		const $uploadButton = document.createElement('button');
		$uploadButton.setAttribute('class', 'robroy-button');
		$uploadButton.setAttribute('id', 'robroy-create-image');
		$uploadButton.setAttribute('type', 'button');
		$uploadButton.innerText = window.ROBROY.lang.uploadImage;
		$uploadButton.addEventListener('click', RobroyImage.showCreateForm);
		$div.append($uploadButton);

		const $createButton = document.createElement('button');
		$createButton.setAttribute('class', 'robroy-button robroy-button--secondary');
		$createButton.setAttribute('id', 'robroy-create-folder');
		$createButton.setAttribute('type', 'button');
		$createButton.innerText = window.ROBROY.lang.createFolder;
		$createButton.addEventListener('click', RobroyFolder.showCreateForm);
		$div.append($createButton);

		if (window.ROBROY.currentFolder.id) {
			const $editButton = document.createElement('button');
			$editButton.setAttribute('class', 'robroy-button robroy-button--secondary');
			$editButton.setAttribute('id', 'robroy-edit-folder');
			$editButton.setAttribute('type', 'button');
			$editButton.innerText = window.ROBROY.lang.editFolder;
			$editButton.addEventListener('click', RobroyFolder.showEditForm);
			$div.append($editButton);

			const $deleteButton = document.createElement('button');
			$deleteButton.setAttribute('class', 'robroy-button robroy-button--danger');
			$deleteButton.setAttribute('id', 'robroy-delete-folder');
			$deleteButton.setAttribute('type', 'button');
			$deleteButton.innerText = window.ROBROY.lang.deleteFolder;
			if (!RobroyUtilities.isEmpty()) {
				$deleteButton.style.display = 'none';
			}
			$deleteButton.addEventListener('click', RobroyFolder.delete);
			$div.append($deleteButton);
		}

		RobroyUtilities.modifier('adminBar', { element: $div });
	}
}
