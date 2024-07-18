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
          class="flex justify-evenly min-[410px]:max-md:flex-row flex-col gap-4 items-center"
        >
          <div>
            <span class="font-semibold text-lg">Lighter Shades</span>
            <div class="flex md:flex-row flex-col justify-center">
              <div
                v-for="(lShade, index) in lightShades"
                :key="lShade"
                class="flex md:flex-col gap-2 items-center text-sm"
              >
                <span class="font-semibold text-primary order-3 md:order-1"
                  >{{ index * 10 }}%</span
                >
                <span
                  class="p-8 hover:scale-125 hover:border-2 hover:rounded order-2"
                  :style="{
                    backgroundColor: lShade,
                    borderColor: pSBC(0.5, lShade),
                  }"
                  @click="copyColor(lShade)"
                />
                <span
                  class="font-semibold order-2 max-w-[60px] text-center break-words"
                  >{{ lShade }}</span
                >
              </div>
            </div>
          </div>
          <div>
            <span class="font-semibold text-lg">Darker Shades</span>
            <div class="flex md:flex-row flex-col justify-center">
              <div
                v-for="(dShade, index) in darkShades"
                :key="dShade"
                class="flex md:flex-col gap-2 items-center text-sm"
              >
                <span class="font-semibold text-primary order-3 md:order-1"
                  >{{ index * 10 }}%</span
                >
                <span
                  class="p-8 hover:scale-125 hover:border-2 hover:rounded order-2"
                  :style="{
                    backgroundColor: dShade,
                    borderColor: pSBC(0.5, dShade),
                  }"
                  @click="copyColor(dShade)"
                />
                <span
                  class="font-semibold order-2 max-w-[60px] text-center break-words"
                  >{{ dShade }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="js" setup>
import pSBC from "~/lib/color/pSBC";
import {  useClipboard } from '@vueuse/core';

const toast = useToast();
const { copy, isSupported } = useClipboard()

const color = ref("#09EF20")
const logBlend = ref(true)

// no of shades including the original color
const noOfShades = 11;
const lightShades = computed(() => Array(noOfShades).fill().map((_, v) => pSBC(v/noOfShades, color.value, false, logBlend.value)));
const darkShades = computed(() => Array(noOfShades).fill().map((_, v) => pSBC(-v/noOfShades, color.value, false, logBlend.value)));

const copyColor = (shade) => {
  if(!isSupported) {
    toast.add({title: "Unsupported action", description: "Cannot copy to clipboard.", color: "red", icon: "i-heroicons-x-circle",})
    return;
  }

  copy(shade)
  toast.add({title: "Copied color hex to clipboard"})
}
</script>
