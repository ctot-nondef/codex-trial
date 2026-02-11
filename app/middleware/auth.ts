export default defineNuxtRouteMiddleware(async () => {
	const localePath = useLocalePath();
	const { data } = await useFetch("/api/session");
	if (!data.value?.authenticated) {
		return navigateTo(localePath("/login"));
	}
});
