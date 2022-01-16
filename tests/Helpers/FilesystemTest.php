<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Exceptions\ApiException;
use Jlbelanger\Robroy\Helpers\Filesystem;
use Tests\TestCase;

class FilesystemTest extends TestCase
{
	public function copyFileProvider() : array
	{
		return [
			'when copy fails' => [[
				'args' => [
					'oldPath' => 'foo',
					'newPath' => 'bar',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'copy' => false,
					],
				],
				'expected' => false,
			]],
			'when copy succeeds' => [[
				'args' => [
					'oldPath' => 'foo',
					'newPath' => 'bar',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'copy' => true,
					],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider copyFileProvider
	 */
	public function testCopyFile(array $args) : void
	{
		self::setupTest($args);
		$output = Filesystem::copyFile(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function createFolderProvider() : array
	{
		return [
			'when the folder exists' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
					],
				],
				'expectedMessage' => 'Folder "foo" already exists.',
			]],
			'when the folder does not exist and mkdir fails' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => false,
						'mkdir' => false,
					],
				],
				'expectedMessage' => 'Folder "foo" could not be created.',
			]],
			'when the folder does not exist and succeeds' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => false,
						'mkdir' => true,
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider createFolderProvider
	 */
	public function testCreateFolder(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::createFolder(...array_values($args['args']));
	}

	public function deleteFileProvider() : array
	{
		return [
			'when the file does not exist' => [[
				'args' => [
					'filename' => 'does-not-exist.png',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => false,
					],
				],
				'expectedMessage' => 'File "does-not-exist.png" does not exist.',
			]],
			'when the file exists and unlink fails' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
						'unlink' => false,
					],
				],
				'expectedMessage' => 'File "example.png" could not be deleted.',
			]],
			'when the file exists and unlink succeeds' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
						'unlink' => true,
					],
				],
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
						'file_exists' => false,
					],
				],
			]],
			'when the folder exists but is not empty' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
						'opendir' => true,
						'closedir' => true,
						'readdir' => ['foo.png'],
						'rmdir' => true,
					],
				],
				'expectedMessage' => 'Folder "foo" is not empty, so it could not be deleted.',
			]],
			'when the folder exists and rmdir fails' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
						'rmdir' => false,
					],
				],
				'expectedMessage' => 'Folder "foo" could not be deleted.',
			]],
			'when the folder exists and rmdir succeeds' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
						'rmdir' => true,
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

	public function fileExistsProvider() : array
	{
		return [
			'when the file does not' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => false,
					],
				],
				'expected' => false,
			]],
			'when the file exists' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => true,
					],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider fileExistsProvider
	 */
	public function testFileExists(array $args) : void
	{
		self::setupTest($args);
		$output = Filesystem::fileExists(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function folderExistsProvider() : array
	{
		return [
			'when the folder does not' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'is_dir' => false,
					],
				],
				'expected' => false,
			]],
			'when the folder exists' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'is_dir' => true,
					],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider folderExistsProvider
	 */
	public function testFolderExists(array $args) : void
	{
		self::setupTest($args);
		$output = Filesystem::folderExists(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
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

	public function testMoveFile() : void
	{
		$this->markTestIncomplete();
	}

	public function testReadFile() : void
	{
		$this->markTestIncomplete();
	}

	public function testRename() : void
	{
		$this->markTestIncomplete();
	}

	public function testWriteFile() : void
	{
		$this->markTestIncomplete();
	}
}
