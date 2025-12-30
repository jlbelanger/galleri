import GalleriUtilities from './utilities.js';

export default class GalleriSpinner {
	static init($parent, id) {
		let $spinner = document.getElementById(id);

		if (!$spinner) {
			$spinner = document.createElement('div');
			$spinner.setAttribute('class', 'galleri-spinner');
			$spinner.setAttribute('id', id);
			$spinner.setAttribute('role', 'status');
			$spinner.innerText = window.GALLERI.lang.loading;
			$parent.appendChild($spinner);
			$spinner.classList.remove('galleri-spinner--hide');

			GalleriUtilities.modifier('spinner', { element: $spinner });
		}

		return $spinner;
	}

	static show() {
		let $spinner = document.getElementById('galleri-modal-spinner');
		if (!$spinner) {
			$spinner = document.getElementById('galleri-spinner');
		}
		$spinner.classList.remove('galleri-spinner--hide');
		return $spinner;
	}

	static hide($spinner) {
		$spinner.classList.add('galleri-spinner--hide');
	}
}
