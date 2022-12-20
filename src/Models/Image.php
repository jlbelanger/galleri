<?php

namespace Jlbelanger\Robroy\Models;

use Exception;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Exceptions\ValidationException;
use Jlbelanger\Robroy\Helpers\Cache;
use Jlbelanger\Robroy\Helpers\Constant;
use Jlbelanger\Robroy\Helpers\Exif;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Jlbelanger\Robroy\Helpers\ImageFile;
use Jlbelanger\Robroy\Helpers\Utilities;

class Image
{
	private $id;

	private $attributes;

	private $meta;

	/**
	 * @param string $id         Eg. 'foo/bar.jpg'.
	 * @param array  $attributes Eg. ['title' => 'Example Title'].
	 * @param array  $meta
	 */
	public function __construct(string $id, array $attributes = [], array $meta = [])
	{
		$this->id = $id;

		$this->attributes = $attributes;
		$pathinfo = pathinfo($this->id);
		if (empty($this->attributes['filename'])) {
			$this->attributes['filename'] = $pathinfo['basename'];
		}
		if (empty($this->attributes['folder'])) {
			$this->attributes['folder'] = $pathinfo['dirname'] === '.' ? '' : $pathinfo['dirname'];
		}

		$this->meta = $meta;
		if (empty($this->meta['thumbnail'])) {
			$this->meta['thumbnail'] = $this->getThumbnail();
		}
		if (empty($this->meta['thumbnailHeight']) || empty($this->meta['thumbnailWidth'])) {
			list($width, $height) = getimagesize($this->thumbnailAbsolutePath());

			$this->meta['thumbnailHeight'] = $height;
			$this->meta['thumbnailWidth'] = $width;
		}
		if (empty($this->meta['height']) || empty($this->meta['width'])) {
			list($width, $height) = getimagesize($this->absolutePath());

			$this->meta['height'] = $height;
			$this->meta['width'] = $width;
		}
		if (empty($this->meta['url'])) {
			$this->meta['url'] = $this->getUrl();
		}
	}

	/**
	 * @return string
	 */
	public function absolutePath() : string
	{
		return Constant::get('UPLOADS_PATH') . '/' . $this->id;
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
			$rows = array_reverse($rows);
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
		Filesystem::deleteFile(self::getThumbnailPath($this->id));
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
		$attributes = !empty($data['data'][$id]['attributes']) ? $data['data'][$id]['attributes'] : [];
		$meta = !empty($data['data'][$id]['meta']) ? $data['data'][$id]['meta'] : [];
		return new self($id, $attributes, $meta);
	}

	/**
	 * Returns all data about this image.
	 *
	 * @return array
	 */
	public function json() : array
	{
		$output = [
			'id' => $this->id,
			'attributes' => $this->attributes,
			'meta' => $this->meta,
		];
		if (!isset($output['attributes']['title'])) {
			$output['attributes'] = array_merge($output['attributes'], $this->getDefaultAttributes());
		}
		if (empty($output['meta']['exif'])) {
			$output['meta']['exif'] = $this->getExif();
		}
		return $output;
	}

