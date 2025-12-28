import { getTasks } from "./api.js";
import { state, ui } from "./state.js";
import { renderApp, renderTodoForm } from "./ui.js";

export async function initApp() {
  try {
    const res = await getTasks();

    state.tasks = [...res.tasks];
    ui.filtered = res.filtered;
    console.log(state, ui, "LOG");
  } catch (error) {
    console.error(error);
  }

  renderApp();
  renderTodoForm();
}
