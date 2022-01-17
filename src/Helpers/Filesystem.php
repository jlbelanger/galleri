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
	 * @param  string $oldPath Eg. '/var/www/foo.png'.
	 * @param  string $newPath Eg. '/var/www/bar.png'.
	 * @return boolean
	 */
	public static function copyFile(string $oldPath, string $newPath) : bool
	{
		return copy($oldPath, $newPath);
	}

	/**
	 * Creates a folder in the file system.
	 *
	 * @param  string $path Eg. '/var/www/foo'.
	 * @return void
	 */
	public static function createFolder(string $path) : void
	{
		$folder = basename($path);
		if (self::fileExists($path)) {
			throw new ApiException('Folder "' . $folder . '" already exists.');
		}

		if (!mkdir($path)) {
			throw new ApiException('Folder "' . $folder . '" could not be created.', 500);
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
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $filename;
		if (!self::fileExists($fullPath)) {
			throw new ApiException('File "' . $filename . '" does not exist.');
		}

		if (!unlink($fullPath)) {
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
		if (!self::fileExists($fullPath)) {
			return;
		}

		if (!self::isEmpty($fullPath)) {
			throw new ApiException('Folder "' . $path . '" is not empty, so it could not be deleted.', 500);
		}

		if (self::fileExists($fullPath . '/.DS_Store')) {
			self::deleteFile($path . '/.DS_Store');
		}

		if (!rmdir($fullPath)) {
			throw new ApiException('Folder "' . $path . '" could not be deleted.', 500);
		}
	}

	/**
	 * Returns true if file exists.
	 *
	 * @param  string $path Eg. '/var/www/foo.png'.
	 * @return boolean
	 */
	public static function fileExists(string $path) : bool
	{
		return file_exists($path);
	}

	/**
	 * Returns true if folder exists.
	 *
	 * @param  string $path Eg. '/var/www/foo'.
	 * @return boolean
	 */
	public static function folderExists(string $path) : bool
	{
		return is_dir($path);
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
	 * @param  string  $parent
	 * @param  boolean $isRecursive
	 * @return array
	 */
	public static function getFilesInFolder(string $parent, bool $isRecursive = false) : array
	{
		$fullParentPath = Constant::get('UPLOADS_PATH') . '/' . $parent;
		if (!self::folderExists($fullParentPath)) {
			return [];
		}

		$output = [];

		if ($handle = opendir($fullParentPath)) {
			while (($filename = readdir($handle)) !== false) {
				if (strpos($filename, '.') === 0) {
					continue;
				}
				if (self::folderExists($fullParentPath . '/' . $filename)) {
					if ($isRecursive) {
						$output = array_merge($output, self::getFilesInFolder($parent . '/' . $filename, $isRecursive));
					} else {
						continue;
					}
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
	 * @param  string $parent
	 * @return array
	 */
	public static function getFolders(string $parent = '') : array
	{
		$fullParentPath = Constant::get('UPLOADS_PATH') . '/' . $parent;
		if (!self::folderExists($fullParentPath)) {
			return [];
		}

		$output = [];

		if ($handle = opendir($fullParentPath)) {
			while (($folderName = readdir($handle)) !== false) {
				if (strpos($folderName, '.') === 0
					|| $folderName === Constant::get('THUMBNAILS_FOLDER')
					|| !self::folderExists($fullParentPath . '/' . $folderName)
				) {
					continue;
				}

				$id = trim($parent . '/' . $folderName, '/');
				$folder = new Folder($id);
				$output[$id] = $folder->json();
				$output = array_merge($output, self::getFolders($id));
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
	 * @param  string $path
	 * @return mixed
	 */
	public static function readFile(string $path)
	{
		$data = file_get_contents($path);
		return json_decode($data, true);
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
		if (!self::fileExists($fullOldPath)) {
			throw new ApiException($type . ' "' . $oldPath . '" does not exist.');
		}

		$fullNewPath = Constant::get('UPLOADS_PATH') . '/' . $newPath;
		if (self::fileExists($fullNewPath)) {
			throw new ApiException($type . ' "' . $newPath . '" already exists.');
		}

		if (!rename($fullOldPath, $fullNewPath)) {
			throw new ApiException($type . ' "' . $oldPath . '" could not be moved to "' . $newPath . '".', 500);
		}
	}

	/**
	 * @param  string $path
	 * @param  mixed  $data
	 * @return boolean
	 */
	public static function writeFile(string $path, $data) : bool
	{
		$data = json_encode($data);
		$result = file_put_contents($path, $data);
		return $result !== false;
	}
}
