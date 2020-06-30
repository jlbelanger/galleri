export default class RobroySpinner {
	static show() {
		var elem = document.querySelector('.robroy-spinner');
		if (!elem) {
			elem = document.createElement('div');
			elem.setAttribute('class', 'robroy-spinner');
			document.body.appendChild(elem);
		}
		elem.style.display = '';
	}

	static hide() {
		document.querySelector('.robroy-spinner').style.display = 'none';
	}
}
