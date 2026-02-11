import { createError, type H3Event } from "h3";
import { $fetch } from "ofetch";

import { requireSession } from "./session";

const apiBaseUrl = "https://api.github.com";

export async function githubRequest<T>(
	event: H3Event,
	path: string,
	init: RequestInit & { query?: Record<string, string | number | boolean | undefined> } = {},
): Promise<T> {
	const session = await requireSession(event);
	try {
		const headers = new Headers(init.headers);
		headers.set("Accept", "application/vnd.github+json");
		headers.set("Authorization", `Bearer ${session.token}`);
		headers.set("X-GitHub-Api-Version", "2022-11-28");

		return await $fetch<T>(`${apiBaseUrl}${path}`, {
			...init,
			headers,
		});
	} catch (error: unknown) {
		const statusCode =
			typeof error === "object" && error && "status" in error
				? Number((error as { status?: number }).status)
				: 500;
		throw createError({
			statusCode: Number.isFinite(statusCode) ? statusCode : 500,
			statusMessage: "GitHub API request failed",
		});
	}
}
