<script lang="ts" setup>
const t = useTranslations();

usePageMetadata({
	title: t("LoginPage.meta.title"),
});
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("LoginPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("LoginPage.description") }}
		</p>
		<div>
			<a
				class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
				href="/auth/github"
			>
				{{ t("LoginPage.cta") }}
			</a>
		</div>
	</MainContent>
</template>
