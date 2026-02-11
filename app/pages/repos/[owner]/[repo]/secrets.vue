<script lang="ts" setup>
const t = useTranslations();
const route = useRoute();
const localePath = useLocalePath();

definePageMeta({ middleware: "auth" });

const owner = route.params.owner as string;
const repo = route.params.repo as string;

usePageMetadata({
	title: t("SecretsPage.meta.title"),
});

const fetchState = await useFetch(`/api/repos/${owner}/${repo}/secrets`);
const { data, pending, refresh } = fetchState;
const hasError = computed(() => Boolean(fetchState.error.value));

const newName = ref("");
const newValue = ref("");
const errorMessage = ref<string | null>(null);
const isSaving = ref(false);
const edits = reactive<Record<string, string>>({});

const resetNewSecret = () => {
	newName.value = "";
	newValue.value = "";
};

const createSecret = async () => {
	if (!newName.value || !newValue.value) {
		errorMessage.value = t("SecretsPage.errors.missing-fields");
		return;
	}
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/secrets/${newName.value}`, {
			method: "PUT",
			body: { value: newValue.value },
		});
		resetNewSecret();
		await refresh();
	} catch {
		errorMessage.value = t("SecretsPage.errors.save-failed");
	}
	isSaving.value = false;
};

const resetSecretEdit = (name: string) => {
	edits[name] = "";
};

const updateSecret = async (name: string) => {
	if (!edits[name]) {
		errorMessage.value = t("SecretsPage.errors.missing-value");
		return;
	}
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/secrets/${name}`, {
			method: "PUT",
			body: { value: edits[name] },
		});
		resetSecretEdit(name);
		await refresh();
	} catch {
		errorMessage.value = t("SecretsPage.errors.save-failed");
	}
	isSaving.value = false;
};

const deleteSecret = async (name: string) => {
	isSaving.value = true;
	errorMessage.value = null;
	try {
		await $fetch(`/api/repos/${owner}/${repo}/secrets/${name}`, {
			method: "DELETE",
		});
		resetSecretEdit(name);
		await refresh();
	} catch {
		errorMessage.value = t("SecretsPage.errors.delete-failed");
	}
	isSaving.value = false;
};
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("SecretsPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("SecretsPage.description", { owner, repo }) }}
		</p>
		<NuxtLink class="text-sm underline" :to="localePath('/repos')">
			{{ t("SecretsPage.back") }}
		</NuxtLink>

		<div class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
			<h2 class="text-sm font-semibold">{{ t("SecretsPage.create") }}</h2>
			<div class="mt-3 grid gap-3">
				<label class="grid gap-1 text-sm">
					<span>{{ t("SecretsPage.fields.name") }}</span>
					<input
						v-model="newName"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="text"
					/>
				</label>
				<label class="grid gap-1 text-sm">
					<span>{{ t("SecretsPage.fields.value") }}</span>
					<input
						v-model="newValue"
						class="rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700"
						type="password"
					/>
				</label>
				<div class="flex items-center gap-3">
					<button
						class="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
						:disabled="isSaving"
						@click="createSecret"
					>
						{{ t("SecretsPage.save") }}
					</button>
					<span v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</span>
				</div>
			</div>
		</div>

		<div v-if="pending">{{ t("SecretsPage.loading") }}</div>
		<div v-else-if="hasError" class="text-red-600">
			{{ t("SecretsPage.error") }}
			<button class="ml-2 underline" @click="refresh">{{ t("SecretsPage.retry") }}</button>
		</div>
		<ul v-else class="grid gap-3">
			<li
				v-for="secret in data?.secrets ?? []"
				:key="secret.name"
				class="rounded-md border border-neutral-200 p-3 dark:border-neutral-700"
			>
				<p class="font-semibold">{{ secret.name }}</p>
				<div class="mt-2 grid gap-2">
					<input
						v-model="edits[secret.name]"
						:aria-label="t('SecretsPage.update-label', { name: secret.name })"
						class="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
						:placeholder="t('SecretsPage.update-placeholder')"
						type="password"
					/>
					<div class="flex gap-2">
						<button
							class="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
							:disabled="isSaving"
							@click="updateSecret(secret.name)"
						>
							{{ t("SecretsPage.update") }}
						</button>
						<button
							class="rounded-md border border-neutral-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-900/20"
							:disabled="isSaving"
							@click="deleteSecret(secret.name)"
						>
							{{ t("SecretsPage.delete") }}
						</button>
					</div>
				</div>
			</li>
		</ul>
	</MainContent>
</template>
