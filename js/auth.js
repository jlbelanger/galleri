import RobroyApi from './api';
import RobroyEmpty from './empty';
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
		var url = [
			window.location.protocol,
			'//log:out@',
			window.location.host,
			window.ROBROY.args.apiPath + '?type=sessions',
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
			url: window.ROBROY.args.apiPath + '?type=sessions',
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

		var figures = RobroyEmpty.getFigures();
		figures.forEach((figure) => {
			RobroyImage.addEditControls(figure);
		});

		RobroyImage.addUploadControl();
	}

	static handleLogout() {
		window.ROBROY.auth.innerText = 'Log In';

		var elems = document.querySelectorAll('.robroy-admin');
		elems.forEach((elem) => {
			elem.parentNode.removeChild(elem);
		});
	}
}
