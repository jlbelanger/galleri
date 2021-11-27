export default class RobroyBreadcrumb {
	static init() {
		const list = document.createElement('ul');
		list.setAttribute('class', 'robroy-breadcrumb');
		window.ROBROY.container.prepend(list);

		let folder = window.ROBROY.currentFolder;
		do {
			list.prepend(this.item(folder.id, folder.attributes.name));
			folder = folder.relationships.parent;
		} while (folder);

		list.prepend(this.item('', window.ROBROY.args.rootFolderName));
	}

	static item(id, name) {
		const item = document.createElement('li');
		item.setAttribute('class', 'robroy-breadcrumb-item');

		if (id === window.ROBROY.currentFolderId) {
			item.innerText = name;
		} else {
			const a = document.createElement('a');
			a.setAttribute('class', 'robroy-breadcrumb-link');
			a.setAttribute('href', id ? `?folder=${id}` : window.location.pathname);
			a.innerText = name;
			item.prepend(a);
		}

		return item;
	}
}
