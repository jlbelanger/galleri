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

	public function testPost() : void
	{
		$this->markTestIncomplete();
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
