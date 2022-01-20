import RobroyApi from './api';
import RobroyFolder from './folder';
import RobroyModal from './modal';
import RobroyToast from './toast';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static element(data) {
		const $figure = document.createElement(window.ROBROY.args.imageItemElement);
		$figure.setAttribute('class', 'robroy-figure');
		$figure.setAttribute('data-path', data.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-link');
		$a.setAttribute('href', data.attributes.url);
		$a.style.backgroundImage = `url("${data.attributes.thumbnail}")`;
		$figure.appendChild($a);

		const $img = document.createElement('img');
		$img.setAttribute('class', 'robroy-img');
		$img.setAttribute('src', data.attributes.thumbnail);
		$img.setAttribute('height', data.attributes.thumbnailHeight);
		$img.setAttribute('width', data.attributes.thumbnailWidth);
		$a.appendChild($img);

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
		$label.innerText = 'Images';
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

		RobroyUtilities.modifier('imageCreateForm', { element: $form });

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
			},
		);
	}

	static showEditForm(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		window.ROBROY.currentImage = window.ROBROY.currentImages[path];

		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=images`);
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
		RobroyUtilities.addField($container, 'folder', window.ROBROY.lang.fieldImageFolder, 'select');

		const $filenameInput = $form.querySelector('#robroy-input-filename');
		$filenameInput.setAttribute('value', window.ROBROY.currentImage.attributes.filename);

		const $folderInput = $form.querySelector('#robroy-input-folder');
		RobroyFolder.addFolderOptions($folderInput, window.ROBROY.currentImage.attributes.folder);

		RobroyUtilities.modifier('imageEditForm', { element: $form });

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
			},
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
			},
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
		RobroyUtilities.clearErrors($form);

		const $uploadInput = document.getElementById('robroy-input-upload');
		if ($uploadInput.files.length <= 0) {
			RobroyUtilities.addError($uploadInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			formData: formData,
			callback: (response) => {
				RobroyImage.createRequestCallback(response);
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
		RobroyUtilities.clearErrors($form);

		const $filenameInput = document.getElementById('robroy-input-filename');
		if (!$filenameInput.value) {
			RobroyUtilities.addError($filenameInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const $folderInput = document.getElementById('robroy-input-folder');
		const hasFilenameChanged = $filenameInput.value !== window.ROBROY.currentImage.attributes.filename;
		const hasFolderChanged = $folderInput.value !== window.ROBROY.currentImage.attributes.folder;
		if (!hasFilenameChanged && !hasFolderChanged) {
			RobroyToast.show(window.ROBROY.lang.nothingToSave);
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
				RobroyImage.editRequestCallback(e, response, hasFolderChanged, hasFilenameChanged);
			},
		});
	}

	static editRequestCallback(e, response, hasFolderChanged, hasFilenameChanged) {
		RobroyToast.show(window.ROBROY.lang.updatedSuccessfullyImage, { class: 'robroy-toast--success' });

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

	static addAdminControls($container) {
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
			$container.querySelector('.robroy-link').style.pointerEvents = 'none';
		}
	}
}
