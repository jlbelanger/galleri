<?php

namespace Jlbelanger\Galleri;

use Exception;
use Jlbelanger\Galleri\Exceptions\ValidationException;
use Jlbelanger\Galleri\Helpers\Constant;
use Jlbelanger\Galleri\Helpers\Input;

class Router
{
	/**
	 * Handles routing.
	 *
	 * @return void
	 */
	public static function load() : void
	{
		try {
			Constant::verify('UPLOADS_PATH');

			$routes = self::routes();
			$method = Input::server('REQUEST_METHOD');
			$type = Input::get('type');
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
		} catch (ValidationException $e) {
			$code = $e->getCode() ? $e->getCode() : 500;
			$response = [
				'errors' => json_decode($e->getMessage()),
			];
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
			echo json_encode($response);
		}
	}

	/**
	 * Returns a list of routes and their corresponding function.
	 *
	 * @return array
	 */
	private static function routes() : array
	{
		return [
			'GET images' => [
				'Jlbelanger\Galleri\Controllers\Images',
				'get',
			],
			'POST images' => [
				'Jlbelanger\Galleri\Controllers\Images',
				'post',
			],
			'PUT images' => [
				'Jlbelanger\Galleri\Controllers\Images',
				'put',
			],
			'DELETE images' => [
				'Jlbelanger\Galleri\Controllers\Images',
				'delete',
			],

			'GET folders' => [
				'Jlbelanger\Galleri\Controllers\Folders',
				'get',
			],
			'POST folders' => [
				'Jlbelanger\Galleri\Controllers\Folders',
				'post',
			],
			'PUT folders' => [
				'Jlbelanger\Galleri\Controllers\Folders',
				'put',
			],
			'DELETE folders' => [
				'Jlbelanger\Galleri\Controllers\Folders',
				'delete',
			],

			'POST sessions' => [
				'Jlbelanger\Galleri\Controllers\Sessions',
				'post',
			],
			'DELETE sessions' => [
				'Jlbelanger\Galleri\Controllers\Sessions',
				'delete',
			],
		];
	}
}
