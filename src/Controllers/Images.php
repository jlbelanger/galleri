<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Api;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Input;
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
		$parent = Input::get('parent');
		Folder::validateId($parent, 'Invalid parent.');
		$images = Image::all($parent);
		$page = Input::get('page', null);
		$number = (int) Input::get('number', 1);
		$size = (int) Input::get('size', 10);

		return Api::paginate($images, $number, $size);
	}

	/**
	 * Uploads a new image.
	 *
	 * @return array
	 */
	public static function post() : array
	{
		$folder = Input::post('folder');
		Folder::validateId($folder, 'Invalid folder.');
		$num = count($_FILES['upload']['name']);
		$images = [];

		for ($i = 0; $i < $num; $i++) {
			$name = Input::file('upload', 'name', $i);
			$tempPath = Input::file('upload', 'tmp_name', $i);
			$error = Input::file('upload', 'error', $i, FILTER_SANITIZE_NUMBER_INT);

			$image = Image::upload($folder, $name, $tempPath, $error);
			$images[] = $image->json();
		}

		return ['data' => $images];
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
		Image::validateId($id);

		$input = Input::json();
		if (empty($input->filename)) {
			throw new ApiException('No filename specified.');
		}
		if (strpos($input->filename, '/') !== false) {
			throw new ApiException('Filename cannot contain slashes.');
		}
		Image::validateId($input->filename);
		if (!isset($input->folder)) {
			$input->folder = '';
		}
		Folder::validateId($input->folder, 'Invalid folder.');
		if (!Filesystem::folderExists($input->folder)) {
			throw new ApiException('Invalid folder.');
		}

		$newName = trim($input->folder . '/' . $input->filename, '/');
		$image = new Image($id);
		$image->rename($newName);

		return ['data' => $image->json()];
	}

	/**
	 * Deletes an existing image.
	 *
	 * @return void
	 */
	public static function delete() : void
	{
		$path = Input::get('path');
		if (!$path) {
			throw new ApiException('No path specified.');
		}
		Image::validateId($path);

		$image = new Image($path);
		$image->delete();
	}
}
