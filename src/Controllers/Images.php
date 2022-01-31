<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Exceptions\ValidationException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Input;
use Jlbelanger\Robroy\Helpers\Utilities;
use Jlbelanger\Robroy\Models\Folder;
use Jlbelanger\Robroy\Models\Image;

class Images
{
	/**
	 * Returns a list of images.
	 *
	 * @return array
	 */
	public static function get() : array
	{
		return Image::all();
	}

	/**
	 * Uploads a new image.
	 *
	 * @return array
	 */
	public static function post() : array
	{
		$folder = Input::post('folder');
		Folder::validateId($folder, 'Folder');
		$num = count(Input::file(['upload', 'name']));
		$images = [];

		for ($i = 0; $i < $num; $i++) {
			$name = Input::file(['upload', 'name', $i]);
			$tempPath = Input::file(['upload', 'tmp_name', $i]);
			$error = Input::file(['upload', 'error', $i], ['default' => 0, 'filter' => FILTER_SANITIZE_NUMBER_INT]);

			$image = Image::create($folder, $name, $tempPath, $error);
			$images[] = $image->json();
		}

		return ['data' => $images];
	}

	/**
	 * Updates an existing image.
	 *
	 * @return array
	 */
	public static function put() : array
	{
		$id = Input::get('id');
		if (!$id) {
			throw new ApiException('ID is required.');
		}
		Image::validateId($id, 'ID');

		$image = Image::get($id);
		if (!$image) {
			throw new ApiException('Image "' . $id . '" does not exist.');
		}

		$input = Input::json(['filter' => ['title' => false]]);

		if (empty($input['filename'])) {
			throw ValidationException::new(['filename' => ['This field is required.']]);
		}
		if (strpos($input['filename'], '/') !== false) {
			throw ValidationException::new(['filename' => ['Filename cannot contain slashes.']]);
		}
		$input['filename'] = Utilities::normalizeFilename($input['filename']);
		Image::validateId($input['filename'], 'Filename', 'filename');

		if (!isset($input['folder'])) {
			$input['folder'] = '';
		}
		Folder::validateId($input['folder'], 'Folder', 'folder');
		if (!Filesystem::folderExists(Constant::get('UPLOADS_PATH') . '/' . $input['folder'])) {
			throw ValidationException::new(['folder' => ['Folder "' . $input['folder'] . '" does not exist.']]);
		}

		if (!isset($input['folder'])) {
			$input['title'] = '';
		} else {
			$input['title'] = trim($input['title']);
		}

		$newName = trim($input['folder'] . '/' . $input['filename'], '/');
		$image->update($newName, $input['title']);

		return ['data' => $image->json()];
	}

	/**
	 * Deletes an existing image.
	 *
	 * @return void
	 */
	public static function delete() : void
	{
		$id = Input::get('id');
		if (!$id) {
			throw new ApiException('ID is required.');
		}
		Image::validateId($id, 'ID');

		$image = new Image($id);
		$image->delete();
	}
}
