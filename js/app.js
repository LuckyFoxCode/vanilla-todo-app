import { getTasks } from "./api.js";
import { state, ui } from "./state.js";
import { renderApp, renderTodoForm, updateFormVisibility } from "./ui.js";

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
  updateFormVisibility();
}
