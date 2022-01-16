<?php

namespace Jlbelanger\Robroy\Models;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Cache;
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
	 * @param  boolean $useCache
	 * @return Folder[]
	 */
	public static function all(bool $useCache = true) : array
	{
		$folder = Constant::get('JSON_PATH');
		$filename = 'folders.json';
		$output = $useCache ? Cache::get($folder, $filename) : null;
		if ($output === null) {
			$folders = Filesystem::getFolders();
			ksort($folders);
			$output = ['data' => $folders];
			Cache::set($folder, $filename, $output);
		}
		return $output;
	}

	/**
	 * @param  string $name       Eg. 'Foo Bar'.
	 * @param  string $parentPath Eg. 'foo/bar'.
	 * @return Folder
	 */
	public static function create(string $name, string $parentPath = '') : self
	{
		$slug = Utilities::nameToSlug($name);
		if ($slug === Constant::get('THUMBNAILS_FOLDER')) {
			throw new ApiException('Name cannot be the same as the thumbnails folder.');
		}
		$path = $parentPath ? $parentPath . '/' . $slug : $slug;

		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $path;
		Filesystem::createFolder($fullPath);
		Filesystem::createFolder($fullPath . '/' . Constant::get('THUMBNAILS_FOLDER'));
		self::refreshCache();

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
		self::refreshCache();
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
	 * @return void
	 */
	public static function refreshCache() : void
	{
		self::all(false);
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
			self::refreshCache();
		}
	}

	/**
	 * @return array
	 */
	public function json() : array
	{
		return [
			'id' => $this->id,
			'attributes' => [
				'name' => Utilities::pathToName($this->id),
			],
		];
	}

	/**
	 * @param  string $id
	 * @param  string $type
	 * @return void
	 */
	public static function validateId(string $id, string $type = 'Folder') : void
	{
		if ($id === '') {
			return;
		}
		if (trim($id, '/') !== $id) {
			throw new ApiException($type . ' cannot begin or end with slashes.');
		}
		if ($id === Constant::get('THUMBNAILS_FOLDER')) {
			throw new ApiException($type . ' cannot be the same as the thumbnails folder.');
		}
		if (!preg_match('/^[a-z0-9\/-]+$/', $id)) {
			throw new ApiException($type . ' contains invalid characters.');
		}
		if (preg_match('/(^|\/)' . str_replace('/', '\/', Constant::get('THUMBNAILS_FOLDER')) . '$/', $id)) {
			throw new ApiException($type . ' cannot end in the thumbnails folder.');
		}
	}
}
