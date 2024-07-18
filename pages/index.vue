<script setup lang="ts"></script>
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
        <span class="font-bold">{{ title }}</span>
      </template>
      <template #icon="{ icon }">
        <UBadge size="md">
          <UIcon :name="icon" />
        </UBadge>
      </template>
    </UAlert>
    <div class="grid grid-flow-col grid-rows-2 justify-center gap-x-10">
      <CardItem
        title="Process Scheduler"
        href="/scheduler-os"
        icon="i-ph-ranking-duotone"
      />
      <CardItem
        title="Notation Convertor"
        href="/notation-conversion"
        icon="i-ph-asterisk-bold"
      />
      <CardItem
        title="Chmod Calculator"
        href="/chmod-calculator"
        icon="i-ph-file-lock-duotone"
      />
      <CardItem title="URL Parser" href="/url-parse" icon="i-ph-link-duotone" />
      <CardItem
        title="Grid Pattern Generator"
        href="/grid-pattern-generator"
        icon="i-ph-grid-nine-duotone"
      />
      <CardItem
        title="Color Shades Generator"
        href="/color-shades-generator"
        icon="i-ph-paint-brush-broad-duotone"
      />
    </div>
  </div>
</template>
