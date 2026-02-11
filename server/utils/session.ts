import { createHmac, randomUUID } from "node:crypto";

import { createError, deleteCookie, getCookie, setCookie, type H3Event } from "h3";
import { useRuntimeConfig, useStorage } from "nitropack/runtime";

const sessionCookieName = "gh_session";
const sessionTtlSeconds = 60 * 60 * 24;

export interface SessionData {
	token: string;
	createdAt: string;
}

function getSessionSecret(): string {
	const config = useRuntimeConfig();
	const secret = config.session.secret || process.env.SESSION_SECRET;
	if (!secret) {
		throw createError({
			statusCode: 500,
			statusMessage: "SESSION_SECRET is not configured",
		});
	}
	return secret;
}

function signSessionId(sessionId: string): string {
	return createHmac("sha256", getSessionSecret()).update(sessionId).digest("hex");
}

function encodeCookieValue(sessionId: string): string {
	return `${sessionId}.${signSessionId(sessionId)}`;
}

function decodeCookieValue(cookieValue: string | undefined): string | null {
	if (!cookieValue) {
		return null;
	}
	const [sessionId, signature] = cookieValue.split(".");
	if (!sessionId || !signature) {
		return null;
	}
	if (signSessionId(sessionId) !== signature) {
		return null;
	}
	return sessionId;
}

const storage = useStorage<SessionData>("sessions");

export async function getSession(event: H3Event): Promise<SessionData | null> {
	const sessionId = decodeCookieValue(getCookie(event, sessionCookieName));
	if (!sessionId) {
		return null;
	}
	const session = await storage.getItem(sessionId);
	return session ?? null;
}

export async function requireSession(event: H3Event): Promise<SessionData> {
	const session = await getSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
	}
	return session;
}

export async function setSession(event: H3Event, data: SessionData): Promise<void> {
	const sessionId = randomUUID();
	await storage.setItem(sessionId, data, { ttl: sessionTtlSeconds });
	setCookie(event, sessionCookieName, encodeCookieValue(sessionId), {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: sessionTtlSeconds,
	});
}

export async function clearSession(event: H3Event): Promise<void> {
	const sessionId = decodeCookieValue(getCookie(event, sessionCookieName));
	if (sessionId) {
		await storage.removeItem(sessionId);
	}
	deleteCookie(event, sessionCookieName, { path: "/" });
}
