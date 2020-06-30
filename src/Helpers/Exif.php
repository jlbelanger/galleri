<?php

namespace Jlbelanger\Robroy\Helpers;

use Exception;

class Exif
{
	/**
	 * Returns EXIF data for the given file.
	 *
	 * @param  string $path
	 * @return array
	 */
	public static function get(string $path)
	{
		try {
			return exif_read_data($path);
		} catch (Exception $e) {
			return [];
		}
	}

	/**
	 * Returns true if this file type has EXIF data.
	 *
	 * @param  integer $fileType
	 * @return boolean
	 */
	public static function exists(int $fileType)
	{
		return $fileType === IMAGETYPE_JPEG;
	}
}
