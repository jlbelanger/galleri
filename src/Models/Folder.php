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

	private $name;

	/**
	 * @param string $id   Eg. 'foo/bar/example-name'.
	 * @param string $name Eg. 'Example Name'.
	 */
	public function __construct(string $id, string $name = '')
	{
		$this->id = trim($id, '/');
		$this->name = $name ? $name : Utilities::pathToName($id);
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
	 * @param  string $id       Eg. 'example-name'.
	 * @param  string $name     Eg. 'Example Name'.
	 * @param  string $parentId Eg. 'foo/bar'.
	 * @return Folder
	 */
	public static function create(string $id, string $name, string $parentId) : self
	{
		$fullId = trim($parentId . '/' . $id, '/');
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $fullId;

		Filesystem::createFolder($fullPath);
		Filesystem::createFolder($fullPath . '/' . Constant::get('THUMBNAILS_FOLDER'));

		$folder = new self($fullId, $name);
		$folder->updateCache();

		return $folder;
	}

	/**
	 * @return void
	 */
	public function delete() : void
	{
		Filesystem::deleteFolder($this->id . '/' . Constant::get('THUMBNAILS_FOLDER'));
		Filesystem::deleteFolder($this->id);
		$this->deleteFromCache();
	}

	/**
	 * @param  string $id
	 * @return Folder|null
	 */
	public static function get(string $id)
	{
		$data = self::all();
		if (empty($data['data'][$id])) {
			return null;
		}
		return new self($id, $data['data'][$id]['attributes']['name']);
	}

	/**
	 * @return void
	 */
	public static function refreshCache() : void
	{
		self::all(false);
	}

	/**
	 * @param  string $parentId Eg. 'foo/bar'.
	 * @param  string $name     Eg. 'Example'.
	 * @return void
	 */
	public function rename(string $parentId, string $name) : void
	{
		$newId = trim($parentId . '/' . Utilities::nameToSlug($name), '/');
		if ($newId === Constant::get('THUMBNAILS_FOLDER')) {
			throw new ApiException('Name cannot be the same as the thumbnails folder.');
		}

		if ($this->id !== $newId) {
			Filesystem::renameFolder($this->id, $newId);
			$oldId = $this->id;
			$this->id = $newId;
			$this->name = $name;
			$this->updateCache($oldId, $newId);
		} elseif ($this->name !== $name) {
			$this->name = $name;
			$this->updateCache();
		}
	}

	/**
	 * @return void
	 */
	public function deleteFromCache() : void
	{
		$folder = Constant::get('JSON_PATH');
		$filename = 'folders.json';
		$data = Cache::get($folder, $filename);
		unset($data['data'][$this->id]);
		Cache::set($folder, $filename, $data);
	}

	/**
	 * @param  string $oldId
	 * @param  string $newId
	 * @return void
	 */
	public function updateCache(string $oldId = '', string $newId = '') : void
	{
		$folder = Constant::get('JSON_PATH');
		$filename = 'folders.json';
		$data = Cache::get($folder, $filename);
		$data['data'][$this->id] = $this->json();
		if ($oldId) {
			unset($data['data'][$oldId]);
			foreach ($data['data'] as $id => $value) {
				if (strpos($id, $oldId . '/') === 0) {
					$newChildId = preg_replace('/^' . str_replace('/', '\/', $oldId) . '\//', $newId . '/', $id);
					$value['id'] = $newChildId;
					$data['data'][$newChildId] = $value;
					unset($data['data'][$id]);
				}
			}
		}
		ksort($data['data']);
		Cache::set($folder, $filename, $data);
	}

	/**
	 * @return array
	 */
	public function json() : array
	{
		return [
			'id' => $this->id,
			'attributes' => [
				'name' => $this->name,
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
