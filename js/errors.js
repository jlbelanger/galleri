import GalleriModal from './modal';
import GalleriUtilities from './utilities';

export default class GalleriErrors {
	static add($input, message) {
		$input.setAttribute('aria-invalid', true);

		const $field = $input.closest('.galleri-field');
		$field.classList.add('galleri-has-error');

		const $span = document.createElement('span');
		$span.setAttribute('class', 'galleri-error');
		$span.setAttribute('id', `galleri-error-${$input.getAttribute('id')}`);
		$span.innerText = message;
		$field.append($span);
	}

	static clear($form) {
		let $elems = $form.querySelectorAll('.galleri-error');
		$elems.forEach(($elem) => {
			$elem.remove();
		});

		$elems = $form.querySelectorAll('.galleri-has-error');
		$elems.forEach(($elem) => {
			$elem.classList.remove('galleri-has-error');
			$elem.removeAttribute('aria-invalid');
		});
	}

	static show(response, status) {
		if (response.errors) {
			const errors = [];
			response.errors.forEach((error) => {
				if (error.pointer) {
					const $input = document.getElementById(`galleri-input-${error.pointer}`);
					if ($input) {
						GalleriErrors.add($input, window.GALLERI.lang.error + error.title);
					} else {
						errors.push(error.title);
					}
				} else {
					errors.push(error.title);
				}
			});
			if (errors.length > 0) {
				GalleriModal.show(GalleriUtilities.sprintf(window.GALLERI.lang.error + errors.join(' '), status));
			}
		} else {
			GalleriModal.show(GalleriUtilities.sprintf(window.GALLERI.lang.error + window.GALLERI.lang.errorStatus, status));
		}
	}
}
