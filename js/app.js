import { getTasks, saveTasks } from "./api.js";
import {
  bindEscapeForm,
  bindTaskActions,
  bindTaskEditing,
  handleAddTodoSubmit,
} from "./handlers.js";
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
  renderStatistics();
  renderFilterTasks();
  renderTodoList();
  const { form, input, isOpenFormBtn, list } = getUiRefs();
  bindEscapeForm(isOpenFormBtn, { updateFormVisibility });

  handleAddTodoSubmit(form, input, isOpenFormBtn, {
    render,
    saveTasks,
    updateFormVisibility,
  });
  bindTaskActions(list, { render, saveTasks });
  bindTaskEditing(list, { render, saveTasks });
  render();
  updateFormVisibility();
}
