import GalleriUtilities from './utilities';

export default class GalleriSpinner {
	static show() {
		let $spinner = document.querySelector('.galleri-spinner');
		if (!$spinner) {
			$spinner = document.createElement('div');
			$spinner.setAttribute('class', 'galleri-spinner');
			$spinner.setAttribute('role', 'alert');
			$spinner.innerText = window.GALLERI.lang.loading;
			document.body.appendChild($spinner);
		}
		$spinner.style.display = '';

		GalleriUtilities.modifier('spinner', { element: $spinner });

		return $spinner;
	}

	static hide($spinner) {
		$spinner.style.display = 'none';
	}
}
