<script lang="ts" setup>
const t = useTranslations();
const route = useRoute();
const localePath = useLocalePath();

definePageMeta({ middleware: "auth" });

const owner = route.params.owner as string;
const repo = route.params.repo as string;

usePageMetadata({
	title: t("EnvironmentsPage.meta.title"),
});

const fetchState = await useFetch(`/api/repos/${owner}/${repo}/environments`);
const { data, pending, refresh } = fetchState;
const hasError = computed(() => Boolean(fetchState.error.value));

const environmentName = ref("");
const waitTimer = ref<number | null>(null);
const isSaving = ref(false);
const errorMessage = ref<string | null>(null);

const resetForm = () => {
	environmentName.value = "";
	waitTimer.value = null;
};

const saveEnvironment = async () => {
	if (!environmentName.value) {
		errorMessage.value = t("EnvironmentsPage.errors.missing-name");
		return;
	}
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/environments/${environmentName.value}`, {
			method: "PUT",
			body: {
				wait_timer: waitTimer.value ?? undefined,
			},
		});
		resetForm();
		await refresh();
	} catch {
		errorMessage.value = t("EnvironmentsPage.errors.save-failed");
	}
	isSaving.value = false;
};
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("EnvironmentsPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("EnvironmentsPage.description", { owner, repo }) }}
		</p>
		<NuxtLink class="text-sm underline" :to="localePath('/repos')">
			{{ t("EnvironmentsPage.back") }}
		</NuxtLink>

		<div class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
			<h2 class="text-sm font-semibold">{{ t("EnvironmentsPage.create") }}</h2>
			<div class="mt-3 grid gap-3">
				<label class="grid gap-1 text-sm">
					<span>{{ t("EnvironmentsPage.fields.name") }}</span>
					<input
						v-model="environmentName"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<label class="grid gap-1 text-sm">
					<span>{{ t("EnvironmentsPage.fields.wait-timer") }}</span>
					<input
						v-model.number="waitTimer"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						min="0"
						type="number"
					/>
				</label>
				<div class="flex items-center gap-3">
					<button
						class="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
						:disabled="isSaving"
						@click="saveEnvironment"
					>
						{{ t("EnvironmentsPage.save") }}
					</button>
					<span v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</span>
				</div>
			</div>
		</div>

		<div v-if="pending">{{ t("EnvironmentsPage.loading") }}</div>
		<div v-else-if="hasError" class="text-red-600">
			{{ t("EnvironmentsPage.error") }}
			<button class="ml-2 underline" @click="refresh">{{ t("EnvironmentsPage.retry") }}</button>
		</div>
		<ul v-else class="grid gap-3">
			<li
				v-for="environment in data?.environments ?? []"
				:key="environment.name"
				class="rounded-md border border-neutral-200 p-3 dark:border-neutral-700"
			>
				<p class="font-semibold">{{ environment.name }}</p>
				<p class="text-sm text-neutral-500">
					{{ t("EnvironmentsPage.wait-timer", { value: environment.wait_timer ?? 0 }) }}
				</p>
			</li>
		</ul>
	</MainContent>
</template>
