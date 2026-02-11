import { createError, getRouterParam, readBody } from "h3";

import { githubRequest } from "../../../../../../utils/github";

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	const name = getRouterParam(event, "name");
	if (!owner || !repo || !name) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner, repo, or name" });
	}

	const body = await readBody<{ wait_timer?: number }>(event);

	return githubRequest(event, `/repos/${owner}/${repo}/environments/${name}`, {
		method: "PUT",
		body,
	});
});
