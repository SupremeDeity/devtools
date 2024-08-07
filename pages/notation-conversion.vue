<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="twitter:title" :content="title" />
      <Meta name="og:title" :content="title" />
      <Meta
        name="keywords"
        content="Infix to Postfix, Postfix to Infix, Infix to Prefix, Prefix to Infix, Prefix to Postfix, Postfix to Prefix, expression conversion, online tool, algorithm, infix, postfix, prefix, conversion tool"
      />
      <Meta name="description" :content="description" />
      <Meta name="twitter:description" :content="description" />
      <Meta name="og:description" :content="description" />
    </Head>
    <div class="p-4 sm:p-6">
      <UCard>
        <template #header>
          <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
            Notation Converter
          </h1>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Type" name="type">
            <USelectMenu v-model="state.type" :options="TypeEnum.options" />
          </UFormGroup>

          <UFormGroup label="Expression" name="expression">
            <UInput v-model="state.expression" />
          </UFormGroup>

          <UButton type="submit" class="font-bold">Convert</UButton>
        </UForm>

        <template v-if="output" #footer>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold p-2 select-none">Output</h3>
            <UBadge v-if="state.type" variant="subtle">{{ state.type }}</UBadge>
          </div>

          <div class="flex justify-center">
            <span
              class="dark:bg-primary-900/40 bg-primary-100/60 font-bold border dark:border-primary-700 border-primary-300 dark:text-primary-300 text-primary-600 p-2 rounded-lg min-w-[50%] text-center"
              >{{ output[output.length - 1].notation }}</span
            >
          </div>
          <UTable :rows="output" class="mt-4" />
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import {
  infixToPostfix,
  infixToPrefix,
  postfixToInfix,
  postfixToPrefix,
  prefixToInfix,
  prefixToPostfix,
  type NotationOutput,
} from "~/lib/conversion/notation_algorithms";

const title = "Notation Converter | DevTools";
const description = "Convert between infix, postfix and prefix notations.";

const TypeEnum = z.enum([
  "Infix To Postfix",
  "Postfix to Infix",
  "Infix to Prefix",
  "Prefix to Infix",
  "Prefix to Postfix",
  "Postfix to Prefix",
]);

const schema = z.object({
  type: TypeEnum,
  expression: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  type: TypeEnum.enum["Infix To Postfix"],
  expression: undefined,
});

const output = ref<NotationOutput[] | undefined>();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  switch (event.data.type) {
    case "Infix To Postfix":
      output.value = infixToPostfix(event.data.expression);
      break;
    case "Postfix to Infix":
      output.value = postfixToInfix(event.data.expression);
      break;
    case "Infix to Prefix":
      output.value = infixToPrefix(event.data.expression);
      break;
    case "Prefix to Infix":
      output.value = prefixToInfix(event.data.expression);
      break;
    case "Prefix to Postfix":
      output.value = prefixToPostfix(event.data.expression);
      break;
    case "Postfix to Prefix":
      output.value = postfixToPrefix(event.data.expression);
      break;
    default:
      break;
  }
}
</script>
