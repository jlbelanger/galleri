import RobroyApi from './api';
import RobroyModal from './modal';
import RobroyToast from './toast';
import RobroyUtilities from './utilities';

export default class RobroyFolder {
	static url(folder) {
		return `?folder=${folder.id}`;
	}

	static element(data) {
		const $li = document.createElement(window.ROBROY.args.folderItemElement);
		$li.setAttribute('class', 'robroy-folder');
		$li.setAttribute('data-path', data.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'robroy-folder-link');
		$a.setAttribute('href', RobroyFolder.url(data));
		$a.innerText = data.attributes.name;
		$li.appendChild($a);

		RobroyUtilities.modifier('folderItem', { element: $li });

		return $li;
	}

	static showCreateForm() {
		const $form = RobroyFolder.form(window.ROBROY.lang.titleCreateFolder, 'post', RobroyFolder.submitCreateFormCallback);

		const $parentInput = $form.querySelector('#robroy-input-parent');
		if ($parentInput) {
			RobroyFolder.addFolderOptions($parentInput, window.ROBROY.currentFolder.id);
		}

		RobroyUtilities.modifier('folderCreateForm', { element: $form });

		RobroyModal.show(
			$form,
			{
				append: true,
				callback: RobroyFolder.submitCreateFormCallback,
				closeButtonAttributes: {
					form: 'robroy-folder-form',
					type: 'submit',
				},
				closeButtonText: window.ROBROY.lang.save,
				showCancel: true,
			},
		);
	}

	static showEditForm() {
		const $form = RobroyFolder.form(window.ROBROY.lang.titleEditFolder, 'put', RobroyFolder.submitEditFormCallback);

		const $nameInput = $form.querySelector('#robroy-input-name');
		$nameInput.setAttribute('value', window.ROBROY.currentFolder.attributes.name);

		const $parentInput = $form.querySelector('#robroy-input-parent');
		if ($parentInput) {
			RobroyFolder.addFolderOptions($parentInput, RobroyFolder.getParentId(window.ROBROY.currentFolder.id));
		}

		RobroyUtilities.modifier('folderEditForm', { element: $form });

		RobroyModal.show(
			$form,
			{
				append: true,
				callback: RobroyFolder.submitEditFormCallback,
				closeButtonAttributes: {
					form: 'robroy-folder-form',
					type: 'submit',
				},
				closeButtonText: window.ROBROY.lang.save,
				showCancel: true,
			},
		);
	}

	static form(title, method, callback) {
		const $form = document.createElement('form');
		$form.setAttribute('action', `${window.ROBROY.args.apiPath}?type=folders`);
		$form.setAttribute('id', 'robroy-folder-form');
		$form.setAttribute('method', method);
		$form.addEventListener('submit', callback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'robroy-heading');
		$heading.innerText = title;
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'robroy-fields');
		$form.appendChild($container);

		RobroyUtilities.addField($container, 'name', window.ROBROY.lang.fieldFolderName);
		RobroyUtilities.addField($container, 'parent', window.ROBROY.lang.fieldFolderParent, 'select');

		RobroyUtilities.modifier('folderForm', { element: $form });

		return $form;
	}

	static delete() {
		const id = window.ROBROY.currentFolder.id;
		RobroyModal.show(
			RobroyUtilities.sprintf(window.ROBROY.lang.confirmDeleteFolder, window.ROBROY.currentFolder.attributes.name),
			{
				closeButtonText: window.ROBROY.lang.delete,
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
				RobroyUtilities.callback('afterDeleteFolder', { id });

				const parentId = RobroyFolder.getParentId(window.ROBROY.currentFolder.id);
				window.location = window.location.href.replace(
					RobroyFolder.url(window.ROBROY.currentFolder),
					parentId ? RobroyFolder.url(window.ROBROY.folders[parentId]) : '',
				);
			},
		});
	}

	static submitCreateFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-folder-form');
		RobroyUtilities.clearErrors($form);

		const $nameInput = document.getElementById('robroy-input-name');
		if (!$nameInput.value) {
			RobroyUtilities.addError($nameInput, window.ROBROY.lang.validationRequired);
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
			url: $form.getAttribute('action'),
			json: json,
			callback: (response) => {
				RobroyFolder.createRequestCallback(response);
			},
		});
	}

	static createRequestCallback(response) {
		RobroyToast.show(window.ROBROY.lang.createdSuccessfullyFolder, { class: 'robroy-toast--success' });

		const parentId = RobroyFolder.getParentId(response.data.id);
		if ((parentId && parentId === window.ROBROY.currentFolder.id) || (!parentId && !window.ROBROY.currentFolder.id)) {
			RobroyFolder.addToList(response.data);

			const $deleteFolderButton = document.getElementById('robroy-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = 'none';
			}
		}

		document.getElementById('robroy-input-name').value = '';

		window.ROBROY.folders[response.data.id] = response.data;

		const $createParentInput = document.getElementById('robroy-input-parent');
		RobroyFolder.addFolderOptions($createParentInput, $createParentInput.value);

		RobroyUtilities.callback('afterCreateFolder', { folder: response.data });
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-folder-form');
		RobroyUtilities.clearErrors($form);

		const $nameInput = document.getElementById('robroy-input-name');
		if (!$nameInput.value) {
			RobroyUtilities.addError($nameInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const $parentInput = document.getElementById('robroy-input-parent');
		const hasNameChanged = $nameInput.value !== window.ROBROY.currentFolder.attributes.name;
		let hasParentChanged;
		const parentId = RobroyFolder.getParentId(window.ROBROY.currentFolder.id);
		if (parentId) {
			hasParentChanged = $parentInput.value !== parentId;
		} else {
			hasParentChanged = !!$parentInput.value;
		}
		if (!hasNameChanged && !hasParentChanged) {
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
			url: `${$form.getAttribute('action')}&id=${window.ROBROY.currentFolder.id}`,
			json: json,
			callback: (response) => {
				RobroyFolder.editRequestCallback(response);
			},
		});
	}

	static editRequestCallback(response) {
		RobroyUtilities.callback('afterEditFolder', { folder: response.data });

		window.location = window.location.href.replace(
			RobroyFolder.url(window.ROBROY.currentFolder),
			RobroyFolder.url(response.data),
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
		return output.reverse().join(window.ROBROY.args.folderSeparator);
	}

	static getParentId(id) {
		const i = id.lastIndexOf('/');
		return i === -1 ? '' : id.substr(0, i);
	}

	static getFolders() {
		return document.querySelectorAll(`#robroy-folders > ${window.ROBROY.args.folderItemElement}`);
	}

	static hasFolders() {
		return RobroyFolder.getFolders().length > 0;
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
}
