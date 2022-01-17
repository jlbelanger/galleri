import RobroyApi from './api';
import RobroyEmpty from './empty';
import RobroyModal from './modal';
import RobroyUtilities from './utilities';

export default class RobroyFolder {
	static element(folder) {
		const $li = document.createElement('li');
		$li.setAttribute('class', 'robroy-folder');
		$li.setAttribute('data-path', folder.id);
		$li.setAttribute('data-name', folder.attributes.name);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-folder-link');
		$a.setAttribute('href', `?folder=${folder.id}`);
		$a.innerText = folder.attributes.name;
		$li.appendChild($a);

		return $li;
	}

	static addEditControls() {
		const $div = document.createElement('div');
		$div.setAttribute('class', 'robroy-admin robroy-form robroy-form-container');

		const $form = RobroyFolder.form('Edit', 'edit', 'put', RobroyFolder.edit);
		$form.setAttribute('class', 'robroy-form robroy-form--folder');
		$div.appendChild($form);

		const $button = document.createElement('button');
		$button.setAttribute('class', 'robroy-button robroy-button--danger robroy-form--delete');
		$button.setAttribute('id', 'robroy-delete-folder');
		$button.setAttribute('type', 'button');
		$button.innerText = 'Delete Folder';
		if (!RobroyEmpty.isEmpty()) {
			$button.style.display = 'none';
		}
		$button.addEventListener('click', RobroyFolder.delete);
		$div.appendChild($button);

		window.ROBROY.elements.$container.prepend($div);
	}

	static addCreateControl() {
		const $form = RobroyFolder.form('Create', 'create', 'post', RobroyFolder.create);
		$form.setAttribute('class', 'robroy-admin robroy-form robroy-form--folder robroy-form-container');
		window.ROBROY.elements.$container.prepend($form);
	}

