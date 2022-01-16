import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyFolder from './folder';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static element(image) {
		const $figure = document.createElement('figure');
		$figure.setAttribute('class', 'robroy-figure');
		$figure.setAttribute('data-path', image.id);
		RobroyUtilities.addAttributes('figure', $figure);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-link');
		$a.setAttribute('href', image.attributes.url);
		$a.style.backgroundImage = `url("${image.attributes.thumbnail}")`;
		RobroyUtilities.addAttributes('a', $a);
		$figure.appendChild($a);

		const $img = document.createElement('img');
		$img.setAttribute('class', 'robroy-img');
		$img.setAttribute('src', image.attributes.thumbnail);
		$img.setAttribute('height', image.attributes.thumbnailHeight);
		$img.setAttribute('width', image.attributes.thumbnailWidth);
		RobroyUtilities.addAttributes('img', $img);
		$a.appendChild($img);

		if (RobroyUtilities.isLoggedIn()) {
			RobroyImage.addEditControls($figure);
		}

		return $figure;
	}

	static addEditControls($container) {
		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-button-container');
		$container.appendChild($div);

		const $viewButton = document.createElement('button');
		$viewButton.setAttribute('class', 'robroy-admin robroy-button');
		$viewButton.setAttribute('href', 'button');
		$viewButton.innerText = 'View';
		$viewButton.addEventListener('click', RobroyImage.view);
		$div.appendChild($viewButton);

		const $deleteButton = document.createElement('button');
		$deleteButton.setAttribute('class', 'robroy-admin robroy-button robroy-button--danger');
		$deleteButton.setAttribute('type', 'button');
		$deleteButton.innerText = 'Delete';
		$deleteButton.addEventListener('click', RobroyImage.delete);
		$div.appendChild($deleteButton);

		const $editButton = document.createElement('button');
		$editButton.setAttribute('class', 'robroy-admin robroy-button robroy-button--secondary');
		$editButton.setAttribute('type', 'button');
		$editButton.innerText = 'Edit';
		$editButton.addEventListener('click', RobroyImage.edit);
		$div.appendChild($editButton);

		$container.querySelector('.robroy-link').style.pointerEvents = 'none';
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
		$div.setAttribute('id', 'robroy-create-image-container');
		$form.appendChild($div);

		const $fileInput = document.createElement('input');
		$fileInput.setAttribute('accept', 'image/*');
		$fileInput.setAttribute('id', 'robroy-create-image-input');
		$fileInput.setAttribute('name', 'upload[]');
		$fileInput.setAttribute('multiple', 'multiple');
		$fileInput.setAttribute('title', 'Select images to upload');
		$fileInput.setAttribute('type', 'file');
		$fileInput.addEventListener('change', RobroyImage.onChange);
		$div.appendChild($fileInput);

		const $text = document.createElement('div');
		$text.setAttribute('id', 'robroy-create-image-text');
		$text.innerText = 'Drag images or click here to upload.';
		$div.appendChild($text);

		const $button = document.createElement('button');
		$button.setAttribute('class', 'robroy-button');
		$button.setAttribute('id', 'robroy-create-image-button');
		$button.setAttribute('type', 'submit');
		$button.innerText = 'Upload';
		$form.appendChild($button);

		const $parentInput = document.createElement('input');
		$parentInput.setAttribute('name', 'folder');
		$parentInput.setAttribute('value', window.ROBROY.currentFolderId);
		$parentInput.setAttribute('type', 'hidden');
		$form.appendChild($parentInput);

		window.ROBROY.elements.$container.prepend($form);
	}

	static delete(e) {
		const path = e.target.closest('[data-path]').getAttribute('data-path');
		RobroyModal.show(
			`Are you sure you want to delete "${path}"?`,
			{
				closeButtonText: 'Delete',
				closeButtonClass: 'robroy-button--danger',
				showCancel: true,
				callback: () => {
					RobroyImage.deleteCallback(path);
					RobroyModal.hide();
				},
			},
		);
	}

	static deleteCallback(path) {
		RobroyApi.request({
			method: 'DELETE',
			url: `${window.ROBROY.args.apiPath}?type=images&path=${path}`,
			callback: () => {
				RobroyImage.removeImageFromList(path);
				RobroyUtilities.callback('afterDeleteImage');
			},
		});
	}

	static removeImageFromList(path) {
		const $container = document.querySelector(`[data-path="${path}"]`);
		let nextLink;
		if ($container.nextSibling) {
			nextLink = [...$container.nextSibling.children].find((child) => child.tagName === 'A');
		}
		$container.parentNode.removeChild($container);

		window.ROBROY.currentNumImages -= 1;
		RobroyUtilities.setNumImages();

		if (RobroyEmpty.hasImages()) {
			window.ROBROY.grid.resizeAllItems();
			if (nextLink) {
				nextLink.focus();
			}
		} else if (!RobroyEmpty.hasFolders()) {
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
			RobroyModal.show('Error: No files selected.');
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
		window.ROBROY.grid.resizeAllItems();

		response.data.forEach((image) => {
			window.ROBROY.currentImages[image.id] = image;
		});

		window.ROBROY.currentNumImages += response.data.length;
		RobroyUtilities.setNumImages();

		document.getElementById('robroy-create-image-input').value = '';
		document.getElementById('robroy-create-image-text').innerText = 'Drag files or click here to upload.';
		document.getElementById('robroy-create-image-button').style.display = '';

		const $deleteFolderButton = document.getElementById('robroy-delete-folder');
		if ($deleteFolderButton) {
			$deleteFolderButton.style.display = 'none';
		}

		RobroyUtilities.callback('afterCreateImage');
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
		$heading.innerText = 'Edit Image';
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'robroy-fields');
		$form.appendChild($container);

		const $filenameLabel = document.createElement('label');
		$filenameLabel.setAttribute('class', 'robroy-label');
		$filenameLabel.setAttribute('for', 'robroy-edit-image-filename');
		$filenameLabel.innerText = 'Filename:';
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
		$folderLabel.innerText = 'Folder:';
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
				closeButtonText: 'Save',
				showCancel: true,
			},
		);
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		// Reset errors.
		const $fieldsWithErrors = document.querySelectorAll('#robroy-edit-image-form .robroy-has-error');
		$fieldsWithErrors.forEach(($elem) => {
			$elem.classList.remove('robroy-has-error');
		});
		const $errors = document.querySelectorAll('#robroy-edit-image-form .robroy-error');
		$errors.forEach(($elem) => {
			$elem.remove();
		});

		const $filenameInput = document.getElementById('robroy-edit-image-filename');
		if (!$filenameInput.value) {
			RobroyUtilities.addError($filenameInput, 'Error: Please enter a filename.');
			return;
		}

		const $folderInput = document.getElementById('robroy-edit-image-folder');
		const hasFilenameChanged = $filenameInput.value !== window.ROBROY.currentImage.attributes.filename;
		const hasFolderChanged = $folderInput.value !== window.ROBROY.currentImage.attributes.folder;
		if (!hasFilenameChanged && !hasFolderChanged) {
			RobroyModal.hide(e);
			return;
		}

		const $form = document.getElementById('robroy-edit-image-form');
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
				RobroyUtilities.callback('afterEditImage');
			},
		});
	}

	static updateImage(path, image) {
		const $figure = document.querySelector(`[data-path="${path}"]`);
		$figure.setAttribute('data-path', image.id);

		const $a = $figure.querySelector('.robroy-link');
		$a.setAttribute('href', image.attributes.url);
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.elements.$imageList.prepend(RobroyImage.element(item));
		});
	}

	static view(e) {
		e.target.closest('[data-path]').querySelector('.robroy-link').click();
	}
}
