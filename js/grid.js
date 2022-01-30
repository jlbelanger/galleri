import RobroyUtilities from './utilities';

export default class RobroyGrid {
	constructor() {
		window.ROBROY.elements.$imageList.classList.add('robroy-grid');

		this.calculate();

		window.addEventListener('resize', RobroyUtilities.debounce(() => {
			this.calculate();
			this.resizeAllItems();
		}, 100));
	}

	calculate() {
		const gridStyle = window.getComputedStyle(window.ROBROY.elements.$imageList);
		this.gridRowHeight = parseInt(gridStyle.getPropertyValue('grid-auto-rows'), 10);
		this.gridRowGap = parseInt(gridStyle.getPropertyValue('grid-row-gap'), 10);
	}

	checkResizeItem($container) {
		const $img = $container.querySelector('img');
		if ($img.complete) {
			this.resizeItem($container);
		} else {
			const int = setInterval(() => {
				if (!$img.complete) {
					return;
				}
				clearInterval(int);
				this.resizeItem($container);
			}, 100);
		}
	}

	resizeItem($container) {
		const $a = $container.querySelector('a');
		$a.style.position = '';
		const itemHeight = $a.getBoundingClientRect().height;
		const rowSpan = Math.ceil((itemHeight + this.gridRowGap) / (this.gridRowHeight + this.gridRowGap));
		$a.style.position = 'absolute';
		$container.style.opacity = 1;
		$container.style.gridRowEnd = `span ${rowSpan}`;
	}

	resizeAllItems() {
		const $figures = document.getElementsByClassName('robroy-figure');
		[...$figures].forEach((figure) => { this.checkResizeItem(figure); });
	}
}
