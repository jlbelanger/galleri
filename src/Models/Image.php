<?php

namespace Jlbelanger\Robroy\Models;

use Exception;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Exceptions\ValidationException;
use Jlbelanger\Robroy\Helpers\Cache;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\ImageFile;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\Utilities;

class Image
{
	private $id;

	private $thumbnailPath;

	/**
	 * @param string $id    Eg. 'foo/bar.jpg'.
	 * @param string $title Eg. 'Example Title'.
	 */
	public function __construct(string $id, string $title = '')
	{
		$this->id = $id;
		$this->title = $title;
		$this->thumbnailPath = $this->getThumbnailPath($id);
	}

	/**
	 * Returns all images.
	 *
	 * @param  boolean $useCache
	 * @return Image[]
	 */
	public static function all(bool $useCache = true) : array
	{
		$filename = 'images.json';
		$output = $useCache ? Cache::get($filename) : null;
		if ($output === null) {
			$rows = Filesystem::getFilesInFolder('', true);
			ksort($rows);
			$output = ['data' => $rows];
			Cache::set($filename, $output);
		}
		return $output;
	}

	/**
	 * Creates a new image.
	 *
	 * @param  string  $folder   Eg. 'foo'.
	 * @param  string  $name     Eg. 'bar.jpg'.
	 * @param  string  $tempPath Eg. '/tmp/phpHp00pt'.
	 * @param  integer $error
	 * @return Image
	 */
	public static function create(string $folder, string $name, string $tempPath, int $error) : self
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
		Filesystem::moveFile($tempPath, $newPath);

		// Create thumbnail and resize original.
		try {
			ImageFile::createThumbnailFile($folder, $newFilename, $originalWidth, $originalHeight, $fileType);

			$maxWidth = Constant::get('FULL_IMAGE_MAX_WIDTH');
			if ($maxWidth && $originalWidth > $maxWidth) {
				ImageFile::resizeFile($folder, $newFilename, $maxWidth, $originalWidth, $originalHeight, $fileType, true);
			}
		} catch (Exception $e) {
			Filesystem::deleteFile(($folder ? $folder . '/' : '') . $newFilename);
			Filesystem::deleteFile(($folder ? $folder . '/' : '') . Constant::get('THUMBNAILS_FOLDER') . '/' . $newFilename);
			throw $e;
		}

		$image = new self(($folder ? $folder . '/' : '') . $newFilename);
		$image->updateCache();

		return $image;
	}

	/**
	 * Deletes an existing image.
	 *
	 * @return void
	 */
	public function delete() : void
	{
		Filesystem::deleteFile($this->id);
		Filesystem::deleteFile($this->thumbnailPath);
		$this->deleteFromCache();
	}

	/**
	 * Deletes an image from the cache.
	 *
	 * @return void
	 */
	public function deleteFromCache() : void
	{
		$filename = 'images.json';
		$data = Cache::get($filename);
		unset($data['data'][$this->id]);
		Cache::set($filename, $data);
	}

	/**
	 * Gets an existing image's data.
	 *
	 * @param  string $id
	 * @return Image|null
	 */
	public static function get(string $id)
	{
		$data = self::all();
		if (empty($data['data'][$id])) {
			return null;
		}
		return new self($id, $data['data'][$id]['attributes']['title']);
	}

	/**
	 * Returns all data about this image.
	 *
	 * @return array
	 */
	public function json() : array
	{
		list($width, $height) = getimagesize($this->thumbnailAbsolutePath());

		$path = Constant::get('UPLOADS_PATH') . '/' . $this->id;
		$pathinfo = pathinfo($this->id);

		// TODO: This info should come from the cache.
		return [
			'id' => $this->id,
			'attributes' => [
				'title'           => $this->title,
				'filename'        => $pathinfo['basename'],
				'folder'          => $pathinfo['dirname'] === '.' ? '' : $pathinfo['dirname'],
				'thumbnail'       => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->thumbnailPath,
				'thumbnailHeight' => $height,
				'thumbnailWidth'  => $width,
				'url'             => '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->id,
			],
		];
	}

	/**
	 * Updates an existing image.
	 *
	 * @param  string $newId Eg. 'foo/bar.jpg'.
	 * @param  string $title Eg. 'Example Title'.
	 * @return void
	 */
	public function update(string $newId, string $title) : void
	{
		if ($this->id === $newId && $this->title === $title) {
			return;
		}

		if ($this->id !== $newId) {
			Filesystem::renameFile($this->id, $newId);

			$folder = self::getFolder($newId);
			$folder = $folder ? $folder . '/' : '';
			$thumbnailFolder = $folder . Constant::get('THUMBNAILS_FOLDER');
			$fullPath = Constant::get('UPLOADS_PATH') . '/' . $thumbnailFolder;
			if (!Filesystem::folderExists($fullPath)) {
				Filesystem::createFolder($fullPath);
			}
			Filesystem::renameFile($this->thumbnailPath, self::getThumbnailPath($newId));

			$oldId = $this->id;
			$this->id = $newId;
			$this->thumbnailPath = $this->getThumbnailPath($newId);
			$this->title = $title;
			$this->updateCache($oldId);
		} elseif ($this->title !== $title) {
			$this->title = $title;
			$this->updateCache();
		}
	}

	/**
	 * Updates an image in the cache.
	 *
	 * @param  string $oldId
	 * @return void
	 */
	public function updateCache(string $oldId = '') : void
	{
		$filename = 'images.json';
		$data = Cache::get($filename);
		$data['data'][$this->id] = $this->json();
		if ($oldId) {
			unset($data['data'][$oldId]);
		}
		ksort($data['data']);
		Cache::set($filename, $data);
	}

	/**
	 * Updates the folders for images in the cache.
	 *
	 * @param  string $oldFolderId
	 * @param  string $newFolderId
	 * @return void
	 */
	public static function updateFoldersInCache(string $oldFolderId, string $newFolderId) : void
	{
		$filename = 'images.json';
		$data = Cache::get($filename);
		foreach ($data['data'] as $imageId => $image) {
			if ($image['attributes']['folder'] === $oldFolderId) {
				$data['data'][$imageId]['attributes']['folder'] = $newFolderId;
			}
		}
		Cache::set($filename, $data);
	}

	/**
	 * Checks if the given ID is valid.
	 *
	 * @param  string $id
	 * @param  string $type
	 * @param  string $attribute
	 * @return void
	 */
	public static function validateId(string $id, string $type = 'Filename', string $attribute = '') : void
	{
		if ($id === '') {
			return;
		}

		$message = '';
		if (trim($id, '/') !== $id) {
			$message = $type . ' cannot begin or end with slashes.';
		} elseif (trim($id, '.') !== $id) {
			$message = $type . ' cannot begin or end with periods.';
		} elseif (strpos($id, '.') === false) {
			$message = $type . ' is missing a file extension (eg. JPG, PNG).';
		} elseif ($id === Constant::get('THUMBNAILS_FOLDER')) {
			$message = $type . ' cannot be the same as the thumbnails folder.';
		} elseif (preg_match('/(^|\/)' . str_replace('/', '\/', Constant::get('THUMBNAILS_FOLDER')) . '$/', $id)) {
			$message = $type . ' cannot end in the thumbnails folder.';
		} elseif (!preg_match('/^[a-z0-9_\.\/-]+$/', $id)) {
			$message = $type . ' contains invalid characters.';
		}

		if ($message) {
			if ($attribute) {
				throw ValidationException::new([$attribute => [$message]]);
			} else {
				throw new ApiException($message);
			}
		}
	}

	/**
	 * Checks if the given file is valid.
	 *
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
}
