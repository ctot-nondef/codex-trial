import { githubRequest } from "../../utils/github";

export default defineEventHandler(async (event) => {
	return githubRequest(event, "/user/repos", {
		query: { per_page: 100, sort: "updated" },
	});
});
