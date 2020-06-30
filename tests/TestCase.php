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

	protected function addMock($namespace, $fn, $value)
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
}
