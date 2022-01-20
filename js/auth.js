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
					RobroyModal.show(window.ROBROY.lang.errorInvalidUsername);
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

		RobroyImage.getImages().forEach(($container) => {
			RobroyImage.addEditControls($container);
		});
		if (window.ROBROY.currentFolderId) {
			RobroyFolder.addEditControls();
		}

		RobroyImage.addCreateControl();
		RobroyFolder.addCreateControl();

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
			$elems.forEach((elem) => {
				elem.style.pointerEvents = '';
			});
		}

		RobroyUtilities.callback('afterLogout');
	}
}
