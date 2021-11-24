<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;

class Constant
{
	/**
	 * Returns an environment variable's value or a default value.
	 *
	 * @param  string $key
	 * @return any
	 */
	public static function get(string $key)
	{
		$value = getenv($key);
		if ($value !== false) {
			return $value;
		}

		$defaults = [
			'JPEG_COMPRESSION' => 90,
			'PNG_COMPRESSION' => 1,
			'THUMBNAIL_IMAGE_WIDTH' => 360,
			'THUMBNAILS_FOLDER' => 'thumbnails',
			'UPLOADS_FOLDER' => 'images',
		];
		return array_key_exists($key, $defaults) ? $defaults[$key] : null;
	}

	/**
	 * Checks if environment variable is set.
	 *
	 * @param  string $key
	 * @return void
	 */
	public static function verify(string $key) : void
	{
		if (getenv($key) === false) {
			throw new ApiException('Environment variable "' . $key . '" is not set.');
		}
	}
}