	/**
	 * Updates an existing image.
	 *
	 * @param  string $newId      Eg. 'foo/bar.jpg'.
	 * @param  array  $attributes Eg. ['title' => 'Example Title'].
	 * @return void
	 */
	public function update(string $newId, array $attributes) : void
	{
		$oldId = $this->id;
		if ($this->id !== $newId) {
			Filesystem::renameFile($this->id, $newId);

			$folder = self::getFolder($newId);
			$folder = $folder ? $folder . '/' : '';
			$thumbnailFolder = $folder . Constant::get('THUMBNAILS_FOLDER');
			$fullPath = Constant::get('UPLOADS_PATH') . '/' . $thumbnailFolder;
			if (!Filesystem::folderExists($fullPath)) {
				Filesystem::createFolder($fullPath);
			}
			Filesystem::renameFile(self::getThumbnailPath($this->id), self::getThumbnailPath($newId));

			$this->id = $newId;
			$this->meta['thumbnail'] = $this->getThumbnail();
			$this->meta['url'] = $this->getUrl();
		}

		$this->attributes = $attributes;

		if ($oldId === $newId) {
			$this->updateCache();
		} else {
			$this->updateCache($oldId);
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
		$data['data'] = array_reverse($data['data']);
		Cache::set($filename, $data);
	}

	/**
	 * Updates the folders for images in the cache.
	 *
	 * @param  string $oldFolderId
	 * @param  string $newFolderId
	 * @return array|null
	 */
	public static function updateFoldersInCache(string $oldFolderId, string $newFolderId)
	{
		$filename = 'images.json';
		$data = Cache::get($filename);
		if (!empty($data['data'])) {
			foreach ($data['data'] as $imageId => $image) {
				if (strpos($image['attributes']['folder'], $oldFolderId) === 0) {
					$data['data'][$imageId]['attributes']['folder'] = $newFolderId;
				}
				$oldImageId = $image['id'];
				if (strpos($oldImageId, $oldFolderId . '/') === 0) {
					$newImageId = preg_replace('/^' . str_replace('/', '\/', $oldFolderId) . '\//', $newFolderId . '/', $image['id']);
					$image['id'] = $newImageId;
					$image['attributes']['folder'] = preg_replace(
						'/^' . str_replace('/', '\/', $oldFolderId) . '(\/|$)/',
						$newFolderId . '$1',
						$image['attributes']['folder']
					);
					$image['meta']['thumbnail'] = preg_replace(
						'/\/' . str_replace('/', '\/', $oldFolderId) . '\//',
						'/' . $newFolderId . '/',
						$image['meta']['thumbnail']
					);
					$image['meta']['url'] = preg_replace(
						'/\/' . str_replace('/', '\/', $oldFolderId) . '\//',
						'/' . $newFolderId . '/',
						$image['meta']['url']
					);
					$data['data'][$newImageId] = $image;
					unset($data['data'][$oldImageId]);
				}
			}
			ksort($data['data']);
			$data['data'] = array_reverse($data['data']);
		}
		Cache::set($filename, $data);
		return $data;
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
	 * @return array
	 */
	protected function getDefaultAttributes() : array
	{
		$attributes = [
			'title' => '',
			'keywords' => [],
		];
		$path = $this->absolutePath();
		list($w, $h, $fileType) = getimagesize($path, $info);
		if (Exif::exists($fileType)) {
			$exif = Exif::get($path);
			if (!empty($exif['ImageDescription'])) {
				$attributes['title'] = $exif['ImageDescription'];
			}
		}
		if (isset($info['APP13'])) {
			$keywords = iptcparse($info['APP13']);
			if (!empty($keywords['2#025'])) {
				$attributes['keywords'] = $keywords['2#025'];
			}
		}
		return $attributes;
	}

	/**
	 * @return array
	 */
	protected function getExif() : array
	{
		$path = $this->absolutePath();
		list($w, $h, $fileType) = getimagesize($path, $info);
		if (Exif::exists($fileType)) {
			$exif = Exif::get($path);
			if (!empty($exif)) {
				return [
					'aperture' => Exif::aperture($exif),
					'camera' => Exif::camera($exif),
					'date' => Exif::date($exif),
					'exposure' => Exif::exposure($exif),
					'flashMode' => Exif::flash($exif),
					'focalLength' => Exif::focalLength($exif),
					'iso' => Exif::iso($exif),
					'latitude' => Exif::latitude($exif),
					'lightSource' => Exif::lightSource($exif),
					'longitude' => Exif::longitude($exif),
					'mode' => Exif::mode($exif),
					'orientation' => Exif::orientation($exif),
					'shutterSpeed' => Exif::shutterSpeed($exif),
					'whiteBalance' => Exif::whiteBalance($exif),
				];
			}
		}
		return [];
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
	 * @return string
	 */
	protected function getThumbnail() : string
	{
		return '/' . Constant::get('UPLOADS_FOLDER') . '/' . self::getThumbnailPath($this->id);
	}

	/**
	 * @return string
	 */
	protected function getUrl() : string
	{
		return '/' . Constant::get('UPLOADS_FOLDER') . '/' . $this->id;
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
		$fullPath = Constant::get('UPLOADS_PATH') . '/' . self::getThumbnailPath($this->id);
		if (!Filesystem::fileExists($fullPath)) {
			return '';
		}
		return $fullPath;
	}
}
