<script lang="ts" setup>
const t = useTranslations();
const route = useRoute();
const localePath = useLocalePath();

definePageMeta({ middleware: "auth" });

const owner = route.params.owner as string;
const repo = route.params.repo as string;

usePageMetadata({
	title: t("VariablesPage.meta.title"),
});

const fetchState = await useFetch(`/api/repos/${owner}/${repo}/variables`);
const { data, pending, refresh } = fetchState;
const hasError = computed(() => Boolean(fetchState.error.value));

const edits = reactive<Record<string, string>>({});
watch(
	() => data.value?.variables,
	(variables) => {
		if (!variables) {
			return;
		}
		for (const variable of variables) {
			if (!(variable.name in edits)) {
				edits[variable.name] = variable.value ?? "";
			}
		}
	},
	{ immediate: true },
);

const newName = ref("");
const newValue = ref("");
const errorMessage = ref<string | null>(null);
const isSaving = ref(false);

const resetNewVariable = () => {
	newName.value = "";
	newValue.value = "";
};

const createVariable = async () => {
	if (!newName.value || !newValue.value) {
		errorMessage.value = t("VariablesPage.errors.missing-fields");
		return;
	}
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/variables`, {
			method: "POST",
			body: { name: newName.value, value: newValue.value },
		});
		resetNewVariable();
		await refresh();
	} catch {
		errorMessage.value = t("VariablesPage.errors.save-failed");
	}
	isSaving.value = false;
};

const resetVariableEdit = (name: string) => {
	edits[name] = "";
};

const updateVariable = async (name: string) => {
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/variables/${name}`, {
			method: "PATCH",
			body: { value: edits[name] },
		});
		await refresh();
	} catch {
		errorMessage.value = t("VariablesPage.errors.save-failed");
	}
	isSaving.value = false;
};

const deleteVariable = async (name: string) => {
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/variables/${name}`, {
			method: "DELETE",
		});
		resetVariableEdit(name);
		await refresh();
	} catch {
		errorMessage.value = t("VariablesPage.errors.delete-failed");
	}
	isSaving.value = false;
};
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("VariablesPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("VariablesPage.description", { owner, repo }) }}
		</p>
		<NuxtLink class="text-sm underline" :to="localePath('/repos')">
			{{ t("VariablesPage.back") }}
		</NuxtLink>

		<div class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
			<h2 class="text-sm font-semibold">{{ t("VariablesPage.create") }}</h2>
			<div class="mt-3 grid gap-3">
				<label class="grid gap-1 text-sm">
					<span>{{ t("VariablesPage.fields.name") }}</span>
					<input
						v-model="newName"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<label class="grid gap-1 text-sm">
					<span>{{ t("VariablesPage.fields.value") }}</span>
					<input
						v-model="newValue"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<div class="flex items-center gap-3">
					<button
						class="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
						:disabled="isSaving"
						@click="createVariable"
					>
						{{ t("VariablesPage.save") }}
					</button>
					<span v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</span>
				</div>
			</div>
		</div>

		<div v-if="pending">{{ t("VariablesPage.loading") }}</div>
		<div v-else-if="hasError" class="text-red-600">
			{{ t("VariablesPage.error") }}
			<button class="ml-2 underline" @click="refresh">{{ t("VariablesPage.retry") }}</button>
		</div>
		<ul v-else class="grid gap-3">
			<li
				v-for="variable in data?.variables ?? []"
				:key="variable.name"
				class="rounded-md border border-neutral-200 p-3 dark:border-neutral-700"
			>
				<p class="font-semibold">{{ variable.name }}</p>
				<div class="mt-2 grid gap-2">
					<input
						v-model="edits[variable.name]"
						:aria-label="t('VariablesPage.update-label', { name: variable.name })"
						class="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
						type="text"
					/>
					<div class="flex gap-2">
						<button
							class="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
							:disabled="isSaving"
							@click="updateVariable(variable.name)"
						>
							{{ t("VariablesPage.update") }}
						</button>
						<button
							class="rounded-md border border-neutral-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
							:disabled="isSaving"
							@click="deleteVariable(variable.name)"
						>
							{{ t("VariablesPage.delete") }}
						</button>
					</div>
				</div>
			</li>
		</ul>
	</MainContent>
</template>
