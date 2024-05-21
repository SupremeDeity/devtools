import type { GanttChartEntry } from "./process";

export function fcfs(processes: Process[]) {
  const process_table = processes.toSorted(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const chart: GanttChartEntry[] = [];

  process_table.reduce((prev, proc, index) => {
    const arrival_time = process_table[index].arrival_time;
    const idle_time = arrival_time - prev;

    if (idle_time > 0) {
      chart.push({ id: "-", end_time: arrival_time });
      prev += idle_time;
    }

    const completion_time = prev + proc.burst_time;
    const turnaround_time = completion_time - arrival_time;

    process_table[index].start_time = prev;
    process_table[index].completion_time = completion_time;
    process_table[index].turnaround_time = turnaround_time;
    process_table[index].waiting_time =
      turnaround_time - process_table[index].burst_time;

    chart.push({ id: proc.id, end_time: completion_time });

    return completion_time;
  }, 0);

  return { process_table, chart };
}

export function sjf(processes: Process[]) {
  const process_table = processes.sort(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const chart: GanttChartEntry[] = [];

  let current_time = 0;
  const ready_queue: Process[] = [];
  const completed_processes: Process[] = [];

  while (process_table.length > 0 || ready_queue.length > 0) {
    while (
      process_table.length > 0 &&
      process_table[0].arrival_time <= current_time
    ) {
      ready_queue.push(process_table.shift()!);
    }

    ready_queue.sort((a, b) => a.burst_time - b.burst_time);

    if (ready_queue.length === 0) {
      current_time = process_table[0].arrival_time;
      chart.push({ id: "-", end_time: current_time });
      continue;
    }

    const current_process = ready_queue.shift()!;
    const completion_time = current_time + current_process.burst_time;

    current_process.start_time = current_time;
    current_process.completion_time = completion_time;
    current_process.turnaround_time =
      completion_time - current_process.arrival_time;
    current_process.waiting_time =
      current_process.turnaround_time - current_process.burst_time;

    current_time = completion_time;

    completed_processes.push(current_process);
    chart.push({ id: current_process.id, end_time: completion_time });
  }

  return { process_table: completed_processes, chart };
}

export function npp(processes: Process[]) {
  processes.sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) {
      return a.arrival_time - b.arrival_time;
    } else {
      return a.priority! - b.priority!;
    }
  });

  const processTable: Process[] = processes.slice();
  const chart: GanttChartEntry[] = [];
  let currentTime = 0;

  while (processTable.length > 0) {
    let selectedProcess = null;

    for (const process of processTable) {
      if (process.arrival_time <= currentTime) {
        selectedProcess = process;
        break;
      }
    }

    if (selectedProcess === null) {
      const idle_time = processTable[0].arrival_time - currentTime;

      currentTime = processTable[0].arrival_time;
      if (idle_time > 0) {
        chart.push({ id: "-", end_time: currentTime });
      }
      continue;
    }

    for (const process of processTable) {
      if (
        process.arrival_time <= currentTime &&
        process.priority! < selectedProcess.priority!
      ) {
        selectedProcess = process;
      }
    }

    chart.push({
      id: selectedProcess.id,
      end_time: currentTime + selectedProcess.burst_time,
    });

    selectedProcess.start_time = currentTime;
    currentTime += selectedProcess.burst_time;
    const index = processTable.findIndex((p) => p.id === selectedProcess.id);
    processTable.splice(index, 1);

    selectedProcess.completion_time = currentTime;
    selectedProcess.turnaround_time =
      selectedProcess.completion_time - selectedProcess.arrival_time;
    selectedProcess.waiting_time =
      selectedProcess.turnaround_time - selectedProcess.burst_time;

    currentTime = selectedProcess.completion_time;
  }

  return { process_table: processes, chart };
}

export function pp(processes: Process[]) {
  processes.sort((a, b) => a.arrival_time - b.arrival_time);

  const n = processes.length;
  const chart: GanttChartEntry[] = [];
  const remainingBurstTimes = processes.map((p) => p.burst_time);
  let currentTime = Math.min(...processes.map((p) => p.arrival_time));
  let completed = 0;

  if (currentTime > 0) {
    chart.push({ id: "-", end_time: currentTime });
  }

  while (completed < n) {
    let idx = -1;
    let highestPriority = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (
        processes[i].arrival_time <= currentTime &&
        remainingBurstTimes[i] > 0 &&
        processes[i].priority! < highestPriority
      ) {
        highestPriority = processes[i].priority!;
        idx = i;
      }
    }

    if (idx === -1) {
      currentTime++;
      if (chart[chart.length - 1].id === "-")
        chart[chart.length - 1].end_time = currentTime;
      else chart.push({ id: "-", end_time: currentTime });
      continue;
    }

    if (
      chart.length === 0 ||
      chart[chart.length - 1].id !== processes[idx].id
    ) {
      chart.push({ id: processes[idx].id, end_time: currentTime });
    }

    if (processes[idx].start_time === undefined) {
      processes[idx].start_time = currentTime;
    }

    remainingBurstTimes[idx]--;
    currentTime++;

    if (remainingBurstTimes[idx] === 0) {
      processes[idx].completion_time = currentTime;
      processes[idx].turnaround_time =
        processes[idx].completion_time! - processes[idx].arrival_time;
      processes[idx].waiting_time =
        processes[idx].turnaround_time! - processes[idx].burst_time;
      completed++;
    }
  }

  // Update the end_time for each entry in the Gantt chart
  chart.forEach((entry, index) => {
    if (index < chart.length - 1) {
      entry.end_time = chart[index + 1].end_time;
    } else {
      const lastProcess = processes.find((p) => p.id === entry.id);
      if (lastProcess) {
        entry.end_time = lastProcess.completion_time!;
      }
    }
  });

  return { process_table: processes, chart };
}
