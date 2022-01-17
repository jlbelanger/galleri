import RobroyUtilities from './utilities';

export default class RobroyModal {
	static show(message, args) {
		args = args || {};
		args.closeButtonText = args.closeButtonText || 'OK';
		args.closeButtonClass = args.closeButtonClass || '';

		const id = `robroy-modal-${new Date().getTime()}`;
		const $container = document.createElement('div');
		$container.setAttribute('id', id);
		$container.setAttribute('class', 'robroy-modal');
		$container.setAttribute('role', 'alert');

		const $innerContainer = document.createElement('div');
		$innerContainer.setAttribute('class', 'robroy-modal-box');
		$container.appendChild($innerContainer);

		const $p = document.createElement('p');
		$p.setAttribute('class', 'robroy-modal-text');
		if (args.append) {
			$p.appendChild(message);
		} else {
			$p.innerText = message;
		}
		$innerContainer.appendChild($p);

		let $closeButton;
		if (!args.hideClose || args.showCancel) {
			const $optionsContainer = document.createElement('p');
			$optionsContainer.setAttribute('class', 'robroy-modal-options');
			$innerContainer.appendChild($optionsContainer);

			if (!args.hideClose) {
				const callback = (e) => {
					if (RobroyUtilities.propertyExists(args, 'callback')) {
						args.callback(e);
					} else {
						RobroyModal.hide(e);
					}
				};

				$closeButton = document.createElement('button');
				$closeButton.setAttribute('id', 'robroy-modal-close');
				$closeButton.setAttribute('type', 'button');
				$closeButton.setAttribute('class', `robroy-button ${args.closeButtonClass}`.trim());
				$closeButton.setAttribute('data-id', id);
				$closeButton.setAttribute('data-robroy-modal-close', '');
				if (args.closeButtonAttributes) {
					Object.keys(args.closeButtonAttributes).forEach((property) => {
						$closeButton.setAttribute(property, args.closeButtonAttributes[property]);
					});
				}
				$closeButton.innerText = args.closeButtonText;
				$closeButton.addEventListener('click', callback);
				$optionsContainer.appendChild($closeButton);

				document.addEventListener('keydown', RobroyModal.keydownListener, false);
			}

			if (args.showCancel) {
				const $cancelButton = document.createElement('button');
				$cancelButton.setAttribute('id', 'robroy-modal-cancel');
				$cancelButton.setAttribute('type', 'button');
				$cancelButton.setAttribute('class', 'robroy-button robroy-button--secondary');
				$cancelButton.setAttribute('data-id', id);
				$cancelButton.innerText = 'Cancel';
				$cancelButton.addEventListener('click', this.hide);
				$optionsContainer.appendChild($cancelButton);
			}
		}

		document.body.appendChild($container);
		if ($closeButton) {
			window.ROBROY.activeElement = document.activeElement;
			$closeButton.focus();
		}
	}

	static keydownListener(e) {
		if (e.key === 'Escape') {
			RobroyModal.hide();
			document.removeEventListener('keydown', RobroyModal.keydownListener);
		}
	}

	static hide(e) {
		let $target;
		if (e && e.target) {
			$target = e.target;
		} else {
			$target = document.querySelector('[data-robroy-modal-close]');
		}

		const $container = document.getElementById($target.getAttribute('data-id'));
		$container.parentNode.removeChild($container);

		if (window.ROBROY.activeElement) {
			window.ROBROY.activeElement.focus();
			window.ROBROY.activeElement = null;
		}
	}
}
