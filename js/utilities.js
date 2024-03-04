export default class GalleriUtilities {
	static addField($container, name, label, type = 'text') {
		const $div = document.createElement('div');
		$div.setAttribute('class', `galleri-field galleri-field--${type}`);
		$div.setAttribute('id', `galleri-field-${name}`);
		$container.appendChild($div);

		const $label = document.createElement('label');
		$label.setAttribute('class', 'galleri-label');
		$label.setAttribute('for', `galleri-input-${name}`);
		$label.innerText = label;
		$div.appendChild($label);

		let $input;
		if (type === 'select') {
			$input = document.createElement('select');
			$input.setAttribute('class', 'galleri-select');
		} else {
			$input = document.createElement('input');
			$input.setAttribute('class', 'galleri-input');
			$input.setAttribute('type', type);
		}
		$input.setAttribute('id', `galleri-input-${name}`);
		$input.setAttribute('name', name);
		$div.appendChild($input);

		return $input;
	}

	static callback(name, args) {
		if (!window.GALLERI.args.callbacks[name]) {
			return;
		}
		window.GALLERI.args.callbacks[name](args);
	}

	static debounce(func, wait, immediate) {
		let timeout;
		return function (...args) { // eslint-disable-line func-names
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
		const imageListStyle = window.getComputedStyle(window.GALLERI.elements.$imageList);
		const folderListStyle = window.getComputedStyle(window.GALLERI.elements.$folderList);
		return imageListStyle.display === 'none' && folderListStyle.display === 'none';
	}

	static isLoggedIn() {
		return window.localStorage.getItem(window.GALLERI.args.localStorageKey);
	}

	static modifier(name, args) {
		if (!window.GALLERI.args.modifiers[name]) {
			return;
		}
		window.GALLERI.args.modifiers[name](args);
	}

	static propertyExists(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}

	static setMetaTitle(title) {
		const $title = document.querySelector('title');
		$title.innerText = title + window.GALLERI.args.metaTitleSeparator + $title.innerText;
	}

	static setPageTitle(title) {
		let $span = document.getElementById('galleri-folder-title-text');
		if (!$span) {
			const $title = document.createElement('h1');
			$title.setAttribute('id', 'galleri-folder-title');
			window.GALLERI.elements.$container.prepend($title);

			$span = document.createElement('span');
			$span.setAttribute('id', 'galleri-folder-title-text');
			$title.appendChild($span);

			window.GALLERI.elements.$numImages = document.createElement('small');
			window.GALLERI.elements.$numImages.setAttribute('id', 'galleri-folder-num');
			$title.appendChild(window.GALLERI.elements.$numImages);

			GalleriUtilities.modifier('title', { element: $title, title });
		}
		$span.innerText = title;
	}

	static setNumImages() {
		const label = window.GALLERI.currentNumImages === 1 ? window.GALLERI.lang.singularImageText : window.GALLERI.lang.pluralImageText;
		window.GALLERI.elements.$numImages.innerText = `(${window.GALLERI.currentNumImages.toLocaleString()} ${label})`;
	}

	static sprintf(s, ...args) {
		args.forEach((a) => {
			s = s.replace('%s', a);
		});
		return s;
	}

	static toSlug(value) {
		if (!value) {
			return '';
		}
		return value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/ & /g, '-and-')
			.replace(/<[^>]+>/g, '')
			.replace(/['’.]/g, '')
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '')
			.replace(/--+/g, '-');
	}
}
