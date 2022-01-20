import RobroyApi from './api';
import RobroyFolder from './folder';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static element(image) {
		const $figure = document.createElement(window.ROBROY.args.imageItemElement);
		$figure.setAttribute('class', 'robroy-figure');
		$figure.setAttribute('data-path', image.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-link');
		$a.setAttribute('href', image.attributes.url);
		$a.style.backgroundImage = `url("${image.attributes.thumbnail}")`;
		$figure.appendChild($a);

		const $img = document.createElement('img');
		$img.setAttribute('class', 'robroy-img');
		$img.setAttribute('src', image.attributes.thumbnail);
		$img.setAttribute('height', image.attributes.thumbnailHeight);
		$img.setAttribute('width', image.attributes.thumbnailWidth);
		$a.appendChild($img);

		if (RobroyUtilities.isLoggedIn()) {
			RobroyImage.addEditControls($figure);
		}

		RobroyUtilities.modifier('imageItem', { element: $figure });

		return $figure;
	}

	static addEditControls($container) {
		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-button-container');
		$container.appendChild($div);

		const $viewButton = document.createElement('button');
		$viewButton.setAttribute('class', 'robroy-admin robroy-button');
		$viewButton.setAttribute('href', 'button');
		$viewButton.innerText = window.ROBROY.lang.view;
		$viewButton.addEventListener('click', RobroyImage.view);
		$div.appendChild($viewButton);

		const $deleteButton = document.createElement('button');
		$deleteButton.setAttribute('class', 'robroy-admin robroy-button robroy-button--danger');
		$deleteButton.setAttribute('type', 'button');
		$deleteButton.innerText = window.ROBROY.lang.delete;
		$deleteButton.addEventListener('click', RobroyImage.delete);
		$div.appendChild($deleteButton);

		const $editButton = document.createElement('button');
		$editButton.setAttribute('class', 'robroy-admin robroy-button robroy-button--secondary');
		$editButton.setAttribute('type', 'button');
		$editButton.innerText = window.ROBROY.lang.edit;
		$editButton.addEventListener('click', RobroyImage.edit);
		$div.appendChild($editButton);

		if (window.ROBROY.args.removePointerEventsOnLogin) {
			$container.querySelector('.robroy-link').style.pointerEvents = 'none';
		}
	}

	static addCreateControl() {
		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=images`);
		$form.setAttribute('class', 'robroy-admin robroy-form robroy-form--image robroy-form-container');
		$form.setAttribute('enctype', 'multipart/form-data');
		$form.setAttribute('id', 'robroy-create-image-form');
		$form.setAttribute('method', 'post');
		$form.addEventListener('submit', RobroyImage.create);

		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-file-input-container');
		$form.appendChild($div);

		const $fileInput = document.createElement('input');
		$fileInput.setAttribute('accept', 'image/*');
		$fileInput.setAttribute('id', 'robroy-create-image-input');
		$fileInput.setAttribute('name', 'upload[]');
		$fileInput.setAttribute('multiple', 'multiple');
		$fileInput.setAttribute('title', window.ROBROY.lang.selectImagesToUpload);
		$fileInput.setAttribute('type', 'file');
		$fileInput.addEventListener('change', RobroyImage.onChange);
		$div.appendChild($fileInput);

		const $text = document.createElement('div');
		$text.setAttribute('id', 'robroy-create-image-text');
		$text.innerText = window.ROBROY.lang.dragImagesOrClickHereToUpload;
		$div.appendChild($text);

		const $button = document.createElement('button');
		$button.setAttribute('class', 'robroy-button');
		$button.setAttribute('id', 'robroy-create-image-button');
		$button.setAttribute('type', 'submit');
		$button.innerText = window.ROBROY.lang.upload;
		$form.appendChild($button);

		const $parentInput = document.createElement('input');
		$parentInput.setAttribute('name', 'folder');
		$parentInput.setAttribute('value', window.ROBROY.currentFolderId);
		$parentInput.setAttribute('type', 'hidden');
		$form.appendChild($parentInput);

		window.ROBROY.elements.$container.prepend($form);
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
			},
		);
	}

	static deleteCallback(id) {
		RobroyApi.request({
			method: 'DELETE',
			url: `${window.ROBROY.args.apiPath}?type=images&id=${id}`,
			callback: () => {
				RobroyImage.removeImageFromList(id);
				RobroyUtilities.callback('afterDeleteImage');
			},
		});
	}

	static removeImageFromList(id) {
		const $container = document.querySelector(`[data-path="${id}"]`);
		let $nextLink;
		if ($container.nextSibling) {
			$nextLink = [...$container.nextSibling.children].find((child) => child.tagName === 'A');
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
		document.getElementById('robroy-create-image-button').style.display = 'flex';
	}

	static create(e) {
		e.preventDefault();
		const files = document.getElementById('robroy-create-image-input').files;
		if (files.length <= 0) {
			RobroyModal.show(window.ROBROY.lang.validationRequiredFiles);
			return;
		}

		const $form = document.getElementById('robroy-create-image-form');
		const formData = new FormData($form);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			formData: formData,
			callback: (response) => {
				RobroyImage.createCallback(response);
			},
		});
	}

	static createCallback(response) {
		RobroyImage.prependItems(response.data);
		if (window.ROBROY.grid) {
			window.ROBROY.grid.resizeAllItems();
		}

		response.data.forEach((image) => {
			window.ROBROY.currentImages[image.id] = image;
		});

		window.ROBROY.currentNumImages += response.data.length;
		RobroyUtilities.setNumImages();

		document.getElementById('robroy-create-image-input').value = '';
		document.getElementById('robroy-create-image-text').innerText = window.ROBROY.lang.dragImagesOrClickHereToUpload;
		document.getElementById('robroy-create-image-button').style.display = '';

		const $deleteFolderButton = document.getElementById('robroy-delete-folder');
		if ($deleteFolderButton) {
			$deleteFolderButton.style.display = 'none';
		}

		RobroyUtilities.callback('afterCreateImage', { image: response.data });
	}

	static edit(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		window.ROBROY.currentImage = window.ROBROY.currentImages[path];

		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=images`);
		$form.setAttribute('id', 'robroy-edit-image-form');
		$form.setAttribute('method', 'PUT');
		$form.addEventListener('submit', RobroyImage.editCallback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'robroy-heading');
		$heading.innerText = window.ROBROY.lang.titleEditImage;
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'robroy-fields');
		$form.appendChild($container);

		const $filenameLabel = document.createElement('label');
		$filenameLabel.setAttribute('class', 'robroy-label');
		$filenameLabel.setAttribute('for', 'robroy-edit-image-filename');
		$filenameLabel.innerText = window.ROBROY.lang.fieldImageFilename;
		$container.appendChild($filenameLabel);

		const $filenameInput = document.createElement('input');
		$filenameInput.setAttribute('class', 'robroy-input');
		$filenameInput.setAttribute('id', 'robroy-edit-image-filename');
		$filenameInput.setAttribute('name', 'filename');
		$filenameInput.setAttribute('type', 'text');
		$filenameInput.setAttribute('value', window.ROBROY.currentImage.attributes.filename);
		$container.appendChild($filenameInput);

		const $folderLabel = document.createElement('label');
		$folderLabel.setAttribute('class', 'robroy-label');
		$folderLabel.setAttribute('for', 'robroy-edit-image-folder');
		$folderLabel.innerText = window.ROBROY.lang.fieldImageFolder;
		$container.appendChild($folderLabel);

		const $folderInput = document.createElement('select');
		$folderInput.setAttribute('class', 'robroy-select');
		$folderInput.setAttribute('id', 'robroy-edit-image-folder');
		$folderInput.setAttribute('name', 'folder');
		$container.appendChild($folderInput);
		RobroyFolder.addFolderOptions($folderInput, window.ROBROY.currentImage.attributes.folder);

		RobroyModal.show(
			$form,
			{
				append: true,
				callback: RobroyImage.submitEditFormCallback,
				closeButtonAttributes: {
					id: 'robroy-edit-image-submit',
					form: 'robroy-edit-image-form',
					type: 'submit',
				},
				closeButtonText: window.ROBROY.lang.save,
				showCancel: true,
			},
		);
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-edit-image-form');
		RobroyUtilities.clearErrors($form);

		const $filenameInput = document.getElementById('robroy-edit-image-filename');
		if (!$filenameInput.value) {
			RobroyUtilities.addError($filenameInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const $folderInput = document.getElementById('robroy-edit-image-folder');
		const hasFilenameChanged = $filenameInput.value !== window.ROBROY.currentImage.attributes.filename;
		const hasFolderChanged = $folderInput.value !== window.ROBROY.currentImage.attributes.folder;
		if (!hasFilenameChanged && !hasFolderChanged) {
			RobroyModal.hide(e);
			return;
		}

		const formData = new FormData($form);
		let json = {};
		formData.forEach((value, key) => {
			json[key] = value;
		});
		json = JSON.stringify(json);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: `${$form.getAttribute('action')}&id=${window.ROBROY.currentImage.id}`,
			json: json,
			callback: (response) => {
				if (hasFolderChanged) {
					RobroyImage.removeImageFromList(window.ROBROY.currentImage.id);
				} else if (hasFilenameChanged) {
					RobroyImage.updateImage(window.ROBROY.currentImage.id, response.data);
				}

				delete window.ROBROY.currentImages[window.ROBROY.currentImage.id];
				window.ROBROY.currentImages[response.data.id] = response.data;
				window.ROBROY.currentImage = null;

				RobroyModal.hide(e);
				RobroyUtilities.callback('afterEditImage', { image: response.data });
			},
		});
	}

	static updateImage(path, image) {
		const $container = document.querySelector(`[data-path="${path}"]`);
		$container.setAttribute('data-path', image.id);

		const $a = $container.querySelector('.robroy-link');
		$a.setAttribute('href', image.attributes.url);

		RobroyUtilities.callback('afterUpdateImage', { image, element: $container });
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.elements.$imageList.prepend(RobroyImage.element(item));
		});
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
}
