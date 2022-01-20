import RobroyUtilities from './utilities';

export default class RobroySpinner {
	static show() {
		let $spinner = document.querySelector('.robroy-spinner');
		if (!$spinner) {
			$spinner = document.createElement('div');
			$spinner.setAttribute('class', 'robroy-spinner');
			$spinner.setAttribute('role', 'alert');
			$spinner.innerText = window.ROBROY.lang.loading;
			document.body.appendChild($spinner);
		}
		$spinner.style.display = '';

		RobroyUtilities.modifier('spinner', { element: $spinner });

		return $spinner;
	}

	static hide($spinner) {
		$spinner.style.display = 'none';
	}
}
