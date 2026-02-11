import { createError, getRouterParam, readBody } from "h3";

import { githubRequest } from "../../../../../../utils/github";
import { encryptSecret } from "../../../../../../utils/secrets";

interface SecretBody {
	value: string;
}

interface PublicKeyResponse {
	key: string;
	key_id: string;
}

export default defineEventHandler(async (event) => {
	const owner = getRouterParam(event, "owner");
	const repo = getRouterParam(event, "repo");
	const name = getRouterParam(event, "name");
	if (!owner || !repo || !name) {
		throw createError({ statusCode: 400, statusMessage: "Missing owner, repo, or name" });
	}

	const body = await readBody<SecretBody | null>(event);
	if (!body?.value) {
		throw createError({ statusCode: 400, statusMessage: "Missing secret value" });
	}

	const publicKey = await githubRequest<PublicKeyResponse>(
		event,
		`/repos/${owner}/${repo}/actions/secrets/public-key`,
	);

	const encrypted = await encryptSecret(publicKey.key, body.value);

	return githubRequest(event, `/repos/${owner}/${repo}/actions/secrets/${name}`, {
		method: "PUT",
		body: {
			encrypted_value: encrypted,
			key_id: publicKey.key_id,
		},
	});
});
