<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\File;
use Tests\TestCase;

class FileTest extends TestCase
{
	public function deleteProvider()
	{
		return [
			'when the file does not exist' => [[
				'args' => [
					'filename' => 'does-not-exist.png',
				],
				'mocks' => [
					'unlink' => true,
				],
				'expectedMessage' => 'File "does-not-exist.png" does not exist.',
			]],
			'when the file exists and unlink fails' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'unlink' => false,
				],
				'expectedMessage' => 'File "example.png" could not be deleted.',
			]],
			'when the file exists and unlink is successful' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'unlink' => true,
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider deleteProvider
	 */
	public function testDelete($args)
	{
		foreach ($args['mocks'] as $function => $value) {
			$this->addMock('Jlbelanger\Robroy\Helpers', $function, $value);
		}
		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}
		File::delete(...array_values($args['args']));
	}
}
