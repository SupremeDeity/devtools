<template>
    <div class="p-4 sm:p-6">
        <UCard>
            <template #header>
                <h1 class="text-lg font-bold dark:text-gray-200 text-gray-800">
                    Process Scheduler
                </h1>
            </template>
            <div class="">
                <UForm :schema="scheduler_form_schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Algorithm" name="algorithm">
                        <USelectMenu v-model="state.selected_algorithm" :options="algorithms" />
                    </UFormGroup>

                    <UFormGroup label="Arrival Time" name="arrival_times">
                        <UInput v-model="state.arrival_times" placeholder="For example: 0, 2, 3" />
                    </UFormGroup>

                    <UFormGroup label="Burst Time" name="burst_times">
                        <UInput v-model="state.burst_times" placeholder="For example: 3, 1, 2" />
                    </UFormGroup>

                    <UButton class="font-bold px-6" type="submit" variant="solid">Run</UButton>
                </UForm>
            </div>

            <template v-if="output" #footer>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-extrabold p-2 select-none">Output</h3>
                    <UBadge v-if="state.selected_algorithm" variant="subtle">{{
                        state.selected_algorithm.key
                        }}</UBadge>
                </div>
                <div class="w-full flex flex-col items-center p-4">
                    <span class="font-bold select-none">Gantt Chart</span>
                    <GanttChart :gantt_chart="gantt_chart" />
                </div>

                <UTable class="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg mx-auto lg:w-max"
                    :rows="output" :columns="process_columns" />
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
</template>

<script setup lang="ts">
import type { Process } from "~/composables/os/process";
import type { FormSubmitEvent } from "#ui/types";
import GanttChart from '../components/gantt-chart.vue'
import { fcfs, sjf } from "~/composables/os/scheduler_algorithms";

const algorithms = [
    { key: "FCFS", label: "[Non Premptive] First Come First Serve (FCFS)" },
    { key: "SJF", label: "[Non Premptive] Shortest Job First (SJF)" },
];

const state = reactive({
    arrival_times: undefined,
    burst_times: undefined,
    selected_algorithm: algorithms[0],
});

const output = ref<Process[]>();
const gantt_chart = ref();
const toast = useToast();



const average_times = computed(() => {
    if (!output.value)
        return { average_turnaround_time: 0, average_waiting_time: 0 };
    const { totalTurnaroundTime, totalWaitingTime } = output.value.reduce(
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

    if (arrival_times.length !== burst_times.length) {
        toast.add({
            title: "Error",
            description: "Length of arrival times and burst times must match.",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
        return;
    }

    if (!burst_times.every((val) => Number.parseInt(val) > 0)) {
        toast.add({
            title: "Error",
            description: "Burst time cannot be 0 or less",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
        return;
    }
    if (!arrival_times.every((val) => Number.parseInt(val) >= 0)) {
        toast.add({
            title: "Error",
            description: "Arrival time cannot be negative",
            icon: "i-heroicons-x-circle",
            color: "red",
        });
        return;
    }

    const process: Process[] = [];
    arrival_times.forEach((val, index) => {
        const at = Number.parseInt(val);
        const bt = Number.parseInt(burst_times[index]);
        if (bt === undefined || at === undefined) {
            toast.add({
                title: "Error",
                description: "Input could not be parsed",
                icon: "i-heroicons-x-circle",
                color: "red",
            });
            return;
        }
        process.push({
            id: `P${index + 1}`,
            arrival_time: at,
            burst_time: bt,
        })
    }
    );

    let algo;
    switch (event.data.selected_algorithm?.key) {
        case 'FCFS':
            algo = fcfs;
            break;
        case 'SJF':
            algo = sjf;
            break;
        default:
            algo = fcfs;
    }

    const { process_table, chart } = algo(process);
    output.value = process_table;
    gantt_chart.value = chart;
}


</script>
