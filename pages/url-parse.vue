<template>
  <div class="p-4 sm:p-6">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="twitter:title" :content="title" />
      <Meta name="og:title" :content="title" />
      <Meta
        name="keywords"
        content="URL, URL properties, URL encode, URL decode, add URL parameters, remove URL parameters, URL tools, web development, online tools"
      />
      <Meta name="description" :content="description" />
      <Meta name="twitter:description" :content="description" />
      <Meta name="og:description" :content="description" />
    </Head>
    <UCard>
      <template #header>
        <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
          URL Parse
        </h1>
      </template>
      <div class="flex flex-col gap-4 items-start">
        <UInput v-model="urlString" class="w-full" placeholder="Enter URL" />
        <UButton @click="parseUrl">Parse</UButton>
      </div>
      <template v-if="isParsed" #footer>
        <h3 class="mt-4 mb-2 font-bold">URL Properties</h3>
        <UTable :columns="urlColumns" :rows="urlRows" />
        <h3 class="mt-4 mb-2 font-bold">URL Parameters</h3>
        <UTable :columns="paramColumns" :rows="paramRows">
          <template #action-data="{ row }">
            <UButton size="sm" color="red" @click="removeParam(row.key)"
              >Remove</UButton
            >
          </template>
        </UTable>
        <div class="flex gap-2">
          <UInput v-model="newParamKey" placeholder="New param key" />
          <UInput v-model="newParamValue" placeholder="New param value" />
          <UButton @click="addParam">Add Param</UButton>
        </div>
        <div class="mt-6 flex flex-col gap-4">
          <strong class="min-w-max">New URL (Encoded)</strong>
          <span
            class="p-2 rounded w-full text-gray-700 bg-gray-200 dark:text-gray-300 dark:bg-gray-800"
            >{{ newUrl }}</span
          >
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const title = "URL Parse | DevTools";
const description =
  "Easily list URL properties, encode and decode URLs, and add or remove URL parameters.";
const toast = useToast();

const urlString = ref("");
const isParsed = ref(false);
const url = ref<URL | null>(null);
const params = ref(new Map<string, string>());
const newParamKey = ref("");
const newParamValue = ref("");

const urlColumns = [
  { key: "property", label: "Property" },
  { key: "value", label: "Value" },
];

const paramColumns = [
  { key: "key", label: "Key" },
  { key: "value", label: "Value" },
  { key: "action", label: "Action" },
];

const urlProperties = [
  "protocol",
  "hostname",
  "port",
  "pathname",
  "hash",
  "username",
  "password",
];

const urlRows = computed(() =>
  url.value
    ? urlProperties
        .map((prop) => ({
          property: prop,
          value: url.value![prop as keyof URL],
        }))
        .filter((row) => row.value !== "")
    : []
);

const paramRows = computed(() =>
  Array.from(params.value.entries()).map(([key, value]) => ({ key, value }))
);

const newUrl = computed(() => {
  if (!url.value) return "";
  const newUrlInstance = new URL(url.value);
  newUrlInstance.search = ""; // Clear existing search params
  params.value.forEach((value, key) => {
    newUrlInstance.searchParams.append(key, value);
  });
  return newUrlInstance.toString();
});

const parseUrl = () => {
  try {
    url.value = new URL(urlString.value);
    params.value = new Map(url.value.searchParams.entries());
    isParsed.value = true;
  } catch (error) {
    toast.add({
      title: "Invalid URL",
      description: "Error while parsing URL.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    isParsed.value = false;
  }
};

const addParam = () => {
  if (newParamKey.value && newParamValue.value) {
    params.value.set(newParamKey.value, newParamValue.value);
    newParamKey.value = "";
    newParamValue.value = "";
  }
};

const removeParam = (key: string) => {
  params.value.delete(key);
};
</script>
