import RobroyApi from './api';
import RobroyEmpty from './empty';
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
		// TODO: Don't add the button if it already exists.
		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-admin robroy-button robroy-button--danger');
		button.setAttribute('type', 'button');
		button.innerText = 'Delete';
		button.addEventListener('click', RobroyImage.delete);
		container.appendChild(button);
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
		var path = e.target.parentNode.getAttribute('data-path');
		RobroyModal.show(
			'Are you sure you want to delete "' + path + '"?',
			{
				closeButtonText: 'Delete',
				closeButtonClass: 'robroy-button--danger',
				showCancel: true,
				callback: () => {
					RobroyImage.deleteCallback(path);
				},
			},
		);
	}

	static deleteCallback(path) {
		RobroyApi.request({
			method: 'DELETE',
			url: window.ROBROY.args.apiPath + '?type=images&path=' + path,
			callback: () => {
				var container = document.querySelector('[data-path="' + path + '"]');
				var nextLink;
				if (container.nextSibling) {
					nextLink = [...container.nextSibling.children].find((child) => child.tagName === 'A');
				}
				container.parentNode.removeChild(container);

				if (RobroyEmpty.hasImages()) {
					window.ROBROY.grid.resizeAllItems();
					if (nextLink) {
						nextLink.focus();
					}
				} else {
					RobroyEmpty.show();

					if (!RobroyEmpty.hasFolders()) {
						var $deleteFolder = document.getElementById('robroy-delete-folder');
						if ($deleteFolder) {
							$deleteFolder.style.display = '';
						}
					}
				}

				RobroyUtilities.callback('afterDeleteImage');
			},
		});
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
		RobroyEmpty.hide();
		RobroyImage.prependItems(response.data);
		window.ROBROY.grid.resizeAllItems();

		document.getElementById('robroy-create-image-input').value = '';
		document.getElementById('robroy-create-image-text').innerText = 'Drag files or click here to upload.';
		document.getElementById('robroy-create-image-button').style.display = '';

		var $deleteFolder = document.getElementById('robroy-delete-folder');
		if ($deleteFolder) {
			$deleteFolder.style.display = 'none';
		}

		RobroyUtilities.callback('afterCreateImage');
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.imageList.prepend(RobroyImage.element(item));
		});
	}
}
