export function robroyUrl(id) {
	if (!Cypress.env('enable_rewrites')) {
		return `/?folder=${id}`;
	}
	return `/${id.replace(/^\/+/, '')}`;
}

export function robroyAbsoluteUrl(id) {
	if (!Cypress.env('enable_rewrites')) {
		if (id === '/') {
			return `${window.location.origin}/`;
		}
		return `${window.location.origin}/?folder=${id}`;
	}
	return `${window.location.origin}/${id.replace(/^\/+/, '')}`;
}
