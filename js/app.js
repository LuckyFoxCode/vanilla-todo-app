import { getTasks, getTheme, saveTasks, saveTheme } from "./api.js";
import {
  bindClearCompleted,
  bindEscapeForm,
  bindFilters,
  bindTaskActions,
  bindTaskEditing,
  bindThemeToggle,
  handleAddTodoSubmit,
} from "./handlers.js";
import { state, ui } from "./state.js";
import {
  applyTheme,
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
  const currentTheme = getTheme();
  ui.theme = currentTheme;
  applyTheme(currentTheme);

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
  const {
    form,
    input,
    isOpenFormBtn,
    filterSection,
    list,
    clearBtn,
    themeBtn,
  } = getUiRefs();
  bindClearCompleted(clearBtn, { render, saveTasks });
  bindThemeToggle(themeBtn, { applyTheme, saveTheme });
  bindEscapeForm(isOpenFormBtn, { updateFormVisibility });
  handleAddTodoSubmit(form, input, isOpenFormBtn, {
    render,
    saveTasks,
    updateFormVisibility,
  });
  bindFilters(filterSection, { render, saveTasks });
  bindTaskActions(list, { render, saveTasks });
  bindTaskEditing(list, { render, saveTasks });
  render();
  updateFormVisibility();
}
