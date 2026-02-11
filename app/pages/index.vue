<script lang="ts" setup>
const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});
</script>

<template>
	<MainContent class="container grid content-start gap-y-8 py-8">
		<PageTitle>{{ t("IndexPage.title") }}</PageTitle>
		<p class="text-neutral-600 dark:text-neutral-300">
			{{ t("IndexPage.description") }}
		</p>
		<div class="flex flex-wrap gap-3">
			<NuxtLinkLocale
				class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
				:href="{ path: '/login' }"
			>
				{{ t("IndexPage.cta-login") }}
			</NuxtLinkLocale>
			<NuxtLinkLocale class="inline-flex items-center text-sm underline" :href="{ path: '/repos' }">
				{{ t("IndexPage.cta-repos") }}
			</NuxtLinkLocale>
		</div>
	</MainContent>
</template>
