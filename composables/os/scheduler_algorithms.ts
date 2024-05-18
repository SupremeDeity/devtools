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
  const process_table = processes.toSorted(
    (a, b) => a.arrival_time - b.arrival_time
  );
  const chart: GanttChartEntry[] = [];

  let current_time = 0;
  const ready_queue = [];
  const copy = [...process_table];

  while (copy.length > 0) {
    const new_processes = copy
      .filter((val) => val.arrival_time <= current_time)
      .sort((a, b) => a.burst_time - b.burst_time);
    if (new_processes.length > 0) {
      ready_queue.push(...new_processes);
    }
    if (new_processes.length <= 0 && copy.length > 0) {
      const idle_time = copy[0].arrival_time - current_time;
      current_time = copy[0].arrival_time;
      if (idle_time > 0) {
        chart.push({ id: "-", end_time: current_time });
        continue;
      }
    }
    if (ready_queue.length > 0) {
      const current_process = ready_queue.shift(); // Remove from the ready queue
      const index = process_table.indexOf(current_process!);
      const cIndex = copy.indexOf(current_process!);
      copy.splice(cIndex, 1); // Mark as completed

      process_table[index].start_time = current_time;
      const completion_time = current_time + current_process!.burst_time;
      process_table[index].completion_time = completion_time;
      current_time += current_process!.burst_time;
      const turnaround_time = completion_time - current_process!.arrival_time;
      process_table[index].turnaround_time = turnaround_time;
      process_table[index].waiting_time =
        turnaround_time - process_table[index].burst_time;

      chart.push({ id: current_process!.id, end_time: completion_time });
    }
  }

  return { process_table, chart };
}
