export default class RobroyEmpty {
	static show() {
		var id = 'robroy-empty';
		var p = document.getElementById(id);
		if (!p) {
			p = document.createElement('p');
			p.setAttribute('id', id);
			p.innerText = 'No images found.';
		}
		window.ROBROY.container.appendChild(p);

		window.ROBROY.list.style.display = 'none';
	}

	static hide() {
		var elem = document.getElementById('robroy-empty');
		if (elem) {
			elem.parentNode.removeChild(elem);
		}

		window.ROBROY.list.style.display = '';
	}

	static getFigures() {
		return document.querySelectorAll('#robroy-list > figure');
	}

	static hasFigures() {
		return RobroyEmpty.getFigures().length > 0;
	}
}
