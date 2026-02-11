import { randomBytes } from "node:crypto";

import { createError, sendRedirect, setCookie } from "h3";

const oauthStateCookie = "gh_oauth_state";
const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";

export default defineEventHandler((event) => {
	const config = useRuntimeConfig();
	const clientId = config.github.clientId;
	if (!clientId) {
		throw createError({ statusCode: 500, statusMessage: "GITHUB_CLIENT_ID is not configured" });
	}
	const scope = config.github.oauthScope || "repo";
	const state = randomBytes(16).toString("hex");
	const callbackUrl =
		config.github.oauthCallbackUrl || `${config.public.app.baseUrl}/auth/github/callback`;

	setCookie(event, oauthStateCookie, state, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 10 * 60,
	});

	const params = new URLSearchParams({
		client_id: clientId,
		scope,
		state,
		redirect_uri: callbackUrl,
	});

	return sendRedirect(event, `${githubAuthorizeUrl}?${params.toString()}`);
});
