export default class RobroyUtilities {
	static addError($input, message) {
		$input.setAttribute('aria-invalid', true);

		const $field = $input.closest('.robroy-field');
		$field.classList.add('robroy-has-error');

		const $span = document.createElement('span');
		$span.setAttribute('class', 'robroy-error');
		$span.setAttribute('id', `robroy-error-${$input.getAttribute('id')}`);
		$span.innerText = message;
		$field.append($span);
	}

	static addField($container, name, label, type = 'text') {
		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-field');
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
	}

	static clearErrors($form) {
		let $elems = $form.querySelectorAll('.robroy-error');
		$elems.forEach(($elem) => {
			$elem.remove();
		});

		$elems = $form.querySelectorAll('.robroy-has-error');
		$elems.forEach(($elem) => {
			$elem.classList.remove('robroy-has-error');
			$elem.removeAttribute('aria-invalid');
		});
	}

	static callback(name, args) {
		if (!window.ROBROY.args.callbacks[name]) {
			return;
		}
		window.ROBROY.args.callbacks[name](args);
	}

	static debounce(func, wait, immediate, ...args) {
		let timeout;
		return function () {
			const context = this;
			const later = function () {
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
		let $title = document.getElementById('robroy-folder-title');
		if (!$title) {
			$title = document.createElement('h1');
			$title.setAttribute('id', 'robroy-folder-title');
			window.ROBROY.elements.$container.prepend($title);
		}
		$title.innerText = title;
	}

	static setNumImages() {
		const label = window.ROBROY.currentNumImages === 1 ? window.ROBROY.lang.singularImageText : window.ROBROY.lang.pluralImageText;
		window.ROBROY.elements.$numImages.innerText = `${window.ROBROY.currentNumImages.toLocaleString()} ${label}`;
	}

	static sprintf(s, ...args) {
		args.forEach((a) => {
			s = s.replace('%s', a);
		});
		return s;
	}
}
