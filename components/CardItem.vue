<template>
  <NuxtLink class="block w-min" :href="props.href">
    <div
      class="hover:shadow-lg hover:shadow-primary-600 hover:dark:shadow-primary-900 w-max mt-4 rounded-lg bg-gray-100 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 hover:bg-primary-200 hover:dark:bg-primary-950 hover:border-primary-400 hover:dark:border-primary-600 transition-colors"
    >
      <div
        class="size-32 flex items-center justify-center font-bold p-1 text-center flex-col"
      >
        <UIcon :name="props.icon" class="size-10" />
        {{ props.title }}
      </div>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
const props = defineProps({
  href: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
});
</script>
