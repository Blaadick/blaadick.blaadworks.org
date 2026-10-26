import type {APIRoute} from 'astro';

const paths = Object.keys(import.meta.glob('./**/*.{astro,md}'))
    .filter((file) => !file.includes('['))
    .map((file) => file.slice(1).replace(/(index)?\.(astro|md)$/, '').replace(/([^/])$/, '$1/'));

export const GET: APIRoute = ({site}) => {
    const urls = paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join('');
    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
        {headers: {'Content-Type': 'application/xml'}},
    );
};
