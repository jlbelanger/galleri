import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyImage {
	static element(image) {
		var figure = document.createElement('figure');
		figure.setAttribute('class', 'robroy-figure');
		figure.setAttribute('data-path', image.id);
		RobroyUtilities.addAttributes('figure', figure);

		var a = document.createElement('a');
		a.setAttribute('class', 'robroy-link');
		a.setAttribute('href', image.attributes.url);
		a.style.backgroundImage = 'url("' + image.attributes.thumbnail + '")';
		RobroyUtilities.addAttributes('a', a);
		figure.appendChild(a);

		var img = document.createElement('img');
		img.setAttribute('class', 'robroy-img');
		img.setAttribute('src', image.attributes.thumbnail);
		img.setAttribute('height', image.attributes.thumbnailHeight);
		img.setAttribute('width', image.attributes.thumbnailWidth);
		RobroyUtilities.addAttributes('img', img);
		a.appendChild(img);

		if (RobroyUtilities.isLoggedIn()) {
			RobroyImage.addEditControls(figure);
		}

		return figure;
	}

	static addEditControls(figure) {
		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-admin robroy-button robroy-button--danger');
		button.setAttribute('type', 'button');
		button.innerText = 'Delete';
		button.addEventListener('click', RobroyImage.delete);
		figure.appendChild(button);
	}

	static addUploadControl() {
		var form = document.createElement('form');
		form.setAttribute('action', window.ROBROY.args.apiPath + '?type=images');
		form.setAttribute('class', 'robroy-admin');
		form.setAttribute('enctype', 'multipart/form-data');
		form.setAttribute('id', 'robroy-upload-form');
		form.setAttribute('method', 'post');
		form.addEventListener('submit', RobroyImage.upload);

		var div = document.createElement('div');
		div.setAttribute('id', 'robroy-upload-container');
		form.appendChild(div);

		var input = document.createElement('input');
		input.setAttribute('accept', 'image/*');
		input.setAttribute('id', 'robroy-upload-input');
		input.setAttribute('name', 'upload[]');
		input.setAttribute('multiple', 'multiple');
		input.setAttribute('title', 'Select images to upload');
		input.setAttribute('type', 'file');
		input.addEventListener('change', RobroyImage.onChange);
		div.appendChild(input);

		var text = document.createElement('div');
		text.setAttribute('id', 'robroy-upload-text');
		text.innerText = 'Drag images or click here to upload.';
		div.appendChild(text);

		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-button');
		button.setAttribute('id', 'robroy-upload-button');
		button.setAttribute('type', 'submit');
		button.innerText = 'Upload';
		form.appendChild(button);

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
				var figure = document.querySelector('[data-path="' + path + '"]');
				var nextLink;
				if (figure.nextSibling) {
					nextLink = [...figure.nextSibling.children].find(child => child.tagName === 'A');
				}
				figure.parentNode.removeChild(figure);

				if (RobroyEmpty.hasFigures()) {
					window.ROBROY.grid.resizeAllItems();
					if (nextLink) {
						nextLink.focus();
					}
				} else {
					RobroyEmpty.show();
				}

				RobroyUtilities.callback('afterDeleteImage');
			},
		});
	}

	static onChange(e) {
		var files = [...e.target.files];
		var filenames = files.map(file => file.name);

		document.getElementById('robroy-upload-text').innerText = filenames.join(', ');
		document.getElementById('robroy-upload-button').style.display = 'flex';
	}

	static upload(e) {
		e.preventDefault();
		var files = document.getElementById('robroy-upload-input').files;
		if (files.length <= 0) {
			RobroyModal.show('Error: No files selected.');
			return;
		}

		var form = document.getElementById('robroy-upload-form');
		var formData = new FormData(form);

		RobroyApi.request({
			method: form.getAttribute('method'),
			url: form.getAttribute('action'),
			formData: formData,
			callback: (response) => {
				RobroyImage.uploadCallback(response);
			},
		});
	}

	static uploadCallback(response) {
		RobroyEmpty.hide();
		RobroyImage.prependImages(response.data);
		window.ROBROY.grid.resizeAllItems();

		document.getElementById('robroy-upload-input').value = '';
		document.getElementById('robroy-upload-text').innerText = 'Drag files or click here to upload.';
		document.getElementById('robroy-upload-button').style.display = '';

		RobroyUtilities.callback('afterUploadImage');
	}

	static prependImages(images) {
		images.forEach((image) => {
			window.ROBROY.list.prepend(RobroyImage.element(image));
		});
	}
}
