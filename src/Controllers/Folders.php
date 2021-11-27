<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Models\Folder;
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
		if (array_key_exists('id', $_GET)) {
			$folder = new Folder($_GET['id']);
			$output = ['data' => $folder->json()];
			$output['data']['relationships']['folders'] = Folder::allInParent($_GET['id']);
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
		$folder = Folder::create($_POST['name'], $_POST['parent']);

		return ['data' => $folder->json()];
	}

	/**
	 * Updates an existing folder.
	 *
	 * @return array
	 */
	public static function put() : array
	{
		$folder = new Folder($_GET['id']);

		$body = file_get_contents('php://input');
		$input = json_decode($body);
		$newName = trim($input->parent . '/' . Utilities::nameToSlug($input->name), '/');
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
		$path = !empty($_GET['path']) ? $_GET['path'] : null;
		if (!$path) {
			throw new ApiException('No path specified.');
		}

		$folder = new Folder($path);
		$folder->delete();
	}
}
