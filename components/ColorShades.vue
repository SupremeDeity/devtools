<template>
  <div>
    <span class="font-semibold text-lg">{{ props.title }}</span>
    <div class="flex lg:flex-row flex-col justify-center gap-2">
      <div
        v-for="(lShade, index) in props.shades"
        :key="lShade"
        class="flex lg:flex-col gap-2 items-center text-sm"
      >
        <span class="font-semibold text-primary order-3 lg:order-1"
          >{{ index * 10 }}%</span
        >
        <span
          class="p-8 hover:scale-125 hover:border-2 hover:rounded order-2 rounded cursor-pointer transition-transform"
          :style="{
            backgroundColor: lShade,
            borderColor: pSBC(0.5, lShade),
          }"
          @click="copyColor(lShade, index)"
        />
        <div
          class="group cursor-pointer order-2 font-semibold w-[60px] lg:min-h-[40px] text-center break-words"
        >
          <span
            class="group-hover:hidden"
            @click="copyColor(altColorCode[index], index)"
            >{{ copied && index === copiedIndex ? "Copied" : lShade }}</span
          >
          <span
            class="hidden group-hover:block"
            @click="copyColor(altColorCode[index], index)"
            >{{
              copied && index === copiedIndex ? "Copied" : altColorCode[index]
            }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
// TODO: Try fix layout shift on hover: color patch
import pSBC from "~/lib/color/pSBC";
import { useClipboard } from "@vueuse/core";

const toast = useToast();
const { copy, copied,  isSupported } = useClipboard();

const props = defineProps({
  shades: { type: Array, required: true },
  title: { type: String, required: true },
});

const altColorCode = computed (() => {
  return props.shades.map((color) => pSBC(0, color, "c"))
})

const copiedIndex = ref(-1);
const copyColor = (shade, index) => {
  if (!isSupported) {
    toast.add({
      title: "Unsupported action",
      description: "Cannot copy to clipboard.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    return;
  }

  copy(shade);
  toast.add({ title: `Copied ${shade.startsWith("rgb") ? "RGB" : "HEX"} color to clipboard` });
  copiedIndex.value = index;
};
</script>

<style></style>
