import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyFolder from './folder';
import RobroyImage from './image';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyAuth {
	static init() {
		if (!window.ROBROY.auth) {
			return;
		}
		window.ROBROY.auth.addEventListener('click', () => { RobroyAuth.authenticate(); });
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
			window.localStorage.clear();
			RobroyAuth.handleLogout();
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
				window.localStorage.clear();
				RobroyAuth.handleLogout();
			},
		});
	}

	static login() {
		RobroyApi.request({
			method: 'POST',
			url: `${window.ROBROY.args.apiPath}?type=sessions`,
			noParse: true,
			callback: (_response, status) => {
				if (status !== 204) {
					RobroyModal.show('Error: Invalid username or password.');
					return;
				}
				window.localStorage.setItem('authenticated', true);
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
		window.ROBROY.auth.innerText = 'Log Out';

		const images = RobroyEmpty.getImages();
		images.forEach((container) => {
			RobroyImage.addEditControls(container);
		});

		RobroyImage.addCreateControl();
		RobroyFolder.addCreateControl();

		if (window.ROBROY.currentFolderId) {
			RobroyFolder.addEditControls();
		}

		let $parentInput = document.getElementById('robroy-create-folder-parent');
		if ($parentInput) {
			RobroyFolder.addFolderOptions($parentInput, window.ROBROY.currentFolderId);
		}

		$parentInput = document.getElementById('robroy-edit-folder-parent');
		if ($parentInput) {
			RobroyFolder.addFolderOptions($parentInput, RobroyFolder.getParentId(window.ROBROY.currentFolder.id));
		}
	}

	static handleLogout() {
		window.ROBROY.auth.innerText = 'Log In';

		let $elems = document.querySelectorAll('.robroy-admin');
		$elems.forEach((elem) => {
			elem.parentNode.removeChild(elem);
		});

		$elems = document.querySelectorAll('.robroy-link');
		$elems.forEach((elem) => {
			elem.style.pointerEvents = '';
		});
	}
}
