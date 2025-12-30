<?php

namespace Jlbelanger\Galleri\Helpers;

use Jlbelanger\Galleri\Exceptions\ApiException;
use Jlbelanger\Galleri\Helpers\Constant;

class ImageFile
{
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
		Filesystem::copyFile($path, $thumbnailPath);
		$thumbnailFilename = $folder . Constant::get('THUMBNAILS_FOLDER') . '/' . $filename;
		self::resizeFile('', $thumbnailFilename, Constant::get('THUMBNAIL_IMAGE_WIDTH'), $oldWidth, $oldHeight, $fileType);
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
	}
}
