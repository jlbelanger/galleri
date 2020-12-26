import RobroyAuth from './auth';
import RobroyGrid from './grid';
import RobroyList from './list';
import RobroyUtilities from './utilities';

export default class Robroy {
	constructor(args) {
		args = args || {};
		args.allPagesLoaded = false;
		args.apiPath = args.apiPath || '/api.php';
		args.attributes = args.attributes || {};
		args.callbacks = args.callbacks || {};
		args.isLoading = false;
		args.pageNumber = 0;
		args.pageSize = args.pageSize || 8;
		args.selector = args.selector || '#robroy';
		this.args = args;

		var container = document.querySelector(args.selector);
		if (!container) {
			return;
		}

		var list = document.createElement('div');
		list.setAttribute('id', 'robroy-list');
		container.appendChild(list);

		this.auth = document.querySelector('[data-action="authenticate"]');
		this.container = container;
		this.list = list;
	}

	static init(args) {
		if (!RobroyUtilities.propertyExists(window, 'ROBROY')) {
			window.ROBROY = new Robroy(args);
			if (!window.ROBROY.list) {
				return null;
			}
			RobroyAuth.init();
			RobroyList.init();
			window.ROBROY.grid = new RobroyGrid();
		}
		return window.ROBROY;
	}
}
