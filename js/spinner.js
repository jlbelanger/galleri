export default class RobroySpinner {
	static show() {
		let $spinner = document.querySelector('.robroy-spinner');
		if (!$spinner) {
			$spinner = document.createElement('div');
			$spinner.setAttribute('class', 'robroy-spinner');
			document.body.appendChild($spinner);
		}
		$spinner.style.display = '';
	}

	static hide() {
		document.querySelector('.robroy-spinner').style.display = 'none';
	}
}
