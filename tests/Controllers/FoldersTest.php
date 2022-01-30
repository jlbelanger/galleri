<?php

namespace Tests\Controllers;

use Jlbelanger\Robroy\Controllers\Folders;
use Jlbelanger\Robroy\Exceptions\ApiException;
use Tests\TestCase;

class FoldersTest extends TestCase
{
	public function getProvider() : array
	{
		return [
			'when folders.json exists' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'expected' => [
					'data' => [
						'foo' => [
							'id' => 'foo',
							'attributes' => [
								'name' => 'Foo',
							],
						],
					],
				],
			]],
			'when folders.json does not exist' => [[
				'expected' => [
					'data' => [],
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
		}

		$output = Folders::get();
		$this->assertSame($args['expected'], $output);
	}

	public function postProvider() : array
	{
		return [
			'when body is not set' => [[
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when name is not set' => [[
				'body' => '{}',
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when name is empty' => [[
				'body' => '{"name":""}',
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when name is the same as THUMBNAILS_FOLDER' => [[
				'body' => '{"name":"Thumbnails"}',
				'expectedMessage' => '[{"title":"Name cannot be the same as the thumbnails folder.","status":422,"pointer":"name"}]',
			]],
			'when name is valid, parent has a leading slash' => [[
				'body' => '{"name":"New Folder","parent":"/foo"}',
				'expectedMessage' => '[{"title":"Parent cannot begin or end with slashes.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent has a trailing slash' => [[
				'body' => '{"name":"New Folder","parent":"foo/"}',
				'expectedMessage' => '[{"title":"Parent cannot begin or end with slashes.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent has a invalid characters' => [[
				'body' => '{"name":"New Folder","parent":".."}',
				'expectedMessage' => '[{"title":"Parent contains invalid characters.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent is the same as THUMBNAILS_FOLDER' => [[
				'body' => '{"name":"New Folder","parent":"thumbnails"}',
				'expectedMessage' => '[{"title":"Parent cannot be the same as the thumbnails folder.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent ends in THUMBNAILS_FOLDER' => [[
				'body' => '{"name":"New Folder","parent":"foo/thumbnails"}',
				'expectedMessage' => '[{"title":"Parent cannot end in the thumbnails folder.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent does not exist' => [[
				'body' => '{"name":"New Folder","parent":"does-not-exist"}',
				'expectedMessage' => '[{"title":"Parent \"does-not-exist\" does not exist.","status":422,"pointer":"parent"}]',
			]],
			'when name is valid, parent is not set' => [[
				'body' => '{"name":"Does Not Exist"}',
			]],
			'when name is valid, parent is empty' => [[
				'body' => '{"name":"Does Not Exist","parent":""}',
			]],
			'when name is valid, parent is valid' => [[
				'body' => '{"name":"Does Not Exist","parent":"foo"}',
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Folders::post();
	}

	public function putProvider() : array
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
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has a trailing slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has invalid characters' => [[
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'ID contains invalid characters.',
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
			'when id does not exist' => [[
				'variables' => [
					'_GET' => ['id' => 'does-not-exist'],
				],
				'expectedMessage' => 'Folder "does-not-exist" does not exist.',
			]],
			'when id is valid, body is not set' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when id is valid, name is not set' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when id is valid, name is empty' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":""}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"This field is required.","status":422,"pointer":"name"}]',
			]],
			'when id is valid, name is the same as THUMBNAILS_FOLDER' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Name cannot be the same as the thumbnails folder.","status":422,"pointer":"name"}]',
			]],
			'when id is valid, name already exists' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Folder \"bar\" already exists.","status":422,"pointer":"name"}]',
			]],
			'when id is valid, name is valid, parent has a leading slash' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"/bar"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent cannot begin or end with slashes.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent has a trailing slash' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"bar/"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent cannot begin or end with slashes.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent has invalid characters' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":".."}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent contains invalid characters.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent is the same as THUMBNAILS_FOLDER' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent cannot be the same as the thumbnails folder.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent ends in THUMBNAILS_FOLDER' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"bar/thumbnails"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent cannot end in the thumbnails folder.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent does not exist' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"does-not-exist"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Parent \"does-not-exist\" does not exist.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent is self' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo","parent":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
				'expectedMessage' => '[{"title":"Name and parent cannot be the same.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent is child' => [[
				'folders.json' => '{"data":{"parent":{"id":"parent","attributes":{"name":"parent"}}}}',
				'body' => '{"name":"parent","parent":"parent/child"}',
				'variables' => [
					'_GET' => ['id' => 'parent'],
				],
				'expectedMessage' => '[{"title":"Parent cannot be a descendant of name.","status":422,"pointer":"parent"}]',
			]],
			'when id is valid, name is valid, parent is not set' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
				'body' => '{"name":"foo"}',
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid, name is valid, parent is empty' => [[
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}}}}',
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
				'folders.json' => '{"data":{"foo":{"id":"foo","attributes":{"name":"Foo"}},"bar":{"id":"bar","attributes":{"name":"Bar"}}}}',
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Folders::put();
	}

	public function deleteProvider() : array
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
					'_GET' => ['id' => '/foo'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has a trailing slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/'],
				],
				'expectedMessage' => 'ID cannot begin or end with slashes.',
			]],
			'when id has invalid characters' => [[
				'variables' => [
					'_GET' => ['id' => '..'],
				],
				'expectedMessage' => 'ID contains invalid characters.',
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
			'when id does not exist' => [[
				'variables' => [
					'_GET' => ['id' => 'does-not-exist'],
				],
			]],
			'when id is valid' => [[
				'variables' => [
					'_GET' => ['id' => 'foo'],
				],
			]],
			'when id is valid with a mid slash' => [[
				'variables' => [
					'_GET' => ['id' => 'foo/bar'],
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
			$this->expectExceptionMessageSame($args['expectedMessage']);
		} else {
			$this->expectNotToPerformAssertions();
		}

		Folders::delete();
	}
}
