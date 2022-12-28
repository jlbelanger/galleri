import GalleriModal from './modal';
import GalleriSpinner from './spinner';
import GalleriUtilities from './utilities';

export default class GalleriApi {
	static request(args) {
		args = args || {};
		args.method = args.method || 'GET';

		const $spinner = GalleriSpinner.show();
		window.GALLERI.state.numRequestsInProgress += 1;

		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState !== XMLHttpRequest.DONE) {
				return;
			}

			window.GALLERI.state.numRequestsInProgress -= 1;
			if (window.GALLERI.state.numRequestsInProgress <= 0) {
				GalleriSpinner.hide($spinner);
			}

			let response = req.responseText;
			if (!response && (req.status < 200 || req.status > 299)) {
				GalleriApi.error(args, response, req);
				return;
			}

			if (response && !args.noParse) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					GalleriApi.error(args, response, req);
					return;
				}
			}

			if (req.status < 200 || req.status > 299) {
				GalleriApi.error(args, response, req);
				return;
			}

			args.callback(response, req.status);
		};

		let url = args.url;
		if (args.url.endsWith('.json') && GalleriUtilities.isLoggedIn()) {
			url += `?t=${Date.now()}`;
		}
		req.open(args.method, url, true);

		if (args.json) {
			req.setRequestHeader('Content-Type', 'application/json');
			req.send(args.json);
		} else {
			req.send(args.formData);
		}
	}

	static error(args, response, req) {
		if (args.errorCallback) {
			args.errorCallback(response, req.status);
		} else {
			GalleriModal.show(GalleriUtilities.sprintf(window.GALLERI.lang.error + window.GALLERI.lang.errorStatus, req.status));
		}
	}
}
