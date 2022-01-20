import RobroyUtilities from './utilities';

export default class RobroyToast {
	static show(message, args = {}) {
		args.class = args.class || '';
		args.closeButtonClass = args.closeButtonText || '';
		args.closeButtonText = args.closeButtonText || window.ROBROY.lang.close;
		args.duration = args.duration || 3000;

		let $container = document.getElementById('robroy-toast-container');
		if (!$container) {
			$container = document.createElement('div');
			$container.setAttribute('id', 'robroy-toast-container');
			document.body.append($container);
		}

		const id = `robroy-toast-${new Date().getTime()}`;
		const $div = document.createElement('div');
		$div.setAttribute('class', `robroy-toast ${args.class}`.trim());
		$div.setAttribute('id', id);
		$div.setAttribute('role', 'alert');
		$div.style.animationDuration = `${args.duration}ms`;
		$container.appendChild($div);

		const $p = document.createElement('p');
		$p.setAttribute('class', 'robroy-toast-text');
		$p.innerText = message;
		$div.appendChild($p);

		if (!args.hideClose) {
			const callback = (e) => {
				RobroyToast.hide(e);
			};

			const $closeButton = document.createElement('button');
			$closeButton.setAttribute('class', `robroy-toast-close ${args.closeButtonClass}`.trim());
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

		RobroyUtilities.modifier('toast', { element: $div });

		setTimeout(() => {
			$div.remove();
		}, args.duration + 1000);

		return $div;
	}

	static hide(e) {
		e.target.closest('.robroy-toast').remove();
	}
}
