<?php

namespace Jlbelanger\Galleri\Controllers;

use Jlbelanger\Galleri\Exceptions\ApiException;
use Jlbelanger\Galleri\Exceptions\ValidationException;
use Jlbelanger\Galleri\Helpers\Constant;
use Jlbelanger\Galleri\Helpers\Filesystem;
use Jlbelanger\Galleri\Helpers\Input;
use Jlbelanger\Galleri\Helpers\Utilities;
use Jlbelanger\Galleri\Models\Folder;

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
		$input = Input::json(['filter' => ['attributes.name' => false]]);

		if (empty($input['id'])) {
			throw ValidationException::new(['id' => ['This field is required.']]);
		}
		$id = Utilities::nameToSlug($input['id']);
		if ($id === Constant::get('THUMBNAILS_FOLDER')) {
			throw ValidationException::new(['id' => ['ID cannot be the same as the thumbnails folder.']]);
		}

		if (empty($input['attributes']['name'])) {
			throw ValidationException::new(['name' => ['This field is required.']]);
		}
		$input['attributes']['name'] = trim($input['attributes']['name']);

		if (isset($input['attributes']['parent'])) {
			Folder::validateId($input['attributes']['parent'], 'Parent', 'parent');
			if (!Filesystem::folderExists(Constant::get('UPLOADS_PATH') . '/' . $input['attributes']['parent'])) {
				throw ValidationException::new(['parent' => ['Parent "' . $input['attributes']['parent'] . '" does not exist.']]);
			}
		} else {
			$input['attributes']['parent'] = '';
		}

		$folder = Folder::create($id, $input['attributes']);

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

		$input = Input::json(['filter' => ['attributes.name' => false]]);

		if (empty($input['id'])) {
			throw ValidationException::new(['id' => ['This field is required.']]);
		}
		$newId = Utilities::nameToSlug($input['id']);
		if ($newId === Constant::get('THUMBNAILS_FOLDER')) {
			throw ValidationException::new(['id' => ['ID cannot be the same as the thumbnails folder.']]);
		}

		if (empty($input['attributes']['name'])) {
			throw ValidationException::new(['name' => ['This field is required.']]);
		}
		$input['attributes']['name'] = trim($input['attributes']['name']);

		if (isset($input['attributes']['parent'])) {
			Folder::validateId($input['attributes']['parent'], 'Parent', 'parent');
			if (!Filesystem::folderExists(Constant::get('UPLOADS_PATH') . '/' . $input['attributes']['parent'])) {
				throw ValidationException::new(['parent' => ['Parent "' . $input['attributes']['parent'] . '" does not exist.']]);
			}
			if ($input['attributes']['parent'] === $id) {
				throw ValidationException::new(['parent' => ['Name and parent cannot be the same.']]);
			}
			if (strpos($input['attributes']['parent'], $id) === 0) {
				throw ValidationException::new(['parent' => ['Parent cannot be a descendant of name.']]);
			}
		} else {
			$input['attributes']['parent'] = '';
		}

		$newId = trim($input['attributes']['parent'] . '/' . $newId, '/');
		$folder->update($newId, $input['attributes']);

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
