<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Exceptions\ValidationException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Input;
use Jlbelanger\Robroy\Helpers\Utilities;
use Jlbelanger\Robroy\Models\Folder;

class Folders
{
	/**
	 * Returns a list of folders.
	 *
	 * @return array
	 */
	public static function get() : array
	{
		return Folder::all();
	}

	/**
	 * Creates a new folder.
	 *
	 * @return array
	 */
	public static function post() : array
	{
		$input = Input::json(['filter' => ['name' => false]]);

		if (empty($input['name'])) {
			throw ValidationException::new(['name' => ['This field is required.']]);
		}
		$input['name'] = trim($input['name']);

		if (isset($input['parent'])) {
			Folder::validateId($input['parent'], 'Parent', 'parent');
			if (!Filesystem::folderExists(Constant::get('UPLOADS_PATH') . '/' . $input['parent'])) {
				throw ValidationException::new(['parent' => ['Parent "' . $input['parent'] . '" does not exist.']]);
			}
		} else {
			$input['parent'] = '';
		}

		$id = Utilities::nameToSlug($input['name']);
		if ($id === Constant::get('THUMBNAILS_FOLDER')) {
			throw ValidationException::new(['name' => ['Name cannot be the same as the thumbnails folder.']]);
		}

		$folder = Folder::create($id, $input['name'], $input['parent']);

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

		$folder = Folder::get($id);
		if (!$folder) {
			throw new ApiException('Folder "' . $id . '" does not exist.');
		}

		$input = Input::json(['filter' => ['name' => false]]);

		if (empty($input['name'])) {
			throw ValidationException::new(['name' => ['This field is required.']]);
		}
		$input['name'] = trim($input['name']);

		if (isset($input['parent'])) {
			Folder::validateId($input['parent'], 'Parent', 'parent');
			if (!Filesystem::folderExists(Constant::get('UPLOADS_PATH') . '/' . $input['parent'])) {
				throw ValidationException::new(['parent' => ['Parent "' . $input['parent'] . '" does not exist.']]);
			}
			if ($input['parent'] === $id) {
				throw ValidationException::new(['parent' => ['Name and parent cannot be the same.']]);
			}
			if (strpos($input['parent'], $id) === 0) {
				throw ValidationException::new(['parent' => ['Parent cannot be a descendant of name.']]);
			}
		} else {
			$input['parent'] = '';
		}

		$newId = Utilities::nameToSlug($input['name']);
		if ($newId === Constant::get('THUMBNAILS_FOLDER')) {
			throw ValidationException::new(['name' => ['Name cannot be the same as the thumbnails folder.']]);
		}

		$newId = trim($input['parent'] . '/' . $newId, '/');
		$folder->update($newId, $input['name']);

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
