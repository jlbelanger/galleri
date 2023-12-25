<?php

namespace Tests\Helpers;

use Jlbelanger\Galleri\Helpers\Exif;
use Tests\TestCase;

class ExifTest extends TestCase
{
	public function testGet() : void
	{
		$this->markTestIncomplete();
	}

	public static function existsProvider() : array
	{
		return [
			'with a GIF' => [[
				'args' => [
					'fileType' => IMAGETYPE_GIF,
				],
				'expected' => false,
			]],
			'with a JPEG' => [[
				'args' => [
					'fileType' => IMAGETYPE_JPEG,
				],
				'expected' => true,
			]],
			'with a PNG' => [[
				'args' => [
					'fileType' => IMAGETYPE_PNG,
				],
				'expected' => false,
			]],
		];
	}

	/**
	 * @dataProvider existsProvider
	 */
	public function testExists(array $args) : void
	{
		$output = Exif::exists(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function apertureProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'COMPUTED' => [
							'ApertureFNumber' => 'f/4.0',
						],
					],
				],
				'expected' => 'f/4.0',
			]],
		];
	}

	/**
	 * @dataProvider apertureProvider
	 */
	public function testAperture(array $args) : void
	{
		$output = Exif::aperture(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function cameraProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'Model' => 'NIKON D5500',
					],
				],
				'expected' => 'NIKON D5500',
			]],
		];
	}

	/**
	 * @dataProvider cameraProvider
	 */
	public function testCamera(array $args) : void
	{
		$output = Exif::camera(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function dateProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'DateTimeOriginal' => '2001:02:03 04:05:06',
					],
				],
				'expected' => '2001-02-03 04:05:06',
			]],
		];
	}

	/**
	 * @dataProvider dateProvider
	 */
	public function testDate(array $args) : void
	{
		$output = Exif::date(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function exposureProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with zero' => [[
				'args' => [
					'exif' => [
						'ExposureBiasValue' => '0/6',
					],
				],
				'expected' => '0',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'ExposureBiasValue' => '20/10',
					],
				],
				'expected' => '2',
			]],
		];
	}

	/**
	 * @dataProvider exposureProvider
	 */
	public function testExposure(array $args) : void
	{
		$output = Exif::exposure(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function flashProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with zero' => [[
				'args' => [
					'exif' => [
						'Flash' => '0',
					],
				],
				'expected' => 'No Flash',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'Flash' => '1',
					],
				],
				'expected' => 'Flash',
			]],
		];
	}

	/**
	 * @dataProvider flashProvider
	 */
	public function testFlash(array $args) : void
	{
		$output = Exif::flash(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function focalLengthProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'FocalLength' => '2700/10',
					],
				],
				'expected' => '270',
			]],
		];
	}

	/**
	 * @dataProvider focalLengthProvider
	 */
	public function testFocalLength(array $args) : void
	{
		$output = Exif::focalLength(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function testFractionToDecimal() : void
	{
		$this->markTestIncomplete();
	}

	public function testGps() : void
	{
		$this->markTestIncomplete();
	}

	public function testLatitude() : void
	{
		$this->markTestIncomplete();
	}

	public function testLongitude() : void
	{
		$this->markTestIncomplete();
	}

	public static function isoProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'ISOSpeedRatings' => 400,
					],
				],
				'expected' => '400',
			]],
		];
	}

	/**
	 * @dataProvider isoProvider
	 */
	public function testIso(array $args) : void
	{
		$output = Exif::iso(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function lightSourceProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with zero' => [[
				'args' => [
					'exif' => [
						'LightSource' => '0',
					],
				],
				'expected' => 'Auto',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'LightSource' => '1',
					],
				],
				'expected' => 'Daylight',
			]],
		];
	}

	/**
	 * @dataProvider lightSourceProvider
	 */
	public function testLightSource(array $args) : void
	{
		$output = Exif::lightSource(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function modeProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'ExposureProgram' => '4',
					],
				],
				'expected' => 'Shutter Priority',
			]],
		];
	}

	/**
	 * @dataProvider modeProvider
	 */
	public function testMode(array $args) : void
	{
		$output = Exif::mode(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function orientationProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with missing width' => [[
				'args' => [
					'exif' => [
						'ExifImageLength' => '1000',
					],
				],
				'expected' => '',
			]],
			'with missing length' => [[
				'args' => [
					'exif' => [
						'ExifImageWidth' => '1000',
					],
				],
				'expected' => '',
			]],
			'with a portrait value' => [[
				'args' => [
					'exif' => [
						'ExifImageLength' => '1000',
						'ExifImageWidth' => '750',
					],
				],
				'expected' => 'Portrait',
			]],
			'with a landscape value' => [[
				'args' => [
					'exif' => [
						'ExifImageLength' => '750',
						'ExifImageWidth' => '1000',
					],
				],
				'expected' => 'Landscape',
			]],
			'with a square value' => [[
				'args' => [
					'exif' => [
						'ExifImageLength' => '1000',
						'ExifImageWidth' => '1000',
					],
				],
				'expected' => 'Square',
			]],
		];
	}

	/**
	 * @dataProvider orientationProvider
	 */
	public function testOrientation(array $args) : void
	{
		$output = Exif::orientation(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function testReduceFraction() : void
	{
		$this->markTestIncomplete();
	}

	public static function shutterSpeedProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'ExposureTime' => '1/320',
					],
				],
				'expected' => '1/320',
			]],
			'with value greater than 1 second' => [[
				'args' => [
					'exif' => [
						'ExposureTime' => '10/1',
					],
				],
				'expected' => '10/1',
			]],
		];
	}

	/**
	 * @dataProvider shutterSpeedProvider
	 */
	public function testShutterSpeed(array $args) : void
	{
		$output = Exif::shutterSpeed(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function whiteBalanceProvider() : array
	{
		return [
			'with no value' => [[
				'args' => [
					'exif' => [],
				],
				'expected' => '',
			]],
			'with zero' => [[
				'args' => [
					'exif' => [
						'WhiteBalance' => '0',
					],
				],
				'expected' => 'Auto',
			]],
			'with value' => [[
				'args' => [
					'exif' => [
						'WhiteBalance' => '1',
					],
				],
				'expected' => 'Sunny',
			]],
		];
	}

	/**
	 * @dataProvider whiteBalanceProvider
	 */
	public function testWhiteBalance(array $args) : void
	{
		$output = Exif::whiteBalance(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}
}
