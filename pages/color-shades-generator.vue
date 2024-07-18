<template>
  <div class="p-4 sm:p-6">
    <UCard>
      <template #header>
        <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
          Color Shades Generator
        </h1>
      </template>

      <div class="flex items-center justify-center gap-4">
        <ColorPicker v-model="color" />
        <UInput v-model="color" />
        <UCheckbox v-model="logBlend" label="Linear Blending" />
      </div>
      <template #footer>
        <div
          class="flex justify-evenly min-[410px]:max-lg:flex-row flex-col gap-4 items-center"
        >
          <ColorShades title="Lighter Shades" :shades="lightShades" />
          <ColorShades title="Darker Shades" :shades="darkShades" />
        </div>
        <UAlert color="green" variant="soft" icon="i-ph-info" class="mt-6">
          <template #title
            ><span class="font-bold">Color Copy Tip</span></template
          >
          <template #description>
            <li>
              <span class="font-bold">Click color patch:</span> Copy in original
              format
            </li>
            <li>
              <span class="font-bold">Click color code:</span> Copy in alternate
              format (RGB ↔ HEX)
            </li>
          </template>
        </UAlert>
      </template>
    </UCard>
  </div>
</template>

<script lang="js" setup>
import pSBC from "~/lib/color/pSBC";
const color = ref("#09EF20")
const logBlend = ref(true)

// no of shades including the original color
const noOfShades = 11;
const lightShades = computed(() => Array(noOfShades).fill().map((_, v) => pSBC(v/noOfShades, color.value, false, logBlend.value)));
const darkShades = computed(() => Array(noOfShades).fill().map((_, v) => pSBC(-v/noOfShades, color.value, false, logBlend.value)));
</script>
