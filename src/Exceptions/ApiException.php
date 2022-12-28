<?php

namespace Jlbelanger\Galleri\Exceptions;

use Exception;

class ApiException extends Exception
{
	protected $code = 422;
}
