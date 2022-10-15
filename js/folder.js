import RobroyApi from './api';
import RobroyErrors from './errors';
import RobroyModal from './modal';
import RobroyToast from './toast';
import RobroyUtilities from './utilities';

export default class RobroyFolder {
	static load() {
		window.ROBROY.state.isLoadingFolder = true;

		RobroyApi.request({
			url: window.ROBROY.args.apiFoldersPath,
			callback: (response) => {
				if (response) {
					RobroyFolder.loadFolderCallback(response);
				} else {
					RobroyApi.request({
						url: `${window.ROBROY.args.apiPath}?type=folders`,
						callback: (response2) => {
							RobroyFolder.loadFolderCallback(response2);
						},
					});
				}
			},
			errorCallback: () => {
				RobroyApi.request({
					url: `${window.ROBROY.args.apiPath}?type=folders`,
					callback: (response) => {
						RobroyFolder.loadFolderCallback(response);
					},
				});
			},
		});
	}

	static loadFolderCallback(response) {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const currentFolderId = urlSearchParams.get('folder') || '';

		window.ROBROY.folders = response.data;

		let folder;
		if (currentFolderId === '') {
			folder = {
				id: '',
				type: 'folders',
				attributes: {
					name: '',
				},
			};
		} else {
			folder = window.ROBROY.folders[currentFolderId];
		}

		if (!folder) {
			RobroyModal.show(window.ROBROY.lang.error + window.ROBROY.lang.errorFolderDoesNotExist);
			return;
		}

		window.ROBROY.currentFolder = folder;

		if (window.ROBROY.currentFolder.id !== '') {
			RobroyFolder.initBreadcrumb();
		}

		if (folder.attributes.name) {
			RobroyUtilities.setMetaTitle(folder.attributes.name);
		}

		RobroyUtilities.setPageTitle(folder.attributes.name ? folder.attributes.name : window.ROBROY.lang.home);

		let childFolders;
		if (window.ROBROY.currentFolder.id === '') {
			childFolders = Object.values(window.ROBROY.folders).filter((f) => (!f.id.includes('/')));
		} else {
			const numSlashes = window.ROBROY.currentFolder.id.split('/').length + 1;
			childFolders = Object.values(window.ROBROY.folders).filter((f) => {
				if (!f.id.startsWith(`${window.ROBROY.currentFolder.id}/`)) {
					return false;
				}
				return numSlashes === f.id.split('/').length;
			});
		}
		if (childFolders.length > 0) {
			RobroyFolder.appendItems(childFolders);
		}

		window.ROBROY.state.isLoadingFolder = false;

		RobroyUtilities.callback('afterLoadFolder', { folder });
	}

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

		const $parentField = $form.querySelector('#robroy-field-parent');
		if (Object.keys(window.ROBROY.folders).length <= 0) {
			$parentField.style.display = 'none';
		} else {
			$parentField.style.display = '';
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
			}
		);
	}

	static showEditForm() {
		const $form = RobroyFolder.form(
			window.ROBROY.lang.titleEditFolder,
			'put',
			RobroyFolder.submitEditFormCallback,
			window.ROBROY.currentFolder.id
		);

		const $parentInput = $form.querySelector('#robroy-input-parent');
		if ($parentInput) {
			RobroyFolder.addFolderOptions($parentInput, RobroyFolder.getParentId(window.ROBROY.currentFolder.id));
		}

		const $parentField = $form.querySelector('#robroy-field-parent');
		if (Object.keys(window.ROBROY.folders).length <= 0) {
			$parentField.style.display = 'none';
		} else {
			$parentField.style.display = '';
		}

		Object.keys(window.ROBROY.currentFolder.attributes).forEach((key) => {
			const $input = $form.querySelector(`#robroy-input-${key}`);
			if ($input) {
				$input.setAttribute('value', window.ROBROY.currentFolder.attributes[key]);
			}
		});

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
			}
		);
	}

	static form(title, method, callback, id = '') {
		const $form = document.createElement('form');
		let action = `${window.ROBROY.args.apiPath}?type=folders`;
		if (id) {
			action += `&id=${id}`;
		}
		$form.setAttribute('action', action);
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
			}
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
					parentId ? RobroyFolder.url(window.ROBROY.folders[parentId]) : ''
				);
			},
		});
	}

	static submitCreateFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-folder-form');
		RobroyErrors.clear($form);

		const $nameInput = document.getElementById('robroy-input-name');
		if (!$nameInput.value) {
			RobroyErrors.add($nameInput, window.ROBROY.lang.validationRequired);
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
			json,
			callback: (response) => {
				RobroyFolder.createRequestCallback(response);
			},
			errorCallback: (response, status) => {
				RobroyErrors.show(response, status);
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

		const $parentField = document.getElementById('robroy-field-parent');
		$parentField.style.display = '';

		RobroyUtilities.callback('afterCreateFolder', { folder: response.data });
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('robroy-folder-form');
		RobroyErrors.clear($form);

		const $nameInput = document.getElementById('robroy-input-name');
		if (!$nameInput.value) {
			RobroyErrors.add($nameInput, window.ROBROY.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);
		let json = {};
		let oldJson = {};
		formData.forEach((value, key) => {
			json[key] = value;
			if (Object.prototype.hasOwnProperty.call(window.ROBROY.currentFolder.attributes, key)) {
				oldJson[key] = window.ROBROY.currentFolder.attributes[key];
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
				RobroyFolder.editRequestCallback(response);
			},
			errorCallback: (response, status) => {
				RobroyErrors.show(response, status);
			},
		});
	}

	static editRequestCallback(response) {
		RobroyUtilities.callback('afterEditFolder', { folder: response.data });

		window.location = window.location.href.replace(
			RobroyFolder.url(window.ROBROY.currentFolder),
			RobroyFolder.url(response.data)
		);
	}

	static appendItems(folders) {
		folders.forEach((folder) => {
			window.ROBROY.elements.$folderList.appendChild(RobroyFolder.element(folder));
		});
	}

	static addToList(item) {
		let i;
		const $li = window.ROBROY.elements.$folderList.children;
		const num = $li.length;
		let $previousItem;
		for (i = 0; i < num; i += 1) {
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
		folderIds.forEach((folderId) => {
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

	static initBreadcrumb() {
		const $ul = document.createElement('ul');
		$ul.setAttribute('class', 'robroy-breadcrumb');
		window.ROBROY.elements.$container.prepend($ul);

		let folder = window.ROBROY.currentFolder;
		do {
			$ul.prepend(this.breadcrumbItem(folder));
			folder = window.ROBROY.folders[RobroyFolder.getParentId(folder.id)];
		} while (folder);

		$ul.prepend(this.breadcrumbItem({ id: '', attributes: { name: window.ROBROY.lang.home } }));

		RobroyUtilities.modifier('breadcrumbList', { element: $ul });
	}

	static breadcrumbItem(folder) {
		const $li = document.createElement('li');
		$li.setAttribute('class', 'robroy-breadcrumb-item');

		if (folder.id === window.ROBROY.currentFolder.id) {
			$li.innerText = folder.attributes.name;
		} else {
			const $a = document.createElement('a');
			$a.setAttribute('class', 'robroy-breadcrumb-link');
			$a.setAttribute('href', folder.id ? RobroyFolder.url(folder) : window.location.pathname);
			$a.innerText = folder.attributes.name;
			$li.prepend($a);
		}

		RobroyUtilities.modifier('breadcrumbItem', { element: $li, folder });

		return $li;
	}
}
