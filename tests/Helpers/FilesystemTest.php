<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Tests\TestCase;

class FilesystemTest extends TestCase
{
	public function testCreateFolder() : void
	{
		$this->markTestIncomplete();
	}

	public function deleteFileProvider() : array
	{
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'unlink' => true,
			],
		];
		return [
			'when the file does not exist' => [[
				'args' => [
					'filename' => 'does-not-exist.png',
				],
				'mocks' => $mocks,
				'expectedMessage' => 'File "does-not-exist.png" does not exist.',
			]],
			'when the file exists and unlink fails' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'unlink' => false,
					],
				],
				'expectedMessage' => 'File "example.png" could not be deleted.',
			]],
			'when the file exists and unlink is successful' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => $mocks,
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider deleteFileProvider
	 */
	public function testDeleteFile(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::deleteFile(...array_values($args['args']));
	}

	public function deleteFolderProvider() : array
	{
		return [
			'when the folder does not exist' => [[
				'args' => [
					'path' => 'does-not-exist',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'rmdir' => true,
						'unlink' => true,
					],
				],
			]],
			'when the file exists and rmdir fails' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'rmdir' => false,
						'unlink' => true,
					],
				],
				'expectedMessage' => 'Folder "foo" could not be deleted.',
			]],
			'when the file exists and rmdir is successful' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'rmdir' => true,
						'unlink' => true,
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider deleteFolderProvider
	 */
	public function testDeleteFolder(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::deleteFolder(...array_values($args['args']));
	}

	public function testFolderExists() : void
	{
		$this->markTestIncomplete();
	}

	public function testIsEmpty() : void
	{
		$this->markTestIncomplete();
	}

	public function testGetFilesInFolder() : void
	{
		$this->markTestIncomplete();
	}

	public function testGetFoldersInFolder() : void
	{
		$this->markTestIncomplete();
	}

	public function testRenameFile() : void
	{
		$this->markTestIncomplete();
	}

	public function testRenameFolder() : void
	{
		$this->markTestIncomplete();
	}
}
