<?php

namespace Tests\Controllers;

use Jlbelanger\Robroy\Controllers\Images;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Tests\TestCase;

class ImagesTest extends TestCase
{
	public function getProvider() : array
	{
		return [
			'when parent is not set' => [[
				'expected' => [
					'data' => [],
					'meta' => [
						'num_items' => 0,
						'page_number' => 1,
						'total_pages' => 0,
					],
				],
			]],
			'when parent is empty' => [[
				'variables' => [
					'_GET' => ['parent' => ''],
				],
				'expected' => [
					'data' => [],
					'meta' => [
						'num_items' => 0,
						'page_number' => 1,
						'total_pages' => 0,
					],
				],
			]],
			'when parent has a leading slash' => [[
				'variables' => [
					'_GET' => ['parent' => '/foo'],
				],
				'expectedMessage' => 'Parent cannot begin or end with slashes.',
			]],
			'when parent has a leading slash' => [[
				'variables' => [
					'_GET' => ['parent' => 'foo/'],
				],
				'expectedMessage' => 'Parent cannot begin or end with slashes.',
			]],
			'when parent has invalid characters' => [[
				'variables' => [
					'_GET' => ['parent' => '..'],
				],
				'expectedMessage' => 'Parent contains invalid characters.',
			]],
			'when parent does not exist' => [[
				'variables' => [
					'_GET' => ['parent' => 'does-not-exist'],
				],
				'expectedMessage' => 'This folder does not exist.',
			]],
			'when parent is valid' => [[
				'variables' => [
					'_GET' => ['parent' => 'foo'],
				],
				'expected' => [
					'data' => [],
					'meta' => [
						'num_items' => 0,
						'page_number' => 1,
						'total_pages' => 0,
					],
				],
			]],
			'when parent is valid with a mid slash' => [[
				'variables' => [
					'_GET' => ['parent' => 'foo/bar'],
				],
				'expected' => [
					'data' => [],
					'meta' => [
						'num_items' => 0,
						'page_number' => 1,
						'total_pages' => 0,
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider getProvider
	 */
	public function testGet(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		}

		$output = Images::get();
		$this->assertSame($args['expected'], $output);
	}

	public function testPost() : void
	{
		$this->markTestIncomplete();
	}

	public function putProvider() : array
	{
		return [
			'when id is not set' => [[
				'expectedMessage' => 'ID is required.',
			]],
			'when id is an empty string' => [[
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'ID is required.',
			]],
			'when id has a leading slash' => [[
				'variables' => [
					'_GET' => ['id' => '/example.png'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has a trailing slash' => [[
				'variables' => [
					'_GET' => ['id' => 'example.png/'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has a leading period' => [[
				'variables' => [
					'_GET' => ['id' => '.example.png'],
				],
				'expectedMessage' => 'ID cannot begin or end with periods.',
			]],
			'when id has a trailing period' => [[
				'variables' => [
					'_GET' => ['id' => 'example.png.'],
				],
				'expectedMessage' => 'ID cannot begin or end with periods.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'ID cannot be the same as the thumbnails folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'ID cannot end in the thumbnails folder.',
			]],
			'when id is valid, body is not set' => [[
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename is required.',
			]],
			'when id is valid, filename is not set' => [[
				'body' => '{}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename is required.',
			]],
			'when id is valid, filename is empty' => [[
				'body' => '{"filename":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename is required.',
			]],
			'when id is valid, filename has leading slash' => [[
				'body' => '{"filename":"/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has trailing slash' => [[
				'body' => '{"filename":"example.png/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has mid slash' => [[
				'body' => '{"filename":"foo/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has leading period' => [[
				'body' => '{"filename":".example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot begin or end with periods.',
			]],
			'when id is valid, filename has trailing period' => [[
				'body' => '{"filename":"example.png."}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot begin or end with periods.',
			]],
			'when id is valid, filename is the same as THUMBNAILS_FOLDER' => [[
				'body' => '{"filename":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot be the same as the thumbnails folder.',
			]],
			'when id is valid, filename ends in THUMBNAILS_FOLDER' => [[
				'body' => '{"filename":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename is valid, folder has a leading slash' => [[
				'body' => '{"filename":"example.png","folder":"/foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder cannot begin or end with slashes.',
			]],
			'when id is valid, filename is valid, folder has a trailing slash' => [[
				'body' => '{"filename":"example.png","folder":"foo/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder cannot begin or end with slashes.',
			]],
			'when id is valid, filename is valid, folder has invalid characters' => [[
				'body' => '{"filename":"example.png","folder":".."}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder contains invalid characters.',
			]],
			'when id is valid, filename is valid, folder is the same as THUMBNAILS_FOLDER' => [[
				'body' => '{"filename":"example.png","folder":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder cannot be the same as the thumbnails folder.',
			]],
			'when id is valid, filename is valid, folder ends in THUMBNAILS_FOLDER' => [[
				'body' => '{"filename":"example.png","folder":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder cannot end in the thumbnails folder.',
			]],
			'when id is valid, filename is valid, folder does not exist' => [[
				'body' => '{"filename":"example.png","folder":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Folder "does-not-exist" does not exist.',
			]],
			'when id is valid, filename is valid, folder is not set' => [[
				'body' => '{"filename":"example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when id is valid, filename is valid, folder is empty' => [[
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when changing filename to one that already exists' => [[
				'body' => '{"filename":"new-filename.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'File "new-filename.png" already exists.',
			]],
			'when setting folder to one where that filename already exists' => [[
				'body' => '{"filename":"example.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'File "foo/example.png" already exists.',
			]],
			'when changing folder to one where that filename already exists' => [[
				'body' => '{"filename":"example.png","folder":"bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo/example.png'],
				],
				'expectedMessage' => 'File "bar/example.png" already exists.',
			]],
			'when changing filename and folder to one where that filename already exists' => [[
				'body' => '{"filename":"new-filename.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'File "foo/new-filename.png" already exists.',
			]],
			'when removing folder to one where that filename already exists' => [[
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'foo/example.png'],
				],
				'expectedMessage' => 'File "example.png" already exists.',
			]],
			'when changing filename' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'new-filename.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"new-filename.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when setting folder' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'new-folder/example.png') !== false || strpos($path, 'new-folder/thumbnails/example.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"example.png","folder":"new-folder"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when changing folder' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'new-folder/example.png') !== false || strpos($path, 'new-folder/thumbnails/example.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"example.png","folder":"new-folder"}',
				'variables' => [
					'_GET' => ['id' => 'folder-with-image/example.png'],
				],
			]],
			'when changing filename and folder' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'new-folder/new-filename.png') !== false) {
								return false;
							}
							if (strpos($path, 'new-folder/thumbnails/new-filename.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"new-filename.png","folder":"new-folder"}',
				'variables' => [
					'_GET' => ['id' => 'folder-with-image/example.png'],
				],
			]],
			'when removing folder' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'assets/example.png') !== false || strpos($path, 'assets/thumbnails/example.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'folder-with-image/example.png'],
				],
			]],
		];
	}

	/**
	 * @dataProvider putProvider
	 */
	public function testPut(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Images::put();
	}

	public function deleteProvider() : array
	{
		return [
			'when path is not set' => [[
				'expectedMessage' => 'Path is required.',
			]],
			'when path is an empty string' => [[
				'variables' => [
					'_GET' => ['path' => ''],
				],
				'expectedMessage' => 'Path is required.',
			]],
			'when path has a leading slash' => [[
				'variables' => [
					'_GET' => ['path' => '/example.png'],
				],
				'expectedMessage' => 'Path cannot begin or end with slashes.',
			]],
			'when path has a trailing slash' => [[
				'variables' => [
					'_GET' => ['path' => 'example.png/'],
				],
				'expectedMessage' => 'Path cannot begin or end with slashes.',
			]],
			'when path has a leading period' => [[
				'variables' => [
					'_GET' => ['path' => '.example.png'],
				],
				'expectedMessage' => 'Path cannot begin or end with periods.',
			]],
			'when path has a trailing period' => [[
				'variables' => [
					'_GET' => ['path' => 'example.png.'],
				],
				'expectedMessage' => 'Path cannot begin or end with periods.',
			]],
			'when path is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['path' => 'thumbnails'],
				],
				'expectedMessage' => 'Path cannot be the same as the thumbnails folder.',
			]],
			'when path ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['path' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Path cannot end in the thumbnails folder.',
			]],
			'when path is valid' => [[
				'variables' => [
					'_GET' => ['path' => 'example.png'],
				],
			]],
			'when path is valid with a mid slash' => [[
				'variables' => [
					'_GET' => ['path' => 'foo/example.png'],
				],
			]],
		];
	}

	/**
	 * @dataProvider deleteProvider
	 */
	public function testDelete(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Images::delete();
	}
}
