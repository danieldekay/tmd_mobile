import DOMPurify from 'dompurify';

const WP_ORIGIN = 'https://www.tangomarathons.com';

/**
 * WordPress content can contain plugin-produced or imported HTML.
 * Sanitize even first-party content; never inject the raw REST response.
 */
export function sanitizeWpHtml(html: string, origin = WP_ORIGIN): string {
	if (typeof document === 'undefined') return '';
	const sanitized = DOMPurify.sanitize(html, {
		USE_PROFILES: { html: true },
		FORBID_TAGS: ['form', 'iframe', 'object', 'embed', 'script', 'style', 'svg', 'math'],
		FORBID_ATTR: ['style', 'srcdoc'],
		ALLOW_DATA_ATTR: false
	});

	const fragment = document.createElement('template');
	fragment.innerHTML = sanitized;
	const base = new URL(origin);

	for (const link of fragment.content.querySelectorAll('a[href]')) {
		try {
			const url = new URL(link.getAttribute('href') ?? '', base);
			if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
				link.removeAttribute('href');
				continue;
			}
			link.setAttribute('href', url.href);
			if (url.protocol !== 'mailto:') {
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
			}
		} catch { link.removeAttribute('href'); }
	}

	for (const image of fragment.content.querySelectorAll('img[src]')) {
		try {
			const url = new URL(image.getAttribute('src') ?? '', base);
			if (url.protocol !== 'http:' && url.protocol !== 'https:') {
				image.remove();
				continue;
			}
			image.setAttribute('src', url.href);
			image.setAttribute('loading', 'lazy');
			image.setAttribute('decoding', 'async');
			if (!image.hasAttribute('alt')) image.setAttribute('alt', '');
		} catch { image.remove(); }
	}
	return fragment.innerHTML;
}
