<template>
  <div class="flex flex-col items-center justify-center gap-y-2">
    <div v-for="(part, index) in splitList" :key="index">
      <div
        class="flex justify-center items-center border border-primary-300 dark:border-primary-700 divide-x divide-primary-300 dark:divide-primary-700 bg-primary-50 dark:bg-primary-950 rounded w-min"
      >
        <template v-for="entry in part" :key="entry">
          <div
            class="select-none text-primary-600 dark:text-primary-400 w-10 h-10 flex justify-center items-center"
          >
            <span>{{ entry.id }}</span>
          </div>
        </template>
      </div>
      <div class="flex">
        <span
          v-if="index === 0"
          class="w-[39px] text-gray-600 dark:text-gray-400"
          >0</span
        >
        <span v-else class="w-[39px] text-gray-600 dark:text-gray-400">{{
          splitList[index - 1][maxEntriesPerRow - 1].end_time
        }}</span>
        <template v-for="entry in part" :key="entry">
          <span class="w-[39px] text-gray-600 dark:text-gray-400">{{
            entry.end_time
          }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ganttChart: any;
}>();

const windowWidth = ref(window.innerWidth);

onMounted(() => {
  nextTick(() => {
    window.addEventListener("resize", onResize);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  windowWidth.value = window.innerWidth;
};

const maxEntriesPerRow = computed(() => {
  return Math.floor(windowWidth.value / 40 - 5);
});

const splitList = computed(() => {
  const parts = [];
  for (let i = 0; i < props.ganttChart.length; i += maxEntriesPerRow.value) {
    parts.push(props.ganttChart.slice(i, i + maxEntriesPerRow.value));
  }
  return parts;
});
</script>
