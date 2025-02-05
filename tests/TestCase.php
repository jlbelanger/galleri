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
			$_ENV = array_merge($this->originalEnv, $args['variables']['_ENV']);
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
			'Jlbelanger\Galleri\Helpers' => [
				'file_exists' => function ($path) use ($args) {
					if ($path === '/var/www/galleri/tests/data/folders.json' && !isset($args['folders.json'])) {
						return false;
					}
					if ($path === '/var/www/galleri/tests/data/images.json' && !isset($args['images.json'])) {
						return false;
					}
					return strpos($path, 'does-not-exist') === false;
				},
				'is_dir' => function ($path) {
					return strpos($path, 'does-not-exist') === false;
				},
				'copy' => true,
				'exif_read_data' => false,
				'file_put_contents' => 1,
				'mkdir' => true,
				'move_uploaded_file' => true,
				'opendir' => false,
				'rename' => true,
				'rmdir' => true,
				'unlink' => true,
			],
			'Jlbelanger\Galleri\Models' => [
				'getimagesize' => [500, 500, IMAGETYPE_JPEG],
			],
		];
		if (!empty($args['mocks']['Jlbelanger\Galleri\Helpers'])) {
			$mocks['Jlbelanger\Galleri\Helpers'] = array_merge($mocks['Jlbelanger\Galleri\Helpers'], $args['mocks']['Jlbelanger\Galleri\Helpers']);
		}
		if (!empty($args['mocks']['Jlbelanger\Galleri\Models'])) {
			$mocks['Jlbelanger\Galleri\Models'] = array_merge($mocks['Jlbelanger\Galleri\Models'], $args['mocks']['Jlbelanger\Galleri\Models']);
		}
		foreach ($mocks as $class => $functions) {
			foreach ($functions as $function => $value) {
				$this->addMock($class, $function, $value);
			}
		}

		$this->addMock(
			'Jlbelanger\Galleri\Helpers',
			'file_get_contents',
			function ($path) use ($args) {
				if ($path === '/var/www/galleri/tests/data/folders.json' && isset($args['folders.json'])) {
					return $args['folders.json'];
				}
				if ($path === '/var/www/galleri/tests/data/images.json' && isset($args['images.json'])) {
					return $args['images.json'];
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
