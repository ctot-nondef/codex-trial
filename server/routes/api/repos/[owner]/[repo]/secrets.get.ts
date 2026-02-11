import { createError, getRouterParam } from "h3";

import { githubRequest } from "../../../../../utils/github";

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	if (!owner || !repo) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner or repo" });
	}

	return githubRequest(event, `/repos/${owner}/${repo}/actions/secrets`, {
		query: { per_page: 100 },
	});
});
