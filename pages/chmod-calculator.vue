<template>
  <div class="p-4 sm:p-6">
    <UCard>
      <template #header>
        <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
          Chmod Calculator
        </h1>
      </template>

      <div class="grid gap-4 grid-flow-col grid-rows-4 place-items-center">
        <span />

        <span class="font-bold text-xl">Owner</span>
        <span class="font-bold text-xl">Group</span>
        <span class="font-bold text-xl">Public</span>

        <span class="font-bold">R(4)</span>
        <UCheckbox v-model="state.owner.read" color="primary" label="Read" />
        <UCheckbox v-model="state.group.read" color="primary" label="Read" />
        <UCheckbox v-model="state.public.read" color="primary" label="Read" />

        <span class="font-bold">W(2)</span>
        <UCheckbox v-model="state.owner.write" color="primary" label="Write" />
        <UCheckbox v-model="state.group.write" color="primary" label="Write" />
        <UCheckbox v-model="state.public.write" color="primary" label="Write" />

        <span class="font-bold">X(1)</span>
        <UCheckbox
          v-model="state.owner.execute"
          color="primary"
          label="Execute"
        />
        <UCheckbox
          v-model="state.group.execute"
          color="primary"
          label="Execute"
        />
        <UCheckbox
          v-model="state.public.execute"
          color="primary"
          label="Execute"
        />
      </div>

      <template #footer>
        <div class="flex gap-6 justify-center items-center">
          <UInput
            v-model="numericInput"
            placeholder="755"
            @blur="handleNumericBlur"
          />
          <UInput
            v-model="symbolicInput"
            placeholder="rwxr-xr-x"
            @blur="handleSymbolicBlur"
          />
          <UButton @click="reset()">Reset</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
<script setup lang="ts">
const initialState = {
  owner: { read: false, write: false, execute: false },
  public: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
};

const state = reactive({ ...initialState });
const numericInput = ref("");
const symbolicInput = ref("");
const isUpdatingFromState = ref(false);

const reset = () => {
  Object.assign(state, initialState);
};

const calculateOctal = (perms) => {
  return (perms.read ? 4 : 0) + (perms.write ? 2 : 0) + (perms.execute ? 1 : 0);
};

const setStateFromOctal = () => {
  const value = parseInt(numericInput.value, 10);
  if (isNaN(value) || value < 0 || value > 777) {
    return;
  }
  const owner = Math.floor(value / 100);
  const group = Math.floor((value % 100) / 10);
  const public_ = value % 10;

  const fromOctal = (octal) => ({
    read: (octal & 4) !== 0,
    write: (octal & 2) !== 0,
    execute: (octal & 1) !== 0,
  });

  state.owner = fromOctal(owner);
  state.group = fromOctal(group);
  state.public = fromOctal(public_);
};

const setStateFromSymbolic = () => {
  if (symbolicInput.value.length !== 9) {
    return;
  }

  const parseSymbolic = (str) => ({
    read: str[0] === "r",
    write: str[1] === "w",
    execute: str[2] === "x",
  });

  state.owner = parseSymbolic(symbolicInput.value.slice(0, 3));
  state.group = parseSymbolic(symbolicInput.value.slice(3, 6));
  state.public = parseSymbolic(symbolicInput.value.slice(6, 9));
};

const calculateSymbolic = (perms) => {
  return (
    (perms.read ? "r" : "-") +
    (perms.write ? "w" : "-") +
    (perms.execute ? "x" : "-")
  );
};

// Update inputs when state changes
watchEffect(() => {
  if (isUpdatingFromState.value) return;

  isUpdatingFromState.value = true;

  const ownerOctal = calculateOctal(state.owner);
  const groupOctal = calculateOctal(state.group);
  const publicOctal = calculateOctal(state.public);

  const ownerSymbolic = calculateSymbolic(state.owner);
  const groupSymbolic = calculateSymbolic(state.group);
  const publicSymbolic = calculateSymbolic(state.public);

  numericInput.value = `${ownerOctal}${groupOctal}${publicOctal}`;
  symbolicInput.value = `${ownerSymbolic}${groupSymbolic}${publicSymbolic}`;

  isUpdatingFromState.value = false;
});

// Functions to handle blur events
const handleNumericBlur = () => {
  if (!isUpdatingFromState.value) {
    setStateFromOctal();
  }
};

const handleSymbolicBlur = () => {
  if (!isUpdatingFromState.value) {
    setStateFromSymbolic();
  }
};
</script>
