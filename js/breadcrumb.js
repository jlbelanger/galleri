import RobroyFolder from './folder';
import RobroyUtilities from './utilities';

export default class RobroyBreadcrumb {
	static init() {
		const $ul = document.createElement('ul');
		$ul.setAttribute('class', 'robroy-breadcrumb');
		window.ROBROY.elements.$container.prepend($ul);

		let folder = window.ROBROY.currentFolder;
		do {
			$ul.prepend(this.item(folder));
			folder = window.ROBROY.folders[RobroyFolder.getParentId(folder.id)];
		} while (folder);

		$ul.prepend(this.item({ id: '', attributes: { name: window.ROBROY.lang.home } }));

		RobroyUtilities.modifier('breadcrumbList', { element: $ul });
	}

	static item(folder) {
		const $li = document.createElement('li');
		$li.setAttribute('class', 'robroy-breadcrumb-item');

		if (folder.id === window.ROBROY.currentFolderId) {
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
