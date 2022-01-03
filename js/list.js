import RobroyApi from './api';
import RobroyAuth from './auth';
import RobroyBreadcrumb from './breadcrumb';
import RobroyEmpty from './empty';
import RobroyFolder from './folder';
import RobroyImage from './image';
import RobroyUtilities from './utilities';

export default class RobroyList {
	static init() {
		RobroyList.loadCurrentFolder();
	}

	static loadCurrentFolder() {
		if (window.ROBROY.args.showAllImages) {
			RobroyAuth.init();

			RobroyList.loadImages(() => { RobroyList.onScroll(); });
			window.addEventListener('scroll', RobroyUtilities.debounce(() => { RobroyList.onScroll(); }, 100));
			return;
		}

		RobroyApi.request({
			url: window.ROBROY.args.apiPath + '?type=folders&id=' + window.ROBROY.currentFolderId,
			callback: (response) => {
				window.ROBROY.currentFolder = response.data;

				if (window.ROBROY.currentFolderId !== '') {
					RobroyBreadcrumb.init();
				}

				if (response.data.attributes.name) {
					RobroyUtilities.setMetaTitle(response.data.attributes.name);
				}

				if (response.data.relationships.folders.length > 0) {
					RobroyList.appendFolders(response.data.relationships.folders);
				}

				RobroyAuth.init();

				RobroyList.loadImages(() => { RobroyList.onScroll(); });
				window.addEventListener('scroll', RobroyUtilities.debounce(() => { RobroyList.onScroll(); }, 100));

				RobroyUtilities.callback('afterLoadFolder');
			},
		});
	}

	static loadImages(callback) {
		window.ROBROY.args.isLoadingImages = true;

		var url = [
			window.ROBROY.args.apiPath,
			'?type=images&page[number]=' + (++window.ROBROY.args.pageNumber),
			'&page[size]=' + window.ROBROY.args.pageSize,
		].join('');
		if (!window.ROBROY.args.showAllImages) {
			url += '&parent=' + window.ROBROY.currentFolderId;
		}

		RobroyApi.request({
			url: url,
			callback: (response) => {
				response.data.forEach((image) => {
					window.ROBROY.currentImages[image.id] = image;
				});

				RobroyList.appendImages(response.data);
				window.ROBROY.grid.resizeAllItems();

				window.ROBROY.args.isLoadingImages = false;
				if (response.meta.page_number >= response.meta.total_pages) {
					window.ROBROY.args.allPagesLoaded = true;
				}

				if (response.meta.num_items !== window.ROBROY.currentNumImages) {
					window.ROBROY.currentNumImages = response.meta.num_items;
					RobroyUtilities.setNumImages();
				}

				if (response.meta.total_pages <= 0) {
					if (!RobroyEmpty.hasFolders()) {
						var $deleteFolder = document.getElementById('robroy-delete-folder');
						if ($deleteFolder) {
							$deleteFolder.style.display = '';
						}
					}
				}

				if (callback) {
					callback();
				}

				RobroyUtilities.callback('afterLoadImage');
			},
		});
	}

	static onScroll() {
		if (window.ROBROY.args.allPagesLoaded || window.ROBROY.args.isLoadingImages) {
			return;
		}

		var lastItem = document.querySelector('#robroy-images > figure:last-of-type');
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
			window.ROBROY.elements.imageList.appendChild(RobroyImage.element(image));
		});
	}

	static appendFolders(folders) {
		folders.forEach((folder) => {
			window.ROBROY.elements.folderList.appendChild(RobroyFolder.element(folder));
		});
	}
}
