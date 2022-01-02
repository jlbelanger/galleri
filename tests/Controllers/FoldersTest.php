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
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'mkdir' => true,
			],
		];
		return [
			'when name is not set' => [[
				'mocks' => $mocks,
				'expectedMessage' => 'No name specified.',
			]],
			'when name is an empty string' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => ['name' => ''],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when name is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => ['name' => 'Thumbnails'],
				],
				'expectedMessage' => 'Invalid name.',
			]],
			'when name is valid, parent is not set' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => ['name' => 'New Folder'],
				],
			]],
			'when name is valid, parent is empty' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '',
					],
				],
			]],
			'when name is valid, parent has a leading slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a trailing slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a invalid characters' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '..',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'foo/thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent does not exist' => [[
				'mocks' => $mocks,
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'does-not-exist',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is valid' => [[
				'mocks' => $mocks,
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
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'rename' => true,
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
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, body is not set' => [[
				'mocks' => $mocks,
				'body' => '',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is not set' => [[
				'mocks' => $mocks,
				'body' => '{"name":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is not set, parent is empty' => [[
				'mocks' => $mocks,
				'body' => '{"parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is empty' => [[
				'mocks' => $mocks,
				'body' => '{"name":"","parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is set' => [[
				'mocks' => $mocks,
				'body' => '{"name":"","parent":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is set, parent has a leading slash' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"/bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has a trailing slash' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"bar/"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has invalid characters' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":".."}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"bar/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent does not exist' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent is self' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Cannot set parent to itself.',
			]],
			'when id is valid, name is set, parent is child' => [[
				'mocks' => $mocks,
				'body' => '{"name":"parent","parent":"parent/child"}',
				'variables' => [
					'_GET' => ['id' => 'parent'],
				],
				'expectedMessage' => 'Cannot set parent to a descendant.',
			]],
			'when id is valid, name is valid, parent is not set' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is empty' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is valid' => [[
				'mocks' => $mocks,
				'body' => '{"name":"foo","parent":"bar"}',
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
		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'unlink' => true,
				'rmdir' => true,
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
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'mocks' => $mocks,
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid' => [[
				'mocks' => $mocks,
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
