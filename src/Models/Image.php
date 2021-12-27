<?php

namespace Jlbelanger\Robroy\Models;

use Exception;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;
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

		$pos = strrpos($id, '/');
		if ($pos === false) {
			$this->thumbnailPath = Constant::get('THUMBNAILS_FOLDER') . '/' . $id;
		} else {
			$this->thumbnailPath = substr($id, 0, $pos + 1) . Constant::get('THUMBNAILS_FOLDER') . substr($id, $pos);
		}
	}

	/**
	 * Returns all images.
	 *
	 * @param  string $parent
	 * @return Image[]
	 */
	public static function all(string $parent) : array
	{
		return Filesystem::getFilesInFolder($parent);
	}

	// phpcs:disable Generic.Metrics.CyclomaticComplexity.TooHigh

	/**
	 * @param  string  $folder   Eg. 'foo'.
	 * @param  string  $name     Eg. 'bar.jpg'.
	 * @param  string  $tempPath Eg. '/tmp/phpHp00pt'.
	 * @param  integer $error
	 * @return Image
	 */
	public static function upload(string $folder, string $name, string $tempPath, int $error) : self
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

		// Get the new filename.
		list($originalWidth, $originalHeight, $fileType) = getimagesize($tempPath);
		if (empty($fileType)) {
			throw new ApiException('File "' . $name . '" is not a valid image.');
		}
		$newFilename = Utilities::cleanFilename($tempPath, $name, $fileType);

		// Move the image.
		$newPath = Constant::get('UPLOADS_PATH') . '/' . ($folder ? $folder . '/' : '') . $newFilename;
		if (file_exists($newPath)) {
			throw new ApiException('File "' . $newFilename . '" already exists.');
		}
		if (!move_uploaded_file($tempPath, $newPath)) {
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

	// phpcs:enable Generic.Metrics.CyclomaticComplexity.TooHigh

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
	 * @return string
	 */
	public function thumbnailAbsolutePath() : string
	{
		$thumbnailPath = Constant::get('UPLOADS_PATH') . '/' . $this->thumbnailPath;
		if (!file_exists($thumbnailPath)) {
			return '';
		}
		return $thumbnailPath;
	}

	/**
	 * @return array
	 */
	public function json() : array
	{
		list($width, $height) = getimagesize($this->thumbnailAbsolutePath());
		return [
			'id' => $this->id,
			'type' => 'images',
			'attributes' => [
				'thumbnail'       => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->thumbnailPath,
				'thumbnailHeight' => $height,
				'thumbnailWidth'  => $width,
				'url'             => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->id,
			],
		];
	}
}
