export default class RobroyUtilities {
	static addAttributes(elemName, elem) {
		if (!window.ROBROY.args.attributes[elemName]) {
			return;
		}
		Object.keys(window.ROBROY.args.attributes[elemName]).forEach((property) => {
			elem.setAttribute(property, window.ROBROY.args.attributes[elemName][property]);
		});
	}

	static addError(input, message) {
		input.classList.add('robroy-has-error');

		const $span = document.createElement('span');
		$span.setAttribute('class', 'robroy-error');
		$span.setAttribute('id', `robroy-error-${input.getAttribute('id')}`);
		$span.innerText = message;
		input.after($span);
	}

	static callback(name) {
		if (!window.ROBROY.args.callbacks[name]) {
			return;
		}
		window.ROBROY.args.callbacks[name]();
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

	static isLoggedIn() {
		return window.localStorage.getItem('authenticated');
	}

	static propertyExists(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}

	static setMetaTitle(title) {
		const $title = document.querySelector('title');
		$title.innerText = title + window.ROBROY.args.metaTitleSeparator + $title.innerText;
	}

	static setNumImages() {
		const label = window.ROBROY.currentNumImages === 1 ? window.ROBROY.args.singularImageText : window.ROBROY.args.pluralImageText;
		window.ROBROY.elements.$numImages.innerText = `${window.ROBROY.currentNumImages.toLocaleString()} ${label}`;
	}
}