	static form(title, type, method, callback) {
		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=folders`);
		$form.setAttribute('id', `robroy-${type}-folder-form`);
		$form.setAttribute('method', method);
		$form.addEventListener('submit', callback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'robroy-heading');
		$heading.innerText = `${title} Folder`;
		$form.appendChild($heading);

		const $inputLabel = document.createElement('label');
		$inputLabel.setAttribute('class', 'robroy-label');
		$inputLabel.setAttribute('for', `robroy-${type}-folder-name`);
		$inputLabel.innerText = 'Name:';
		$form.appendChild($inputLabel);

		const $nameInput = document.createElement('input');
		$nameInput.setAttribute('class', 'robroy-input');
		$nameInput.setAttribute('id', `robroy-${type}-folder-name`);
		$nameInput.setAttribute('name', 'name');
		$nameInput.setAttribute('type', 'text');
		$form.appendChild($nameInput);
		if (type === 'edit') {
			$nameInput.setAttribute('value', window.ROBROY.currentFolder.attributes.name);
		}

		const $selectLabel = document.createElement('label');
		$selectLabel.setAttribute('class', 'robroy-label');
		$selectLabel.setAttribute('for', `robroy-${type}-folder-parent`);
		$selectLabel.innerText = 'Parent:';
		$form.appendChild($selectLabel);

		const $parentInput = document.createElement('select');
		$parentInput.setAttribute('class', 'robroy-select');
		$parentInput.setAttribute('id', `robroy-${type}-folder-parent`);
		$parentInput.setAttribute('name', 'parent');
		$form.appendChild($parentInput);
		let selectedValue;
		if (type === 'create') {
			selectedValue = window.ROBROY.currentFolderId;
		} else if (type === 'edit') {
			selectedValue = RobroyFolder.getParentId(window.ROBROY.currentFolder.id);
		}
		RobroyFolder.addFolderOptions($parentInput, selectedValue);

		const $button = document.createElement('button');
		$button.setAttribute('class', 'robroy-button');
		$button.setAttribute('id', `robroy-${type}-submit`);
		$button.setAttribute('type', 'submit');
		$button.innerText = title;
		$form.appendChild($button);

		return $form;
	}

	static addFolderOptions(select, selectedValue) {
		select.innerText = '';

		let $option = document.createElement('option');
		$option.setAttribute('value', '');
		select.appendChild($option);

		const folderIds = Object.keys(window.ROBROY.folders).sort();
		let folder;
		folderIds.forEach(function (folderId) {
			folder = window.ROBROY.folders[folderId];
			$option = document.createElement('option');
			$option.setAttribute('value', folder.id);
			$option.innerText = RobroyFolder.getFullName(window.ROBROY.folders[folder.id]);
			if (folder.id === selectedValue) {
				$option.setAttribute('selected', 'selected');
			}
			select.appendChild($option);
		});
	}

	static delete() {
		const id = window.ROBROY.currentFolderId;
		RobroyModal.show(
			`Are you sure you want to delete the folder "${id}"?`,
			{
				closeButtonText: 'Delete',
				closeButtonClass: 'robroy-button--danger',
				showCancel: true,
				callback: () => {
					RobroyFolder.deleteCallback(id);
					RobroyModal.hide();
				},
			},
		);
	}

	static deleteCallback(id) {
		RobroyApi.request({
			method: 'DELETE',
			url: `${window.ROBROY.args.apiPath}?type=folders&id=${id}`,
			callback: () => {
				RobroyUtilities.callback('afterDeleteFolder');

				const parentId = RobroyFolder.getParentId(window.ROBROY.currentFolder.id);
				window.location = window.location.href.replace(
					`?folder=${window.ROBROY.currentFolderId}`,
					parentId ? `?folder=${parentId}` : '',
				);
			},
		});
	}

	static create(e) {
		e.preventDefault();
		const $nameInput = document.getElementById('robroy-create-folder-name');
		if (!$nameInput.value) {
			RobroyModal.show('Error: Please enter a name.');
			return;
		}

		const $form = document.getElementById('robroy-create-folder-form');
		const formData = new FormData($form);
		let json = {};
		formData.forEach((value, key) => {
			json[key] = value;
		});
		json = JSON.stringify(json);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			json: json,
			callback: (response) => {
				RobroyFolder.createCallback(response);
			},
		});
	}

	static createCallback(response) {
		const parentId = RobroyFolder.getParentId(response.data.id);
		if ((parentId && parentId === window.ROBROY.currentFolderId) || (!parentId && !window.ROBROY.currentFolderId)) {
			RobroyFolder.addToList(response.data);

			const $deleteFolderButton = document.getElementById('robroy-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = 'none';
			}
		}

		document.getElementById('robroy-create-folder-name').value = '';

		window.ROBROY.folders[response.data.id] = response.data;

		const $createParentInput = document.getElementById('robroy-create-folder-parent');
		RobroyFolder.addFolderOptions($createParentInput, $createParentInput.value);

		const $editParentInput = document.getElementById('robroy-edit-folder-parent');
		if ($editParentInput) {
			RobroyFolder.addFolderOptions($editParentInput, RobroyFolder.getParentId(window.ROBROY.currentFolder.id));
		}

		RobroyUtilities.callback('afterCreateFolder');
	}

	static edit(e) {
		e.preventDefault();
		const $nameInput = document.getElementById('robroy-edit-folder-name');
		if (!$nameInput.value) {
			RobroyModal.show('Error: Please enter a name.');
			return;
		}

		const $parentInput = document.getElementById('robroy-edit-folder-parent');
		const hasNameChanged = $nameInput.value !== window.ROBROY.currentFolder.attributes.name;
		let hasParentChanged;
		const parentId = RobroyFolder.getParentId(window.ROBROY.currentFolder.id);
		if (parentId) {
			hasParentChanged = $parentInput.value !== parentId;
		} else {
			hasParentChanged = !!$parentInput.value;
		}
		if (!hasNameChanged && !hasParentChanged) {
			RobroyModal.show('Nothing to update.');
			return;
		}

		const $form = document.getElementById('robroy-edit-folder-form');
		const formData = new FormData($form);
		let json = {};
		formData.forEach((value, key) => {
			json[key] = value;
		});
		json = JSON.stringify(json);

		RobroyApi.request({
			method: $form.getAttribute('method'),
			url: `${$form.getAttribute('action')}&id=${window.ROBROY.currentFolderId}`,
			json: json,
			callback: (response) => {
				RobroyFolder.editCallback(response);
			},
		});
	}

	static editCallback(response) {
		RobroyUtilities.callback('afterEditFolder');

		window.location = window.location.href.replace(
			`?folder=${window.ROBROY.currentFolderId}`,
			`?folder=${response.data.id}`,
		);
	}

	static addToList(item) {
		let i;
		const $li = window.ROBROY.elements.$folderList.children;
		const num = $li.length;
		let $previousItem;
		for (i = 0; i < num; i++) {
			if ($li[i].getAttribute('data-path') < item.id) {
				$previousItem = $li[i];
			} else {
				break;
			}
		}

		if ($previousItem) {
			$previousItem.after(RobroyFolder.element(item));
		} else {
			window.ROBROY.elements.$folderList.prepend(RobroyFolder.element(item));
		}
	}

	static getFullName(folder) {
		const output = [folder.attributes.name];
		let parentId = RobroyFolder.getParentId(folder.id);
		while (parentId) {
			if (window.ROBROY.folders[parentId]) {
				folder = window.ROBROY.folders[parentId];
			} else {
				break;
			}
			output.push(folder.attributes.name);
			parentId = RobroyFolder.getParentId(folder.id);
		}
		return output.reverse().join(' > ');
	}

	static getParentId(id) {
		const i = id.lastIndexOf('/');
		return i === -1 ? '' : id.substr(0, i);
	}
}
