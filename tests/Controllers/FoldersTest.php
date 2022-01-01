<?php

namespace Tests\Controllers;

use Jlbelanger\Robroy\Controllers\Folders;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Tests\TestCase;

class FoldersTest extends TestCase
{
	public static function setUpBeforeClass() : void
	{
		parent::setUpBeforeClass();
		self::createDirectory('assets/bar');
		self::createDirectory('assets/foo');
		self::createDirectory('assets/parent');
		self::createDirectory('assets/parent/child');
	}

	public function testGet() : void
	{
		$this->markTestIncomplete();
	}

	public function postProvider() : array
	{
		return [
			'when name is not set' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when name is an empty string' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => ['name' => ''],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when name is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => ['name' => 'Thumbnails'],
				],
				'expectedMessage' => 'Invalid name.',
			]],
			'when name is valid, parent is not set' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => ['name' => 'New Folder'],
				],
			]],
			'when name is valid, parent is empty' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '',
					],
				],
			]],
			'when name is valid, parent has a leading slash' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a trailing slash' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a invalid characters' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '..',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent ends in THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'foo/thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent does not exist' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'does-not-exist',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is valid' => [[
				'mocks' => [
					'mkdir' => true,
				],
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'foo',
					],
				],
			]],
		];
	}

	/**
	 * @dataProvider postProvider
	 */
	public function testPost(array $args) : void
	{
		self::setupTest($args);

		if (!empty($args['expectedMessage'])) {
			$this->expectException(ApiException::class);
			$this->expectExceptionMessage($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Folders::post();
	}

	public function putProvider() : array
	{
		return [
			'when id is not set' => [[
				'mocks' => [
					'rename' => true,
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id is an empty string' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id has a leading slash' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'rename' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, body is not set' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is not set' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":""}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is not set, parent is empty' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"parent":""}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is empty' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"","parent":""}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is set' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"","parent":"foo"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is set, parent has a leading slash' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"/bar"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has a trailing slash' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"bar/"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has invalid characters' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":".."}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"thumbnails"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent ends in THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"bar/thumbnails"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent does not exist' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"does-not-exist"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent is self' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"foo"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Cannot set parent to itself.',
			]],
			'when id is valid, name is set, parent is child' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"parent","parent":"parent/child"}',
				],
				'variables' => [
					'_GET' => ['id' => 'parent'],
				],
				'expectedMessage' => 'Cannot set parent to a descendant.',
			]],
			'when id is valid, name is valid, parent is not set' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is empty' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":""}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is valid' => [[
				'mocks' => [
					'rename' => true,
					'file_get_contents' => '{"name":"foo","parent":"bar"}',
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
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

		Folders::put();
	}

	public function deleteProvider() : array
	{
		return [
			'when id is not set' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id is an empty string' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id has a leading slash' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid' => [[
				'mocks' => [
					'unlink' => true,
					'rmdir' => true,
				],
				'variables' => [
					'_GET' => ['id' => 'foo'],
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

		Folders::delete();
	}
}
