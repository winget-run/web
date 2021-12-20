import Wingetdotrun from "$lib/api/wingetdotrun";
import type { IListRespoonse } from "$lib/types/package";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async () => {
	const sitemapXML = (data: IListRespoonse["list"]) => {
		const packages = data.map((e) => {
			const [org, ...pkg] = e.Id.split(".");
			return `
      <url>
      <loc>https://winget.run/pkg/${org}/${pkg.join(".")}</loc>
      <lastmod>${e.updatedAt}</lastmod>
      <priority>0.80</priority>
      </url>`;
		});

		const orgsArray = [...new Set(data.map((e) => e.Id.split(".")[0]))];

		const orgs = orgsArray.map((e) => {
			return `
      <url>
      <loc>https://winget.run/pkg/${e}</loc>
      <priority>0.50</priority>
      </url>`;
		});

		return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://winget.run/</loc>
          <priority>1.00</priority>
        </url>
        ${packages.join("")}
        ${orgs.join("")}
      </urlset>`;
	};

	try {
		const api = new Wingetdotrun({ version: 1 });
		const res = await api.list();

		return {
			headers: {
				"Content-Type": "text/xml",
			},
			body: sitemapXML(res.list),
		};
	} catch (err) {
		return {
			headers: {
				"Content-Type": "text/xml",
			},
			body: `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://winget.run/</loc>
          <priority>1.00</priority>
        </url>
      </urlset>`,
		};
	}
};
