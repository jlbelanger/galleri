<?php

namespace Tests\Helpers;

use Jlbelanger\Galleri\Exceptions\ApiException;
use Jlbelanger\Galleri\Helpers\Constant;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ConstantTest extends TestCase
{
	public static function getProvider() : array
	{
		return [
			'when the value is set in the environment' => [[
				'args' => [
					'key' => 'UPLOADS_FOLDER',
				],
				'expected' => 'assets',
			]],
			'when the value is not set in the environment but has a default' => [[
				'args' => [
					'key' => 'THUMBNAILS_FOLDER',
				],
				'expected' => 'thumbnails',
			]],
			'when the value is not set in the environment and has no default' => [[
				'args' => [
					'key' => 'FOO',
				],
				'expected' => null,
			]],
		];
	}

	#[DataProvider('getProvider')]
	public function testGet(array $args) : void
	{
		$output = Constant::get(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function verifyProvider() : array
	{
		return [
			'when the value is set in the environment' => [[
				'args' => [
					'key' => 'UPLOADS_FOLDER',
				],
			]],
			'when the value is not set in the environment' => [[
				'args' => [
					'key' => 'THUMBNAILS_FOLDER',
				],
				'expectedMessage' => 'Environment variable "THUMBNAILS_FOLDER" is not set.',
			]],
		];
	}

	#[DataProvider('verifyProvider')]
	public function testVerify(array $args) : void
	{
		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}
		Constant::verify(...array_values($args['args']));
	}
}
