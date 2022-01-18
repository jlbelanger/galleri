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

	public function combineArgsProvider() : array
	{
		return [
			[[
				'args' => [
					'defaults' => [
						'a' => 'b',
						'c' => 'd',
					],
					'values' => [
						'c' => 'e',
						'f' => 'g',
					],
				],
				'expected' => [
					'a' => 'b',
					'c' => 'e',
					'f' => 'g',
				],
			]],
		];
	}

	/**
	 * @dataProvider combineArgsProvider
	 */
	public function testCombineArgs(array $args) : void
	{
		$output = Utilities::combineArgs(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function nameToSlugProvider() : array
	{
		return [
			[[
				'args' => [
					's' => ' ...M&M\'s - "Foo" & P.E.I. (Foo’s) <img> and? AC/DC #1-2-3-',
				],
				'expected' => 'm-and-ms-foo-and-pei-foos-and-ac-dc-1-2-3',
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

	public function normalizeFilenameProvider() : array
	{
		return [
			'with a file extension' => [[
				'args' => [
					's' => ' ...M&M\'s - "Foo" & P.E.I. (Foo’s) <img> and? AC/DC #1-2-3-.Jpeg ',
				],
				'expected' => 'm-and-ms-foo-and-pei-foos-and-ac-dc-1-2-3.jpg',
			]],
			'with no file extension' => [[
				'args' => [
					's' => 'foo',
				],
				'expected' => 'foo',
			]],
		];
	}

	/**
	 * @dataProvider normalizeFilenameProvider
	 */
	public function testNormalizeFilename(array $args) : void
	{
		$output = Utilities::normalizeFilename(...array_values($args['args']));
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
}
