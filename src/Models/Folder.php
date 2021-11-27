<?php

namespace Jlbelanger\Robroy\Models;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Utilities;

class Folder
{
	private $id;

	/**
	 * @param string $id Eg. 'foo/bar'.
	 */
	public function __construct(string $id)
	{
		$this->id = trim($id, '/');
	}

	/**
	 * Returns all folders.
	 *
	 * @return Folder[]
	 */
	public static function all() : array
	{
		$folders = Filesystem::getFoldersInFolder('');
		ksort($folders);
		return array_values($folders);
	}

	/**
	 * Returns all folders under the parent.
	 *
	 * @param  string $parentPath
	 * @return Folder[]
	 */
	public static function allInParent(string $parentPath) : array
	{
		$folders = [];
		$uploadsPath = Constant::get('UPLOADS_PATH') . '/' . $parentPath;
		if (!is_dir($uploadsPath)) {
			throw new ApiException('This folder does not exist.', 404);
		}

		// TODO: Move to filesystem helper.
		if ($handle = opendir($uploadsPath)) {
			while (($folderName = readdir($handle)) !== false) {
				$path = $uploadsPath . '/' . $folderName;
				if (!is_dir($path) || strpos($folderName, '.') === 0 || $folderName === Constant::get('THUMBNAILS_FOLDER')) {
					continue;
				}
				$folder = new self($parentPath . '/' . $folderName);
				$folders[$path] = $folder->json();
			}

			closedir($handle);
		}

		ksort($folders);
		return array_values($folders);
	}

	/**
	 * @param  string $name       Eg. 'Foo Bar'.
	 * @param  string $parentPath Eg. 'foo/bar'.
	 * @return Folder
	 */
	public static function create(string $name, string $parentPath = '') : self
	{
		$slug = Utilities::nameToSlug($name);
		$path = $parentPath ? $parentPath . '/' . $slug : $slug;

		Filesystem::createFolder($path);
		Filesystem::createFolder($path . '/' . Constant::get('THUMBNAILS_FOLDER'));

		return new self($path);
	}

	/**
	 * Deletes an image.
	 *
	 * @return void
	 */
	public function delete() : void
	{
		Filesystem::deleteFolder($this->id . '/' . Constant::get('THUMBNAILS_FOLDER'));
		Filesystem::deleteFolder($this->id);
	}

	/**
	 * @return self|null
	 */
	public function parent()
	{
		$pos = strrpos($this->id, '/');
		if ($pos === false) {
			return null;
		}
		$parentPath = substr($this->id, 0, $pos);
		return new self($parentPath);
	}

	/**
	 * @param  string $newId Eg. 'foo/bar'.
	 * @return void
	 */
	public function rename(string $newId) : void
	{
		if ($this->id !== $newId) {
			Filesystem::renameFolder($this->id, $newId);
			$this->id = $newId;
		}
	}

	/**
	 * @return array
	 */
	public function json() : array
	{
		$parent = $this->parent();
		return [
			'id' => $this->id,
			'type' => 'folders',
			'attributes' => [
				'name' => Utilities::pathToName($this->id),
			],
			'relationships' => [
				'parent' => $parent ? $parent->json() : null,
			],
		];
	}
}
