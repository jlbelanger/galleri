<?php

namespace Tests\Helpers;

use Jlbelanger\Robroy\Helpers\Input;
use Tests\TestCase;

class InputTest extends TestCase
{
	public function envProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => '',
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => '',
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_ENV' => ['foo' => 'blah'],
				],
				'expected' => 'blah',
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_ENV' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => 'blah',
			]],
		];
	}

	/**
	 * @dataProvider envProvider
	 */
	public function testEnv(array $args) : void
	{
		self::setupTest($args);
		$output = Input::env(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function hasEnvProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => false,
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => false,
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_ENV' => ['foo' => 'blah'],
				],
				'expected' => true,
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_ENV' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider hasEnvProvider
	 */
	public function testHasEnv(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasEnv(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function fileProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => '',
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => '',
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_FILES' => ['foo' => 'blah'],
				],
				'expected' => 'blah',
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_FILES' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => 'blah',
			]],
		];
	}

	/**
	 * @dataProvider fileProvider
	 */
	public function testFile(array $args) : void
	{
		self::setupTest($args);
		$output = Input::file(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function hasFileProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => false,
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => false,
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_FILES' => ['foo' => 'blah'],
				],
				'expected' => true,
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_FILES' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider hasFileProvider
	 */
	public function testHasFile(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasFile(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function getProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => '',
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => '',
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_GET' => ['foo' => 'blah'],
				],
				'expected' => 'blah',
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_GET' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => 'blah',
			]],
		];
	}

	/**
	 * @dataProvider getProvider
	 */
	public function testGet(array $args) : void
	{
		self::setupTest($args);
		$output = Input::get(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function hasGetProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => false,
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => false,
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_GET' => ['foo' => 'blah'],
				],
				'expected' => true,
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_GET' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider hasGetProvider
	 */
	public function testHasGet(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasGet(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function jsonProvider() : array
	{
		return [
			'when body is not set' => [[
				'expected' => [],
			]],
			'when body is empty' => [[
				'body' => '',
				'expected' => [],
			]],
			'when body is set' => [[
				'body' => '{"foo":"bar"}',
				'expected' => [
					'foo' => 'bar',
				],
			]],
		];
	}

	/**
	 * @dataProvider jsonProvider
	 */
	public function testJson(array $args) : void
	{
		self::setupTest($args);
		$output = Input::json();
		$this->assertSame($args['expected'], $output);
	}

	public function postProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => '',
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => '',
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_POST' => ['foo' => 'blah'],
				],
				'expected' => 'blah',
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_POST' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => 'blah',
			]],
		];
	}

	/**
	 * @dataProvider postProvider
	 */
	public function testPost(array $args) : void
	{
		self::setupTest($args);
		$output = Input::post(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function hasPostProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => false,
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => false,
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_POST' => ['foo' => 'blah'],
				],
				'expected' => true,
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_POST' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider hasPostProvider
	 */
	public function testHasPost(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasPost(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function serverProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => '',
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => '',
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_SERVER' => ['foo' => 'blah'],
				],
				'expected' => 'blah',
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_SERVER' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => 'blah',
			]],
		];
	}

	/**
	 * @dataProvider serverProvider
	 */
	public function testServer(array $args) : void
	{
		self::setupTest($args);
		$output = Input::server(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public function hasServerProvider() : array
	{
		return [
			'when the string key is not set' => [[
				'args' => [
					'key' => 'foo',
				],
				'expected' => false,
			]],
			'when the array key is not set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'expected' => false,
			]],
			'when the string key is set' => [[
				'args' => [
					'key' => 'foo',
				],
				'variables' => [
					'_SERVER' => ['foo' => 'blah'],
				],
				'expected' => true,
			]],
			'when the array key is set' => [[
				'args' => [
					'key' => ['foo', 'bar'],
				],
				'variables' => [
					'_SERVER' => ['foo' => ['bar' => 'blah']],
				],
				'expected' => true,
			]],
		];
	}

	/**
	 * @dataProvider hasServerProvider
	 */
	public function testHasServer(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasServer(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}
}
