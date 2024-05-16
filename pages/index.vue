<template>
    <div class="p-6">
        <UAlert icon="i-heroicons-bell-alert"
            description="This site is under development and you might find bugs and uncompleted things. Open up a issue on github if you find a bug."
            title="Heads up!" variant="subtle" color="primary">
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
        <NuxtLink class="block w-min" href="/scheduler-os">
            <UCard
                class="w-max mt-4 !bg-primary-900 border !border-primary-400 hover:!bg-primary-950 hover:!border-primary-600 transition-colors">
                <div class="size-32 flex items-center justify-center font-bold text-lg text-center">
                    Process Scheduler
                </div>
            </UCard>
        </NuxtLink>
    </div>
</template>
