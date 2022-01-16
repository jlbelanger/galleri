import RobroyUtilities from './utilities';

export default class RobroyGrid {
	constructor() {
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

	checkResizeItem(figure) {
		const $img = figure.querySelector('img');
		if ($img.complete) {
			this.resizeItem(figure);
		} else {
			const int = setInterval(() => {
				if (!$img.complete) {
					return;
				}
				clearInterval(int);
				this.resizeItem(figure);
			}, 100);
		}
	}

	resizeItem(figure) {
		const $a = figure.querySelector('a');
		$a.style.position = '';
		const itemHeight = $a.getBoundingClientRect().height;
		const rowSpan = Math.ceil((itemHeight + this.gridRowGap) / (this.gridRowHeight + this.gridRowGap));
		$a.style.position = 'absolute';
		figure.style.gridRowEnd = `span ${rowSpan}`;
	}

	resizeAllItems() {
		const $figures = document.getElementsByClassName('robroy-figure');
		[...$figures].forEach((figure) => { this.checkResizeItem(figure); });
	}
}
