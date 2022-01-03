<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Helpers\Utilities;
use Tests\TestCase;

class UtilitiesTest extends TestCase
{
	public function testCleanFilename() : void
	{
		$this->markTestIncomplete();
	}

	public function testCreateThumbnailFile() : void
	{
		$this->markTestIncomplete();
	}

	public function nameToSlugProvider() : array
	{
		return [
			[[
				'args' => [
					's' => 'Foo Bar 1',
				],
				'expected' => 'foo-bar-1',
			]],
			'with an apostrophe' => [[
				'args' => [
					's' => "Foo's Bar 1",
				],
				'expected' => 'foos-bar-1',
			]],
			'with special characters' => [[
				'args' => [
					's' => '"Foo/Bar"',
				],
				'expected' => 'foo-bar',
			]],
		];
	}

	/**
	 * @dataProvider nameToSlugProvider
	 */
	public function testNameToSlug(array $args) : void
	{
		$output = Utilities::nameToSlug(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function pathToNameProvider() : array
	{
		return [
			[[
				'args' => [
					's' => 'foo-bar',
				],
				'expected' => 'Foo Bar',
			]],
		];
	}

	/**
	 * @dataProvider pathToNameProvider
	 */
	public function testPathToName(array $args) : void
	{
		$output = Utilities::pathToName(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function testResizeFile() : void
	{
		$this->markTestIncomplete();
	}

	public function testResizeImage() : void
	{
		$this->markTestIncomplete();
	}

	public function testAddWatermark() : void
	{
		$this->markTestIncomplete();
	}

	public function testGetImageSource() : void
	{
		$this->markTestIncomplete();
	}

	public function testFixOrientation() : void
	{
		$this->markTestIncomplete();
	}
}
