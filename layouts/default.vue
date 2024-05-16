<template>
  <div class="font-['Urbanist']">
    <div
      class="fixed w-full z-50 shadow shadow-gray-200 dark:shadow-gray-800 flex items-center justify-between bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-3 ">
      <div class="flex items-center gap-x-2 text-2xl select-none">
        <Icon class="text-primary-500 dark:text-primary-400" name="bi:tools" /> <span
          class="font-bold text-gray-900 dark:text-gray-100">DevTools</span>
      </div>

      <ThemeModeToggle />
    </div>
    <div class="pt-[56px]">
      <slot />
    </div>
  </div>
</template>
