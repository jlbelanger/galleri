export default class RobroyEmpty {
	static isEmpty() {
		const imageListStyle = window.getComputedStyle(window.ROBROY.elements.imageList);
		const folderListStyle = window.getComputedStyle(window.ROBROY.elements.folderList);
		return imageListStyle.display === 'none' && folderListStyle.display === 'none';
	}

	static getImages() {
		return document.querySelectorAll('#robroy-images > figure');
	}

	static getFolders() {
		return document.querySelectorAll('#robroy-folders > li');
	}

	static hasImages() {
		return RobroyEmpty.getImages().length > 0;
	}

	static hasFolders() {
		return RobroyEmpty.getFolders().length > 0;
	}
}
