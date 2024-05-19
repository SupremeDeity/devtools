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

export function rr(processes: Process[], time_quantum: number) {
  const process_table = processes.sort(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const chart: GanttChartEntry[] = [];
  const ready_queue = [];

  return { process_table, chart };
}

export function npp(processes: Process[]) {
  processes.sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) {
      return a.arrival_time - b.arrival_time;
    } else {
      return a.priority! - b.priority!;
    }
  });

  const processTable = processes.slice();
  const chart = [];
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
      start_time: currentTime,
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
