<?php

namespace Tests\Controllers;

use Jlbelanger\Robroy\Controllers\Images;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Tests\TestCase;

class ImagesTest extends TestCase
{
	public static function setUpBeforeClass() : void
	{
		parent::setUpBeforeClass();
		self::createDirectory('assets/foo');
	}

	public function testGet() : void
	{
		$this->markTestIncomplete();
	}

	public function testPost() : void
	{
		$this->markTestIncomplete();
	}

	public function putProvider() : array
	{
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'rename' => true,
			],
			'Jlbelanger\Robroy\Models' => [
				'getimagesize' => [500, 500], // phpcs:disable Squiz.Arrays.ArrayDeclaration.SingleLineNotAllowed
				'file_exists' => true,
			],
		];
		return [
			'when id is not set' => [[
				'mocks' => $mocks,
				'expectedMessage' => 'No ID specified.',
			]],
			'when id is an empty string' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id has a leading slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => '/example.png'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id has a trailing slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'example.png/'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id has a leading period' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => '.example.png'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id has a trailing period' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'example.png.'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid ID.',
			]],
			'when id is valid, body is not set' => [[
				'mocks' => $mocks,
				'body' => '',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'No filename specified.',
			]],
			'when id is valid, filename is not set' => [[
				'mocks' => $mocks,
				'body' => '{}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'No filename specified.',
			]],
			'when id is valid, filename is empty' => [[
				'mocks' => $mocks,
				'body' => '{"filename":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'No filename specified.',
			]],
			'when id is valid, filename has leading slash' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has trailing slash' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has mid slash' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"foo/example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename has leading period' => [[
				'mocks' => $mocks,
				'body' => '{"filename":".example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid filename.',
			]],
			'when id is valid, filename has trailing period' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png."}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid filename.',
			]],
			'when id is valid, filename is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid filename.',
			]],
			'when id is valid, filename ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Filename cannot contain slashes.',
			]],
			'when id is valid, filename is valid, folder has a leading slash' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"/foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder has a trailing slash' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"foo/"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder has invalid characters' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":".."}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"foo/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder does not exist' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, filename is valid, folder is not set' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when id is valid, filename is valid, folder is empty' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when changing filename' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"new-filename.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when setting folder' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"example.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'example.png'],
				],
			]],
			'when changing folder' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"image.png","folder":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'folder-with-image/image.png'],
				],
			]],
			'when removing folder' => [[
				'mocks' => $mocks,
				'body' => '{"filename":"image.png","folder":""}',
				'variables' => [
					'_GET' => ['id' => 'folder-with-image/image.png'],
				],
			]],
			// TODO: Changing filename/folder to one that already exists.
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
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'unlink' => true,
			],
		];
		return [
			'when path is not set' => [[
				'mocks' => $mocks,
				'expectedMessage' => 'No path specified.',
			]],
			'when path is an empty string' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => ''],
				],
				'expectedMessage' => 'No path specified.',
			]],
			'when path has a leading slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => '/example.png'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path has a trailing slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'example.png/'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path has a leading period' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => '.example.png'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path has a trailing period' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'example.png.'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path has invalid characters' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'EXAMPLE.PNG'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid path.',
			]],
			'when path is valid' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['path' => 'example.png'],
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
