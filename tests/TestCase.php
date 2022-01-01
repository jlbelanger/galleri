<?php

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
	private $mocks = [];

	protected function tearDown() : void
	{
		foreach ($this->mocks as $mock) {
			$mock->disable();
		}
	}

	protected function createDirectory(string $path) : void
	{
		if (!is_dir($path)) {
			mkdir($path);
		}
	}

	protected function addMock(string $namespace, string $fn, $value) : void
	{
		$builder = new \phpmock\MockBuilder();
		$valueFn = new \phpmock\functions\FixedValueFunction($value);
		$builder->setNamespace($namespace)
				->setName($fn)
				->setFunctionProvider($valueFn);
		$mock = $builder->build();
		$mock->enable();
		$this->mocks[] = $mock;
	}

	protected function setupTest(array $args) : void
	{
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

		if (!empty($args['mocks'])) {
			foreach ($args['mocks'] as $function => $value) {
				$this->addMock('Jlbelanger\Robroy\Helpers', $function, $value);
			}
		}
	}
}
