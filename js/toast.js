import GalleriUtilities from './utilities';

export default class GalleriToast {
	static show(message, args = {}) {
		args.class = args.class || '';
		args.closeButtonClass = args.closeButtonClass || '';
		args.closeButtonText = args.closeButtonText || window.GALLERI.lang.close;
		args.duration = args.duration || 3000;

		let $container = document.getElementById('galleri-toast-container');
		if (!$container) {
			$container = document.createElement('div');
			$container.setAttribute('id', 'galleri-toast-container');
			document.getElementById('galleri-admin').append($container);
		}

		const id = `galleri-toast-${new Date().getTime()}`;
		const $div = document.createElement('div');
		$div.setAttribute('class', `galleri-toast ${args.class}`.trim());
		$div.setAttribute('id', id);
		$div.setAttribute('role', 'alert');
		$div.style.animationDuration = `${args.duration}ms`;
		$container.appendChild($div);

		const $p = document.createElement('p');
		$p.setAttribute('class', 'galleri-toast-text');
		$p.innerText = message;
		$div.appendChild($p);

		if (!args.hideClose) {
			const callback = (e) => {
				GalleriToast.hide(e);
			};

			const $closeButton = document.createElement('button');
			$closeButton.setAttribute('class', `galleri-toast-close ${args.closeButtonClass}`.trim());
			$closeButton.setAttribute('type', 'button');
			if (args.closeButtonAttributes) {
				Object.keys(args.closeButtonAttributes).forEach((property) => {
					$closeButton.setAttribute(property, args.closeButtonAttributes[property]);
				});
			}
			$closeButton.innerText = args.closeButtonText;
			$closeButton.addEventListener('click', callback);
			$div.appendChild($closeButton);
		}

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
