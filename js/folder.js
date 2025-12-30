import GalleriApi from './api.js';
import GalleriErrors from './errors.js';
import GalleriModal from './modal.js';
import GalleriToast from './toast.js';
import GalleriUtilities from './utilities.js';

export default class GalleriFolder {
	static load() {
		window.GALLERI.state.isLoadingFolder = true;

		GalleriApi.request({
			url: window.GALLERI.args.apiFoldersPath,
			callback: (response) => {
				if (response) {
					GalleriFolder.loadFolderCallback(response);
				} else {
					GalleriApi.request({
						url: `${window.GALLERI.args.apiPath}?type=folders`,
						callback: (response2) => {
							GalleriFolder.loadFolderCallback(response2);
						},
					});
				}
			},
			errorCallback: () => {
				GalleriApi.request({
					url: `${window.GALLERI.args.apiPath}?type=folders`,
					callback: (response) => {
						GalleriFolder.loadFolderCallback(response);
					},
				});
			},
		});
	}

	static getCurrentFolderId() {
		if (!window.GALLERI.args.enableRewrites) {
			const urlSearchParams = new URLSearchParams(window.location.search);
			return urlSearchParams.get('folder') || '';
		}
		return window.location.pathname.replace(/^\/+/, '');
	}

	static loadFolderCallback(response) {
		const currentFolderId = GalleriFolder.getCurrentFolderId();

		window.GALLERI.folders = response.data;

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
			folder = window.GALLERI.folders[currentFolderId];
		}

		if (!folder) {
			GalleriModal.show(window.GALLERI.lang.error + window.GALLERI.lang.errorFolderDoesNotExist);
			return;
		}

		window.GALLERI.currentFolder = folder;

		if (window.GALLERI.currentFolder.id !== '') {
			GalleriFolder.initBreadcrumb();
		}

		if (folder.attributes.name) {
			GalleriUtilities.setMetaTitle(folder.attributes.name);
		}

		GalleriUtilities.setPageTitle(folder.attributes.name ? folder.attributes.name : window.GALLERI.lang.home);

		let childFolders;
		if (window.GALLERI.currentFolder.id === '') {
			childFolders = Object.values(window.GALLERI.folders).filter((f) => (!f.id.includes('/')));
		} else {
			const numSlashes = window.GALLERI.currentFolder.id.split('/').length + 1;
			childFolders = Object.values(window.GALLERI.folders).filter((f) => {
				if (!f.id.startsWith(`${window.GALLERI.currentFolder.id}/`)) {
					return false;
				}
				return numSlashes === f.id.split('/').length;
			});
		}
		if (childFolders.length > 0) {
			GalleriFolder.appendItems(childFolders);
		}

		window.GALLERI.state.isLoadingFolder = false;

