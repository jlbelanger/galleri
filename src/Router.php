<?php

namespace Jlbelanger\Robroy;

use Exception;
use Jlbelanger\Robroy\Helpers\Constant;

class Router
{
	/**
	 * Handles routing.
	 *
	 * @return void
	 */
	public static function load()
	{
		try {
			Constant::verify('UPLOADS_PATH');

			$routes = self::routes();
			$method = !empty($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
			$type = !empty($_GET['type']) ? $_GET['type'] : '';
			$route = $method . ' ' . $type;

			if (!empty($routes[$route])) {
				$response = call_user_func($routes[$route][0] . '::' . $routes[$route][1]);
				$code = !empty($response) ? 200 : 204;
			} else {
				$code = 404;
				$response = [
					'errors' => [
						[
							'title' => 'Invalid route.',
							'status' => $code,
						],
					],
				];
			}
		} catch (Exception $e) {
			$code = $e->getCode() ? $e->getCode() : 500;
			$response = [
				'errors' => [
					[
						'title' => $e->getMessage(),
						'status' => $code,
					],
				],
			];
		}

		http_response_code($code);
		header('Content-Type: application/json');
		if (!empty($response)) {
			echo json_encode($response, JSON_PRETTY_PRINT);
		}
	}

	/**
	 * Returns a list of routes and their corresponding function.
	 *
	 * @return array
	 */
	private static function routes()
	{
		return [
			'GET images' => [
				'Jlbelanger\Robroy\Controllers\Images',
				'get',
			],
			'POST images' => [
				'Jlbelanger\Robroy\Controllers\Images',
				'post',
			],
			'DELETE images' => [
				'Jlbelanger\Robroy\Controllers\Images',
				'delete',
			],
			'POST sessions' => [
				'Jlbelanger\Robroy\Controllers\Sessions',
				'post',
			],
			'DELETE sessions' => [
				'Jlbelanger\Robroy\Controllers\Sessions',
				'delete',
			],
		];
	}
}
