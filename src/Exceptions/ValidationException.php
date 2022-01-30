<?php

namespace Jlbelanger\Robroy\Exceptions;

use Jlbelanger\Robroy\Exceptions\ApiException;

class ValidationException extends ApiException
{
	/**
	 * @param  array   $data
	 * @param  integer $code
	 * @return ValidationException
	 */
	public static function new(array $data, int $code = 422) : self
	{
		$output = [];
		foreach ($data as $attribute => $errors) {
			foreach ($errors as $error) {
				$output[] = [
					'title' => $error,
					'status' => $code,
					'pointer' => $attribute,
				];
			}
		}
		return new self(json_encode($output), $code);
	}
}
