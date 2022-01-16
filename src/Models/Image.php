<?php

namespace Jlbelanger\Robroy\Models;

use Exception;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\Exif;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Utilities;

class Image
{
	private $id;

	private $thumbnailPath;

	/**
	 * @param string $id Eg. 'foo/bar.jpg'.
	 */
	public function __construct(string $id)
	{
		$this->id = $id;
		$this->thumbnailPath = $this->getThumbnailPath($id);
	}

	/**
	 * Returns all images.
	 *
	 * @return Image[]
	 */
	public static function all() : array
	{
		return Filesystem::getFilesInFolder('', true);
	}

	/**
	 * Returns all images in a folder.
	 *
	 * @param  string $parent
	 * @return Image[]
	 */
	public static function allInFolder(string $parent) : array
	{
		return Filesystem::getFilesInFolder($parent);
	}

	/**
	 * @param  string  $folder   Eg. 'foo'.
	 * @param  string  $name     Eg. 'bar.jpg'.
	 * @param  string  $tempPath Eg. '/tmp/phpHp00pt'.
	 * @param  integer $error
	 * @return Image
	 */
	public static function upload(string $folder, string $name, string $tempPath, int $error) : self
	{
		self::validateUpload($name, $tempPath, $error);

		// Get the new filename.
		list($originalWidth, $originalHeight, $fileType) = getimagesize($tempPath);
		if (empty($fileType)) {
			throw new ApiException('File "' . $name . '" is not a valid image.');
		}
		$newFilename = Utilities::cleanFilename($tempPath, $name, $fileType);

		// Move the image.
		$newPath = ($folder ? $folder . '/' : '') . $newFilename;
		$fullNewPath = Constant::get('UPLOADS_PATH') . '/' . $newPath;
		if (Filesystem::fileExists($fullNewPath)) {
			throw new ApiException('File "' . $newFilename . '" already exists.');
		}
		if (!Filesystem::moveFile($tempPath, $newPath)) {
			throw new ApiException('File "' . $newFilename . '" could not be moved.', 500);
		}

		// Create thumbnail and resize original.
		try {
			Utilities::createThumbnailFile($folder, $newFilename, $originalWidth, $originalHeight, $fileType);

			$maxWidth = Constant::get('FULL_IMAGE_MAX_WIDTH');
			if ($maxWidth && $originalWidth > $maxWidth) {
				Utilities::resizeFile($folder, $newFilename, $maxWidth, $originalWidth, $originalHeight, $fileType, true);
			}
		} catch (Exception $e) {
			Filesystem::deleteFile(($folder ? $folder . '/' : '') . $newFilename);
			Filesystem::deleteFile(($folder ? $folder . '/' : '') . Constant::get('THUMBNAILS_FOLDER') . '/' . $newFilename);
			throw $e;
		}

		return new self(($folder ? $folder . '/' : '') . $newFilename);
	}

	/**
	 * @param  string  $name     Eg. 'bar.jpg'.
	 * @param  string  $tempPath Eg. '/tmp/phpHp00pt'.
	 * @param  integer $error
	 * @return void
	 */
	protected static function validateUpload(string $name, string $tempPath, int $error) : void
	{
		// Check for upload errors.
		if (empty($tempPath) || !empty($error)) {
			$errors = [
				UPLOAD_ERR_INI_SIZE => 'the file is too large (max: ' . ini_get('upload_max_filesize') . ').',
				UPLOAD_ERR_FORM_SIZE => 'the file is too large.',
				UPLOAD_ERR_PARTIAL => 'the file was only partially uploaded.',
				UPLOAD_ERR_NO_FILE => 'no file was uploaded.',
				UPLOAD_ERR_NO_TMP_DIR => 'temporary folder is missing.',
				UPLOAD_ERR_CANT_WRITE => 'the file could not be written to disk.',
				UPLOAD_ERR_EXTENSION => 'a PHP extension stopped the file upload.',
			];
			if (!empty($errors[$error])) {
				$error = $errors[$error];
			} else {
				$error = 'code ' . $error;
			}
			throw new ApiException('File "' . $name . '" could not be uploaded: ' . $error);
		}
	}

