<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Models\Folder;

class Filesystem
{
	/**
	 * Creates a folder in the file system.
	 *
	 * @param  string $path
	 * @return void
	 */
	public static function createFolder(string $path) : void
	{
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $path;
		if (file_exists($fullPath)) {
			throw new ApiException('Folder "' . $path . '" already exists.');
		}
		if (!mkdir($fullPath)) {
			throw new ApiException('Folder "' . $path . '" could not be created.', 500);
		}
	}

	/**
	 * Deletes a file from the file system.
	 *
	 * @param  string $filename
	 * @return void
	 */
	public static function deleteFile(string $filename) : void
	{
		$path = Constant::get('UPLOADS_PATH') . '/' . $filename;
		if (!file_exists($path)) {
			throw new ApiException('File "' . $filename . '" does not exist.');
		}
		if (!unlink($path)) {
			throw new ApiException('File "' . $filename . '" could not be deleted.', 500);
		}
	}

	/**
	 * Deletes a folder from the file system.
	 *
	 * @param  string $path
	 * @return void
	 */
	public static function deleteFolder(string $path) : void
	{
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $path;
		if (!file_exists($fullPath)) {
			throw new ApiException('Folder "' . $path . '" does not exist.');
		}
		if (!self::isEmpty($fullPath)) {
			throw new ApiException('Folder "' . $path . '" is not empty, so it could not be deleted.', 500);
		}
		if (file_exists($fullPath . '/.DS_Store')) {
			self::deleteFile($path . '/.DS_Store');
		}
		if (!rmdir($fullPath)) {
			throw new ApiException('Folder "' . $path . '" could not be deleted.', 500);
		}
	}

	/**
	 * Returns true if a directory contains no files.
	 *
	 * @param  string $path
	 * @return boolean
	 */
	public static function isEmpty(string $path) : bool
	{
		if ($handle = opendir($path)) {
			while (($filename = readdir($handle)) !== false) {
				if ($filename !== '.' && $filename !== '..' && $filename !== '.DS_Store') {
					closedir($handle);
					return false;
				}
			}
			closedir($handle);
		}
		return true;
	}

	/**
	 * @param  string $parent
	 * @return array
	 */
	public static function getFoldersInFolder(string $parent) : array
	{
		$uploadsPath = Constant::get('UPLOADS_PATH');
		if (!is_dir($uploadsPath)) {
			throw new ApiException('This folder does not exist.', 404);
		}

		$output = [];

		if ($handle = opendir($uploadsPath . '/' . $parent)) {
			while (($folderName = readdir($handle)) !== false) {
				$fullPath = trim($parent . '/' . $folderName, '/');
				if (!is_dir($uploadsPath . '/' . $fullPath) || strpos($folderName, '.') === 0 || $folderName === Constant::get('THUMBNAILS_FOLDER')) {
					continue;
				}

				$folder = new Folder($fullPath);
				$output[$fullPath] = $folder->json();
				$output = array_merge($output, self::getFoldersInFolder($fullPath));
			}

			closedir($handle);
		}

		return $output;
	}

	/**
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @return void
	 */
	public static function renameFolder(string $oldPath, string $newPath) : void
	{
		$fullOldPath = Constant::get('UPLOADS_PATH') . '/' . $oldPath;
		if (!file_exists($fullOldPath)) {
			throw new ApiException('Folder "' . $oldPath . '" does not exist.');
		}

		$fullNewPath = Constant::get('UPLOADS_PATH') . '/' . $newPath;
		if (file_exists($fullNewPath)) {
			throw new ApiException('Folder "' . $newPath . '" already exists.');
		}

		if (!rename($fullOldPath, $fullNewPath)) {
			throw new ApiException('Folder "' . $oldPath . '" could not be moved to "' . $newPath . '".', 500);
		}
	}
}
