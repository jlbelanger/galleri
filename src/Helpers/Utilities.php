<?php

namespace Jlbelanger\Robroy\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Constant;

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
		$filename = strtolower($filename);
		$filename = preg_replace('/[^a-z0-9_\.]+/', '-', $filename);
		$filename = trim($filename, '-');
		$filename = str_replace('-.', '.', $filename);
		$filename = str_replace('.jpeg', '.jpg', $filename);

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
	 * @param  string  $folder
	 * @param  string  $filename
	 * @param  integer $oldWidth
	 * @param  integer $oldHeight
	 * @param  integer $fileType
	 * @return void
	 */
	public static function createThumbnailFile(string $folder, string $filename, int $oldWidth, int $oldHeight, int $fileType) : void
	{
		$uploadsPath = Constant::get('UPLOADS_PATH');
		$folder = $folder ? $folder . '/' : '';
		$path = $uploadsPath . '/' . $folder . $filename;
		$thumbnailFolderPath = $uploadsPath . '/' . $folder . Constant::get('THUMBNAILS_FOLDER');
		if (!Filesystem::folderExists($thumbnailFolderPath)) {
			Filesystem::createFolder($uploadsPath . '/' . $folder . Constant::get('THUMBNAILS_FOLDER'));
		}
		$thumbnailPath = $thumbnailFolderPath . '/' . $filename;
		if (!Filesystem::copyFile($path, $thumbnailPath)) {
			throw new ApiException('File "' . $filename . '" could not be duplicated.', 500);
		}
		$thumbnailFilename = $folder . Constant::get('THUMBNAILS_FOLDER') . '/' . $filename;
		self::resizeFile('', $thumbnailFilename, Constant::get('THUMBNAIL_IMAGE_WIDTH'), $oldWidth, $oldHeight, $fileType);
	}

	/**
	 * @param  string $s
	 * @param  string $allowed
	 * @return string
	 */
	public static function nameToSlug(string $s, string $allowed = 'a-z0-9') : string
	{
		$s = strtolower($s);
		$s = str_replace(' & ', ' and ', $s);
		$s = str_replace("'", '', $s);
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
		return self::nameToSlug($s, 'a-z0-9\._-');
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

	/**
	 * @param  string  $folder
	 * @param  string  $filename
	 * @param  integer $newWidth
	 * @param  integer $oldWidth
	 * @param  integer $oldHeight
	 * @param  integer $fileType
	 * @param  boolean $hasWatermark
	 * @return void
	 */
	public static function resizeFile(
		string $folder,
		string $filename,
		int $newWidth,
		int $oldWidth,
		int $oldHeight,
		int $fileType,
		bool $hasWatermark = false
	) : void
	{
		$path = Constant::get('UPLOADS_PATH') . '/' . ($folder ? $folder . '/' : '') . $filename;
		self::resizeImage($oldWidth, $oldHeight, $newWidth, $path, $path, $fileType, $hasWatermark);
	}

	/**
	 * @param  integer $oldWidth
	 * @param  integer $oldHeight
	 * @param  integer $newWidth
	 * @param  string  $srcPath
	 * @param  string  $dstPath
	 * @param  integer $fileType
	 * @param  boolean $hasWatermark
	 * @return void
	 */
	private static function resizeImage(
		int $oldWidth,
		int $oldHeight,
		int $newWidth,
		string $srcPath,
		string $dstPath,
		int $fileType,
		bool $hasWatermark = false
	) : void
	{
		$src = self::getImageSource($srcPath, $fileType);
		if (empty($src) || empty($src['image'])) {
			throw new ApiException('Could not get image source.', 500);
		}

		if ($src['swap']) {
			$tempWidth = $oldWidth;
			$oldWidth = $oldHeight;
			$oldHeight = $tempWidth;
		}
		$src = $src['image'];

		$ratio = $newWidth / $oldWidth;
		$newHeight = (int) ($oldHeight * $ratio);
		$dstX = 0;
		$dstY = 0;

		$dst = imagecreatetruecolor($newWidth, $newHeight);
		imagecopyresampled($dst, $src, $dstX, $dstY, 0, 0, $newWidth, $newHeight, $oldWidth, $oldHeight);
		if ($hasWatermark && !empty(Constant::get('WATERMARK_PATH'))) {
			self::addWatermark($dst, $newWidth, $newHeight);
		}

		if ($fileType === IMAGETYPE_PNG) {
			imagepng($dst, $dstPath, Constant::get('PNG_COMPRESSION'));
		} else {
			imagejpeg($dst, $dstPath, Constant::get('JPEG_COMPRESSION'));
		}

		imagedestroy($src);
		imagedestroy($dst);
	}

	/**
	 * @param  resource $dst
	 * @param  integer  $newWidth
	 * @param  integer  $newHeight
	 * @return void
	 */
	private static function addWatermark($dst, int $newWidth, int $newHeight) : void
	{
		$watermarkPath = Constant::get('WATERMARK_PATH');
		list($watermarkWidth, $watermarkHeight, $watermarkFileType) = getimagesize($watermarkPath);
		$watermarkSrc = self::getImageSource($watermarkPath, $watermarkFileType);
		$watermarkX = $newWidth - $watermarkWidth;
		$watermarkY = $newHeight - $watermarkHeight;
		imagecopy($dst, $watermarkSrc['image'], $watermarkX, $watermarkY, 0, 0, $watermarkWidth, $watermarkHeight);
	}

	/**
	 * @param  string  $path
	 * @param  integer $fileType
	 * @return array
	 */
	private static function getImageSource(string $path, int $fileType) : array
	{
		$src = null;

		switch ($fileType) {
			case IMAGETYPE_GIF:
				$src = imagecreatefromgif($path);
				break;

			case IMAGETYPE_JPEG:
				$src = imagecreatefromjpeg($path);
				break;

			case IMAGETYPE_PNG:
				$src = imagecreatefrompng($path);
				break;

			default:
				throw new ApiException('Invalid file type "' . $fileType . '".');
		}

		return self::fixOrientation($path, $fileType, $src);
	}

	/**
	 * @param  string   $path
	 * @param  integer  $fileType
	 * @param  resource $src
	 * @return array
	 */
	private static function fixOrientation(string $path, int $fileType, $src) : array
	{
		if (empty($src)) {
			return $src;
		}

		$swap = false;

		if (Exif::exists($fileType)) {
			$exif = Exif::get($path);

			if (!empty($exif['Orientation'])) {
				switch ($exif['Orientation']) {
					case 3:
						$src = imagerotate($src, 180, 0);
						break;

					case 6:
						$swap = true;
						$src = imagerotate($src, -90, 0);
						break;

					case 8:
						$swap = true;
						$src = imagerotate($src, 90, 0);
						break;

					default:
						$swap = false;
						break;
				}
			}
		}

		return [
			'image' => $src,
			'swap'  => $swap,
		];
	}
}
