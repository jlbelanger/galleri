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

	checkResizeItem($figure) {
		const $img = $figure.querySelector('img');
		this.resizeItem($figure, $img);
		$img.onload = () => {
			this.resizeItem($figure, $img);
			const $a = $figure.querySelector('a');
			$a.classList.add('robroy-show');
		};
	}

	resizeItem($figure, $img) {
		const itemHeight = $img.getBoundingClientRect().height;
		const rowSpan = Math.ceil((itemHeight + this.gridRowGap) / (this.gridRowHeight + this.gridRowGap));
		$figure.style.gridRowEnd = `span ${rowSpan}`;
	}

	resizeAllItems() {
		const $figures = document.getElementsByClassName('robroy-figure');
		[...$figures].forEach(($figure) => { this.checkResizeItem($figure); });
	}
}
