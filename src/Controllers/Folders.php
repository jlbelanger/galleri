<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Models\Folder;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Input;
use Jlbelanger\Robroy\Helpers\Utilities;

class Folders
{
	/**
	 * Returns a list of folders.
	 *
	 * @return array
	 */
	public static function get() : array
	{
		if (Input::hasGet('id')) {
			$id = Input::get('id');
			Folder::validateId($id, 'ID');
			$folder = new Folder($id);
			$output = ['data' => $folder->json()];
			$output['data']['relationships']['folders'] = Folder::allInParent($id);
			return $output;
		}

		$folders = Folder::all();
		return [
			'data' => $folders,
			'meta' => [
				'num' => count($folders),
			],
		];
	}

	/**
	 * Creates a new folder.
	 *
	 * @return array
	 */
	public static function post() : array
	{
		$name = Input::post('name');
		if (empty($name)) {
			throw new ApiException('Name is required.');
		}
		$parent = Input::post('parent');
		if ($parent) {
			Folder::validateId($parent, 'Parent');
			if (!Filesystem::folderExists($parent)) {
				throw new ApiException('Parent "' . $parent . '" does not exist.');
			}
		}
		$folder = Folder::create($name, $parent);

		return ['data' => $folder->json()];
	}

	/**
	 * Updates an existing folder.
	 *
	 * @return array
	 */
	public static function put() : array
	{
		$id = Input::get('id');
		if (!$id) {
			throw new ApiException('ID is required.');
		}
		Folder::validateId($id, 'ID');

		$input = Input::json();
		if (empty($input->name)) {
			throw new ApiException('Name is required.');
		}
		if (isset($input->parent)) {
			Folder::validateId($input->parent, 'Parent');
			if (!Filesystem::folderExists($input->parent)) {
				throw new ApiException('Parent "' . $input->parent . '" does not exist.');
			}
			if ($input->parent === $id) {
				throw new ApiException('Name and parent cannot be the same.');
			}
			if (strpos($input->parent, $id) === 0) {
				throw new ApiException('Parent cannot be a descendant of name.');
			}
		} else {
			$input->parent = '';
		}

		$newName = trim($input->parent . '/' . Utilities::nameToSlug($input->name), '/');
		$folder = new Folder($id);
		$folder->rename($newName);

		return ['data' => $folder->json()];
	}

	/**
	 * Deletes an existing folder.
	 *
	 * @return void
	 */
	public static function delete() : void
	{
		$id = Input::get('id');
		if (!$id) {
			throw new ApiException('ID is required.');
		}
		Folder::validateId($id, 'ID');

		$folder = new Folder($id);
		$folder->delete();
	}
}
