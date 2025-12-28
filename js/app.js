import { getTasks } from "./api.js";
import { state, ui } from "./state.js";
import {
  render,
  renderAddTodoButton,
  renderApp,
  renderFilterTasks,
  renderStatistics,
  renderTodoForm,
  renderTodoList,
  updateFormVisibility,
} from "./ui.js";

export async function initApp() {
  try {
    const res = await getTasks();

    state.tasks = [...res.tasks];
    ui.filtered = res.filtered;
  } catch (error) {
    console.error(error);
  }

  renderApp();
  renderTodoForm();
  renderStatistics();
  renderFilterTasks();
  renderTodoList();
  renderAddTodoButton();
  render();
  updateFormVisibility();
}
