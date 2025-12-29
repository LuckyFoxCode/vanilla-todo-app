import { getTasks } from "./api.js";
import { handleAddTodoSubmit } from "./handlers.js";
import { state, ui } from "./state.js";
import {
  getUiRefs,
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
  renderAddTodoButton();
  const { form, input, isOpenFormBtn } = getUiRefs();
  handleAddTodoSubmit(form, input, isOpenFormBtn);
  renderStatistics();
  renderFilterTasks();
  renderTodoList();
  render();
  updateFormVisibility();
}
