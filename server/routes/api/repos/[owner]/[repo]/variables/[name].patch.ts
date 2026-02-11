import { createError, getRouterParam, readBody } from "h3";

import { githubRequest } from "../../../../../../utils/github";

interface VariableBody {
	value: string;
}

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	const name = getRouterParam(event, "name");
	if (!owner || !repo || !name) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner, repo, or name" });
	}

	const body = await readBody<VariableBody | null>(event);
	if (!body?.value) {
		throw createError({ statusCode: 400, statusMessage: "Missing variable value" });
	}

	return githubRequest(event, `/repos/${owner}/${repo}/actions/variables/${name}`, {
		method: "PATCH",
		body,
	});
});
