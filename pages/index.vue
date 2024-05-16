<template>
    <div class="p-6">
        <UAlert icon="i-heroicons-information-circle"
            description="This site is under development and you might find bugs and uncompleted things. Open up a issue on github if you find a bug."
            title="Heads up!" variant="subtle" color="primary">
            <template #title="{ title }">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="title" />
            </template>
        </UAlert>
    </div>
</template>
