<script lang="ts" setup>
const t = useTranslations();
const route = useRoute();
const localePath = useLocalePath();

definePageMeta({ middleware: "auth" });

const owner = route.params.owner as string;
const repo = route.params.repo as string;

usePageMetadata({
	title: t("CachesPage.meta.title"),
});

const keyFilter = ref("");
const refFilter = ref("");

const fetchState = await useFetch(() => `/api/repos/${owner}/${repo}/caches`, {
	query: computed(() => ({
		key: keyFilter.value || undefined,
		ref: refFilter.value || undefined,
	})),
});
const { data, pending, refresh } = fetchState;
const hasError = computed(() => Boolean(fetchState.error.value));

const isDeleting = ref(false);
const errorMessage = ref<string | null>(null);

const deleteCaches = async () => {
	isDeleting.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/caches`, {
			method: "DELETE",
			query: {
				key: keyFilter.value || undefined,
				ref: refFilter.value || undefined,
			},
		});
		await refresh();
	} catch {
		errorMessage.value = t("CachesPage.errors.delete-failed");
	}
	isDeleting.value = false;
};
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("CachesPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("CachesPage.description", { owner, repo }) }}
		</p>
		<NuxtLink class="text-sm underline" :to="localePath('/repos')">
			{{ t("CachesPage.back") }}
		</NuxtLink>

		<div class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
			<h2 class="text-sm font-semibold">{{ t("CachesPage.filters") }}</h2>
			<div class="mt-3 grid gap-3">
				<label class="grid gap-1 text-sm">
					<span>{{ t("CachesPage.fields.key") }}</span>
					<input
						v-model="keyFilter"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<label class="grid gap-1 text-sm">
					<span>{{ t("CachesPage.fields.ref") }}</span>
					<input
						v-model="refFilter"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<div class="flex items-center gap-3">
					<button
						class="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
						@click="refresh"
					>
						{{ t("CachesPage.refresh") }}
					</button>
					<button
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
						:disabled="isDeleting"
						@click="deleteCaches"
					>
						{{ t("CachesPage.delete") }}
					</button>
					<span v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</span>
				</div>
			</div>
		</div>

		<div v-if="pending">{{ t("CachesPage.loading") }}</div>
		<div v-else-if="hasError" class="text-red-600">
			{{ t("CachesPage.error") }}
			<button class="ml-2 underline" @click="refresh">{{ t("CachesPage.retry") }}</button>
		</div>
		<ul v-else class="grid gap-3">
			<li
				v-for="cache in data?.actions_caches ?? []"
				:key="cache.id"
				class="rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-700"
			>
				<p class="font-semibold">{{ cache.key }}</p>
				<p class="text-neutral-500">{{ t("CachesPage.cache-id", { id: cache.id }) }}</p>
				<p class="text-neutral-500">{{ t("CachesPage.size", { size: cache.size_in_bytes }) }}</p>
			</li>
		</ul>
	</MainContent>
</template>
