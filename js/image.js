import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyFolder from './folder';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static element(image) {
		var container = document.createElement('figure');
		container.setAttribute('class', 'robroy-figure');
		container.setAttribute('data-path', image.id);
		RobroyUtilities.addAttributes('figure', container);

		var a = document.createElement('a');
		a.setAttribute('class', 'robroy-link');
		a.setAttribute('href', image.attributes.url);
		a.style.backgroundImage = 'url("' + image.attributes.thumbnail + '")';
		RobroyUtilities.addAttributes('a', a);
		container.appendChild(a);

		var img = document.createElement('img');
		img.setAttribute('class', 'robroy-img');
		img.setAttribute('src', image.attributes.thumbnail);
		img.setAttribute('height', image.attributes.thumbnailHeight);
		img.setAttribute('width', image.attributes.thumbnailWidth);
		RobroyUtilities.addAttributes('img', img);
		a.appendChild(img);

		if (RobroyUtilities.isLoggedIn()) {
			RobroyImage.addEditControls(container);
		}

		return container;
	}

	static addEditControls(container) {
		var buttonContainer = document.createElement('div');
		buttonContainer.setAttribute('class', 'robroy-button-container');
		container.appendChild(buttonContainer);

		var viewButton = document.createElement('button');
		viewButton.setAttribute('class', 'robroy-admin robroy-button');
		viewButton.setAttribute('href', 'button');
		viewButton.innerText = 'View';
		viewButton.addEventListener('click', RobroyImage.view);
		buttonContainer.appendChild(viewButton);

		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-admin robroy-button robroy-button--danger');
		button.setAttribute('type', 'button');
		button.innerText = 'Delete';
		button.addEventListener('click', RobroyImage.delete);
		buttonContainer.appendChild(button);

		var editButton = document.createElement('button');
		editButton.setAttribute('class', 'robroy-admin robroy-button robroy-button--secondary');
		editButton.setAttribute('type', 'button');
		editButton.innerText = 'Edit';
		editButton.addEventListener('click', RobroyImage.edit);
		buttonContainer.appendChild(editButton);

		container.querySelector('.robroy-link').style.pointerEvents = 'none';
	}

	static addCreateControl() {
		var form = document.createElement('form');
		form.setAttribute('action', window.ROBROY.args.apiPath + '?type=images');
		form.setAttribute('class', 'robroy-admin robroy-form robroy-form--image robroy-form-container');
		form.setAttribute('enctype', 'multipart/form-data');
		form.setAttribute('id', 'robroy-create-image-form');
		form.setAttribute('method', 'post');
		form.addEventListener('submit', RobroyImage.create);

		var div = document.createElement('div');
		div.setAttribute('id', 'robroy-create-image-container');
		form.appendChild(div);

		var input = document.createElement('input');
		input.setAttribute('accept', 'image/*');
		input.setAttribute('id', 'robroy-create-image-input');
		input.setAttribute('name', 'upload[]');
		input.setAttribute('multiple', 'multiple');
		input.setAttribute('title', 'Select images to upload');
		input.setAttribute('type', 'file');
		input.addEventListener('change', RobroyImage.onChange);
		div.appendChild(input);

		var text = document.createElement('div');
		text.setAttribute('id', 'robroy-create-image-text');
		text.innerText = 'Drag images or click here to upload.';
		div.appendChild(text);

		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-button');
		button.setAttribute('id', 'robroy-create-image-button');
		button.setAttribute('type', 'submit');
		button.innerText = 'Upload';
		form.appendChild(button);

		var parent = document.createElement('input');
		parent.setAttribute('name', 'folder');
		parent.setAttribute('value', window.ROBROY.currentFolderId);
		parent.setAttribute('type', 'hidden');
		form.appendChild(parent);

		window.ROBROY.container.prepend(form);
	}

	static delete(e) {
		var path = e.target.closest('[data-path]').getAttribute('data-path');
		RobroyModal.show(
			'Are you sure you want to delete "' + path + '"?',
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
			url: window.ROBROY.args.apiPath + '?type=images&path=' + path,
			callback: () => {
				RobroyImage.removeImageFromList(path);
				RobroyUtilities.callback('afterDeleteImage');
			},
		});
	}

	static removeImageFromList(path) {
		var container = document.querySelector('[data-path="' + path + '"]');
		var nextLink;
		if (container.nextSibling) {
			nextLink = [...container.nextSibling.children].find((child) => child.tagName === 'A');
		}
		container.parentNode.removeChild(container);

		window.ROBROY.currentNumImages -= 1;
		RobroyUtilities.setNumImages();

		if (RobroyEmpty.hasImages()) {
			window.ROBROY.grid.resizeAllItems();
			if (nextLink) {
				nextLink.focus();
			}
		} else if (!RobroyEmpty.hasFolders()) {
			var $deleteFolder = document.getElementById('robroy-delete-folder');
			if ($deleteFolder) {
				$deleteFolder.style.display = '';
			}
		}
	}

	static onChange(e) {
		var files = [...e.target.files];
		var filenames = files.map((file) => file.name);

		document.getElementById('robroy-create-image-text').innerText = filenames.join(', ');
		document.getElementById('robroy-create-image-button').style.display = 'flex';
	}

	static create(e) {
		e.preventDefault();
		var files = document.getElementById('robroy-create-image-input').files;
		if (files.length <= 0) {
			RobroyModal.show('Error: No files selected.');
			return;
		}

		var form = document.getElementById('robroy-create-image-form');
		var formData = new FormData(form);

		RobroyApi.request({
			method: form.getAttribute('method'),
			url: form.getAttribute('action'),
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

		var $deleteFolder = document.getElementById('robroy-delete-folder');
		if ($deleteFolder) {
			$deleteFolder.style.display = 'none';
		}

		RobroyUtilities.callback('afterCreateImage');
	}

	static edit(e) {
		var path = e.target.closest('[data-path]').getAttribute('data-path');
		window.ROBROY.currentImage = window.ROBROY.currentImages[path];

		var form = document.createElement('form');
		form.setAttribute('action', window.ROBROY.args.apiPath + '?type=images');
		form.setAttribute('id', 'robroy-edit-image-form');
		form.setAttribute('method', 'PUT');
		form.addEventListener('submit', RobroyImage.editCallback);

		var heading = document.createElement('h2');
		heading.setAttribute('class', 'robroy-heading');
		heading.innerText = 'Edit Image';
		form.appendChild(heading);

		var container = document.createElement('div');
		container.setAttribute('class', 'robroy-fields');
		form.appendChild(container);

		var filenameLabel = document.createElement('label');
		filenameLabel.setAttribute('class', 'robroy-label');
		filenameLabel.setAttribute('for', 'robroy-edit-image-filename');
		filenameLabel.innerText = 'Filename:';
		container.appendChild(filenameLabel);

		var filenameInput = document.createElement('input');
		filenameInput.setAttribute('class', 'robroy-input');
		filenameInput.setAttribute('id', 'robroy-edit-image-filename');
		filenameInput.setAttribute('name', 'filename');
		filenameInput.setAttribute('type', 'text');
		filenameInput.setAttribute('value', window.ROBROY.currentImage.attributes.filename);
		container.appendChild(filenameInput);

		var folderLabel = document.createElement('label');
		folderLabel.setAttribute('class', 'robroy-label');
		folderLabel.setAttribute('for', 'robroy-edit-image-folder');
		folderLabel.innerText = 'Folder:';
		container.appendChild(folderLabel);

		var folderInput = document.createElement('select');
		folderInput.setAttribute('class', 'robroy-select');
		folderInput.setAttribute('id', 'robroy-edit-image-folder');
		folderInput.setAttribute('name', 'folder');
		container.appendChild(folderInput);
		RobroyFolder.addFolderOptions(folderInput, window.ROBROY.currentImage.attributes.folder);

		RobroyModal.show(
			form,
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
		const fields = document.querySelectorAll('#robroy-edit-image-form .robroy-has-error');
		fields.forEach((elem) => {
			elem.classList.remove('robroy-has-error');
		});
		const errors = document.querySelectorAll('#robroy-edit-image-form .robroy-error');
		errors.forEach((elem) => {
			elem.remove();
		});

		var filename = document.getElementById('robroy-edit-image-filename');
		if (!filename.value) {
			RobroyUtilities.addError(filename, 'Error: Please enter a filename.');
			return;
		}

		var folder = document.getElementById('robroy-edit-image-folder');
		var hasFilenameChanged = filename.value !== window.ROBROY.currentImage.attributes.filename;
		var hasFolderChanged = folder.value !== window.ROBROY.currentImage.attributes.folder;
		if (!hasFilenameChanged && !hasFolderChanged) {
			RobroyModal.hide(e);
			return;
		}

		var form = document.getElementById('robroy-edit-image-form');
		var formData = new FormData(form);
		var json = {};
		formData.forEach((value, key) => {
			json[key] = value;
		});
		json = JSON.stringify(json);

		RobroyApi.request({
			method: form.getAttribute('method'),
			url: form.getAttribute('action') + '&id=' + window.ROBROY.currentImage.id,
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
		const figure = document.querySelector('[data-path="' + path + '"]');
		figure.setAttribute('data-path', image.id);

		const a = figure.querySelector('.robroy-link');
		a.setAttribute('href', image.attributes.url);
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.elements.imageList.prepend(RobroyImage.element(item));
		});
	}

	static view(e) {
		e.target.closest('[data-path]').querySelector('.robroy-link').click();
	}
}
