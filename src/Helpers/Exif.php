<?php

namespace Jlbelanger\Galleri\Helpers;

use Exception;

class Exif
{
	/**
	 * Returns EXIF data for the given file.
	 *
	 * @param  string $path
	 * @return array
	 */
	public static function get(string $path) : array
	{
		try {
			return exif_read_data($path);
		} catch (Exception $e) {
			return [];
		}
	}

	/**
	 * Returns true if this file type has EXIF data.
	 *
	 * @param  integer $fileType
	 * @return boolean
	 */
	public static function exists(int $fileType) : bool
	{
		return $fileType === IMAGETYPE_JPEG;
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function aperture(array $exif) : string
	{
		return !empty($exif['COMPUTED']['ApertureFNumber']) ? $exif['COMPUTED']['ApertureFNumber'] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function camera(array $exif) : string
	{
		return !empty($exif['Model']) ? $exif['Model'] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function date(array $exif) : string
	{
		if (empty($exif['DateTimeOriginal'])) {
			return '';
		}
		return preg_replace('/^(\d+):(\d+):(\d+) /', '$1-$2-$3 ', $exif['DateTimeOriginal']);
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function exposure(array $exif) : string
	{
		return !empty($exif['ExposureBiasValue']) ? self::fractionToDecimal($exif['ExposureBiasValue']) : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function flash(array $exif) : string
	{
		if (!isset($exif['Flash'])) {
			return '';
		}
		$value = $exif['Flash'];
		$values = [
			'0' => 'No Flash',
			'16' => 'No Flash',
			'24' => 'No Flash',
			'32' => 'No Flash',
			'1' => 'Flash',
			'5' => 'Flash',
			'7' => 'Flash',
			'9' => 'Compulsory Flash',
			'13' => 'Compulsory Flash',
			'15' => 'Compulsory Flash',
			'25' => 'Flash, Auto-Mode',
			'29' => 'Flash, Auto-Mode',
			'31' => 'Flash, Auto-Mode',
			'65' => 'Red Eye',
			'69' => 'Red Eye',
			'71' => 'Red Eye',
			'73' => 'Red Eye, Compulsory Flash',
			'77' => 'Red Eye, Compulsory Flash',
			'79' => 'Red Eye, Compulsory Flash',
			'89' => 'Red Eye, Auto-Mode',
			'93' => 'Red Eye, Auto-Mode',
			'95' => 'Red Eye, Auto-Mode',
		];
		return !empty($values[$value]) ? $values[$value] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function focalLength(array $exif) : string
	{
		return !empty($exif['FocalLength']) ? self::fractionToDecimal($exif['FocalLength']) : '';
	}

	/**
	 * @param  string $value
	 * @return string
	 */
	public static function fractionToDecimal(string $value) : string
	{
		if (strpos($value, '/') === false) {
			return '';
		}
		$value = explode('/', $value);
		if ($value[1] !== '0') {
			return (string) ($value[0] / $value[1]);
		}
		return '';
	}

	/**
	 * @param  array  $exif
	 * @param  string $type
	 * @return string
	 */
	protected static function gps(array $exif, string $type) : string
	{
		if (empty($exif[$type]) || empty($exif[$type . 'Ref'])) {
			return '';
		}
		$degrees = self::fractionToDecimal($exif[$type][0]);
		$minutes = self::fractionToDecimal($exif[$type][1]);
		$seconds = self::fractionToDecimal($exif[$type][2]);
		$multiplier = ($exif[$type . 'Ref'] === 'S' || $exif[$type . 'Ref'] === 'W') ? -1 : 1;
		$output = ($degrees + ($minutes / 60) + ($seconds / 3600)) * $multiplier;
		return round($output, 6);
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function latitude(array $exif) : string
	{
		return self::gps($exif, 'GPSLatitude');
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function longitude(array $exif) : string
	{
		return self::gps($exif, 'GPSLongitude');
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function iso(array $exif) : string
	{
		return !empty($exif['ISOSpeedRatings']) ? (string) $exif['ISOSpeedRatings'] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function lightSource(array $exif) : string
	{
		if (!isset($exif['LightSource'])) {
			return '';
		}
		$value = $exif['LightSource'];
		$values = [
			'0' => 'Auto',
			'1' => 'Daylight',
			'2' => 'Fluorescent',
			'3' => 'Tungsten',
			'4' => 'Flash',
			'9' => 'Fine Weather',
			'10' => 'Cloudy Weather',
			'11' => 'Shade',
			'12' => 'Daylight Fluorescent',
			'13' => 'Day White Fluorescent',
			'14' => 'Cool White Fluorescent',
			'15' => 'White Fluorescent',
			'24' => 'Studio Tungsten',
		];
		return !empty($values[$value]) ? $values[$value] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function mode(array $exif) : string
	{
		if (!isset($exif['ExposureProgram'])) {
			return '';
		}
		$value = $exif['ExposureProgram'];
		$values = [
			'1' => 'Manual',
			'2' => 'Program',
			'3' => 'Aperture Priority',
			'4' => 'Shutter Priority',
			'5' => 'Program Creative',
			'6' => 'Program Action',
			'7' => 'Portrait',
			'8' => 'Landscape',
		];
		return !empty($values[$value]) ? $values[$value] : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function orientation(array $exif) : string
	{
		if (empty($exif['ExifImageLength']) || empty($exif['ExifImageWidth'])) {
			return '';
		}
		if ($exif['ExifImageLength'] === $exif['ExifImageWidth']) {
			return 'Square';
		}
		return $exif['ExifImageLength'] > $exif['ExifImageWidth'] ? 'Portrait' : 'Landscape';
	}

	/**
	 * @param  string $value
	 * @return string
	 */
	protected static function reduceFraction(string $value) : string
	{
		if (strpos($value, '/') === false) {
			return $value;
		}
		list($numerator, $denominator) = explode('/', $value);
		if ($numerator > $denominator) {
			$max = $numerator;
		} else {
			$max = $denominator;
		}
		if ($numerator > 0 && $denominator < 0) {
			$numerator = $numerator * -1;
			$denominator = $denominator * -1;
		}
		for ($i = $max; $i > 0; $i--) {
			if (($numerator % $i) == 0 && ($denominator % $i) == 0) {
				return ($numerator / $i) . '/' . ($denominator / $i);
			}
		}
		if ($numerator && $denominator) {
			return $numerator . '/' . $denominator;
		}
		return '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function shutterSpeed(array $exif) : string
	{
		return !empty($exif['ExposureTime']) ? self::reduceFraction($exif['ExposureTime']) : '';
	}

	/**
	 * @param  array $exif
	 * @return string
	 */
	public static function whiteBalance(array $exif) : string
	{
		if (!isset($exif['WhiteBalance'])) {
			return '';
		}
		$value = $exif['WhiteBalance'];
		$values = [
			'0' => 'Auto',
			'1' => 'Sunny',
			'2' => 'Cloudy',
			'3' => 'Tungsten',
			'4' => 'Fluorescent',
			'5' => 'Flash',
			'6' => 'Custom',
			'126' => 'Manual',
		];
		return !empty($values[$value]) ? $values[$value] : '';
	}
}
