<template>
  <div class="p-6">
    <UAlert
      icon="i-ph-bell-ringing-duotone"
      description="This site is under development and you might find bugs and uncompleted things. Open up a issue on github if you find a bug."
      title="Heads up!"
      variant="subtle"
      color="primary"
    >
      <template #title="{ title }">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="font-bold" v-html="title" />
      </template>
      <template #icon="{ icon }">
        <UBadge size="md">
          <UIcon :name="icon" />
        </UBadge>
      </template>
    </UAlert>
    <div class="grid grid-flow-col justify-center gap-x-10">
      <NuxtLink class="block w-min" href="/scheduler-os">
        <div
          class="w-max mt-4 rounded-lg bg-primary-100 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 hover:dark:bg-primary-950 hover:border-primary-400 hover:dark:border-primary-600 transition-colors"
        >
          <div
            class="size-32 flex items-center justify-center font-bold text-lg text-center flex-col"
          >
            <UIcon name="i-ph-ranking-duotone" class="size-10" />
            Process Scheduler
          </div>
        </div>
      </NuxtLink>
      <NuxtLink class="block w-min" href="/notation-conversion">
        <div
          class="w-max mt-4 rounded-lg bg-primary-100 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 hover:dark:bg-primary-950 hover:border-primary-400 hover:dark:border-primary-600 transition-colors"
        >
          <div
            class="size-32 flex items-center justify-center font-bold text-lg text-center flex-col"
          >
            <UIcon name="i-ph-asterisk-bold" class="size-10" />
            Notation Convertor
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
