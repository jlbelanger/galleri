<?php

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
	private $mocks = [];

	private $originalEnv = [];

	protected function setUp() : void
	{
		parent::setUp();
		$this->originalEnv = $_ENV;
	}

	protected function tearDown() : void
	{
		$_ENV = $this->originalEnv;
		foreach ($this->mocks as $i => $mock) {
			$mock->disable();
		}
		$this->mocks = [];
	}

	protected function addMock(string $namespace, string $fn, $value) : void
	{
		$builder = new \phpmock\MockBuilder();
		$builder->setNamespace($namespace)
				->setName($fn);

		if (is_callable($value)) {
			$builder->setFunction($value);
		} else {
			$valueFn = new \phpmock\functions\FixedValueFunction($value);
			$builder->setFunctionProvider($valueFn);
		}

		$mock = $builder->build();
		$mock->enable();
		$this->mocks[] = $mock;
	}

	protected function callPrivate($obj, string $name, array $args = [])
	{
		$class = new \ReflectionClass($obj);
		$method = $class->getMethod($name);
		$method->setAccessible(true);
		return $method->invokeArgs($obj, $args);
	}

	protected function expectExceptionMessageSame(string $value)
	{
		$value = preg_quote($value);
		$value = str_replace('/', '\/', $value);
		$this->expectExceptionMessageMatches('/^' . $value . '$/');
	}

	protected function setupTest(array $args) : void // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh
	{
		if (!empty($args['variables']['_ENV'])) {
			$_ENV = $args['variables']['_ENV'];
		} else {
			$_ENV = $this->originalEnv;
		}

		if (!empty($args['variables']['_FILES'])) {
			$_FILES = $args['variables']['_FILES'];
		} else {
			$_FILES = [];
		}

		if (!empty($args['variables']['_GET'])) {
			$_GET = $args['variables']['_GET'];
		} else {
			$_GET = [];
		}

		if (!empty($args['variables']['_POST'])) {
			$_POST = $args['variables']['_POST'];
		} else {
			$_POST = [];
		}

		if (!empty($args['variables']['_SERVER'])) {
			$_SERVER = $args['variables']['_SERVER'];
		} else {
			$_SERVER = [];
		}

		$mocks = [
			'Jlbelanger\Robroy\Helpers' => [
				'file_exists' => function ($path) use ($args) {
					if ($path === '/var/www/robroy/tests/data/folders.json' && !isset($args['folders.json'])) {
						return false;
					}
					return strpos($path, 'does-not-exist') === false;
				},
				'is_dir' => function ($path) {
					return strpos($path, 'does-not-exist') === false;
				},
				'copy' => true,
				'file_put_contents' => 1,
				'mkdir' => true,
				'move_uploaded_file' => true,
				'opendir' => false,
				'rename' => true,
				'rmdir' => true,
				'unlink' => true,
			],
			'Jlbelanger\Robroy\Models' => [
				'getimagesize' => [500, 500],
			],
		];
		if (!empty($args['mocks']['Jlbelanger\Robroy\Helpers'])) {
			$mocks['Jlbelanger\Robroy\Helpers'] = array_merge($mocks['Jlbelanger\Robroy\Helpers'], $args['mocks']['Jlbelanger\Robroy\Helpers']);
		}
		if (!empty($args['mocks']['Jlbelanger\Robroy\Models'])) {
			$mocks['Jlbelanger\Robroy\Models'] = array_merge($mocks['Jlbelanger\Robroy\Models'], $args['mocks']['Jlbelanger\Robroy\Models']);
		}
		foreach ($mocks as $class => $functions) {
			foreach ($functions as $function => $value) {
				$this->addMock($class, $function, $value);
			}
		}

		$this->addMock(
			'Jlbelanger\Robroy\Helpers',
			'file_get_contents',
			function ($path) use ($args) {
				if ($path === '/var/www/robroy/tests/data/folders.json' && isset($args['folders.json'])) {
					return $args['folders.json'];
				}
				if ($path === 'php://input' && isset($args['body'])) {
					return $args['body'];
				}
				if (!empty($args['file_get_contents'])) {
					return $args['file_get_contents'];
				}
				return '';
			}
		);
	}
}
