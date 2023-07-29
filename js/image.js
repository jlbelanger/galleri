import GalleriApi from './api';
import GalleriErrors from './errors';
import GalleriFolder from './folder';
import GalleriModal from './modal';
import GalleriToast from './toast';
import GalleriUtilities from './utilities';

export default class GalleriImage {
	static load() {
		window.GALLERI.state.isLoadingImages = true;

		GalleriApi.request({
			url: window.GALLERI.args.apiImagesPath,
			callback: (response) => {
				if (response) {
					GalleriImage.getImagesCallback(response);
				} else {
					GalleriApi.request({
						url: `${window.GALLERI.args.apiPath}?type=images`,
						callback: (response2) => {
							GalleriImage.getImagesCallback(response2);
						},
					});
				}
			},
			errorCallback: () => {
				GalleriApi.request({
					url: `${window.GALLERI.args.apiPath}?type=images`,
					callback: (response) => {
						GalleriImage.getImagesCallback(response);
					},
				});
			},
		});
	}

	static getImagesCallback(response) {
		const currentFolderId = GalleriFolder.getCurrentFolderId();
		let images = Object.values(response.data);

		if (!window.GALLERI.args.showAllImages) {
			images = images.filter((image) => (image.attributes.folder === currentFolderId));
		}

		GalleriUtilities.modifier('images', { images });

		images.forEach((image) => {
			window.GALLERI.currentImages[image.id] = image;
		});

		GalleriImage.appendItems(images);
		if (window.GALLERI.grid) {
			window.GALLERI.grid.resizeAllItems();
		}

		window.GALLERI.state.allPagesLoaded = true;

		window.GALLERI.currentNumImages = images.length;

		if (images.length <= 0) {
			if (!GalleriFolder.hasFolders()) {
				const $deleteFolderButton = document.getElementById('galleri-delete-folder');
				if ($deleteFolderButton) {
					$deleteFolderButton.style.display = '';
				}
			}
		} else {
			const $deleteFolderButton = document.getElementById('galleri-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = 'none';
			}
		}

		window.GALLERI.state.isLoadingImages = false;

		GalleriImage.onScroll();
		window.addEventListener('scroll', GalleriUtilities.debounce(() => { GalleriImage.onScroll(); }, 100));

		GalleriUtilities.callback('afterLoadImages', { images });
	}

	static element(data, setSrc = false) {
		const $figure = document.createElement(window.GALLERI.args.imageItemElement);
		$figure.setAttribute('class', 'galleri-figure');
		$figure.setAttribute('data-path', data.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'galleri-link');
		$a.setAttribute('href', data.meta.url);
		$figure.appendChild($a);

		const $img = document.createElement('img');
		if (data.attributes.title) {
			$img.setAttribute('alt', data.attributes.title);
		}
		$img.setAttribute('class', 'galleri-img');
		$img.setAttribute('data-src', data.meta.thumbnail);
		$img.setAttribute('height', data.meta.thumbnailHeight);
		$img.setAttribute('width', data.meta.thumbnailWidth);
		$a.appendChild($img);

		if (setSrc) {
			GalleriImage.setSrc($img);

			if (GalleriUtilities.isLoggedIn()) {
				GalleriImage.addAdminControls($figure, data);
			}
		}

		GalleriUtilities.modifier('imageItem', { element: $figure, image: data });

		return $figure;
	}

