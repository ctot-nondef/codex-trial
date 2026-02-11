import { getSession } from "../../utils/session";

export default defineEventHandler(async (event) => {
	const session = await getSession(event);
	return { authenticated: Boolean(session) };
});
