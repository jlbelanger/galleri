<?php

namespace Jlbelanger\Robroy\Exceptions;

use Exception;

class ApiException extends Exception
{
	protected $code = 422;
}
