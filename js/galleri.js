import GalleriAuth from './auth';
import GalleriFolder from './folder';
import GalleriGrid from './grid';
import GalleriImage from './image';
import GalleriUtilities from './utilities';

export default class Galleri {
	constructor(args) {
		args = args || {};
		args.apiFoldersPath = args.apiFoldersPath || '/json/folders.json';
		args.apiImagesPath = args.apiImagesPath || '/json/images.json';
		args.apiPath = args.apiPath || '/api.php';
		args.callbacks = args.callbacks || {};
		args.enableGrid = GalleriUtilities.propertyExists(args, 'enableGrid') ? args.enableGrid : true;
		args.enableRewrites = GalleriUtilities.propertyExists(args, 'enableRewrites') ? args.enableRewrites : true;
		args.folderItemElement = args.folderItemElement || 'li';
		args.folderSeparator = args.folderSeparator || ' > ';
		args.imageItemElement = args.imageItemElement || 'figure';
		args.localStorageKey = args.localStorageKey || 'authenticated';
		args.maxFileSizeMegabytes = args.maxFileSizeMegabytes || null;
		args.metaTitleSeparator = args.metaTitleSeparator || ' | ';
		args.modifiers = args.modifiers || {};
		args.pageSize = args.pageSize || 8;
		args.removePointerEventsOnLogin = GalleriUtilities.propertyExists(args, 'removePointerEventsOnLogin')
			? args.removePointerEventsOnLogin : true;
		args.selector = args.selector || '#galleri';
		args.showAllImages = GalleriUtilities.propertyExists(args, 'showAllImages') ? args.showAllImages : false;
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
		lang.error = lang.error || 'Error: ';
		lang.errorFileSize = lang.errorFileSize || '%s is too large. (Maximum size is %s MB.)';
		lang.errorFolderDoesNotExist = lang.errorFolderDoesNotExist || 'This folder does not exist.';
		lang.errorInvalidUsername = lang.errorInvalidUsername || 'Invalid username or password.';
		lang.errorUpdatingThumbnail = lang.errorUpdatingThumbnail || 'Error updating thumbnail.';
		lang.errorRemovingThumbnail = lang.errorRemovingThumbnail || 'Error removing thumbnail.';
		lang.errorStatus = lang.errorStatus || 'The server returned a %s error.';
		lang.fieldFolderId = lang.fieldFolderId || 'ID';
		lang.fieldFolderName = lang.fieldFolderName || 'Name';
		lang.fieldFolderParent = lang.fieldFolderParent || 'Parent';
		lang.fieldFolderThumbnail = lang.fieldFolderThumbnail || 'Thumbnail';
		lang.fieldImageImages = lang.fieldImageImages || 'Images';
		lang.fieldImageFilename = lang.fieldImageFilename || 'Filename';
		lang.fieldImageTitle = lang.fieldImageTitle || 'Title';
		lang.fieldImageFolder = lang.fieldImageFolder || 'Folder';
		lang.home = lang.home || 'Home';
		lang.loading = lang.loading || 'Loading...';
		lang.logIn = lang.logIn || 'Log In';
		lang.logOut = lang.logOut || 'Log Out';
		lang.makeThumbnail = lang.makeThumbnail || 'Make Thumbnail';
		lang.nothingToSave = lang.nothingToSave || 'Nothing to save.';
		lang.ok = lang.ok || 'OK';
		lang.pluralImageText = lang.pluralImageText || 'images';
		lang.removeThumbnail = lang.removeThumbnail || 'Remove Thumbnail';
		lang.removedSuccessfullyThumbnail = lang.removedSuccessfullyThumbnail || 'Thumbnail removed successfully.';
		lang.save = lang.save || 'Save';
		lang.singularImageText = lang.singularImageText || 'image';
		lang.submitCreateFolder = lang.submitCreateFolder || 'Create';
		lang.submitEditFolder = lang.submitEditFolder || 'Save';
		lang.titleCreateFolder = lang.titleCreateFolder || 'Create Folder';
		lang.titleEditFolder = lang.titleEditFolder || 'Edit Folder';
		lang.titleEditImage = lang.titleEditImage || 'Edit Image';
		lang.updatedSuccessfullyImage = lang.updatedSuccessfullyImage || 'Image updated successfully.';
		lang.updatedSuccessfullyFolder = lang.updatedSuccessfullyFolder || 'Folder updated successfully.';
		lang.updatedSuccessfullyThumbnail = lang.updatedSuccessfullyThumbnail || 'Thumbnail updated successfully.';
		lang.upload = lang.upload || 'Upload';
		lang.uploadImage = lang.uploadImage || 'Upload Image';
		lang.validationRequired = lang.validationRequired || 'Error: This field is required.';
		lang.view = lang.view || 'View';
		this.lang = lang;

		const $folderList = document.createElement('ul');
		$folderList.setAttribute('id', 'galleri-folders');
		$container.appendChild($folderList);

		const $imageList = document.createElement('div');
		$imageList.setAttribute('id', 'galleri-images');
		$container.appendChild($imageList);

		this.elements = {
			$authenticateButton: document.querySelector('[data-action="authenticate"]'),
			$container,
			$folderList,
			$imageList,
		};
		this.state = {
			isLoadingFolder: false,
			isLoadingImages: false,
			numRequestsInProgress: 0,
		};
		this.currentFolder = null;
		this.currentImage = null;
		this.currentImages = {};
		this.currentNumImages = null;
		this.folders = [];
	}

	static init(args) {
		if (!GalleriUtilities.propertyExists(window, 'GALLERI')) {
			window.GALLERI = new Galleri(args);
			if (!window.GALLERI.elements.$imageList) {
				return null;
			}
			GalleriFolder.load();
			GalleriImage.load();
			if (args.enableGrid) {
				window.GALLERI.grid = new GalleriGrid();
			}
			let int = setInterval(() => {
				if (!window.GALLERI.state.isLoadingFolder && !window.GALLERI.state.isLoadingImages) {
					GalleriAuth.init();
					GalleriUtilities.setNumImages();
					clearInterval(int);
					int = null;
				}
			}, 250);
		}
		return window.GALLERI;
	}
}
