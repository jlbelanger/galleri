import RobroyApi from './api';
import RobroyErrors from './errors';
import RobroyFolder from './folder';
import RobroyModal from './modal';
import RobroyToast from './toast';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static load() {
		window.ROBROY.state.isLoadingImages = true;

		RobroyApi.request({
			url: window.ROBROY.args.apiImagesPath,
			callback: (response) => {
				if (response) {
					RobroyImage.getImagesCallback(response);
				} else {
					RobroyApi.request({
						url: `${window.ROBROY.args.apiPath}?type=images`,
						callback: (response2) => {
							RobroyImage.getImagesCallback(response2);
						},
					});
				}
			},
			errorCallback: () => {
				RobroyApi.request({
					url: `${window.ROBROY.args.apiPath}?type=images`,
					callback: (response) => {
						RobroyImage.getImagesCallback(response);
					},
				});
			},
		});
	}

	static getImagesCallback(response) {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const currentFolderId = urlSearchParams.get('folder') || '';
		let images = Object.values(response.data);

		if (!window.ROBROY.args.showAllImages) {
			images = images.filter((image) => (image.attributes.folder === currentFolderId));
		}

		images.forEach((image) => {
			window.ROBROY.currentImages[image.id] = image;
		});

		RobroyImage.appendItems(images);
		if (window.ROBROY.grid) {
			window.ROBROY.grid.resizeAllItems();
		}

		window.ROBROY.state.allPagesLoaded = true;

		window.ROBROY.currentNumImages = images.length;

		if (images.length <= 0) {
			if (!RobroyFolder.hasFolders()) {
				const $deleteFolderButton = document.getElementById('robroy-delete-folder');
				if ($deleteFolderButton) {
					$deleteFolderButton.style.display = '';
				}
			}
		} else {
			const $deleteFolderButton = document.getElementById('robroy-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = 'none';
			}
		}

		window.ROBROY.state.isLoadingImages = false;

		RobroyImage.onScroll();
		window.addEventListener('scroll', RobroyUtilities.debounce(() => { RobroyImage.onScroll(); }, 100));

		RobroyUtilities.callback('afterLoadImages', { images });
	}

	static element(data, setSrc = false) {
		const $figure = document.createElement(window.ROBROY.args.imageItemElement);
		$figure.setAttribute('class', 'robroy-figure');
		$figure.setAttribute('data-path', data.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-link');
		$a.setAttribute('href', data.meta.url);
		$figure.appendChild($a);

		const $img = document.createElement('img');
		if (data.attributes.title) {
			$img.setAttribute('alt', data.attributes.title);
		}
		$img.setAttribute('class', 'robroy-img');
		$img.setAttribute('data-src', data.meta.thumbnail);
		$img.setAttribute('height', data.meta.thumbnailHeight);
		$img.setAttribute('width', data.meta.thumbnailWidth);
		$a.appendChild($img);

		if (setSrc) {
			RobroyImage.setSrc($img);
		}

		if (RobroyUtilities.isLoggedIn()) {
			RobroyImage.addAdminControls($figure);
		}

		RobroyUtilities.modifier('imageItem', { element: $figure });

		return $figure;
	}

	static showCreateForm() {
		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=images`);
		$form.setAttribute('enctype', 'multipart/form-data');
		$form.setAttribute('id', 'robroy-image-form');
		$form.setAttribute('method', 'post');
		$form.addEventListener('submit', RobroyImage.submitCreateFormCallback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'robroy-heading');
		$heading.innerText = window.ROBROY.lang.uploadImage;
		$form.appendChild($heading);

		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-field');
		$div.setAttribute('id', 'robroy-field-upload');
		$form.appendChild($div);

		const $label = document.createElement('label');
		$label.setAttribute('class', 'robroy-label');
		$label.setAttribute('for', 'robroy-input-upload');
		$label.innerText = window.ROBROY.lang.fieldImageImages;
		$div.appendChild($label);

		const $fileContainer = document.createElement('div');
		$fileContainer.setAttribute('class', 'robroy-file-container');
		$div.appendChild($fileContainer);

		const $fileInput = document.createElement('input');
		$fileInput.setAttribute('accept', 'image/*');
		$fileInput.setAttribute('class', 'robroy-file-input');
		$fileInput.setAttribute('id', 'robroy-input-upload');
		$fileInput.setAttribute('name', 'upload[]');
		$fileInput.setAttribute('multiple', 'multiple');
		$fileInput.setAttribute('type', 'file');
		$fileInput.addEventListener('change', RobroyImage.onChange);
		$fileContainer.appendChild($fileInput);

		const $text = document.createElement('div');
		$text.setAttribute('class', 'robroy-file-text');
		$text.setAttribute('id', 'robroy-create-image-text');
		$text.innerText = window.ROBROY.lang.dragImagesOrClickHereToUpload;
		$fileContainer.appendChild($text);

		const $parentInput = document.createElement('input');
		$parentInput.setAttribute('name', 'folder');
		$parentInput.setAttribute('value', window.ROBROY.currentFolder.id);
		$parentInput.setAttribute('type', 'hidden');
		$form.appendChild($parentInput);

		RobroyUtilities.modifier('imageCreateForm', { addField: RobroyUtilities.addField, form: $form });

		RobroyModal.show(
			$form,
			{
				append: true,
				callback: RobroyImage.submitCreateFormCallback,
				closeButtonAttributes: {
					form: 'robroy-image-form',
					type: 'submit',
				},
				closeButtonText: window.ROBROY.lang.upload,
				showCancel: true,
			}
		);
	}

	static showEditForm(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		window.ROBROY.currentImage = window.ROBROY.currentImages[path];

		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=images&id=${window.ROBROY.currentImage.id}`);
		$form.setAttribute('id', 'robroy-image-form');
		$form.setAttribute('method', 'PUT');
		$form.addEventListener('submit', RobroyImage.submitEditFormCallback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'robroy-heading');
		$heading.innerText = window.ROBROY.lang.titleEditImage;
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'robroy-fields');
		$form.appendChild($container);

		RobroyUtilities.addField($container, 'filename', window.ROBROY.lang.fieldImageFilename);

		const $folderInput = RobroyUtilities.addField($container, 'folder', window.ROBROY.lang.fieldImageFolder, 'select');
		RobroyFolder.addFolderOptions($folderInput, window.ROBROY.currentImage.attributes.folder);

		RobroyUtilities.addField($container, 'title', window.ROBROY.lang.fieldImageTitle);

		Object.keys(window.ROBROY.currentImage.attributes).forEach((key) => {
			const $input = $form.querySelector(`#robroy-input-${key}`);
			if ($input && Object.prototype.hasOwnProperty.call(window.ROBROY.currentImage.attributes, key)) {
				$input.setAttribute('value', window.ROBROY.currentImage.attributes[key]);
			}
		});

		RobroyUtilities.modifier('imageEditForm', { addField: RobroyUtilities.addField, container: $container, form: $form });

		RobroyModal.show(
			$form,
			{
				append: true,
				callback: RobroyImage.submitEditFormCallback,
				closeButtonAttributes: {
					form: 'robroy-image-form',
					type: 'submit',
				},
				closeButtonText: window.ROBROY.lang.save,
				showCancel: true,
			}
		);
	}

	static delete(e) {
		const id = e.target.closest('[data-path]').getAttribute('data-path');
		RobroyModal.show(
			RobroyUtilities.sprintf(window.ROBROY.lang.confirmDeleteImage, id),
			{
				closeButtonText: window.ROBROY.lang.delete,
				closeButtonClass: 'robroy-button--danger',
				showCancel: true,
				callback: () => {
					RobroyImage.deleteCallback(id);
					RobroyModal.hide();
				},
			}
		);
	}

	static deleteCallback(id) {
		RobroyApi.request({
			method: 'DELETE',
			url: `${window.ROBROY.args.apiPath}?type=images&id=${id}`,
			callback: () => {
				RobroyToast.show(window.ROBROY.lang.deletedSuccessfullyImage, { class: 'robroy-toast--success' });
				RobroyImage.removeImageFromList(id);
				RobroyUtilities.callback('afterDeleteImage', { id });
			},
		});
	}

	static submitCreateFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-image-form');
		RobroyErrors.clear($form);

		const $uploadInput = document.getElementById('robroy-input-upload');
		if ($uploadInput.files.length <= 0) {
			RobroyErrors.add($uploadInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			formData,
			callback: (response) => {
				RobroyImage.createRequestCallback(response);
			},
			errorCallback: (response, status) => {
				RobroyErrors.show(response, status);
			},
		});
	}

	static createRequestCallback(response) {
		RobroyToast.show(window.ROBROY.lang.createdSuccessfullyImage, { class: 'robroy-toast--success' });

		RobroyImage.prependItems(response.data);

		if (window.ROBROY.grid) {
			window.ROBROY.grid.resizeAllItems();
		}

		response.data.forEach((image) => {
			window.ROBROY.currentImages[image.id] = image;
		});

		window.ROBROY.currentNumImages += response.data.length;
		RobroyUtilities.setNumImages();

		document.getElementById('robroy-input-upload').value = '';
		document.getElementById('robroy-create-image-text').innerText = window.ROBROY.lang.dragImagesOrClickHereToUpload;

		const $deleteFolderButton = document.getElementById('robroy-delete-folder');
		if ($deleteFolderButton) {
			$deleteFolderButton.style.display = 'none';
		}

		RobroyUtilities.callback('afterCreateImage', { image: response.data });
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-image-form');
		RobroyErrors.clear($form);

		const $filenameInput = document.getElementById('robroy-input-filename');
		if (!$filenameInput.value) {
			RobroyErrors.add($filenameInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);
		let json = {};
		let oldJson = {};
		formData.forEach((value, key) => {
			json[key] = value;
			if (Object.prototype.hasOwnProperty.call(window.ROBROY.currentImage.attributes, key)) {
				oldJson[key] = window.ROBROY.currentImage.attributes[key];
			} else {
				oldJson[key] = '';
			}
		});
		json = JSON.stringify(json);
		oldJson = JSON.stringify(oldJson);

		if (json === oldJson) {
			RobroyToast.show(window.ROBROY.lang.nothingToSave);
			RobroyModal.hide(e);
			return;
		}

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			json,
			callback: (response) => {
				RobroyImage.editRequestCallback(e, response);
			},
			errorCallback: (response, status) => {
				RobroyErrors.show(response, status);
			},
		});
	}

	static editRequestCallback(e, response) {
		RobroyToast.show(window.ROBROY.lang.updatedSuccessfullyImage, { class: 'robroy-toast--success' });

		const $folderInput = document.getElementById('robroy-input-folder');
		const hasFolderChanged = $folderInput.value !== window.ROBROY.currentImage.attributes.folder;
		if (hasFolderChanged) {
			RobroyImage.removeImageFromList(window.ROBROY.currentImage.id);
		} else {
			RobroyImage.updateImage(window.ROBROY.currentImage.id, response.data);
		}

		delete window.ROBROY.currentImages[window.ROBROY.currentImage.id];
		window.ROBROY.currentImages[response.data.id] = response.data;
		window.ROBROY.currentImage = null;

		RobroyModal.hide(e);
		RobroyUtilities.callback('afterEditImage', { image: response.data });
	}

	static appendItems(images) {
		const elements = images.map((image) => RobroyImage.element(image));
		window.ROBROY.elements.$imageList.append(...elements);
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.elements.$imageList.prepend(RobroyImage.element(item, true));
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

		window.ROBROY.currentNumImages -= 1;
		RobroyUtilities.setNumImages();

		if (RobroyImage.hasImages()) {
			if (window.ROBROY.grid) {
				window.ROBROY.grid.resizeAllItems();
			}
			if ($nextLink) {
				$nextLink.focus();
			}
		} else if (!RobroyFolder.hasFolders()) {
			const $deleteFolderButton = document.getElementById('robroy-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = '';
			}
		}
	}

	static onChange(e) {
		const files = [...e.target.files];
		const filenames = files.map((file) => file.name);

		document.getElementById('robroy-create-image-text').innerText = filenames.join(', ');
	}

	static updateImage(path, image) {
		const $container = document.querySelector(`[data-path="${path}"]`);
		$container.setAttribute('data-path', image.id);

		const $a = $container.querySelector('.robroy-link');
		$a.setAttribute('href', image.meta.url);

		const $img = $container.querySelector('.robroy-img');
		if (image.attributes.title) {
			$img.setAttribute('alt', image.attributes.title);
		} else {
			$img.removeAttribute('alt');
		}

		RobroyUtilities.callback('afterUpdateImage', { image, element: $container });
	}

	static view(e) {
		e.target.closest('[data-path]').querySelector('.robroy-link').click();
	}

	static getImages() {
		return document.querySelectorAll(`#robroy-images > ${window.ROBROY.args.imageItemElement}`);
	}

	static hasImages() {
		return RobroyImage.getImages().length > 0;
	}

	static addAdminControls($container) {
		if ($container.querySelector('.robroy-admin')) {
			return;
		}

		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-admin robroy-button-container');
		$container.appendChild($div);

		const $viewButton = document.createElement('button');
		$viewButton.setAttribute('class', 'robroy-button');
		$viewButton.setAttribute('href', 'button');
		$viewButton.innerText = window.ROBROY.lang.view;
		$viewButton.addEventListener('click', RobroyImage.view);
		$div.appendChild($viewButton);

		const $editButton = document.createElement('button');
		$editButton.setAttribute('class', 'robroy-button robroy-button--secondary');
		$editButton.setAttribute('type', 'button');
		$editButton.innerText = window.ROBROY.lang.edit;
		$editButton.addEventListener('click', RobroyImage.showEditForm);
		$div.appendChild($editButton);

		const $deleteButton = document.createElement('button');
		$deleteButton.setAttribute('class', 'robroy-button robroy-button--danger');
		$deleteButton.setAttribute('type', 'button');
		$deleteButton.innerText = window.ROBROY.lang.delete;
		$deleteButton.addEventListener('click', RobroyImage.delete);
		$div.appendChild($deleteButton);

		if (window.ROBROY.args.removePointerEventsOnLogin) {
			const $link = $container.querySelector('.robroy-link');
			$link.style.pointerEvents = 'none';
			$link.setAttribute('tabindex', -1);
		}
	}

	static onScroll() {
		const $images = document.querySelectorAll('[data-src]');
		const browserHeight = window.innerHeight;
		const offsetFromTopOfPage = window.pageYOffset;
		const buffer = browserHeight;
		const max = offsetFromTopOfPage + browserHeight + buffer;

		$images.forEach(($img) => {
			const topOfImage = $img.getBoundingClientRect().top;
			if (topOfImage <= max) {
				RobroyImage.setSrc($img);
			}
		});
	}

	static setSrc($img) {
		const src = $img.getAttribute('data-src');
		$img.setAttribute('src', src);
		$img.removeAttribute('data-src');

		$img.closest('.robroy-link').style.backgroundImage = `url("${src}")`;

		RobroyUtilities.callback('afterLoadImage', { element: $img });
	}
}
