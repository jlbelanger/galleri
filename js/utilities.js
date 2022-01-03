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

		const error = document.createElement('span');
		error.setAttribute('class', 'robroy-error');
		error.setAttribute('id', 'robroy-error-' + input.getAttribute('id'));
		error.innerText = message;
		input.after(error);
	}

	static callback(name) {
		if (!window.ROBROY.args.callbacks[name]) {
			return;
		}
		window.ROBROY.args.callbacks[name]();
	}

	static debounce(func, wait, immediate, ...args) {
		var timeout;
		return function () {
			var context = this;
			var later = function () {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
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
		var elem = document.querySelector('title');
		elem.innerText = title + window.ROBROY.args.metaTitleSeparator + elem.innerText;
	}

	static setNumImages() {
		const label = window.ROBROY.currentNumImages === 1 ? window.ROBROY.args.singularImageText : window.ROBROY.args.pluralImageText;
		window.ROBROY.elements.numImages.innerText = window.ROBROY.currentNumImages.toLocaleString() + ' ' + label;
	}
}
