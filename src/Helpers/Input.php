<?php

namespace Jlbelanger\Robroy\Helpers;

class Input
{
	/**
	 * Returns an ENV value.
	 *
	 * @param  string|array $key
	 * @param  mixed        $defaultValue
	 * @param  integer      $filter
	 * @return mixed
	 */
	public static function env($key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasEnv($key)) {
			return $defaultValue;
		}
		return self::filter($key, $_ENV, $filter);
	}

	/**
	 * Returns true if the ENV value is specified.
	 *
	 * @param  string|array $key
	 * @return boolean
	 */
	public static function hasEnv($key) : bool
	{
		return self::has($key, $_ENV);
	}

	/**
	 * Returns a FILES value.
	 *
	 * @param  string|array $key
	 * @param  mixed        $defaultValue
	 * @param  integer      $filter
	 * @return mixed
	 */
	public static function file($key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasFile($key)) {
			return $defaultValue;
		}
		return self::filter($key, $_FILES, $filter);
	}

	/**
	 * Returns true if the FILES value is specified.
	 *
	 * @param  string|array $key
	 * @return boolean
	 */
	public static function hasFile($key) : bool
	{
		return self::has($key, $_FILES);
	}

	/**
	 * Returns a GET parameter value.
	 *
	 * @param  string|array $key
	 * @param  mixed        $defaultValue
	 * @param  integer      $filter
	 * @return mixed
	 */
	public static function get($key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasGet($key)) {
			return $defaultValue;
		}
		return self::filter($key, $_GET, $filter);
	}

	/**
	 * Returns true if the GET parameter is specified.
	 *
	 * @param  string|array $key
	 * @return boolean
	 */
	public static function hasGet($key) : bool
	{
		return self::has($key, $_GET);
	}

	/**
	 * Returns a JSON request's body.
	 *
	 * @return object
	 */
	public static function json() : object
	{
		$body = file_get_contents('php://input');
		return $body ? json_decode($body) : new \stdClass();
	}

	/**
	 * Returns a POST value.
	 *
	 * @param  string|array $key
	 * @param  mixed        $defaultValue
	 * @param  integer      $filter
	 * @return mixed
	 */
	public static function post($key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasPost($key)) {
			return $defaultValue;
		}
		return self::filter($key, $_POST, $filter);
	}

	/**
	 * Returns true if the POST parameter is specified.
	 *
	 * @param  string|array $key
	 * @return boolean
	 */
	public static function hasPost($key) : bool
	{
		return self::has($key, $_POST);
	}

	/**
	 * Returns a SERVER value.
	 *
	 * @param  string|array $key
	 * @param  mixed        $defaultValue
	 * @param  integer      $filter
	 * @return mixed
	 */
	public static function server($key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasServer($key)) {
			return $defaultValue;
		}
		return self::filter($key, $_SERVER, $filter);
	}

	/**
	 * Returns true if the SERVER parameter is specified.
	 *
	 * @param  string|array $key
	 * @return boolean
	 */
	public static function hasServer($key) : bool
	{
		return self::has($key, $_SERVER);
	}

	/**
	 * Returns a parameter value.
	 *
	 * @param  string|array $key
	 * @param  array        $value
	 * @param  integer      $filter
	 * @return mixed
	 */
	protected static function filter($key, array $value, int $filter = FILTER_SANITIZE_STRING)
	{
		if (is_array($key)) {
			$pointer = $value;
			foreach ($key as $k) {
				$pointer = $pointer[$k];
			}
			return $pointer;
		}
		return filter_var($value[$key], $filter);
	}

	/**
	 * Returns true if the parameter is specified.
	 *
	 * @param  string|array $key
	 * @param  array        $value
	 * @return boolean
	 */
	protected static function has($key, array $value) : bool
	{
		if (is_array($key)) {
			$pointer = $value;
			foreach ($key as $k) {
				if (!array_key_exists($k, $pointer)) {
					return false;
				}
				$pointer = $pointer[$k];
			}
			return true;
		}
		return array_key_exists($key, $value);
	}
}
