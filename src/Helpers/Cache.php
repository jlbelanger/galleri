<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Helpers\Filesystem;

class Cache
{
	/**
	 * @param  string $filename
	 * @return mixed
	 */
	public static function get(string $filename)
	{
		Constant::verify('JSON_PATH');
		$folder = Constant::get('JSON_PATH');
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
	 * @param  string $filename
	 * @param  mixed  $value
	 * @return boolean
	 */
	public static function set(string $filename, $value) : bool
	{
		Constant::verify('JSON_PATH');
		$folder = Constant::get('JSON_PATH');
		if (!Filesystem::folderExists($folder)) {
			Filesystem::createFolder($folder);
		}
		$path = $folder . '/' . $filename;
		return Filesystem::writeFile($path, $value);
	}
}
