import { createError, deleteCookie, getCookie, getQuery, sendRedirect } from "h3";
import { $fetch } from "ofetch";

import { defaultLocale, isValidLocale } from "../../../../app/config/i18n.config";
import { setSession } from "../../../utils/session";

const oauthStateCookie = "gh_oauth_state";
const githubTokenUrl = "https://github.com/login/oauth/access_token";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { code, state } = getQuery(event);
	if (!code || typeof code !== "string") {
		throw createError({ statusCode: 400, statusMessage: "Missing OAuth code" });
	}

	const storedState = getCookie(event, oauthStateCookie);
	if (!storedState || typeof state !== "string" || storedState !== state) {
		throw createError({ statusCode: 400, statusMessage: "Invalid OAuth state" });
	}

	deleteCookie(event, oauthStateCookie, { path: "/" });

	const clientId = config.github.clientId;
	const clientSecret = config.github.clientSecret;
	if (!clientId || !clientSecret) {
		throw createError({
			statusCode: 500,
			statusMessage: "GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not configured",
		});
	}

	const callbackUrl =
		config.github.oauthCallbackUrl || `${config.public.app.baseUrl}/auth/github/callback`;

	const response = await $fetch<{ access_token?: string }>(githubTokenUrl, {
		method: "POST",
		headers: { Accept: "application/json" },
		body: {
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: callbackUrl,
		},
	});

	if (!response.access_token) {
		throw createError({ statusCode: 401, statusMessage: "OAuth token exchange failed" });
	}

	await setSession(event, {
		token: response.access_token,
		createdAt: new Date().toISOString(),
	});

	const localeCookie = getCookie(event, "i18n_redirected");
	const locale =
		typeof localeCookie === "string" && isValidLocale(localeCookie) ? localeCookie : defaultLocale;

	return sendRedirect(event, `/${locale}/repos`);
});
