import RobroyGrid from './grid';
import RobroyList from './list';
import RobroyUtilities from './utilities';

export default class Robroy {
	constructor(args) {
		args = args || {};
		args.allPagesLoaded = false;
		args.apiPath = args.apiPath || '/api.php';
		args.attributes = args.attributes || {};
		args.callbacks = args.callbacks || {};
		args.isLoadingImages = false;
		args.metaTitleSeparator = args.metaTitleSeparator || ' | ';
		args.pageNumber = 0;
		args.pageSize = args.pageSize || 8;
		args.rootFolderName = args.rootFolderName || 'Home';
		args.selector = args.selector || '#robroy';
		args.showAllImages = args.showAllImages || false;
		args.singularImageText = args.singularImageText || 'image';
		args.pluralImageText = args.pluralImageText || 'images';
		this.args = args;

		var container = document.querySelector(args.selector);
		if (!container) {
			return;
		}

		var header = document.createElement('div');
		header.setAttribute('id', 'robroy-folder-header');
		container.appendChild(header);

		var folderList = document.createElement('ul');
		folderList.setAttribute('id', 'robroy-folders');
		header.appendChild(folderList);

		var numImages = document.createElement('p');
		numImages.setAttribute('id', 'robroy-num');
		header.appendChild(numImages);

		var imageList = document.createElement('div');
		imageList.setAttribute('id', 'robroy-images');
		container.appendChild(imageList);

		var urlSearchParams = new URLSearchParams(window.location.search);
		var currentFolderId = urlSearchParams.get('folder');

		this.auth = document.querySelector('[data-action="authenticate"]');
		this.container = container;
		this.elements = {
			folderList,
			imageList,
			numImages,
		};
		this.currentFolderId = currentFolderId || '';
		this.currentFolder = null;
		this.currentImage = null;
		this.currentImages = {};
		this.currentNumImages = null;
		this.folders = [];
	}

	static init(args) {
		if (!RobroyUtilities.propertyExists(window, 'ROBROY')) {
			window.ROBROY = new Robroy(args);
			if (!window.ROBROY.elements.imageList) {
				return null;
			}
			RobroyList.init();
			window.ROBROY.grid = new RobroyGrid();
		}
		return window.ROBROY;
	}
}
