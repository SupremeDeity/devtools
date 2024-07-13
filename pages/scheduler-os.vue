<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="twitter:title" :content="title" />
      <Meta name="og:title" :content="title" />
      <Meta name="description" :content="description" />
      <Meta name="twitter:description" :content="description" />
      <Meta name="og:description" :content="description" />
    </Head>
    <div class="p-4 sm:p-6">
      <UCard>
        <template #header>
          <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
            Process Scheduler
          </h1>
        </template>
        <div class="">
          <UForm
            :schema="scheduler_form_schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormGroup label="Algorithm" name="algorithm">
              <USelectMenu
                v-model="state.selected_algorithm"
                :options="algorithms"
              />
            </UFormGroup>

            <UFormGroup label="Arrival Time" name="arrival_times">
              <UInput
                v-model="state.arrival_times"
                placeholder="For example: 0, 2, 3"
              />
            </UFormGroup>

            <UFormGroup label="Burst Time" name="burst_times">
              <UInput
                v-model="state.burst_times"
                placeholder="For example: 3, 1, 2"
              />
            </UFormGroup>

            <UFormGroup
              v-if="state.selected_algorithm.key === 'RR'"
              label="Time Quantum"
              name="time_quantum"
            >
              <UInput
                v-model="state.time_quantum"
                placeholder="For example: 3"
              />
            </UFormGroup>

            <UFormGroup
              v-if="
                state.selected_algorithm.key === 'NPP' ||
                state.selected_algorithm.key === 'PP'
              "
              label="Priorities"
              name="priorities"
            >
              <UInput
                v-model="state.priorities"
                placeholder="Lower# = Higher priority"
              />
            </UFormGroup>

            <UButton class="font-bold px-6" type="submit" variant="solid"
              >Run</UButton
            >
          </UForm>
        </div>

        <template v-if="output" #footer>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold p-2 select-none">Output</h3>
            <UBadge v-if="state.selected_algorithm" variant="subtle">{{
              algorithmRef
            }}</UBadge>
          </div>
          <div class="w-full flex flex-col items-center p-4">
            <span class="font-bold select-none">Gantt Chart</span>
            <GanttChart :gantt_chart="gantt_chart" />
          </div>

          <UTable
            class="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg mx-auto lg:w-max"
            :rows="output"
            :columns="process_columns"
          />
          <div class="text-center p-2">
            <div>
              <span class="font-bold mr-2">Average Turnaround Time:</span>
              <span>{{ average_times.average_turnaround_time }}</span>
            </div>
            <div>
              <span class="font-bold mr-2">Average Waiting Time:</span>
              <span>{{ average_times.average_waiting_time }}</span>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  process_columns,
  scheduler_form_schema,
  type Process,
  type SchedulerFormSchema,
} from "~/lib/os/process";
import type { FormSubmitEvent } from "#ui/types";
import GanttChart from "../components/gantt-chart.vue";
import { fcfs, npp, pp, rr, sjf, srtf } from "~/lib/os/scheduler_algorithms";

const title = "Process Scheduler | DevTools";
const description = "Process Scheduling algorithms solver.";

const algorithms = [
  { key: "FCFS", label: "First Come First Serve (FCFS)" },
  { key: "SJF", label: "[Non Premptive] Shortest Job First (SJF)" },
  {
    key: "SRTF",
    label: "[Premptive] Shortest Remaining Time First (SRTF/SJF)",
  },
  { key: "NPP", label: "[Non Premptive] Priority (NPP)" },
  { key: "PP", label: "[Premptive] Priority (PP)" },
  { key: "RR", label: "Round Robin (RR)" },
];

const state = reactive({
  arrival_times: undefined,
  burst_times: undefined,
  selected_algorithm: algorithms[0],
  time_quantum: undefined,
  priorities: undefined,
});

const output = ref<Process[]>();
const gantt_chart = ref();
const algorithmRef = ref();
const toast = useToast();

const average_times = computed(() => {
  if (!output.value)
    return { average_turnaround_time: 0, average_waiting_time: 0 };
  const { totalTurnaroundTime, totalWaitingTime } = output.value.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (totals: any, process: Process) => {
      return {
        totalTurnaroundTime:
          totals.totalTurnaroundTime + (process.turnaround_time || 0),
        totalWaitingTime: totals.totalWaitingTime + (process.waiting_time || 0),
      };
    },
    { totalTurnaroundTime: 0, totalWaitingTime: 0 }
  );

  return {
    average_turnaround_time: (
      totalTurnaroundTime / output.value.length
    ).toFixed(3),
    average_waiting_time: (totalWaitingTime / output.value.length).toFixed(3),
  };
});

async function onSubmit(event: FormSubmitEvent<SchedulerFormSchema>) {
  const arrival_times = event.data.arrival_times.trim().split(/[ ,]+/);
  const burst_times = event.data.burst_times.trim().split(/[ ,]+/);
  const priorities = event.data?.priorities?.trim().split(/[ ,]+/);
  const selected_algorithm = event.data.selected_algorithm!;

  if (arrival_times.length !== burst_times.length) {
    toast.add({
      title: "Error",
      description: "Length of arrival times and burst times must match.",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
    return;
  }

  if (selected_algorithm?.key === "NPP" || selected_algorithm?.key === "PP") {
    if (
      priorities?.length !== arrival_times.length ||
      priorities.length !== burst_times.length
    ) {
      toast.add({
        title: "Error",
        description:
          "Length of arrival times, burst times and priorities must match.",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return;
    }
  }

  const btCon = burst_times.every((val: string) => {
    const parsedNum = Number.parseInt(val);
    if (Number.isNaN(parsedNum) || !Number.isFinite(parsedNum)) {
      toast.add({
        title: "Error",
        description: "Burst times cannot be parsed",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    } else if (parsedNum <= 0) {
      toast.add({
        title: "Error",
        description: "Burst time cannot be 0 or less",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    }
    return true;
  });

  const process: Process[] = [];
  const atCon = arrival_times.every((val: string, index: number) => {
    const parsedNum = Number.parseInt(val);
    if (Number.isNaN(parsedNum) || !Number.isFinite(parsedNum)) {
      toast.add({
        title: "Error",
        description: "Arrival times cannot be parsed",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    } else if (parsedNum < 0) {
      toast.add({
        title: "Error",
        description: "Arrival time cannot be negative",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    }

    let p;
    if (selected_algorithm?.key === "NPP" || selected_algorithm?.key === "PP") {
      p = Number.parseInt(priorities![index]);
      if (Number.isNaN(p) || !Number.isFinite(p)) {
        toast.add({
          title: "Error",
          description: "Priorities could not be parsed",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
        return false;
      }
    }
    process.push({
      id: `P${index + 1}`,
      arrival_time: parsedNum,
      burst_time: Number.parseInt(burst_times[index]),
      priority: p,
    });
    return true;
  });

  if (!atCon || !btCon) return;

  let algo;
  switch (selected_algorithm?.key) {
    case "FCFS":
      algo = fcfs;
      break;
    case "SJF":
      algo = sjf;
      break;
    case "SRTF":
      algo = srtf;
      break;
    case "PP":
      algo = pp;
      break;
    case "NPP":
      algo = npp;
      break;
    case "RR":
      algo = rr;
      break;
    default:
      algo = fcfs;
  }

  const { process_table, chart } = algo(process, event.data.time_quantum ?? 0);
  output.value = process_table;
  gantt_chart.value = chart;
  algorithmRef.value = selected_algorithm.key;
}
</script>
