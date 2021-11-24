<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Helpers\Exif;
use Tests\TestCase;

class ExifTest extends TestCase
{
	public function existsProvider() : array
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
}
