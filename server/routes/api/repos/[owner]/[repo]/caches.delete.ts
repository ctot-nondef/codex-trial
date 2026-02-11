import { createError, getQuery, getRouterParam } from "h3";

import { githubRequest } from "../../../../../utils/github";

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	if (!owner || !repo) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner or repo" });
	}

	const query = getQuery(event);
	const key = typeof query.key === "string" ? query.key : undefined;
	const ref = typeof query.ref === "string" ? query.ref : undefined;

	return githubRequest(event, `/repos/${owner}/${repo}/actions/caches`, {
		method: "DELETE",
		query: { key, ref },
	});
});
