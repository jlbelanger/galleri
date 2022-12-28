<?php

namespace Jlbelanger\Galleri\Helpers;

class Utilities
{
	/**
	 * @param  string  $path     Eg. '/tmp/phpHp00pt'.
	 * @param  string  $filename Eg. 'bar.jpg'.
	 * @param  integer $fileType
	 * @return string
	 */
	public static function cleanFilename(string $path, string $filename, int $fileType) : string
	{
		$filename = self::normalizeFilename($filename);
		$date = '';

		if (Exif::exists($fileType)) {
			$exif = Exif::get($path);

			if (!empty($exif['DateTimeOriginal'])) {
				$date = $exif['DateTimeOriginal'];
				$date = str_replace(' ', '-', $date);
				$date = str_replace(':', '-', $date);
			}
		}

		if (empty($date) && preg_match('/\d{4}.\d{2}.\d{2}.\d{2}.\d{2}.\d{2}/', $filename, $matches)) {
			$date = preg_replace('/[^\d]+/', '-', $matches[0]);
		}

		if (empty($date)) {
			$date = date('Y-m-d-H-i-s');
		}

		return $date . '-' . $filename;
	}

	/**
	 * @param  array $defaults
	 * @param  array $values
	 * @return array
	 */
	public static function combineArgs(array $defaults, array $values) : array
	{
		return array_merge($defaults, $values);
	}

	/**
	 * @param  string $s
	 * @param  string $allowed
	 * @return string
	 */
	public static function nameToSlug(string $s, string $allowed = 'a-z0-9') : string
	{
		$s = strip_tags($s);
		$s = strtolower($s);
		$s = str_replace(' & ', ' and ', $s);
		$s = str_replace('&', ' and ', $s);
		$s = str_replace("'", '', $s);
		$s = str_replace('’', '', $s);
		$s = str_replace('.', '', $s);
		$s = preg_replace('/[^' . $allowed . ']+/', '-', $s);
		$s = preg_replace('/-+/', '-', $s);
		$s = trim($s, '-');
		return $s;
	}

	/**
	 * @param  string $s
	 * @return string
	 */
	public static function normalizeFilename(string $s) : string
	{
		$pos = strrpos($s, '.');
		if ($pos !== false) {
			$filename = substr($s, 0, $pos);
			$extension = substr($s, $pos);
			$extension = self::nameToSlug($extension);
			if ($extension === 'jpeg') {
				$extension = 'jpg';
			}
		} else {
			$filename = $s;
			$extension = '';
		}
		$s = self::nameToSlug($filename, 'a-z0-9_-');
		if ($extension) {
			$s .= '.' . $extension;
		}
		return $s;
	}

	/**
	 * @param  string $s
	 * @return string
	 */
	public static function pathToName(string $s) : string
	{
		$pos = strrpos($s, '/');
		if ($pos !== false) {
			$s = substr($s, $pos + 1);
		}
		$s = str_replace('-', ' ', $s);
		$s = ucwords($s);
		return $s;
	}
}
