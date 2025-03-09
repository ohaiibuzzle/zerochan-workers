/**
 * @typedef {Object} Env
 */

let API_TEMPLATE = "https://www.zerochan.net/%s?json&s=id";

let IMAGE_MAPPING = {
    "/genshin": "Genshin Impact",
    "/hsr": "Honkai Star Rail",
    "/zzz": "Zenless Zone Zero",
};

async function fetchImage(url) {
    const json = await fetch(API_TEMPLATE.replace("%s", url));
    const data = await json.json();

    // Return a random item from the "items" array
    let randomItem = data.items[Math.floor(Math.random() * data.items.length)];
    while (!randomItem.source.includes("pixiv.net")) {
        randomItem = data.items[Math.floor(Math.random() * data.items.length)];
    }

    const id = randomItem.source.split("/")[randomItem.source.split("/").length - 1];
    return Response.redirect(`https://pixiv.cat/${id}.png`);   
}

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		console.log(`Hello ${navigator.userAgent} at path ${url.pathname}!`);

        if (IMAGE_MAPPING[url.pathname]) {
            return fetchImage(IMAGE_MAPPING[url.pathname]);
        }

        // Return 404
        return new Response("Not found", { status: 404 });
	},
};
