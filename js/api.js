import RobroyModal from './modal';
import RobroySpinner from './spinner';

export default class RobroyApi {
	static request(args) {
		args = args || {};
		args.method = args.method || 'GET';

		RobroySpinner.show();

		var req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState !== XMLHttpRequest.DONE) {
				return;
			}

			RobroySpinner.hide();

			var response = req.responseText;
			if (!response && (req.status < 200 || req.status > 299)) {
				if (args.errorCallback) {
					args.errorCallback(response, req.status);
				} else {
					RobroyModal.show('Error: The server returned a ' + req.status + ' error.');
				}
				return;
			}
			if (response && !args.noParse) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					if (args.errorCallback) {
						args.errorCallback(response, req.status);
					} else {
						RobroyModal.show('Error: The server returned a non-JSON response. (' + args.url + ')');
					}
					return;
				}

				if (response.errors) {
					var errors = response.errors.map((error) => error.title);
					RobroyModal.show('Error: ' + errors);
					return;
				}
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
}
