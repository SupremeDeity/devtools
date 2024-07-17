<template>
  <div class="p-4 sm:p-6 flex md:flex-row flex-col gap-8">
    <UCard class="w-full md:max-w-xs">
      <template #header>
        <h1 class="font-bold dark:text-gray-200 text-gray-800">
          Grid Pattern Generator
        </h1>
      </template>
      <div class="flex flex-col gap-5">
        <div class="flex gap-5 items-center justify-between font-bold">
          Gradient Mask:
          <UToggle v-model="gradientMask" />
        </div>
        <div class="font-bold">
          Amount: <URange v-model.number="amount" :min="10" :max="50" />
        </div>
        <div class="font-bold">
          Density:
          <URange v-model.number="density" :min="0" :max="1" :step="0.1" />
        </div>
        <div class="font-bold">
          Filled Chance:
          <URange v-model.number="fillChance" :min="0" :max="1" :step="0.1" />
        </div>
        <div class="font-bold">
          Stroke Width:
          <URange
            v-model.number="strokeWidth"
            :min="0"
            :max="0.1"
            :step="0.001"
          />
        </div>
        <div class="flex gap-5">
          <div class="font-bold">
            Base Color:
            <ColorPicker v-model="baseColor" />
          </div>
          <div class="font-bold">
            Front Color:
            <ColorPicker v-model="frontColor" />
          </div>
        </div>
      </div>
    </UCard>
    <UCard class="w-full min-w-max">
      <div class="flex flex-col gap-5 items-center">
        <div
          class="rounded-xl min-h-96 h-full overflow-hidden"
          :style="patternStyle"
        />
        <div class="flex gap-5 justify-center">
          <UButton class="self-center" @click="generate">Regenerate</UButton>
          <UButton class="self-center" @click="copyCSS"
            ><span v-if="!copied">Copy CSS</span>
            <span v-else>Copied!</span></UButton
          >
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="js" setup>
import { generateGridPattern } from "~/lib/generator/grid-pattern";
import { useDebounceFn, useClipboard } from '@vueuse/core';

const patternStyle = shallowRef({});
const amount = ref(30);
const baseColor = ref("#000000");
const frontColor = ref("#41FF41");
const density = ref(1);
const fillChance = ref(0.3);
const strokeWidth = ref(0.015);
const gradientMask = ref(true);
const { copy, copied, isSupported } = useClipboard()
const toast = useToast()

let updatePending = false;

const copyCSS = () => {
  if(!isSupported) {
    toast.add({title: "Unsupported action", description: "Cannot copy to clipboard.", color: "red", icon: "i-heroicons-x-circle",})
    return;
  }

  copy(patternStyle.value)
}

const generate = () => {
  if (!updatePending) {
    updatePending = true;
    requestAnimationFrame(() => {
      nextTick(() => {
        patternStyle.value = generateGridPattern(
          amount.value,
          amount.value,
          baseColor.value,
          frontColor.value,
          density.value,
          fillChance.value,
          gradientMask.value,
          strokeWidth.value.toString()
        );
        updatePending = false;
      });
    });
  }
};

const debouncedGenerate = useDebounceFn(generate, 70);

watch(
  [amount, baseColor, frontColor, density, fillChance, gradientMask, strokeWidth],
  debouncedGenerate
);

onMounted(() => {
  generate();
});
</script>
