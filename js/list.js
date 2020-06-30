import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyImage from './image';
import RobroyUtilities from './utilities';

export default class RobroyList {
	static init() {
		RobroyList.loadImages(() => { RobroyList.onScroll(); });
		window.addEventListener('scroll', RobroyUtilities.debounce(() => { RobroyList.onScroll(); }, 100));
	}

	static loadImages(callback) {
		window.ROBROY.args.isLoading = true;
		var url = [
			window.ROBROY.args.apiPath,
			'?type=images&page[number]=' + (++window.ROBROY.args.pageNumber),
			'&page[size]=' + window.ROBROY.args.pageSize,
		].join('');
		RobroyApi.request({
			url: url,
			callback: (response) => {
				RobroyList.appendImages(response.data);
				window.ROBROY.grid.resizeAllItems();

				window.ROBROY.args.isLoading = false;
				if (response.meta.number >= response.meta.total_pages) {
					window.ROBROY.args.allPagesLoaded = true;
				}

				if (response.meta.total_pages <= 0) {
					RobroyEmpty.show();
				}

				if (callback) {
					callback();
				}

				RobroyUtilities.callback('afterLoadImage');
			},
		});
	}

	static onScroll() {
		if (window.ROBROY.args.allPagesLoaded || window.ROBROY.args.isLoading) {
			return;
		}

		var lastItem = document.querySelector('#robroy-list > figure:last-of-type');
		if (!lastItem) {
			return;
		}

		var lastItemOffsetFromTop = lastItem.offsetTop;
		var pageOffsetFromTop = window.pageYOffset + window.innerHeight;

		if (pageOffsetFromTop > lastItemOffsetFromTop) {
			RobroyList.loadImages();
		}
	}

	static appendImages(images) {
		images.forEach((image) => {
			window.ROBROY.list.appendChild(RobroyImage.element(image));
		});
	}
}
