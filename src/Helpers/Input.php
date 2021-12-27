<?php

namespace Jlbelanger\Robroy\Helpers;

class Input
{
	/**
	 * Returns an ENV value.
	 *
	 * @param  string  $key
	 * @param  mixed   $defaultValue
	 * @param  integer $filter
	 * @return mixed
	 */
	public static function env(string $key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasEnv($key)) {
			return $defaultValue;
		}
		return filter_var($_ENV[$key], $filter);
	}

	/**
	 * Returns true if the ENV value is specified.
	 *
	 * @param  string $key
	 * @return boolean
	 */
	public static function hasEnv(string $key) : bool
	{
		return array_key_exists($key, $_ENV);
	}

	/**
	 * Returns a FILES value.
	 *
	 * @param  string  $a
	 * @param  string  $b
	 * @param  integer $c
	 * @param  integer $filter
	 * @return mixed
	 */
	public static function file(string $a, string $b, int $c, int $filter = FILTER_SANITIZE_STRING)
	{
		return filter_var($_FILES[$a][$b][$c], $filter);
	}

	/**
	 * Returns a GET parameter value.
	 *
	 * @param  string  $key
	 * @param  mixed   $defaultValue
	 * @param  integer $filter
	 * @return mixed
	 */
	public static function get(string $key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasGet($key)) {
			return $defaultValue;
		}
		return filter_var($_GET[$key], $filter);
	}

	/**
	 * Returns true if the GET parameter is specified.
	 *
	 * @param  string $key
	 * @return boolean
	 */
	public static function hasGet(string $key) : bool
	{
		return array_key_exists($key, $_GET);
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
	 * @param  string  $key
	 * @param  mixed   $defaultValue
	 * @param  integer $filter
	 * @return mixed
	 */
	public static function post(string $key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasPost($key)) {
			return $defaultValue;
		}
		return filter_var($_POST[$key], $filter);
	}

	/**
	 * Returns true if the POST parameter is specified.
	 *
	 * @param  string $key
	 * @return boolean
	 */
	public static function hasPost(string $key) : bool
	{
		return array_key_exists($key, $_POST);
	}

	/**
	 * Returns a SERVER value.
	 *
	 * @param  string  $key
	 * @param  mixed   $defaultValue
	 * @param  integer $filter
	 * @return mixed
	 */
	public static function server(string $key, $defaultValue = '', int $filter = FILTER_SANITIZE_STRING)
	{
		if (!self::hasServer($key)) {
			return $defaultValue;
		}
		return filter_var($_SERVER[$key], $filter);
	}

	/**
	 * Returns true if the SERVER parameter is specified.
	 *
	 * @param  string $key
	 * @return boolean
	 */
	public static function hasServer(string $key) : bool
	{
		return array_key_exists($key, $_SERVER);
	}
}
