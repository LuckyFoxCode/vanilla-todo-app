let tasks = [];
let filtered = "all";

export function getTasks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem("vanila-todo-tasks");
      if (!data) {
        resolve({ tasks: [], filtered: "all" });
        return;
      }

      const obj = JSON.parse(data);
      tasks = obj.tasks;
      filtered = obj.filtered;

      resolve({ tasks, filtered });
    }, 500);
  });
}

export function saveTasks(todos, filteredTasks) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!Array.isArray(todos)) {
        reject(new Error("Corrupted todos"));
        return;
      }
      const serialized = JSON.stringify({
        tasks: [...todos],
        filtered: filteredTasks,
      });
      localStorage.setItem("vanila-todo-tasks", serialized);
      tasks = todos;
      filtered = filteredTasks;
      resolve();
    }, 500);
  });
}
