import RobroyGrid from './grid';
import RobroyList from './list';
import RobroyUtilities from './utilities';

export default class Robroy {
	constructor(args) {
		args = args || {};
		args.apiFoldersPath = args.apiFoldersPath || '/json/folders.json';
		args.apiPath = args.apiPath || '/api.php';
		args.callbacks = args.callbacks || {};
		args.enableGrid = RobroyUtilities.propertyExists(args, 'enableGrid') ? args.enableGrid : true;
		args.folderItemElement = args.folderItemElement || 'li';
		args.folderSeparator = args.folderSeparator || ' > ';
		args.imageItemElement = args.imageItemElement || 'figure';
		args.localStorageKey = args.localStorageKey || 'authenticated';
		args.metaTitleSeparator = args.metaTitleSeparator || ' | ';
		args.modifiers = args.modifiers || {};
		args.pageSize = args.pageSize || 8;
		args.removePointerEventsOnLogin = RobroyUtilities.propertyExists(args, 'removePointerEventsOnLogin') ? args.removePointerEventsOnLogin : true;
		args.selector = args.selector || '#robroy';
		args.showAllImages = args.showAllImages || false;
		this.args = args;

		const $container = document.querySelector(args.selector);
		if (!$container) {
			return;
		}

		const lang = args.lang || {};
		lang.cancel = lang.cancel || 'Cancel';
		lang.close = lang.close || 'Close';
		lang.confirmDeleteFolder = lang.confirmDeleteFolder || 'Are you sure you want to delete the folder "%s"?';
		lang.confirmDeleteImage = lang.confirmDeleteImage || 'Are you sure you want to delete the image "%s"?';
		lang.createdSuccessfullyImage = lang.createdSuccessfullyImage || 'Image uploaded successfully.';
		lang.createdSuccessfullyFolder = lang.createdSuccessfullyFolder || 'Folder created successfully.';
		lang.createFolder = lang.createFolder || 'Create Folder';
		lang.delete = lang.delete || 'Delete';
		lang.deletedSuccessfullyImage = lang.deletedSuccessfullyImage || 'Image deleted successfully.';
		lang.deletedSuccessfullyFolder = lang.deletedSuccessfullyFolder || 'Folder deleted successfully.';
		lang.deleteFolder = lang.deleteFolder || 'Delete Folder';
		lang.dragImagesOrClickHereToUpload = lang.dragImagesOrClickHereToUpload || 'Drag images or click here to upload.';
		lang.edit = lang.edit || 'Edit';
		lang.editFolder = lang.editFolder || 'Edit Folder';
		lang.errorFolderDoesNotExist = lang.errorFolderDoesNotExist || 'Error: This folder does not exist.';
		lang.errorInvalidUsername = lang.errorInvalidUsername || 'Error: Invalid username or password.';
		lang.errorStatus = lang.errorStatus || 'Error: The server returned a %s error.';
		lang.fieldFolderName = lang.fieldFolderName || 'Name';
		lang.fieldFolderParent = lang.fieldFolderParent || 'Parent';
		lang.fieldImageFilename = lang.fieldImageFilename || 'Filename';
		lang.fieldImageFolder = lang.fieldImageFolder || 'Folder';
		lang.home = lang.home || 'Home';
		lang.loading = lang.loading || 'Loading...';
		lang.logIn = lang.logIn || 'Log In';
		lang.logOut = lang.logOut || 'Log Out';
		lang.nothingToSave = lang.nothingToSave || 'Nothing to save.';
		lang.ok = lang.ok || 'OK';
		lang.pluralImageText = lang.pluralImageText || 'images';
		lang.save = lang.save || 'Save';
		lang.singularImageText = lang.singularImageText || 'image';
		lang.submitCreateFolder = lang.submitCreateFolder || 'Create';
		lang.submitEditFolder = lang.submitEditFolder || 'Save';
		lang.titleCreateFolder = lang.titleCreateFolder || 'Create Folder';
		lang.titleEditFolder = lang.titleEditFolder || 'Edit Folder';
		lang.titleEditImage = lang.titleEditImage || 'Edit Image';
		lang.updatedSuccessfullyImage = lang.updatedSuccessfullyImage || 'Image updated successfully.';
		lang.updatedSuccessfullyFolder = lang.updatedSuccessfullyFolder || 'Folder updated successfully.';
		lang.upload = lang.upload || 'Upload';
		lang.uploadImage = lang.uploadImage || 'Upload Image';
		lang.validationRequired = lang.validationRequired || 'Error: This field is required.';
		lang.view = lang.view || 'View';
		this.lang = lang;

		const $header = document.createElement('div');
		$header.setAttribute('id', 'robroy-folder-header');
		$container.appendChild($header);

		const $folderList = document.createElement('ul');
		$folderList.setAttribute('id', 'robroy-folders');
		$header.appendChild($folderList);

		const $numImages = document.createElement('p');
		$numImages.setAttribute('id', 'robroy-num');
		$header.appendChild($numImages);

		const $imageList = document.createElement('div');
		$imageList.setAttribute('id', 'robroy-images');
		$container.appendChild($imageList);

		const urlSearchParams = new URLSearchParams(window.location.search);
		const currentFolderId = urlSearchParams.get('folder');

		this.elements = {
			$authenticateButton: document.querySelector('[data-action="authenticate"]'),
			$container,
			$folderList,
			$imageList,
			$numImages,
		};
		this.state = {
			allPagesLoaded: false,
			isLoadingImages: false,
			pageNumber: 0,
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
			if (!window.ROBROY.elements.$imageList) {
				return null;
			}
			RobroyList.init();
			if (args.enableGrid) {
				window.ROBROY.grid = new RobroyGrid();
			}
		}
		return window.ROBROY;
	}
}