	static showCreateForm() {
		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.GALLERI.args.apiPath}?type=images`);
		$form.setAttribute('enctype', 'multipart/form-data');
		$form.setAttribute('id', 'galleri-image-form');
		$form.setAttribute('method', 'post');
		$form.addEventListener('submit', GalleriImage.submitCreateFormCallback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'galleri-heading');
		$heading.innerText = window.GALLERI.lang.uploadImage;
		$form.appendChild($heading);

		const $div = document.createElement('div');
		$div.setAttribute('class', 'galleri-field');
		$div.setAttribute('id', 'galleri-field-upload');
		$form.appendChild($div);

		const $label = document.createElement('label');
		$label.setAttribute('class', 'galleri-label');
		$label.setAttribute('for', 'galleri-input-upload');
		$label.innerText = window.GALLERI.lang.fieldImageImages;
		$div.appendChild($label);

		const $fileContainer = document.createElement('div');
		$fileContainer.setAttribute('class', 'galleri-file-container');
		$div.appendChild($fileContainer);

		const $fileInput = document.createElement('input');
		$fileInput.setAttribute('accept', 'image/*');
		$fileInput.setAttribute('class', 'galleri-file-input');
		$fileInput.setAttribute('id', 'galleri-input-upload');
		$fileInput.setAttribute('name', 'upload[]');
		$fileInput.setAttribute('multiple', 'multiple');
		$fileInput.setAttribute('type', 'file');
		$fileInput.addEventListener('change', GalleriImage.onChange);
		$fileContainer.appendChild($fileInput);

		const $text = document.createElement('div');
		$text.setAttribute('class', 'galleri-file-text');
		$text.setAttribute('id', 'galleri-create-image-text');
		$text.innerText = window.GALLERI.lang.dragImagesOrClickHereToUpload;
		$fileContainer.appendChild($text);

		const $parentInput = document.createElement('input');
		$parentInput.setAttribute('name', 'folder');
		$parentInput.setAttribute('value', window.GALLERI.currentFolder.id);
		$parentInput.setAttribute('type', 'hidden');
		$form.appendChild($parentInput);

		GalleriUtilities.modifier('imageCreateForm', { addField: GalleriUtilities.addField, form: $form });

		GalleriModal.show(
			$form,
			{
				append: true,
				callback: GalleriImage.submitCreateFormCallback,
				closeButtonAttributes: {
					form: 'galleri-image-form',
					type: 'submit',
				},
				closeButtonText: window.GALLERI.lang.upload,
				showCancel: true,
			}
		);
	}

	static showEditForm(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		window.GALLERI.currentImage = window.GALLERI.currentImages[path];

		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.GALLERI.args.apiPath}?type=images&id=${window.GALLERI.currentImage.id}`);
		$form.setAttribute('id', 'galleri-image-form');
		$form.setAttribute('method', 'PUT');
		$form.addEventListener('submit', GalleriImage.submitEditFormCallback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'galleri-heading');
		$heading.innerText = window.GALLERI.lang.titleEditImage;
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'galleri-fields');
		$form.appendChild($container);

		GalleriUtilities.addField($container, 'filename', window.GALLERI.lang.fieldImageFilename);

		const $folderInput = GalleriUtilities.addField($container, 'folder', window.GALLERI.lang.fieldImageFolder, 'select');
		GalleriFolder.addFolderOptions($folderInput, window.GALLERI.currentImage.attributes.folder);

		GalleriUtilities.addField($container, 'title', window.GALLERI.lang.fieldImageTitle);

		Object.keys(window.GALLERI.currentImage.attributes).forEach((key) => {
			const $input = $form.querySelector(`#galleri-input-${key}`);
			if ($input && Object.prototype.hasOwnProperty.call(window.GALLERI.currentImage.attributes, key)) {
				$input.setAttribute('value', window.GALLERI.currentImage.attributes[key]);
			}
		});

		GalleriUtilities.modifier('imageEditForm', { addField: GalleriUtilities.addField, container: $container, form: $form });

		GalleriModal.show(
			$form,
			{
				append: true,
				callback: GalleriImage.submitEditFormCallback,
				closeButtonAttributes: {
					form: 'galleri-image-form',
					type: 'submit',
				},
				closeButtonText: window.GALLERI.lang.save,
				showCancel: true,
			}
		);
	}

	static delete(e) {
		const id = e.target.closest('[data-path]').getAttribute('data-path');
		GalleriModal.show(
			GalleriUtilities.sprintf(window.GALLERI.lang.confirmDeleteImage, id),
			{
				closeButtonText: window.GALLERI.lang.delete,
				closeButtonClass: 'galleri-button--danger',
				showCancel: true,
				callback: () => {
					GalleriImage.deleteCallback(id);
					GalleriModal.hide();
				},
			}
		);
	}

	static deleteCallback(id) {
		GalleriApi.request({
			method: 'DELETE',
			url: `${window.GALLERI.args.apiPath}?type=images&id=${id}`,
			callback: () => {
				GalleriToast.show(window.GALLERI.lang.deletedSuccessfullyImage, { class: 'galleri-toast--success' });
				GalleriImage.removeImageFromList(id);
				GalleriUtilities.callback('afterDeleteImage', { id });
			},
		});
	}

	static setThumbnail(e) {
		if (e.target.getAttribute('data-current-thumbnail')) {
			GalleriImage.removeThumbnail(e);
		} else {
			GalleriImage.makeThumbnail(e);
		}
	}

	static makeThumbnail(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		const image = window.GALLERI.currentImages[path];
		const folderId = window.GALLERI.currentFolder.id;
		const json = {
			id: folderId,
			attributes: window.GALLERI.currentFolder.attributes,
		};
		json.attributes.thumbnail = image.meta.thumbnail;

		GalleriApi.request({
			method: 'PUT',
			url: `${window.GALLERI.args.apiPath}?type=folders&id=${folderId}`,
			json: JSON.stringify(json),
			callback: () => {
				GalleriToast.show(window.GALLERI.lang.updatedSuccessfullyThumbnail, { class: 'galleri-toast--success' });

				const $thumbnailButton = document.querySelector('[data-current-thumbnail]');
				if ($thumbnailButton) {
					$thumbnailButton.innerText = window.GALLERI.lang.makeThumbnail;
					$thumbnailButton.removeAttribute('data-current-thumbnail');
				}

				e.target.innerText = window.GALLERI.lang.removeThumbnail;
				e.target.setAttribute('data-current-thumbnail', true);

				GalleriUtilities.callback('afterMakeThumbnail', { folderId, image });
			},
			errorCallback: () => {
				GalleriToast.show(window.GALLERI.lang.errorUpdatingThumbnail, { class: 'galleri-toast--danger' });
			},
		});
	}

	static removeThumbnail(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		const image = window.GALLERI.currentImages[path];
		const folderId = window.GALLERI.currentFolder.id;
		const json = {
			id: folderId,
			attributes: window.GALLERI.currentFolder.attributes,
		};
		json.attributes.thumbnail = '';

		GalleriApi.request({
			method: 'PUT',
			url: `${window.GALLERI.args.apiPath}?type=folders&id=${folderId}`,
			json: JSON.stringify(json),
			callback: () => {
				GalleriToast.show(window.GALLERI.lang.removedSuccessfullyThumbnail, { class: 'galleri-toast--success' });

				e.target.innerText = window.GALLERI.lang.makeThumbnail;
				e.target.removeAttribute('data-current-thumbnail');

				GalleriUtilities.callback('afterRemoveThumbnail', { folderId, image });
			},
			errorCallback: () => {
				GalleriToast.show(window.GALLERI.lang.errorRemovingThumbnail, { class: 'galleri-toast--danger' });
			},
		});
	}

	static submitCreateFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('galleri-image-form');
		GalleriErrors.clear($form);

		const $uploadInput = document.getElementById('galleri-input-upload');
		if ($uploadInput.files.length <= 0) {
			GalleriErrors.add($uploadInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);

		GalleriApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			formData,
			callback: (response) => {
				GalleriImage.createRequestCallback(response);
			},
			errorCallback: (response, status) => {
				GalleriErrors.show(response, status);
			},
		});
	}

	static createRequestCallback(response) {
		GalleriToast.show(window.GALLERI.lang.createdSuccessfullyImage, { class: 'galleri-toast--success' });

		GalleriImage.prependItems(response.data);

		if (window.GALLERI.grid) {
			window.GALLERI.grid.resizeAllItems();
		}

		response.data.forEach((image) => {
			window.GALLERI.currentImages[image.id] = image;
		});

		window.GALLERI.currentNumImages += response.data.length;
		GalleriUtilities.setNumImages();

		document.getElementById('galleri-input-upload').value = '';
		document.getElementById('galleri-create-image-text').innerText = window.GALLERI.lang.dragImagesOrClickHereToUpload;

		const $deleteFolderButton = document.getElementById('galleri-delete-folder');
		if ($deleteFolderButton) {
			$deleteFolderButton.style.display = 'none';
		}

		GalleriUtilities.callback('afterCreateImage', { image: response.data });
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('galleri-image-form');
		GalleriErrors.clear($form);

		const $filenameInput = document.getElementById('galleri-input-filename');
		if (!$filenameInput.value) {
			GalleriErrors.add($filenameInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);
		let json = {};
		let oldJson = {};
		formData.forEach((value, key) => {
			json[key] = value;
			if (Object.prototype.hasOwnProperty.call(window.GALLERI.currentImage.attributes, key)) {
				oldJson[key] = window.GALLERI.currentImage.attributes[key];
			} else {
				oldJson[key] = '';
			}
		});
		json = JSON.stringify(json);
		oldJson = JSON.stringify(oldJson);

		if (json === oldJson) {
			GalleriToast.show(window.GALLERI.lang.nothingToSave);
			GalleriModal.hide(e);
			return;
		}

		GalleriApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			json,
			callback: (response) => {
				GalleriImage.editRequestCallback(e, response);
			},
			errorCallback: (response, status) => {
				GalleriErrors.show(response, status);
			},
		});
	}

	static editRequestCallback(e, response) {
		GalleriToast.show(window.GALLERI.lang.updatedSuccessfullyImage, { class: 'galleri-toast--success' });

		const $folderInput = document.getElementById('galleri-input-folder');
		const hasFolderChanged = $folderInput.value !== window.GALLERI.currentImage.attributes.folder;
		if (hasFolderChanged) {
			GalleriImage.removeImageFromList(window.GALLERI.currentImage.id);
		} else {
			GalleriImage.updateImage(window.GALLERI.currentImage.id, response.data);
		}

		delete window.GALLERI.currentImages[window.GALLERI.currentImage.id];
		window.GALLERI.currentImages[response.data.id] = response.data;
		window.GALLERI.currentImage = null;

		GalleriModal.hide(e);
		GalleriUtilities.callback('afterEditImage', { image: response.data });
	}

	static appendItems(images) {
		const elements = images.map((image) => GalleriImage.element(image));
		window.GALLERI.elements.$imageList.append(...elements);
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.GALLERI.elements.$imageList.prepend(GalleriImage.element(item, true));
		});
	}

	static removeImageFromList(id) {
		const $container = document.querySelector(`[data-path="${id}"]`);
		let $nextLink;
		if ($container.nextSibling) {
			$nextLink = $container.nextSibling.querySelector('button');
		}
		if (!$nextLink && $container.previousSibling) {
			$nextLink = $container.previousSibling.querySelector('button');
		}
		$container.remove();

		window.GALLERI.currentNumImages -= 1;
		GalleriUtilities.setNumImages();

		if (GalleriImage.hasImages()) {
			if (window.GALLERI.grid) {
				window.GALLERI.grid.resizeAllItems();
			}
			if ($nextLink) {
				$nextLink.focus();
			}
		} else if (!GalleriFolder.hasFolders()) {
			const $deleteFolderButton = document.getElementById('galleri-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = '';
			}
		}
	}

	static onChange(e) {
		const files = [...e.target.files];
		const filenames = files.map((file) => file.name);

		document.getElementById('galleri-create-image-text').innerText = filenames.join(', ');
	}

	static updateImage(path, image) {
		const $container = document.querySelector(`[data-path="${path}"]`);
		$container.setAttribute('data-path', image.id);

		const $a = $container.querySelector('.galleri-link');
		$a.setAttribute('href', image.meta.url);

		const $img = $container.querySelector('.galleri-img');
		if (image.attributes.title) {
			$img.setAttribute('alt', image.attributes.title);
		} else {
			$img.removeAttribute('alt');
		}

		GalleriUtilities.callback('afterUpdateImage', { image, element: $container });
	}

	static view(e) {
		e.target.closest('[data-path]').querySelector('.galleri-link').click();
	}

	static getImages() {
		return document.querySelectorAll(`#galleri-images > ${window.GALLERI.args.imageItemElement}`);
	}

	static hasImages() {
		return GalleriImage.getImages().length > 0;
	}

	static addAdminControls($container, data) {
		if ($container.querySelector('.galleri-admin')) {
			return;
		}

		const $div = document.createElement('div');
		$div.setAttribute('class', 'galleri-admin galleri-button-container');
		$container.appendChild($div);

		const $viewButton = document.createElement('button');
		$viewButton.setAttribute('class', 'galleri-button');
		$viewButton.setAttribute('href', 'button');
		$viewButton.innerText = window.GALLERI.lang.view;
		$viewButton.addEventListener('click', GalleriImage.view);
		$div.appendChild($viewButton);

		const $editButton = document.createElement('button');
		$editButton.setAttribute('class', 'galleri-button galleri-button--secondary');
		$editButton.setAttribute('type', 'button');
		$editButton.innerText = window.GALLERI.lang.edit;
		$editButton.addEventListener('click', GalleriImage.showEditForm);
		$div.appendChild($editButton);

		if (data.attributes.folder) {
			const $thumbnailButton = document.createElement('button');
			$thumbnailButton.setAttribute('class', 'galleri-button galleri-button--secondary');
			$thumbnailButton.setAttribute('href', 'button');
			$thumbnailButton.setAttribute('data-thumbnail-button', true);
			$thumbnailButton.addEventListener('click', GalleriImage.setThumbnail);
			const folder = window.GALLERI.folders[data.attributes.folder];
			if (folder && folder.attributes.thumbnail === data.meta.thumbnail) {
				$thumbnailButton.setAttribute('data-current-thumbnail', true);
				$thumbnailButton.innerText = window.GALLERI.lang.removeThumbnail;
			} else {
				$thumbnailButton.innerText = window.GALLERI.lang.makeThumbnail;
			}
			$div.appendChild($thumbnailButton);
		}

		const $deleteButton = document.createElement('button');
		$deleteButton.setAttribute('class', 'galleri-button galleri-button--danger');
		$deleteButton.setAttribute('type', 'button');
		$deleteButton.innerText = window.GALLERI.lang.delete;
		$deleteButton.addEventListener('click', GalleriImage.delete);
		$div.appendChild($deleteButton);

		if (window.GALLERI.args.removePointerEventsOnLogin) {
			const $link = $container.querySelector('.galleri-link');
			$link.style.pointerEvents = 'none';
			$link.setAttribute('tabindex', -1);
		}
	}

	static onScroll() {
		const $images = document.querySelectorAll('[data-src]');
		const browserHeight = window.innerHeight;
		const offsetFromTopOfPage = window.scrollY;
		const buffer = browserHeight;
		const max = offsetFromTopOfPage + browserHeight + buffer;

		$images.forEach(($img) => {
			const topOfImage = $img.getBoundingClientRect().top;
			if (topOfImage <= max) {
				GalleriImage.setSrc($img);
			}
		});
	}

	static setSrc($img) {
		const src = $img.getAttribute('data-src');
		$img.setAttribute('src', src);
		$img.removeAttribute('data-src');

		$img.closest('.galleri-link').style.backgroundImage = `url("${src}")`;

		GalleriUtilities.callback('afterLoadImage', { element: $img });
	}
}
