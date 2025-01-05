<?php

namespace Tests\Controllers;

use Jlbelanger\Galleri\Controllers\Images;
use Jlbelanger\Galleri\Exceptions\ApiException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ImagesTest extends TestCase
{
	public static function getProvider() : array
	{
		return [
			'when images.json exists' => [[
				'images.json' => '{"data":{"foo.png":{"id":"foo.png","attributes":{"title":"Foo"}}}}',
				'expected' => [
					'data' => [
						'foo.png' => [
							'id' => 'foo.png',
							'attributes' => [
								'title' => 'Foo',
							],
						],
					],
				],
			]],
			'when images.json does not exist' => [[
				'expected' => [
					'data' => [],
				],
			]],
		];
	}

	#[DataProvider('getProvider')]
	public function testGet(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		}

		$output = Images::get();
		$this->assertSame($args['expected'], $output);
	}

	public function testPost() : void
	{
		$this->markTestIncomplete();
	}

	public static function putProvider() : array
	{
		$json = '{"data":{"example.png":{"id":"example.png","attributes":{"title":"Foo"}}}}';
		return [
			'when id is not set' => [[
				'expectedMessage' => 'ID is required.',
			]],
			'when id is empty' => [[
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
			'when id has no extension' => [[
				'variables' => [
					'_GET' => ['id' => 'example'],
				],
				'expectedMessage' => 'ID is missing a file extension (eg. JPG, PNG).',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'thumbnails.jpg'],
					'_ENV' => ['THUMBNAILS_FOLDER' => 'thumbnails.jpg'],
				],
				'expectedMessage' => 'ID cannot be the same as the thumbnails folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails.jpg'],
					'_ENV' => ['THUMBNAILS_FOLDER' => 'thumbnails.jpg'],
				],
				'expectedMessage' => 'ID cannot end in the thumbnails folder.',
			]],
			'when id does not exist' => [[
				'variables' => [
					'_GET' => ['id' => 'does-not-exist.png'],
				],
				'expectedMessage' => 'Image "does-not-exist.png" does not exist.',
			]],
			'when id is valid, body is not set' => [[
				'images.json' => $json,
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename is not set' => [[
				'images.json' => $json,
				'body' => '{}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename is empty' => [[
				'images.json' => $json,
				'body' => '{"filename":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename has leading slash' => [[
				'images.json' => $json,
				'body' => '{"filename":"/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Filename cannot contain slashes.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename has trailing slash' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Filename cannot contain slashes.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename has mid slash' => [[
				'images.json' => $json,
				'body' => '{"filename":"foo/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Filename cannot contain slashes.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename has no extension' => [[
				'images.json' => $json,
				'body' => '{"filename":"example"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Filename is missing a file extension (eg. JPG, PNG).","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename is the same as THUMBNAILS_FOLDER' => [[
				'images.json' => $json,
				'body' => '{"filename":"thumbnails.jpg"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
					'_ENV' => ['THUMBNAILS_FOLDER' => 'thumbnails.jpg'],
				],
				'expectedMessage' => '[{"title":"Filename cannot be the same as the thumbnails folder.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename ends in THUMBNAILS_FOLDER' => [[
				'images.json' => $json,
				'body' => '{"filename":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Filename cannot contain slashes.","status":422,"pointer":"filename"}]',
			]],
			'when id is valid, filename is valid, folder has a leading slash' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"/foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder cannot begin or end with slashes.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder has a trailing slash' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"foo/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder cannot begin or end with slashes.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder has invalid characters' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":".."}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder contains invalid characters.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder is the same as THUMBNAILS_FOLDER' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder cannot be the same as the thumbnails folder.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder ends in THUMBNAILS_FOLDER' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder cannot end in the thumbnails folder.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder does not exist' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"Folder \"does-not-exist\" does not exist.","status":422,"pointer":"folder"}]',
			]],
			'when id is valid, filename is valid, folder is not set' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when id is valid, filename is valid, folder is empty' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when changing filename to one that already exists' => [[
				'images.json' => '{"data":{"example.png":{"id":"example.png","attributes":{"title":"Foo"}},"new-filename.png":{"id":"new-filename.png","attributes":{"title":"Foo"}}}}',
				'body' => '{"filename":"new-filename.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"File \"new-filename.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when setting folder to one where that filename already exists' => [[
				'images.json' => $json,
				'body' => '{"filename":"example.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"File \"foo\/example.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when changing folder to one where that filename already exists' => [[
				'images.json' => '{"data":{"foo/example.png":{"id":"foo/example.png","attributes":{"title":"Foo"}},"bar/example.png":{"id":"bar/example.png","attributes":{"title":"Foo"}}}}',
				'body' => '{"filename":"example.png","folder":"bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo/example.png'],
				],
				'expectedMessage' => '[{"title":"File \"bar\/example.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when changing filename and folder to one where that filename already exists' => [[
				'images.json' => '{"data":{"example.png":{"id":"example.png","attributes":{"title":"Foo"}},"new-filename.png":{"id":"new-filename.png","attributes":{"title":"Foo"}}}}',
				'body' => '{"filename":"new-filename.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => '[{"title":"File \"foo\/new-filename.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when removing folder to one where that filename already exists' => [[
				'images.json' => '{"data":{"example.png":{"id":"example.png","attributes":{"title":"Foo"}},"foo/example.png":{"id":"foo/example.png","attributes":{"title":"Foo"}}}}',
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'foo/example.png'],
				],
				'expectedMessage' => '[{"title":"File \"example.png\" already exists.","status":422,"pointer":"filename"}]',
			]],
			'when changing filename' => [[
				'images.json' => $json,
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
			'when changing filename with invalid characters' => [[
				'images.json' => $json,
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
						'file_exists' => function ($path) {
							if (strpos($path, 'new-filename.png') !== false) {
								return false;
							}
							return true;
						},
					],
				],
				'body' => '{"filename":"New Filename.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when setting folder' => [[
				'images.json' => $json,
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
				'images.json' => '{"data":{"folder-with-image/example.png":{"id":"folder-with-image/example.png","attributes":{"title":"Foo"}}}}',
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
				'images.json' => '{"data":{"folder-with-image/example.png":{"id":"folder-with-image/example.png","attributes":{"title":"Foo"}}}}',
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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
				'images.json' => '{"data":{"folder-with-image/example.png":{"id":"folder-with-image/example.png","attributes":{"title":"Foo"}}}}',
				'mocks' => [
					'Jlbelanger\Galleri\Helpers' => [
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

	#[DataProvider('putProvider')]
	public function testPut(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Images::put();
	}

	public static function deleteProvider() : array
	{
		return [
			'when id is not set' => [[
				'expectedMessage' => 'ID is required.',
			]],
			'when id is empty' => [[
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
			'when id has no extension' => [[
				'variables' => [
					'_GET' => ['id' => 'example'],
				],
				'expectedMessage' => 'ID is missing a file extension (eg. JPG, PNG).',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'thumbnails.jpg'],
					'_ENV' => ['THUMBNAILS_FOLDER' => 'thumbnails.jpg'],
				],
				'expectedMessage' => 'ID cannot be the same as the thumbnails folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails.jpg'],
					'_ENV' => ['THUMBNAILS_FOLDER' => 'thumbnails.jpg'],
				],
				'expectedMessage' => 'ID cannot end in the thumbnails folder.',
			]],
			'when id does not exist' => [[
				'variables' => [
					'_GET' => ['id' => 'does-not-exist.png'],
				],
			]],
			'when id is valid' => [[
				'variables' => [
					'_GET' => ['id' => 'foo.png'],
				],
			]],
			'when id is valid with a mid slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/bar.png'],
				],
			]],
		];
	}

	#[DataProvider('deleteProvider')]
	public function testDelete(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Images::delete();
	}
}