	/**
	 * Deletes an image.
	 *
	 * @return void
	 */
	public function delete() : void
	{
		Filesystem::deleteFile($this->id);
		Filesystem::deleteFile($this->thumbnailPath);
	}

	/**
	 * @param  string $newId Eg. 'foo/bar.jpg'.
	 * @return void
	 */
	public function rename(string $newId) : void
	{
		if ($this->id === $newId) {
			return;
		}

		Filesystem::renameFile($this->id, $newId);

		$folder = self::getFolder($newId);
		$folder = $folder ? $folder . '/' : '';
		$thumbnailFolder = $folder . Constant::get('THUMBNAILS_FOLDER');
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $thumbnailFolder;
		if (!Filesystem::folderExists($fullPath)) {
			Filesystem::createFolder($fullPath);
		}
		Filesystem::renameFile($this->thumbnailPath, self::getThumbnailPath($newId));

		$this->id = $newId;
		$this->thumbnailPath = $this->getThumbnailPath($newId);
	}

	/**
	 * @param  string $id
	 * @return string
	 */
	protected static function getFolder(string $id) : string
	{
		$pathinfo = pathinfo($id);
		return $pathinfo['dirname'];
	}

	/**
	 * @param  string $id
	 * @return string
	 */
	protected static function getThumbnailPath(string $id) : string
	{
		$pos = strrpos($id, '/');
		if ($pos === false) {
			return Constant::get('THUMBNAILS_FOLDER') . '/' . $id;
		}
		return substr($id, 0, $pos + 1) . Constant::get('THUMBNAILS_FOLDER') . substr($id, $pos);
	}

	/**
	 * @return string
	 */
	public function thumbnailAbsolutePath() : string
	{
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . $this->thumbnailPath;
		if (!Filesystem::fileExists($fullPath)) {
			return '';
		}
		return $fullPath;
	}

	/**
	 * @return array
	 */
	public function json() : array
	{
		list($width, $height) = getimagesize($this->thumbnailAbsolutePath());

		$path = Constant::get('UPLOADS_PATH') . '/' . $this->id;
		$pathinfo = pathinfo($this->id);

		return [
			'id' => $this->id,
			'attributes' => [
				'filename'        => $pathinfo['basename'],
				'folder'          => $pathinfo['dirname'],
				'thumbnail'       => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->thumbnailPath,
				'thumbnailHeight' => $height,
				'thumbnailWidth'  => $width,
				'url'             => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->id,
			],
		];
	}

	/**
	 * @param  string $id
	 * @param  string $type
	 * @return void
	 */
	public static function validateId(string $id, string $type = 'Filename') : void
	{
		if ($id === '') {
			return;
		}
		if (trim($id, '/') !== $id) {
			throw new ApiException($type . ' cannot begin or end with slashes.');
		}
		if (trim($id, '.') !== $id) {
			throw new ApiException($type . ' cannot begin or end with periods.');
		}
		if (strpos($id, '.') === false) {
			throw new ApiException($type . ' is missing a file extension (eg. JPG, PNG).');
		}
		if ($id === Constant::get('THUMBNAILS_FOLDER')) {
			throw new ApiException($type . ' cannot be the same as the thumbnails folder.');
		}
		if (!preg_match('/^[a-z0-9_\.\/-]+$/', $id)) {
			throw new ApiException($type . ' contains invalid characters.');
		}
		if (preg_match('/(^|\/)' . str_replace('/', '\/', Constant::get('THUMBNAILS_FOLDER')) . '$/', $id)) {
			throw new ApiException($type . ' cannot end in the thumbnails folder.');
		}
	}
}
