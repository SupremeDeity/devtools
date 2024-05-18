import {z} from "zod";

export type Process = {
    id: string,
    arrival_time: number,
    burst_time: number,
    start_time?: number,
    completion_time?: number,
    turnaround_time?: number,
    waiting_time?: number,
}

export type GanttChartEntry = {
    id: string,
    end_time: number
}

export const process_columns = [
    { key: "id", label: "Process ID" },
    { key: "arrival_time", label: "Arrival Time" },
    { key: "burst_time", label: "Burst Time" },
    { key: "start_time", label: "Start Time" },
    { key: "completion_time", label: "Completion Time" },
    { key: "turnaround_time", label: "Turnaround Time" },
    { key: "waiting_time", label: "Waiting Time" },
];

export const scheduler_form_schema = z.object({
    arrival_times: z.string(),
    burst_times: z.string(),
    selected_algorithm: z
        .object({ key: z.string(), label: z.string() })
        .optional(),
});

export type SchedulerFormSchema = z.output<typeof scheduler_form_schema>;