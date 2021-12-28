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
			Folder::validateId($id);
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
		$parent = Input::post('parent');
		Folder::validateId($parent, 'Invalid parent.');
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
			throw new ApiException('No ID specified.');
		}
		Folder::validateId($id);

		$input = Input::json();
		if (empty($input->name)) {
			throw new ApiException('No name specified.');
		}
		if (!isset($input->parent)) {
			$input->parent = '';
		}
		Folder::validateId($input->parent, 'Invalid parent.');
		if (!Filesystem::folderExists($input->parent)) {
			throw new ApiException('Invalid parent.');
		}
		if ($input->parent === $id) {
			throw new ApiException('Cannot set parent to itself.');
		}
		if (strpos($input->parent, $id) === 0) {
			throw new ApiException('Cannot set parent to a descendant.');
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
			throw new ApiException('No ID specified.');
		}
		Folder::validateId($id);

		$folder = new Folder($id);
		$folder->delete();
	}
}
