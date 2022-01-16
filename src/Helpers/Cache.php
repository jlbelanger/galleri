<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Helpers\Filesystem;

class Cache
{
	/**
	 * @param  string $folder
	 * @param  string $filename
	 * @return mixed
	 */
	public static function get(string $folder, string $filename)
	{
		$path = $folder . '/' . $filename;
		if (Filesystem::fileExists($path)) {
			$result = Filesystem::readFile($path);
			if ($result) {
				return $result;
			}
		}
		return null;
	}

	/**
	 * @param  string $folder
	 * @param  string $filename
	 * @param  mixed  $value
	 * @return boolean
	 */
	public static function set(string $folder, string $filename, $value) : bool
	{
		if (!Filesystem::folderExists($folder)) {
			Filesystem::createFolder($folder);
		}
		$path = $folder . '/' . $filename;
		return Filesystem::writeFile($path, $value);
	}
}
