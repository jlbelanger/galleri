<?php

namespace Jlbelanger\Robroy\Helpers;

class Api
{
	/**
	 * Paginates items.
	 *
	 * @param  Image[] $items
	 * @param  integer $page
	 * @param  integer $perPage
	 * @return array
	 */
	public static function paginate(array $items, int $page, int $perPage) : array
	{
		$numItems = count($items);
		$min = $perPage * ($page - 1);

		if ($min <= $numItems) {
			$items = array_slice($items, $min, $perPage);
			$items = array_map(
				function ($item) {
					return $item->json();
				},
				$items
			);
		} else {
			$items = [];
		}

		return [
			'data' => $items,
			'meta' => [
				'page_number' => (int) $page,
				'total_pages' => ceil($numItems / $perPage),
			],
		];
	}
}
