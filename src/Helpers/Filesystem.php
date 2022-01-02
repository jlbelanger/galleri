<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Models\Folder;
use Jlbelanger\Robroy\Models\Image;

class Filesystem
{
	/**
	 * Returns true if folder exists.
	 *
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @return boolean
	 */
	public static function copyFile(string $oldPath, string $newPath) : bool
	{
		return copy($oldPath, $newPath);
	}

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
			return;
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
	 * Returns true if file exists.
	 *
	 * @param  string $path
	 * @return boolean
	 */
	public static function fileExists(string $path) : bool
	{
		return file_exists(Constant::get('UPLOADS_PATH') . '/' . $path);
	}

	/**
	 * Returns true if folder exists.
	 *
	 * @param  string $path
	 * @return boolean
	 */
	public static function folderExists(string $path) : bool
	{
		return is_dir(Constant::get('UPLOADS_PATH') . '/' . $path);
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
	public static function getFilesInFolder(string $parent) : array
	{
		$uploadsPath = Constant::get('UPLOADS_PATH') . '/' . $parent;
		if (!is_dir($uploadsPath)) {
			throw new ApiException('This folder does not exist.', 404);
		}

		$output = [];

		if ($handle = opendir($uploadsPath)) {
			while (($filename = readdir($handle)) !== false) {
				if (strpos($filename, '.') === 0 || is_dir($uploadsPath . '/' . $filename)) {
					continue;
				}

				$fullPath = trim($parent . '/' . $filename, '/');
				$image = new Image($fullPath);
				if (!$image->thumbnailAbsolutePath()) {
					continue;
				}
				$output[$fullPath] = $image;
			}

			closedir($handle);
		}

		ksort($output);
		return array_reverse(array_values($output));
	}

	/**
	 * @param  string  $parent
	 * @param  boolean $isRecursive
	 * @return array
	 */
	public static function getFoldersInFolder(string $parent, bool $isRecursive = false) : array
	{
		$uploadsPath = Constant::get('UPLOADS_PATH') . '/' . $parent;
		if (!is_dir($uploadsPath)) {
			throw new ApiException('This folder does not exist.', 404);
		}

		$output = [];

		if ($handle = opendir($uploadsPath)) {
			while (($folderName = readdir($handle)) !== false) {
				if (strpos($folderName, '.') === 0
					|| $folderName === Constant::get('THUMBNAILS_FOLDER')
					|| !is_dir($uploadsPath . '/' . $folderName)
				) {
					continue;
				}

				$fullPath = trim($parent . '/' . $folderName, '/');
				$folder = new Folder($fullPath);
				$output[$fullPath] = $folder->json();
				if ($isRecursive) {
					$output = array_merge($output, self::getFoldersInFolder($fullPath, $isRecursive));
				}
			}

			closedir($handle);
		}

		return $output;
	}

	/**
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @return boolean
	 */
	public static function moveFile(string $oldPath, string $newPath) : bool
	{
		return move_uploaded_file($oldPath, Constant::get('UPLOADS_PATH') . '/' . $newPath);
	}

	/**
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @return void
	 */
	public static function renameFile(string $oldPath, string $newPath) : void
	{
		self::rename($oldPath, $newPath, 'File');
	}

	/**
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @return void
	 */
	public static function renameFolder(string $oldPath, string $newPath) : void
	{
		self::rename($oldPath, $newPath, 'Folder');
	}

	/**
	 * @param  string $oldPath
	 * @param  string $newPath
	 * @param  string $type
	 * @return void
	 */
	protected static function rename(string $oldPath, string $newPath, string $type = 'Folder') : void
	{
		$fullOldPath = Constant::get('UPLOADS_PATH') . '/' . $oldPath;
		if (!file_exists($fullOldPath)) {
			throw new ApiException($type . ' "' . $oldPath . '" does not exist.');
		}

		$fullNewPath = Constant::get('UPLOADS_PATH') . '/' . $newPath;
		if (file_exists($fullNewPath)) {
			throw new ApiException($type . ' "' . $newPath . '" already exists.');
		}

		if (!rename($fullOldPath, $fullNewPath)) {
			throw new ApiException($type . ' "' . $oldPath . '" could not be moved to "' . $newPath . '".', 500);
		}
	}
}
