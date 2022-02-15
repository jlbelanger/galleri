import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyErrors {
	static add($input, message) {
		$input.setAttribute('aria-invalid', true);

		const $field = $input.closest('.robroy-field');
		$field.classList.add('robroy-has-error');

		const $span = document.createElement('span');
		$span.setAttribute('class', 'robroy-error');
		$span.setAttribute('id', `robroy-error-${$input.getAttribute('id')}`);
		$span.innerText = message;
		$field.append($span);
	}

	static clear($form) {
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

	static show(response, status) {
		if (response.errors) {
			const errors = [];
			response.errors.forEach((error) => {
				if (error.pointer) {
					const $input = document.getElementById(`robroy-input-${error.pointer}`);
					if ($input) {
						RobroyErrors.add($input, window.ROBROY.lang.error + error.title);
					} else {
						errors.push(error.title);
					}
				} else {
					errors.push(error.title);
				}
			});
			if (errors.length > 0) {
				RobroyModal.show(RobroyUtilities.sprintf(window.ROBROY.lang.error + errors.join(' '), status));
			}
		} else {
			RobroyModal.show(RobroyUtilities.sprintf(window.ROBROY.lang.error + window.ROBROY.lang.errorStatus, status));
		}
	}
}
