import { createError, getRouterParam, readBody } from "h3";

import { githubRequest } from "../../../../../utils/github";

interface VariableBody {
	name: string;
	value: string;
}

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	if (!owner || !repo) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner or repo" });
	}

	const body = await readBody<VariableBody | null>(event);
	if (!body?.name || !body.value) {
		throw createError({ statusCode: 400, statusMessage: "Missing variable name or value" });
	}

	return githubRequest(event, `/repos/${owner}/${repo}/actions/variables`, {
		method: "POST",
		body,
	});
});
