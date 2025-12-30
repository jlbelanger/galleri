import GalleriUtilities from './utilities.js';

export default class GalleriToast {
	static show(message, args = {}) {
		args.class = args.class || '';
		args.closeButtonClass = args.closeButtonClass || '';
		args.closeButtonText = args.closeButtonText || window.GALLERI.lang.close;
		args.duration = args.duration || 3000;

		const id = `galleri-toast-${new Date().getTime()}`;
		const $div = document.createElement('div');
		$div.setAttribute('class', `galleri-toast ${args.class}`.trim());
		$div.setAttribute('id', id);
		$div.style.animationDuration = `${args.duration}ms`;

		const $p = document.createElement('p');
		$p.setAttribute('class', 'galleri-toast-text');
		$p.innerText = message;
		$div.appendChild($p);

		if (!args.hideClose) {
			const callback = (e) => {
				GalleriToast.hide(e);
			};

			const $closeButton = document.createElement('button');
			$closeButton.setAttribute('aria-label', args.closeButtonText);
			$closeButton.setAttribute('class', `galleri-toast-close ${args.closeButtonClass}`.trim());
			$closeButton.setAttribute('type', 'button');
			if (args.closeButtonAttributes) {
				Object.keys(args.closeButtonAttributes).forEach((property) => {
					$closeButton.setAttribute(property, args.closeButtonAttributes[property]);
				});
			}
			$closeButton.addEventListener('click', callback);
			$div.appendChild($closeButton);
		}

		let $toastContainer = document.getElementById('galleri-modal-toast-container');
		if (!$toastContainer) {
			$toastContainer = document.getElementById('galleri-toast-container');
		}
		$toastContainer.appendChild($div);

		GalleriUtilities.modifier('toast', { element: $div });

		setTimeout(() => {
			$div.remove();
		}, args.duration + 1000);

		return $div;
	}

	static hide(e) {
		e.target.closest('.galleri-toast').remove();
	}
}
