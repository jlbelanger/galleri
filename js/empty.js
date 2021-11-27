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

		window.ROBROY.imageList.style.display = 'none';
	}

	static hide() {
		var elem = document.getElementById('robroy-empty');
		if (elem) {
			elem.parentNode.removeChild(elem);
		}

		window.ROBROY.imageList.style.display = '';
	}

	static isEmpty() {
		return window.ROBROY.imageList.style.display === 'none' && document.getElementById('robroy-folders').style.display === 'none';
	}

	static getImages() {
		return document.querySelectorAll('#robroy-images > figure');
	}

	static getFolders() {
		return document.querySelectorAll('#robroy-folders > li');
	}

	static hasImages() {
		return RobroyEmpty.getImages().length > 0;
	}

	static hasFolders() {
		return RobroyEmpty.getFolders().length > 0;
	}
}
