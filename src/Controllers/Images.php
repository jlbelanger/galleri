<?php

namespace Jlbelanger\Robroy\Controllers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Api;
use Jlbelanger\Robroy\Models\Image;

class Images
{
	/**
	 * Returns a list of images.
	 *
	 * @return array
	 */
	public static function get()
	{
		$images = Image::all();
		$page = !empty($_GET['page']) ?: null;
		$number = !empty($page['number']) ? (int) $page['number'] : 1;
		$size = !empty($page['size']) ? (int) $page['size'] : 10;

		return Api::paginate($images, $number, $size);
	}

	/**
	 * Uploads a new image.
	 *
	 * @return array
	 */
	public static function post()
	{
		$num = count($_FILES['upload']['name']);
		$images = [];

		for ($i = 0; $i < $num; $i++) {
			$name = $_FILES['upload']['name'][$i];
			$tempPath = $_FILES['upload']['tmp_name'][$i];
			$error = $_FILES['upload']['error'][$i];

			$image = Image::upload($name, $tempPath, $error);
			$images[] = $image->json();
		}

		return ['data' => $images];
	}

	/**
	 * Deletes an existing image.
	 *
	 * @return void
	 */
	public static function delete()
	{
		$path = !empty($_GET['path']) ? $_GET['path'] : null;
		if (!$path) {
			throw new ApiException('No path specified.');
		}

		$image = new Image($path);
		$image->delete();
	}
}
