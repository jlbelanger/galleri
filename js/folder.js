import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyFolder {
	static element(folder) {
		var container = document.createElement('li');
		container.setAttribute('class', 'robroy-folder');
		container.setAttribute('data-path', folder.id);
		container.setAttribute('data-name', folder.attributes.name);

		var a = document.createElement('a');
		a.setAttribute('class', 'robroy-folder-link');
		a.setAttribute('href', '?folder=' + folder.id);
		a.innerText = folder.attributes.name;
		container.appendChild(a);

		return container;
	}

	static addEditControls() {
		var div = document.createElement('div');
		div.setAttribute('class', 'robroy-admin robroy-form robroy-form-container');

		var form = RobroyFolder.form('Edit', 'edit', 'put', RobroyFolder.edit);
		form.setAttribute('class', 'robroy-form robroy-form--folder');
		div.appendChild(form);

		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-button robroy-button--danger robroy-form--delete');
		button.setAttribute('id', 'robroy-delete-folder');
		button.setAttribute('type', 'button');
		button.innerText = 'Delete Folder';
		if (!RobroyEmpty.isEmpty()) {
			button.style.display = 'none';
		}
		button.addEventListener('click', RobroyFolder.delete);
		div.appendChild(button);

		window.ROBROY.container.prepend(div);
	}

	static addCreateControl() {
		var form = RobroyFolder.form('Create', 'create', 'post', RobroyFolder.create);
		form.setAttribute('class', 'robroy-admin robroy-form robroy-form--folder robroy-form-container');
		window.ROBROY.container.prepend(form);
	}

	static form(title, type, method, callback) {
		var form = document.createElement('form');
		form.setAttribute('action', window.ROBROY.args.apiPath + '?type=folders');
		form.setAttribute('id', 'robroy-' + type + '-folder-form');
		form.setAttribute('method', method);
		form.addEventListener('submit', callback);

		var heading = document.createElement('h2');
		heading.setAttribute('class', 'robroy-heading');
		heading.innerText = title + ' Folder';
		form.appendChild(heading);

		var inputLabel = document.createElement('label');
		inputLabel.setAttribute('class', 'robroy-label');
		inputLabel.setAttribute('for', 'robroy-' + type + '-folder-name');
		inputLabel.innerText = 'Name:';
		form.appendChild(inputLabel);

		var nameInput = document.createElement('input');
		nameInput.setAttribute('class', 'robroy-input');
		nameInput.setAttribute('id', 'robroy-' + type + '-folder-name');
		nameInput.setAttribute('name', 'name');
		nameInput.setAttribute('type', 'text');
		form.appendChild(nameInput);
		if (type === 'edit') {
			nameInput.setAttribute('value', window.ROBROY.currentFolder.attributes.name);
		}

		var selectLabel = document.createElement('label');
		selectLabel.setAttribute('class', 'robroy-label');
		selectLabel.setAttribute('for', 'robroy-' + type + '-folder-parent');
		selectLabel.innerText = 'Parent:';
		form.appendChild(selectLabel);

		var parentInput = document.createElement('select');
		parentInput.setAttribute('class', 'robroy-select');
		parentInput.setAttribute('id', 'robroy-' + type + '-folder-parent');
		parentInput.setAttribute('name', 'parent');
		form.appendChild(parentInput);
		RobroyFolder.addFolderOptions(type, parentInput);

		var button = document.createElement('button');
		button.setAttribute('class', 'robroy-button');
		button.setAttribute('id', 'robroy-' + type + '-submit');
		button.setAttribute('type', 'submit');
		button.innerText = title;
		form.appendChild(button);

		return form;
	}

	static addFolderOptions(type, select) {
		select.innerText = '';

		var option = document.createElement('option');
		option.setAttribute('value', '');
		select.appendChild(option);

		window.ROBROY.folders.forEach(function (folder) {
			option = document.createElement('option');
			option.setAttribute('value', folder.id);
			option.innerText = RobroyFolder.getFullName(folder);
			if (type === 'create') {
				if (folder.id === window.ROBROY.currentFolderId) {
					option.setAttribute('selected', 'selected');
				}
			} else if (type === 'edit') {
				if (window.ROBROY.currentFolder.relationships.parent && folder.id === window.ROBROY.currentFolder.relationships.parent.id) {
					option.setAttribute('selected', 'selected');
				}
			}
			select.appendChild(option);
		});
	}

	static delete() {
		var id = window.ROBROY.currentFolderId;
		RobroyModal.show(
			'Are you sure you want to delete the folder "' + id + '"?',
			{
				closeButtonText: 'Delete',
				closeButtonClass: 'robroy-button--danger',
				showCancel: true,
				callback: () => {
					RobroyFolder.deleteCallback(id);
				},
			},
		);
	}

	static deleteCallback(id) {
		RobroyApi.request({
			method: 'DELETE',
			url: window.ROBROY.args.apiPath + '?type=folders&id=' + id,
			callback: () => {
				RobroyUtilities.callback('afterDeleteFolder');

				window.location = window.location.href.replace(
					'?folder=' + window.ROBROY.currentFolderId,
					window.ROBROY.currentFolder.relationships.parent ? '?folder=' + window.ROBROY.currentFolder.relationships.parent.id : '',
				);
			},
		});
	}

	static create(e) {
		e.preventDefault();
		var name = document.getElementById('robroy-create-folder-name');
		if (!name.value) {
			RobroyModal.show('Error: Please enter a name.');
			return;
		}

		var form = document.getElementById('robroy-create-folder-form');
		var formData = new FormData(form);

		RobroyApi.request({
			method: form.getAttribute('method'),
			url: form.getAttribute('action'),
			formData: formData,
			callback: (response) => {
				RobroyFolder.createCallback(response);
			},
		});
	}

	static createCallback(response) {
		if (
			(response.data.relationships.parent && response.data.relationships.parent.id === window.ROBROY.currentFolderId)
			|| (!response.data.relationships.parent && !window.ROBROY.currentFolderId)
		) {
			RobroyFolder.prependItems([response.data]);
			document.getElementById('robroy-folders').style.display = '';

			var $deleteFolder = document.getElementById('robroy-delete-folder');
			if ($deleteFolder) {
				$deleteFolder.style.display = 'none';
			}
		}

		document.getElementById('robroy-create-folder-name').value = '';

		RobroyUtilities.callback('afterCreateFolder');
	}

	static edit(e) {
		e.preventDefault();
		var name = document.getElementById('robroy-edit-folder-name');
		if (!name.value) {
			RobroyModal.show('Error: Please enter a name.');
			return;
		}

		var parent = document.getElementById('robroy-edit-folder-parent');
		var hasNameChanged = name.value !== window.ROBROY.currentFolder.attributes.name;
		var hasParentChanged;
		if (window.ROBROY.currentFolder.relationships.parent) {
			hasParentChanged = parent.value !== window.ROBROY.currentFolder.relationships.parent.id;
		} else {
			hasParentChanged = !!parent.value;
		}
		if (!hasNameChanged && !hasParentChanged) {
			RobroyModal.show('Nothing to update.');
			return;
		}

		var form = document.getElementById('robroy-edit-folder-form');
		var formData = new FormData(form);
		var json = {};
		formData.forEach((value, key) => {
			json[key] = value;
		});
		json = JSON.stringify(json);

		RobroyApi.request({
			method: form.getAttribute('method'),
			url: form.getAttribute('action') + '&id=' + window.ROBROY.currentFolderId,
			json: json,
			callback: (response) => {
				RobroyFolder.editCallback(response);
			},
		});
	}

	static editCallback(response) {
		RobroyUtilities.callback('afterEditFolder');

		window.location = window.location.href.replace(
			'?folder=' + window.ROBROY.currentFolderId,
			'?folder=' + response.data.id,
		);
	}

	static prependItems(items) {
		items.forEach((item) => {
			window.ROBROY.folderList.prepend(RobroyFolder.element(item));
		});
	}

	static getFullName(folder) {
		const output = [folder.attributes.name];
		while (folder.relationships.parent) {
			folder = folder.relationships.parent;
			output.push(folder.attributes.name);
		}
		return output.reverse().join(' > ');
	}
}
