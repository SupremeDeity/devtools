<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="size-8 rounded-full" :style="{ backgroundColor: model }">
    <input
      v-model="model"
      class="opacity-0 block size-8 border-0"
      type="color"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel({ type: String, default: "#000000" });
</script>
