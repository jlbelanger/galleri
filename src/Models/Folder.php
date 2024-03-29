<?php

namespace Jlbelanger\Galleri\Models;

use Jlbelanger\Galleri\Exceptions\ApiException;
use Jlbelanger\Galleri\Exceptions\ValidationException;
use Jlbelanger\Galleri\Helpers\Cache;
use Jlbelanger\Galleri\Helpers\Constant;
use Jlbelanger\Galleri\Helpers\Filesystem;
use Jlbelanger\Galleri\Helpers\Utilities;

class Folder
{
	private $id;

	private $attributes;

	private $meta;

	/**
	 * @param string $id         Eg. 'foo/bar/example-name'.
	 * @param array  $attributes Eg. ['name' => 'Example Name', 'parent' => 'foo/bar'].
	 * @param array  $meta
	 */
	public function __construct(string $id, array $attributes = [], array $meta = [])
	{
		$this->id = trim($id, '/');

		$this->attributes = $attributes;
		if (empty($this->attributes['name'])) {
			$this->attributes['name'] = Utilities::pathToName($this->id);
		}

		if (empty($this->attributes['parent'])) {
			$pathinfo = pathinfo($this->id);
			$this->attributes['parent'] = $pathinfo['dirname'] === '.' ? '' : $pathinfo['dirname'];
		}

		$this->meta = $meta;
		if (empty($this->meta['num'])) {
			$this->meta['num'] = $this->getNum();
		}
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
	 * @param  string $id         Eg. 'example-name'.
	 * @param  array  $attributes Eg. ['name' => 'Example Name', 'parent' => 'foo/bar'].
	 * @return Folder
	 */
	public static function create(string $id, array $attributes) : self
	{
		$fullId = trim($attributes['parent'] . '/' . $id, '/');
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $fullId;

		Filesystem::createFolder($fullPath);
		Filesystem::createFolder($fullPath . '/' . Constant::get('THUMBNAILS_FOLDER'));

		$folder = new self($fullId, $attributes);
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
		$attributes = !empty($data['data'][$id]['attributes']) ? $data['data'][$id]['attributes'] : [];
		return new self($id, $attributes);
	}

	/**
	 * @return integer
	 */
	protected function getNum() : int
	{
		$images = Image::all();
		$num = 0;
		foreach ($images['data'] as $image) {
			if ($image['attributes']['folder'] === $this->id) {
				$num++;
			}
		}
		return $num;
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
			'attributes' => $this->attributes,
			'meta' => $this->meta,
		];
	}

	/**
	 * Updates an existing folder.
	 *
	 * @param  string $newId      Eg. 'foo/bar/example-name'.
	 * @param  array  $attributes Eg. ['name' => 'Example Name', 'parent' => 'foo/bar'].
	 * @return void
	 */
	public function update(string $newId, array $attributes) : void
	{
		$oldId = $this->id;
		if ($this->id !== $newId) {
			Filesystem::renameFolder($this->id, $newId);
			$this->id = $newId;
			Image::updateFoldersInCache($oldId, $newId);
		}

		$this->attributes = $attributes;

		if ($oldId === $newId) {
			$this->updateCache();
		} else {
			$this->updateCache($oldId);
		}
	}

	/**
	 * Updates a folder in the cache.
	 *
	 * @param  string $oldId
	 * @return array
	 */
	public function updateCache(string $oldId = '') : array
	{
		$filename = 'folders.json';
		$data = Cache::get($filename);
		$data['data'][$this->id] = $this->json();
		if ($oldId) {
			unset($data['data'][$oldId]);
			foreach ($data['data'] as $id => $value) {
				if (strpos($id, $oldId . '/') === 0) {
					$newChildId = preg_replace('/^' . str_replace('/', '\/', $oldId) . '\//', $this->id . '/', $id);
					$value['id'] = $newChildId;
					$data['data'][$newChildId] = $value;
					unset($data['data'][$id]);
				}
			}
		}
		ksort($data['data']);
		Cache::set($filename, $data);
		return $data;
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
