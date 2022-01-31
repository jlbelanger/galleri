<?php

namespace Jlbelanger\Robroy\Models;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Exceptions\ValidationException;
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
		$filename = 'folders.json';
		$output = $useCache ? Cache::get($filename) : null;
		if ($output === null) {
			$rows = Filesystem::getFolders();
			ksort($rows);
			$output = ['data' => $rows];
			Cache::set($filename, $output);
		}
		return $output;
	}

	/**
	 * Creates a new folder.
	 *
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
	 * Deletes an existing folder.
	 *
	 * @return void
	 */
	public function delete() : void
	{
		Filesystem::deleteFolder($this->id . '/' . Constant::get('THUMBNAILS_FOLDER'));
		Filesystem::deleteFolder($this->id);
		$this->deleteFromCache();
	}

	/**
	 * Deletes a folder from the cache.
	 *
	 * @return void
	 */
	public function deleteFromCache() : void
	{
		$filename = 'folders.json';
		$data = Cache::get($filename);
		unset($data['data'][$this->id]);
		Cache::set($filename, $data);
	}

	/**
	 * Gets an existing folder's data.
	 *
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
	 * Returns all data about this folder.
	 *
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
	 * Updates an existing folder.
	 *
	 * @param  string $newId Eg. 'foo/bar/example-name'.
	 * @param  string $name  Eg. 'Example Name'.
	 * @return void
	 */
	public function update(string $newId, string $name) : void
	{
		if ($this->id === $newId && $this->name === $name) {
			return;
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

		// TODO: Update image cache.
	}

	/**
	 * Updates a folder in the cache.
	 *
	 * @param  string $oldId
	 * @param  string $newId
	 * @return void
	 */
	public function updateCache(string $oldId = '', string $newId = '') : void
	{
		$filename = 'folders.json';
		$data = Cache::get($filename);
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
		Cache::set($filename, $data);
	}

	/**
	 * Checks if the given ID is valid.
	 *
	 * @param  string $id
	 * @param  string $type
	 * @param  string $attribute
	 * @return void
	 */
	public static function validateId(string $id, string $type = 'Folder', string $attribute = '') : void
	{
		if ($id === '') {
			return;
		}

		$message = '';
		if (trim($id, '/') !== $id) {
			$message = $type . ' cannot begin or end with slashes.';
		} elseif ($id === Constant::get('THUMBNAILS_FOLDER')) {
			$message = $type . ' cannot be the same as the thumbnails folder.';
		} elseif (preg_match('/(^|\/)' . str_replace('/', '\/', Constant::get('THUMBNAILS_FOLDER')) . '$/', $id)) {
			$message = $type . ' cannot end in the thumbnails folder.';
		} elseif (!preg_match('/^[a-z0-9\/-]+$/', $id)) {
			$message = $type . ' contains invalid characters.';
		}

		if ($message) {
			if ($attribute) {
				throw ValidationException::new([$attribute => [$message]]);
			} else {
				throw new ApiException($message);
			}
		}
	}
}
