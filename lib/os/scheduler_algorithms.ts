import type { GanttChartEntry, Process } from "./process";

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

export function srtf(processes: Process[]) {
  processes.sort((a, b) => a.arrival_time - b.arrival_time);

  const n = processes.length;
  const chart: GanttChartEntry[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = processes[0].arrival_time;
  let completed = 0;
  const remainingBurstTimes = processes.map((p) => p.burst_time);
  let shortestRemainingTimeIdx: number;

  if (currentTime > 0) {
    chart.push({ id: "-", end_time: currentTime });
  }

  while (completed < n) {
    shortestRemainingTimeIdx = -1;
    let shortestRemainingTime = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (
        processes[i].arrival_time <= currentTime &&
        remainingBurstTimes[i] > 0 &&
        remainingBurstTimes[i] < shortestRemainingTime
      ) {
        shortestRemainingTime = remainingBurstTimes[i];
        shortestRemainingTimeIdx = i;
      }
    }

    if (shortestRemainingTimeIdx === -1) {
      const nextArrivalTime = processes.find(
        (p) => p.arrival_time > currentTime
      )?.arrival_time;
      if (nextArrivalTime !== undefined) {
        chart.push({ id: "-", end_time: nextArrivalTime });
        currentTime = nextArrivalTime;
      } else {
        currentTime++;
      }
      continue;
    }

    if (
      chart.length === 0 ||
      chart[chart.length - 1].id !== processes[shortestRemainingTimeIdx].id
    ) {
      chart.push({
        id: processes[shortestRemainingTimeIdx].id,
        end_time: currentTime + 1,
      });
    } else {
      chart[chart.length - 1].end_time++;
    }

    remainingBurstTimes[shortestRemainingTimeIdx]--;
    currentTime++;

    if (remainingBurstTimes[shortestRemainingTimeIdx] === 0) {
      const completedProcess = { ...processes[shortestRemainingTimeIdx] };
      completedProcess.completion_time = currentTime;
      completedProcess.turnaround_time =
        completedProcess.completion_time - completedProcess.arrival_time;
      completedProcess.waiting_time =
        completedProcess.turnaround_time - completedProcess.burst_time;
      completedProcess.start_time =
        completedProcess.completion_time - completedProcess.burst_time;
      completedProcesses.push(completedProcess);
      completed++;
    }
  }

  return { chart, process_table: completedProcesses };
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

export function rr(processes: Process[], timeQuantum: number): { process_table: Process[], chart: GanttChartEntry[] } {
    processes.sort((a, b) => a.arrival_time - b.arrival_time);

    const n = processes.length;
    const chart: GanttChartEntry[] = [];
    const remainingBurstTimes = processes.map(p => p.burst_time);
    const readyQueue: Process[] = [];
    let currentTime = 0;
    let completed = 0;

    for (let i = 0; i < n; i++) {
        if (processes[i].arrival_time <= currentTime) {
            readyQueue.push(processes[i]);
        }
    }

    while (completed < n) {
        if (readyQueue.length === 0) {
            const nextArrivalTime = Math.min(...processes.map(p => p.arrival_time).filter(t => t > currentTime));
            
            if (nextArrivalTime > currentTime) {
                chart.push({ id: "-", end_time: nextArrivalTime });
                currentTime = nextArrivalTime;
            }
            
            for (let i = 0; i < n; i++) {
                if (processes[i].arrival_time <= currentTime && !readyQueue.includes(processes[i]) && remainingBurstTimes[i] > 0) {
                    readyQueue.push(processes[i]);
                }
            }
        }

        const currentProcess = readyQueue.shift()!;
        const idx = processes.indexOf(currentProcess);
        const executionTime = Math.min(timeQuantum, remainingBurstTimes[idx]);

        if (currentProcess.start_time === undefined) {
            currentProcess.start_time = currentTime;
        }

        chart.push({ id: currentProcess.id, end_time: currentTime + executionTime });

        remainingBurstTimes[idx] -= executionTime;
        currentTime += executionTime;

        for (let i = 0; i < n; i++) {
            if (processes[i].arrival_time > currentTime - executionTime && processes[i].arrival_time <= currentTime && !readyQueue.includes(processes[i]) && remainingBurstTimes[i] > 0) {
                readyQueue.push(processes[i]);
            }
        }

        if (remainingBurstTimes[idx] === 0) {
            currentProcess.completion_time = currentTime;
            currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
            currentProcess.waiting_time = currentProcess.turnaround_time - processes[idx].burst_time;
            completed++;
        } else {
            readyQueue.push(currentProcess);
        }
    }

    return { process_table: processes, chart };
}








