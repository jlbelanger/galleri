<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Helpers\Filesystem;

class Cache
{
	/**
	 * @param  string $key
	 * @return mixed
	 */
	public static function get(string $key)
	{
		if (Filesystem::fileExists($key)) {
			$result = Filesystem::readFile($key);
			if ($result) {
				return $result;
			}
		}
		return null;
	}

	/**
	 * @param  string $key
	 * @param  mixed  $value
	 * @return mixed
	 */
	public static function set(string $key, $value)
	{
		return Filesystem::writeFile($key, $value);
	}
}
