import RobroyFolder from './folder';

export default class RobroyBreadcrumb {
	static init() {
		const $ul = document.createElement('ul');
		$ul.setAttribute('class', 'robroy-breadcrumb');
		window.ROBROY.elements.$container.prepend($ul);

		let folder = window.ROBROY.currentFolder;
		do {
			$ul.prepend(this.item(folder.id, folder.attributes.name));
			folder = window.ROBROY.folders[RobroyFolder.getParentId(folder.id)];
		} while (folder);

		$ul.prepend(this.item('', window.ROBROY.args.rootFolderName));
	}

	static item(id, name) {
		const $li = document.createElement('li');
		$li.setAttribute('class', 'robroy-breadcrumb-item');

		if (id === window.ROBROY.currentFolderId) {
			$li.innerText = name;
		} else {
			const $a = document.createElement('a');
			$a.setAttribute('class', 'robroy-breadcrumb-link');
			$a.setAttribute('href', id ? `?folder=${id}` : window.location.pathname);
			$a.innerText = name;
			$li.prepend($a);
		}

		return $li;
	}
}
