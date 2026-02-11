<script lang="ts" setup>
const t = useTranslations();
const localePath = useLocalePath();

definePageMeta({ middleware: "auth" });

usePageMetadata({
	title: t("ReposPage.meta.title"),
});

const { data, pending, error, refresh } = await useFetch("/api/repos");

const logout = async () => {
	await $fetch("/auth/logout", { method: "POST" });
	await navigateTo(localePath("/login"));
};
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<div class="flex items-start justify-between gap-4">
			<PageTitle>{{ t("ReposPage.title") }}</PageTitle>
			<button
				class="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
				@click="logout"
			>
				{{ t("ReposPage.logout") }}
			</button>
		</div>

		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("ReposPage.description") }}
		</p>

		<div v-if="pending">{{ t("ReposPage.loading") }}</div>
		<div v-else-if="error" class="text-red-600">
			{{ t("ReposPage.error") }}
			<button class="ml-2 underline" @click="refresh">{{ t("ReposPage.retry") }}</button>
		</div>
		<ul v-else class="grid gap-4">
			<li
				v-for="repo in data ?? []"
				:key="repo.id"
				class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
			>
				<div class="flex items-center justify-between gap-4">
					<div>
						<p class="font-semibold">{{ repo.full_name }}</p>
						<p class="text-sm text-neutral-500">
							{{ repo.private ? t("ReposPage.private") : t("ReposPage.public") }}
						</p>
					</div>
					<div class="flex gap-2">
						<NuxtLink
							class="text-sm underline"
							:to="localePath(`/repos/${repo.owner.login}/${repo.name}/environments`)"
						>
							{{ t("ReposPage.actions.environments") }}
						</NuxtLink>
						<NuxtLink
							class="text-sm underline"
							:to="localePath(`/repos/${repo.owner.login}/${repo.name}/secrets`)"
						>
							{{ t("ReposPage.actions.secrets") }}
						</NuxtLink>
						<NuxtLink
							class="text-sm underline"
							:to="localePath(`/repos/${repo.owner.login}/${repo.name}/variables`)"
						>
							{{ t("ReposPage.actions.variables") }}
						</NuxtLink>
						<NuxtLink
							class="text-sm underline"
							:to="localePath(`/repos/${repo.owner.login}/${repo.name}/caches`)"
						>
							{{ t("ReposPage.actions.caches") }}
						</NuxtLink>
					</div>
				</div>
			</li>
		</ul>
	</MainContent>
</template>
