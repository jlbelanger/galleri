export default class RobroyUtilities {
	static addField($container, name, label, type = 'text') {
		const $div = document.createElement('div');
		$div.setAttribute('class', `robroy-field robroy-field--${type}`);
		$div.setAttribute('id', `robroy-field-${name}`);
		$container.appendChild($div);

		const $label = document.createElement('label');
		$label.setAttribute('class', 'robroy-label');
		$label.setAttribute('for', `robroy-input-${name}`);
		$label.innerText = label;
		$div.appendChild($label);

		let $input;
		if (type === 'select') {
			$input = document.createElement('select');
			$input.setAttribute('class', 'robroy-select');
		} else {
			$input = document.createElement('input');
			$input.setAttribute('class', 'robroy-input');
			$input.setAttribute('type', type);
		}
		$input.setAttribute('id', `robroy-input-${name}`);
		$input.setAttribute('name', name);
		$div.appendChild($input);

		return $input;
	}

	static callback(name, args) {
		if (!window.ROBROY.args.callbacks[name]) {
			return;
		}
		window.ROBROY.args.callbacks[name](args);
	}

	static debounce(func, wait, immediate, ...args) {
		let timeout;
		return () => {
			const context = this;
			const later = () => {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	}

	static isEmpty() {
		const imageListStyle = window.getComputedStyle(window.ROBROY.elements.$imageList);
		const folderListStyle = window.getComputedStyle(window.ROBROY.elements.$folderList);
		return imageListStyle.display === 'none' && folderListStyle.display === 'none';
	}

	static isLoggedIn() {
		return window.localStorage.getItem(window.ROBROY.args.localStorageKey);
	}

	static modifier(name, args) {
		if (!window.ROBROY.args.modifiers[name]) {
			return;
		}
		window.ROBROY.args.modifiers[name](args);
	}

	static propertyExists(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}

	static setMetaTitle(title) {
		const $title = document.querySelector('title');
		$title.innerText = title + window.ROBROY.args.metaTitleSeparator + $title.innerText;
	}

	static setPageTitle(title) {
		let $span = document.getElementById('robroy-folder-title-text');
		if (!$span) {
			const $title = document.createElement('h1');
			$title.setAttribute('id', 'robroy-folder-title');
			window.ROBROY.elements.$container.prepend($title);

			$span = document.createElement('span');
			$span.setAttribute('id', 'robroy-folder-title-text');
			$title.appendChild($span);

			window.ROBROY.elements.$numImages = document.createElement('small');
			window.ROBROY.elements.$numImages.setAttribute('id', 'robroy-folder-num');
			$title.appendChild(window.ROBROY.elements.$numImages);
		}
		$span.innerText = title;
	}

	static setNumImages() {
		const label = window.ROBROY.currentNumImages === 1 ? window.ROBROY.lang.singularImageText : window.ROBROY.lang.pluralImageText;
		window.ROBROY.elements.$numImages.innerText = `(${window.ROBROY.currentNumImages.toLocaleString()} ${label})`;
	}

	static sprintf(s, ...args) {
		args.forEach((a) => {
			s = s.replace('%s', a);
		});
		return s;
	}
}
