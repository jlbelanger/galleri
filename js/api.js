import RobroyModal from './modal';
import RobroySpinner from './spinner';
import RobroyUtilities from './utilities';

export default class RobroyApi {
	static request(args) {
		args = args || {};
		args.method = args.method || 'GET';

		const $spinner = RobroySpinner.show();
		window.ROBROY.state.numRequestsInProgress += 1;

		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState !== XMLHttpRequest.DONE) {
				return;
			}

			window.ROBROY.state.numRequestsInProgress -= 1;
			if (window.ROBROY.state.numRequestsInProgress <= 0) {
				RobroySpinner.hide($spinner);
			}

			let response = req.responseText;
			if (!response && (req.status < 200 || req.status > 299)) {
				RobroyApi.error(args, response, req);
				return;
			}

			if (response && !args.noParse) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					RobroyApi.error(args, response, req);
					return;
				}
			}

			if (req.status < 200 || req.status > 299) {
				RobroyApi.error(args, response, req);
				return;
			}

			args.callback(response, req.status);
		};
		req.open(args.method, args.url, true);

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
			RobroyModal.show(RobroyUtilities.sprintf(window.ROBROY.lang.error + window.ROBROY.lang.errorStatus, req.status));
		}
	}
}
