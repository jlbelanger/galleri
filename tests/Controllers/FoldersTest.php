<?php

namespace Tests\Controllers;

use Jlbelanger\Robroy\Controllers\Folders;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Tests\TestCase;

class FoldersTest extends TestCase
{
	public function testGet() : void
	{
		$this->markTestIncomplete();
	}

	public function postProvider() : array
	{
		return [
			'when name is not set' => [[
				'expectedMessage' => 'No name specified.',
			]],
			'when name is an empty string' => [[
				'variables' => [
					'_POST' => ['name' => ''],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when name is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_POST' => ['name' => 'Thumbnails'],
				],
				'expectedMessage' => 'Invalid name.',
			]],
			'when name is valid, parent has a leading slash' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a trailing slash' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '/foo',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent has a invalid characters' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => '..',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'foo/thumbnails',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent does not exist' => [[
				'variables' => [
					'_POST' => [
						'name' => 'New Folder',
						'parent' => 'does-not-exist',
					],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when name is valid, parent is not set' => [[
				'variables' => [
					'_POST' => ['name' => 'Does Not Exist'],
				],
			]],
			'when name is valid, parent is empty' => [[
				'variables' => [
					'_POST' => [
						'name' => 'Does Not Exist',
						'parent' => '',
					],
				],
			]],
			'when name is valid, parent is valid' => [[
				'variables' => [
					'_POST' => [
						'name' => 'Does Not Exist',
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
				'expectedMessage' => 'No ID specified.',
			]],
			'when id is an empty string' => [[
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id has a leading slash' => [[
				'variables' => [
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid, body is not set' => [[
				'body' => '',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is not set' => [[
				'body' => '{"name":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is not set, parent is empty' => [[
				'body' => '{"parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is empty' => [[
				'body' => '{"name":"","parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is empty, parent is set' => [[
				'body' => '{"name":"","parent":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'No name specified.',
			]],
			'when id is valid, name is set, parent has a leading slash' => [[
				'body' => '{"name":"foo","parent":"/bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has a trailing slash' => [[
				'body' => '{"name":"foo","parent":"bar/"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent has invalid characters' => [[
				'body' => '{"name":"foo","parent":".."}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent is the same as THUMBNAILS_FOLDER' => [[
				'body' => '{"name":"foo","parent":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent ends in THUMBNAILS_FOLDER' => [[
				'body' => '{"name":"foo","parent":"bar/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Invalid parent.',
			]],
			'when id is valid, name is set, parent does not exist' => [[
				'body' => '{"name":"foo","parent":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Folder "does-not-exist" does not exist.',
			]],
			'when id is valid, name is set, parent is self' => [[
				'body' => '{"name":"foo","parent":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => 'Cannot set parent to itself.',
			]],
			'when id is valid, name is set, parent is child' => [[
				'body' => '{"name":"parent","parent":"parent/child"}',
				'variables' => [
					'_GET' => ['id' => 'parent'],
				],
				'expectedMessage' => 'Cannot set parent to a descendant.',
			]],
			'when id is valid, name is valid, parent is not set' => [[
				'body' => '{"name":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is empty' => [[
				'body' => '{"name":"foo","parent":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is valid' => [[
				'mocks' => [
					'Jlbelanger\Robroy\Helpers' => [
						'file_exists' => function ($path) {
							if ($path === '/var/www/robroy/tests/assets/bar/foo') {
								return false;
							}
							return true;
						},
					],
				],
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
		return [
			'when id is not set' => [[
				'expectedMessage' => 'No ID specified.',
			]],
			'when id is an empty string' => [[
				'variables' => [
					'_GET' => ['id' => ''],
				],
				'expectedMessage' => 'No ID specified.',
			]],
			'when id has a leading slash' => [[
				'variables' => [
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has a trailing slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id has invalid characters' => [[
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is the same as THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id ends in THUMBNAILS_FOLDER' => [[
				'variables' => [
					'_GET' => ['id' => 'folder/thumbnails'],
				],
				'expectedMessage' => 'Invalid folder.',
			]],
			'when id is valid' => [[
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
