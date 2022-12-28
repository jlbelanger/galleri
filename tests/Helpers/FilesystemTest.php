<?php

namespace Tests\Helpers;

use Jlbelanger\Galleri\Exceptions\ApiException;
use Jlbelanger\Galleri\Helpers\Filesystem;
use Tests\TestCase;

class FilesystemTest extends TestCase
{
	public function copyFileProvider() : array
	{
		return [
			'when copy fails' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'copy' => false,
					],
				],
				'expectedMessage' => 'File "foo.png" could not be duplicated.',
			]],
			'when copy succeeds' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::copyFile(...array_values($args['args']));
	}

	public function createFolderProvider() : array
	{
		return [
			'when the folder exists' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => true,
					],
				],
				'expectedMessage' => '[{"title":"Folder \"foo\" already exists.","status":422,"pointer":"id"}]',
			]],
			'when the folder does not exist and mkdir fails' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
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
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => false,
					],
				],
			]],
			'when the file exists and unlink fails' => [[
				'args' => [
					'filename' => 'example.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
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
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => false,
					],
				],
			]],
			'when the folder exists but is not empty' => [[
				'args' => [
					'path' => 'foo',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
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
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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
					'Jlbelanger\Galleri\Helpers' => [
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

	public function testGetFolders() : void
	{
		$this->markTestIncomplete();
	}

	public function moveFileProvider() : array
	{
		return [
			'when the new file already exists' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => true,
						'move_uploaded_file' => true,
					],
				],
				'expectedMessage' => '[{"title":"File \"bar.png\" already exists.","status":422,"pointer":"upload"}]',
			]],
			'when move fails' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'foo.png') !== false) {
								return true;
							}
							return false;
						},
						'move_uploaded_file' => false,
					],
				],
				'expectedMessage' => 'File "foo.png" could not be moved.',
			]],
			'when move succeeds' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'foo.png') !== false) {
								return true;
							}
							return false;
						},
						'move_uploaded_file' => true,
					],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider moveFileProvider
	 */
	public function testMoveFile(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::moveFile(...array_values($args['args']));
	}

	public function readFileProvider() : array
	{
		return [
			[[
				'args' => [
					'path' => 'foo',
				],
				'file_get_contents' => '{"foo":"bar"}',
				'expected' => ['foo' => 'bar'],
			]],
		];
	}

	/**
	 * @dataProvider readFileProvider
	 */
	public function testReadFile(array $args) : void
	{
		self::setupTest($args);
		$output = Filesystem::readFile(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function renameFileProvider() : array
	{
		return [
			'when the old file does not exist' => [[
				'args' => [
					'oldPath' => 'does-not-exist.png',
					'newPath' => 'new-does-not-exist.png',
				],
				'expectedMessage' => '[{"title":"File \"new-does-not-exist.png\" does not exist.","status":422,"pointer":"filename"}]',
			]],
			'when the new file already exists' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'bar.png',
				],
				'expectedMessage' => '[{"title":"File \"bar.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when rename fails' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'does-not-exist.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'rename' => false,
					],
				],
				'expectedMessage' => 'File "foo.png" could not be moved to "does-not-exist.png".',
			]],
			'when rename succeeds' => [[
				'args' => [
					'oldPath' => 'foo.png',
					'newPath' => 'does-not-exist.png',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'rename' => true,
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider renameFileProvider
	 */
	public function testRenameFile(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::renameFile(...array_values($args['args']));
	}

	public function renameFolderProvider() : array
	{
		return [
			'when the old folder does not exist' => [[
				'args' => [
					'oldPath' => 'does-not-exist',
					'newPath' => 'new-does-not-exist',
				],
				'expectedMessage' => '[{"title":"Folder \"new-does-not-exist\" does not exist.","status":422,"pointer":"id"}]',
			]],
			'when the new folder already exists' => [[
				'args' => [
					'oldPath' => 'foo',
					'newPath' => 'bar',
				],
				'expectedMessage' => '[{"title":"Folder \"bar\" already exists.","status":422,"pointer":"id"}]',
			]],
			'when rename fails' => [[
				'args' => [
					'oldPath' => 'foo',
					'newPath' => 'does-not-exist',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'rename' => false,
					],
				],
				'expectedMessage' => 'Folder "foo" could not be moved to "does-not-exist".',
			]],
			'when rename succeeds' => [[
				'args' => [
					'oldPath' => 'foo',
					'newPath' => 'does-not-exist',
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'rename' => true,
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider renameFolderProvider
	 */
	public function testRenameFolder(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Filesystem::renameFolder(...array_values($args['args']));
	}

	public function writeFileProvider() : array
	{
		return [
			'when file_put_contents succeeds' => [[
				'args' => [
					'path' => 'foo',
					'data' => ['foo' => 'bar'],
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_put_contents' => true,
					],
				],
				'expected' => true,
			]],
			'when file_put_contents fails' => [[
				'args' => [
					'path' => 'foo',
					'data' => ['foo' => 'bar'],
				],
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_put_contents' => false,
					],
				],
				'expected' => false,
			]],
		];
	}

	/**
	 * @dataProvider writeFileProvider
	 */
	public function testWriteFile(array $args) : void
	{
		self::setupTest($args);
		$output = Filesystem::writeFile(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}
}
