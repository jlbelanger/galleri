<?php

namespace Tests\Helpers;

use Jlbelanger\Galleri\Helpers\Input;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class InputTest extends TestCase
{
	public static function envProvider() : array
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

	#[DataProvider('envProvider')]
	public function testEnv(array $args) : void
	{
		self::setupTest($args);
		$output = Input::env(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function hasEnvProvider() : array
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

	#[DataProvider('hasEnvProvider')]
	public function testHasEnv(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasEnv(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function fileProvider() : array
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

	#[DataProvider('fileProvider')]
	public function testFile(array $args) : void
	{
		self::setupTest($args);
		$output = Input::file(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function hasFileProvider() : array
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

	#[DataProvider('hasFileProvider')]
	public function testHasFile(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasFile(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function getProvider() : array
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

	#[DataProvider('getProvider')]
	public function testGet(array $args) : void
	{
		self::setupTest($args);
		$output = Input::get(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function hasGetProvider() : array
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

	#[DataProvider('hasGetProvider')]
	public function testHasGet(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasGet(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function jsonProvider() : array
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

	#[DataProvider('jsonProvider')]
	public function testJson(array $args) : void
	{
		self::setupTest($args);
		$output = Input::json();
		$this->assertSame($args['expected'], $output);
	}

	public static function postProvider() : array
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

	#[DataProvider('postProvider')]
	public function testPost(array $args) : void
	{
		self::setupTest($args);
		$output = Input::post(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function hasPostProvider() : array
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

	#[DataProvider('hasPostProvider')]
	public function testHasPost(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasPost(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function serverProvider() : array
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

	#[DataProvider('serverProvider')]
	public function testServer(array $args) : void
	{
		self::setupTest($args);
		$output = Input::server(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function hasServerProvider() : array
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

	#[DataProvider('hasServerProvider')]
	public function testHasServer(array $args) : void
	{
		self::setupTest($args);
		$output = Input::hasServer(...array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function valueProvider() : array
	{
		return [
			'with a string key and a string value' => [[
				'args' => [
					'key' => 'a',
					'value' => ['a' => 'b'],
				],
				'expected' => 'b',
			]],
			'with a string key and an array value' => [[
				'args' => [
					'key' => 'a',
					'value' => ['a' => ['b' => 'c']],
				],
				'expected' => ['b' => 'c'],
			]],
			'with an array key and a string value' => [[
				'args' => [
					'key' => ['a', 'b'],
					'value' => [
						'a' => [
							'b' => 'c',
						],
					],
				],
				'expected' => 'c',
			]],
			'with an array key and an array value' => [[
				'args' => [
					'key' => ['a', 'b'],
					'value' => [
						'a' => [
							'b' => ['c' => 'd'],
						],
					],
				],
				'expected' => ['c' => 'd'],
			]],
		];
	}

	#[DataProvider('valueProvider')]
	public function testValue(array $args) : void
	{
		$output = $this->callPrivate(new Input, 'value', array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}

	public static function filterProvider() : array
	{
		return [
			'with a string value' => [[
				'args' => [
					's' => ' ...M&M\'s - "Foo" & P.E.I. (Foo’s) <img> and? AC/DC #1-2-3-',
				],
				'expected' => '...M&amp;M\'s - &quot;Foo&quot; &amp; P.E.I. (Foo’s) &lt;img&gt; and? AC/DC #1-2-3-',
			]],
			'with an array value' => [[
				'args' => [
					's' => [
						'<img>',
						'"Foo"',
						['<d>' => 'A & B'],
					],
				],
				'expected' => [
					'&lt;img&gt;',
					'&quot;Foo&quot;',
					['&lt;d&gt;' => 'A &amp; B'],
				],
			]],
			'with an associative array value' => [[
				'args' => [
					's' => [
						'a' => '<img>',
						'b' => '"Foo"',
						'c' => [
							'<d>' => 'A & B',
						],
					],
				],
				'expected' => [
					'a' => '&lt;img&gt;',
					'b' => '&quot;Foo&quot;',
					'c' => [
						'&lt;d&gt;' => 'A &amp; B',
					],
				],
			]],
			'with a custom filter' => [[
				'args' => [
					's' => '1,000',
					'filter' => FILTER_SANITIZE_NUMBER_INT,
				],
				'expected' => '1000',
			]],
		];
	}

	#[DataProvider('filterProvider')]
	public function testFilter(array $args) : void
	{
		$output = $this->callPrivate(new Input, 'filter', array_values($args['args']));
		$this->assertSame($args['expected'], $output);
	}
}