		GalleriUtilities.callback('afterLoadFolder', { folder });
	}

	static url(folder) {
		if (!window.GALLERI.args.enableRewrites) {
			return `/?folder=${folder.id}`;
		}
		return `/${folder.id}`;
	}

	static element(data) {
		const $li = document.createElement(window.GALLERI.args.folderItemElement);
		$li.setAttribute('class', 'galleri-folder');
		$li.setAttribute('data-path', data.id);

		const $a = document.createElement('a');
		$a.setAttribute('class', 'galleri-folder-link');
		$a.setAttribute('href', GalleriFolder.url(data));
		$li.appendChild($a);

		if (data.attributes.thumbnail) {
			const $img = document.createElement('img');
			$img.setAttribute('class', 'galleri-folder-img');
			$img.setAttribute('src', data.attributes.thumbnail);
			$a.appendChild($img);
		}

		const $name = document.createElement('div');
		$name.setAttribute('class', 'galleri-folder-name');
		$name.innerText = data.attributes.name;
		$a.appendChild($name);

		GalleriUtilities.modifier('folderItem', { element: $li, folder: data });

		return $li;
	}

	static showCreateForm() {
		const $form = GalleriFolder.form(window.GALLERI.lang.titleCreateFolder, 'post', GalleriFolder.submitCreateFormCallback);

		const $parentInput = $form.querySelector('#galleri-input-parent');
		if ($parentInput) {
			GalleriFolder.addFolderOptions($parentInput, window.GALLERI.currentFolder.id);
		}

		const $parentField = $form.querySelector('#galleri-field-parent');
		if (Object.keys(window.GALLERI.folders).length <= 0) {
			$parentField.style.display = 'none';
		} else {
			$parentField.style.display = '';
		}

		GalleriUtilities.modifier('folderCreateForm', { addField: GalleriUtilities.addField, form: $form });

		GalleriModal.show(
			$form,
			{
				append: true,
				callback: GalleriFolder.submitCreateFormCallback,
				closeButtonAttributes: {
					form: 'galleri-folder-form',
					type: 'submit',
				},
				closeButtonText: window.GALLERI.lang.save,
				showCancel: true,
			}
		);
	}

	static showEditForm() {
		const $form = GalleriFolder.form(
			window.GALLERI.lang.titleEditFolder,
			'put',
			GalleriFolder.submitEditFormCallback,
			window.GALLERI.currentFolder.id
		);

		const $parentInput = $form.querySelector('#galleri-input-parent');
		if ($parentInput) {
			GalleriFolder.addFolderOptions($parentInput, GalleriFolder.getParentId(window.GALLERI.currentFolder.id));
		}

		const $parentField = $form.querySelector('#galleri-field-parent');
		if (Object.keys(window.GALLERI.folders).length <= 0) {
			$parentField.style.display = 'none';
		} else {
			$parentField.style.display = '';
		}

		const $idInput = $form.querySelector('#galleri-input-id');
		if ($idInput) {
			$idInput.value = window.GALLERI.currentFolder.id.replace(/^.+\/([^/]+)$/, '$1');
		}

		Object.keys(window.GALLERI.currentFolder.attributes).forEach((key) => {
			const $input = $form.querySelector(`#galleri-input-${key}`);
			if ($input) {
				$input.setAttribute('value', window.GALLERI.currentFolder.attributes[key]);
			}
		});

		GalleriUtilities.modifier('folderEditForm', { addField: GalleriUtilities.addField, form: $form });

		GalleriModal.show(
			$form,
			{
				append: true,
				callback: GalleriFolder.submitEditFormCallback,
				closeButtonAttributes: {
					form: 'galleri-folder-form',
					type: 'submit',
				},
				closeButtonText: window.GALLERI.lang.save,
				showCancel: true,
			}
		);
	}

	static form(title, method, callback, id = '') {
		const $form = document.createElement('form');
		let action = `${window.GALLERI.args.apiPath}?type=folders`;
		if (id) {
			action += `&id=${id}`;
		}
		$form.setAttribute('action', action);
		$form.setAttribute('id', 'galleri-folder-form');
		$form.setAttribute('method', method);
		$form.addEventListener('submit', callback);

		const $heading = document.createElement('h2');
		$heading.setAttribute('class', 'galleri-heading');
		$heading.innerText = title;
		$form.appendChild($heading);

		const $container = document.createElement('div');
		$container.setAttribute('class', 'galleri-fields');
		$form.appendChild($container);

		const $nameInput = GalleriUtilities.addField($container, 'name', window.GALLERI.lang.fieldFolderName);
		const $idInput = GalleriUtilities.addField($container, 'id', window.GALLERI.lang.fieldFolderId);
		GalleriUtilities.addField($container, 'parent', window.GALLERI.lang.fieldFolderParent, 'select');
		GalleriUtilities.addField($container, 'thumbnail', window.GALLERI.lang.fieldFolderThumbnail);

		$nameInput.addEventListener('keyup', (e) => {
			$idInput.value = GalleriUtilities.toSlug(e.target.value);
		});

		$nameInput.addEventListener('change', (e) => {
			$idInput.value = GalleriUtilities.toSlug(e.target.value);
		});

		GalleriUtilities.modifier('folderForm', { addField: GalleriUtilities.addField, container: $container, form: $form });

		return $form;
	}

	static delete() {
		const id = window.GALLERI.currentFolder.id;
		GalleriModal.show(
			GalleriUtilities.sprintf(window.GALLERI.lang.confirmDeleteFolder, window.GALLERI.currentFolder.attributes.name),
			{
				closeButtonText: window.GALLERI.lang.delete,
				closeButtonClass: 'galleri-button--danger',
				showCancel: true,
				callback: () => {
					GalleriFolder.deleteCallback(id);
					GalleriModal.hide();
				},
			}
		);
	}

	static deleteCallback(id) {
		GalleriApi.request({
			method: 'DELETE',
			url: `${window.GALLERI.args.apiPath}?type=folders&id=${id}`,
			callback: () => {
				GalleriUtilities.callback('afterDeleteFolder', { id });

				const parentId = GalleriFolder.getParentId(window.GALLERI.currentFolder.id);
				window.location = window.location.href.replace(
					GalleriFolder.url(window.GALLERI.currentFolder),
					parentId ? GalleriFolder.url(window.GALLERI.folders[parentId]) : ''
				);
			},
		});
	}

	static submitCreateFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('galleri-folder-form');
		GalleriErrors.clear($form);

		const $nameInput = document.getElementById('galleri-input-name');
		if (!$nameInput.value) {
			GalleriErrors.add($nameInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const $idInput = document.getElementById('galleri-input-id');
		if (!$idInput.value) {
			GalleriErrors.add($idInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);
		let json = {
			id: null,
			attributes: {},
		};
		formData.forEach((value, key) => {
			if (key === 'id') {
				json[key] = value;
			} else {
				json.attributes[key] = value;
			}
		});
		json = JSON.stringify(json);

		GalleriApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			json,
			callback: (response) => {
				GalleriFolder.createRequestCallback(response);
			},
			errorCallback: (response, status) => {
				GalleriErrors.show(response, status);
			},
		});
	}

	static createRequestCallback(response) {
		GalleriToast.show(window.GALLERI.lang.createdSuccessfullyFolder, { class: 'galleri-toast--success' });

		const parentId = GalleriFolder.getParentId(response.data.id);
		if ((parentId && parentId === window.GALLERI.currentFolder.id) || (!parentId && !window.GALLERI.currentFolder.id)) {
			GalleriFolder.addToList(response.data);

			const $deleteFolderButton = document.getElementById('galleri-delete-folder');
			if ($deleteFolderButton) {
				$deleteFolderButton.style.display = 'none';
			}
		}

		document.getElementById('galleri-input-name').value = '';
		document.getElementById('galleri-input-id').value = '';

		window.GALLERI.folders[response.data.id] = response.data;

		const $createParentInput = document.getElementById('galleri-input-parent');
		GalleriFolder.addFolderOptions($createParentInput, $createParentInput.value);

		const $parentField = document.getElementById('galleri-field-parent');
		$parentField.style.display = '';

		GalleriUtilities.callback('afterCreateFolder', { folder: response.data });
	}

	static submitEditFormCallback(e) {
		e.preventDefault();

		const $form = document.getElementById('galleri-folder-form');
		GalleriErrors.clear($form);

		const $nameInput = document.getElementById('galleri-input-name');
		if (!$nameInput.value) {
			GalleriErrors.add($nameInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const $idInput = document.getElementById('galleri-input-id');
		if (!$idInput.value) {
			GalleriErrors.add($idInput, window.GALLERI.lang.validationRequired);
			return;
		}

		const formData = new FormData($form);
		let json = {
			attributes: {},
		};
		let oldJson = {
			attributes: {},
		};
		formData.forEach((value, key) => {
			if (key === 'id') {
				json[key] = value;

				if (Object.hasOwn(window.GALLERI.currentFolder, key)) {
					oldJson[key] = window.GALLERI.currentFolder[key].replace(/^.+\/([^/]+)$/, '$1');
				} else {
					oldJson[key] = '';
				}
			} else {
				json.attributes[key] = value;

				if (Object.hasOwn(window.GALLERI.currentFolder.attributes, key)) {
					oldJson.attributes[key] = window.GALLERI.currentFolder.attributes[key];
				} else {
					oldJson.attributes[key] = '';
				}
			}
		});
		json = JSON.stringify(json);
		oldJson = JSON.stringify(oldJson);

		if (json === oldJson) {
			GalleriModal.hide(e);
			GalleriToast.show(window.GALLERI.lang.nothingToSave);
			return;
		}

		GalleriApi.request({
			method: $form.getAttribute('method'),
			url: $form.getAttribute('action'),
			json,
			callback: (response) => {
				GalleriFolder.editRequestCallback(response);
			},
			errorCallback: (response, status) => {
				GalleriErrors.show(response, status);
			},
		});
	}

	static editRequestCallback(response) {
		GalleriUtilities.callback('afterEditFolder', { folder: response.data });

		window.location = window.location.href.replace(
			GalleriFolder.url(window.GALLERI.currentFolder),
			GalleriFolder.url(response.data)
		);
	}

	static appendItems(folders) {
		folders.forEach((folder) => {
			window.GALLERI.elements.$folderList.appendChild(GalleriFolder.element(folder));
		});
	}

	static addToList(item) {
		let i;
		const $li = window.GALLERI.elements.$folderList.children;
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
			$previousItem.after(GalleriFolder.element(item));
		} else {
			window.GALLERI.elements.$folderList.prepend(GalleriFolder.element(item));
		}
	}

	static getFullName(folder) {
		const output = [folder.attributes.name];
		let parentId = GalleriFolder.getParentId(folder.id);
		while (parentId) {
			if (window.GALLERI.folders[parentId]) {
				folder = window.GALLERI.folders[parentId];
			} else {
				break;
			}
			output.push(folder.attributes.name);
			parentId = GalleriFolder.getParentId(folder.id);
		}
		return output.reverse().join(window.GALLERI.args.folderSeparator);
	}

	static getParentId(id) {
		const i = id.lastIndexOf('/');
		return i === -1 ? '' : id.substr(0, i);
	}

	static getFolders() {
		return document.querySelectorAll(`#galleri-folders > ${window.GALLERI.args.folderItemElement}`);
	}

	static hasFolders() {
		return GalleriFolder.getFolders().length > 0;
	}

	static addFolderOptions(select, selectedValue) {
		select.innerText = '';

		let $option = document.createElement('option');
		$option.setAttribute('value', '');
		select.appendChild($option);

		const folderIds = Object.keys(window.GALLERI.folders).sort();
		let folder;
		folderIds.forEach((folderId) => {
			folder = window.GALLERI.folders[folderId];
			$option = document.createElement('option');
			$option.setAttribute('value', folder.id);
			$option.innerText = GalleriFolder.getFullName(window.GALLERI.folders[folder.id]);
			if (folder.id === selectedValue) {
				$option.setAttribute('selected', 'selected');
			}
			select.appendChild($option);
		});
	}

	static initBreadcrumb() {
		const $ul = document.createElement('ul');
		$ul.setAttribute('class', 'galleri-breadcrumb');
		window.GALLERI.elements.$container.prepend($ul);

		let folder = window.GALLERI.currentFolder;
		do {
			$ul.prepend(this.breadcrumbItem(folder));
			folder = window.GALLERI.folders[GalleriFolder.getParentId(folder.id)];
		} while (folder);

		$ul.prepend(this.breadcrumbItem({ id: '', attributes: { name: window.GALLERI.lang.home } }));

		GalleriUtilities.modifier('breadcrumbList', { element: $ul, folder: window.GALLERI.currentFolder });
	}

	static breadcrumbItem(folder) {
		const $li = document.createElement('li');
		$li.setAttribute('class', 'galleri-breadcrumb-item');

		if (folder.id === window.GALLERI.currentFolder.id) {
			$li.innerText = folder.attributes.name;
		} else {
			const $a = document.createElement('a');
			$a.setAttribute('class', 'galleri-breadcrumb-link');
			$a.setAttribute('href', folder.id ? GalleriFolder.url(folder) : '/');
			$a.innerText = folder.attributes.name;
			$li.prepend($a);
		}

		GalleriUtilities.modifier('breadcrumbItem', { element: $li, folder });

		return $li;
	}
}
