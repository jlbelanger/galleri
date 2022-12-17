<?php

namespace Jlbelanger\Robroy\Helpers;

class Input
{
	/**
	 * Returns an ENV value.
	 *
	 * @param  string|array $key
	 * @param  array        $args
	 *         mixed        $args['default]
	 *         integer      $args['filter']
	 * @return mixed
	 */
	public static function env($key, array $args = [])
	{
		$defaults = [
			'default' => '',
			'filter' => FILTER_SANITIZE_STRING,
		];
		$args = Utilities::combineArgs($defaults, $args);
		if (!self::hasEnv($key)) {
			return $args['default'];
		}
		return self::filter(self::value($key, $_ENV), $args['filter']);
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
	 * @param  array        $args
	 *         mixed        $args['default]
	 *         integer      $args['filter']
	 * @return mixed
	 */
	public static function file($key, array $args = [])
	{
		$defaults = [
			'default' => '',
			'filter' => FILTER_SANITIZE_STRING,
		];
		$args = Utilities::combineArgs($defaults, $args);
		if (!self::hasFile($key)) {
			return $args['default'];
		}
		return self::filter(self::value($key, $_FILES), $args['filter']);
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
	 * @param  array        $args
	 *         mixed        $args['default]
	 *         integer      $args['filter']
	 * @return mixed
	 */
	public static function get($key, array $args = [])
	{
		$defaults = [
			'default' => '',
			'filter' => FILTER_SANITIZE_STRING,
		];
		$args = Utilities::combineArgs($defaults, $args);
		if (!self::hasGet($key)) {
			return $args['default'];
		}
		return self::filter(self::value($key, $_GET), $args['filter']);
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
	 * @param  array $args
	 *         int[] $args['filter']
	 * @return array
	 */
	public static function json(array $args = []) : array
	{
		$body = file_get_contents('php://input');
		if (!$body) {
			return [];
		}
		$values = json_decode($body, true);
		$values = self::flatten($values);
		$output = [];
		foreach ($values as $key => $value) {
			$filter = isset($args['filter'][$key]) ? $args['filter'][$key] : FILTER_SANITIZE_STRING;
			$value = self::filter(self::value($key, $values), $filter);

			if (strpos($key, 'attributes.') === 0) {
				$cleanKey = substr($key, strlen('attributes.'));
				if (!array_key_exists('attributes', $output)) {
					$output['attributes'] = [];
				}
				$output['attributes'][$cleanKey] = $value;
			} else {
				$output[$key] = $value;
			}
		}
		return $output;
	}

	public static function flatten(array $a, string $prefix = '') : array
	{
		$output = [];
		foreach ($a as $key => $value) {
			if (is_array($value)) {
				$output = array_merge($output, self::flatten($value, $prefix . $key . '.'));
			} else {
				$output[$prefix . $key] = $value;
			}
		}
		return $output;
	}

	/**
	 * Returns a POST value.
	 *
	 * @param  string|array $key
	 * @param  array        $args
	 *         mixed        $args['default]
	 *         integer      $args['filter']
	 * @return mixed
	 */
	public static function post($key, array $args = [])
	{
		$defaults = [
			'default' => '',
			'filter' => FILTER_SANITIZE_STRING,
		];
		$args = Utilities::combineArgs($defaults, $args);
		if (!self::hasPost($key)) {
			return $args['default'];
		}
		return self::filter(self::value($key, $_POST), $args['filter']);
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
	 * @param  array        $args
	 *         mixed        $args['default]
	 *         integer      $args['filter']
	 * @return mixed
	 */
	public static function server($key, array $args = [])
	{
		$defaults = [
			'default' => '',
			'filter' => FILTER_SANITIZE_STRING,
		];
		$args = Utilities::combineArgs($defaults, $args);
		if (!self::hasServer($key)) {
			return $args['default'];
		}
		return self::filter(self::value($key, $_SERVER), $args['filter']);
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
	 * @param  string|array $key
	 * @param  array        $value
	 * @return mixed
	 */
	protected static function value($key, array $value)
	{
		if (is_array($key)) {
			$pointer = $value;
			foreach ($key as $k) {
				$pointer = $pointer[$k];
			}
			return $pointer;
		}
		return $value[$key];
	}

	/**
	 * @param  mixed   $s
	 * @param  integer $filter
	 * @return mixed
	 */
	protected static function filter($s, int $filter = FILTER_SANITIZE_STRING)
	{
		if (is_array($s)) {
			$output = [];
			foreach ($s as $key => $value) {
				$key = self::filter($key, $filter);
				$value = self::filter($value, $filter);
				$output[$key] = $value;
			}
			return $output;
		}
		if ($filter === FILTER_SANITIZE_STRING) {
			$s = trim(htmlspecialchars($s));
		} elseif ($filter) {
			$s = filter_var($s, $filter);
		}
		return $s;
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
