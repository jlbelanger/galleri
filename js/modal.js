import GalleriSpinner from './spinner';
import GalleriUtilities from './utilities';

export default class GalleriModal {
	static show(message, args = {}) {
		args.closeButtonText = args.closeButtonText || window.GALLERI.lang.ok;
		args.closeButtonClass = args.closeButtonClass || '';

		document.body.classList.add('galleri-modal-open');

		const id = `galleri-modal-${new Date().getTime()}`;
		const $container = document.createElement('dialog');
		$container.setAttribute('id', id);
		$container.setAttribute('class', 'galleri-modal');
		$container.setAttribute('tabindex', '-1');

		const $toastContainer = document.createElement('div');
		$toastContainer.setAttribute('aria-live', 'polite');
		$toastContainer.setAttribute('class', 'galleri-toast-container');
		$toastContainer.setAttribute('id', 'galleri-modal-toast-container');
		$toastContainer.setAttribute('role', 'alert');
		$container.appendChild($toastContainer);

		const $spinner = GalleriSpinner.init($container, 'galleri-modal-spinner');
		GalleriSpinner.hide($spinner);

		const $innerContainer = document.createElement('div');
		$innerContainer.setAttribute('class', 'galleri-modal-box');
		$container.appendChild($innerContainer);

		if (args.append) {
			$innerContainer.appendChild(message);
		} else {
			const $p = document.createElement('p');
			$p.setAttribute('class', 'galleri-modal-text');
			$p.innerText = message;
			$innerContainer.appendChild($p);
		}

		let $closeButton;
		if (!args.hideClose || args.showCancel) {
			const $optionsContainer = document.createElement('p');
			$optionsContainer.setAttribute('class', 'galleri-modal-options');
			$innerContainer.appendChild($optionsContainer);

			if (!args.hideClose) {
				const callback = (e) => {
					if (GalleriUtilities.propertyExists(args, 'callback')) {
						args.callback(e);
					} else {
						GalleriModal.hide(e);
					}
				};

				$closeButton = document.createElement('button');
				$closeButton.setAttribute('id', 'galleri-modal-close');
				$closeButton.setAttribute('type', 'button');
				$closeButton.setAttribute('class', `galleri-button ${args.closeButtonClass}`.trim());
				$closeButton.setAttribute('data-galleri-modal-close', '');
				if (args.closeButtonAttributes) {
					Object.keys(args.closeButtonAttributes).forEach((property) => {
						$closeButton.setAttribute(property, args.closeButtonAttributes[property]);
					});
				}
				$closeButton.innerText = args.closeButtonText;
				$closeButton.addEventListener('click', callback);
				$optionsContainer.appendChild($closeButton);

				document.addEventListener('keydown', GalleriModal.keydownListener, false);
				$container.addEventListener('click', GalleriModal.onClickDialog);
			}

			if (args.showCancel) {
				const $cancelButton = document.createElement('button');
				$cancelButton.setAttribute('id', 'galleri-modal-cancel');
				$cancelButton.setAttribute('type', 'button');
				$cancelButton.setAttribute('class', 'galleri-button galleri-button--secondary');
				$cancelButton.innerText = window.GALLERI.lang.cancel;
				$cancelButton.addEventListener('click', this.hide);
				$optionsContainer.appendChild($cancelButton);
			}
		}

		document.body.appendChild($container);

		window.GALLERI.activeElement = document.activeElement;
		$container.showModal();

		$container.focus();

		GalleriUtilities.modifier('modal', { element: $container });

		return $container;
	}

	static keydownListener(e) {
		if (e.key === 'Escape') {
			GalleriModal.hide();
		}
	}

	static onClickDialog(e) {
		if (e.target.tagName === 'DIALOG') {
			GalleriModal.hide();
		}
	}

	static hide(e) {
		document.removeEventListener('keydown', GalleriModal.keydownListener);

		document.body.classList.remove('galleri-modal-open');

		let $target;
		if (e && e.target) {
			$target = e.target;
		} else {
			$target = document.querySelector('[data-galleri-modal-close]');
		}

		const $container = $target.closest('.galleri-modal');
		$container.remove();

		if (window.GALLERI.activeElement) {
			window.GALLERI.activeElement.focus();
			window.GALLERI.activeElement = null;
		}
	}
}
