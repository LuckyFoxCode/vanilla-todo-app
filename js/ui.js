import { state, ui } from "./state.js";

let root = null;
let overlay = null;
let form = null;
let input = null;
let button = null;
let isOpenFormBtn = null;
let stats = null;
let filterSection = null;
let list = null;
let info = null;
let informationCounterTasks = null;
let clearBtn = null;
let themeBtn = null;

const statsCounters = [];

export function getUiRefs() {
  return {
    form,
    input,
    isOpenFormBtn,
    filterSection,
    list,
    overlay,
    clearBtn,
    themeBtn,
  };
}

export function renderApp() {
  root = document.createElement("div");
  root.classList.add("todo");

  document.body.appendChild(root);
}

export function renderTodoForm() {
  overlay = document.createElement("div");
  overlay.classList.add("todo-form-overlay");
  overlay.classList.add("todo-form-overlay--hidden");

  form = document.createElement("form");
  form.classList.add("todo-form");

  input = document.createElement("input");
  input.type = "text";
  input.classList.add("todo-form__input");
  input.name = "todo";
  input.placeholder = "Add a todo";
  input.required = true;
  input.autocomplete = "off";
  input.minLength = 2;
  input.maxLength = 30;

  input.addEventListener("invalid", () => {
    input.classList.add("todo-form__input-error");
  });
  input.addEventListener("input", () => {
    input.classList.remove("todo-form__input-error");
  });

  button = document.createElement("button");
  button.type = "submit";
  button.classList.add("todo-form__button");
  button.textContent = "Add";

  overlay.append(form);
  form.append(input, button);
  root.appendChild(overlay);
}

export function updateFormVisibility() {
  if (!overlay) return;
  overlay.classList.toggle("todo-form-overlay--hidden", !ui.isFormOpen);
}

export function renderAddTodoButton() {
  isOpenFormBtn = document.createElement("button");
  isOpenFormBtn.classList.add("todo-add-btn");
  isOpenFormBtn.textContent = "+";

  isOpenFormBtn.addEventListener("click", () => {
    ui.isFormOpen = true;
    updateFormVisibility();
    input.focus();
  });

  root.append(isOpenFormBtn);
}

export function renderStatistics() {
  stats = document.createElement("section");
  stats.classList.add("todo-stats");

  const statsHeader = document.createElement("div");
  statsHeader.classList.add("todo-stats__header");

  const title = document.createElement("h1");
  title.classList.add("todo-stats__header-title");
  title.textContent = "my tasks";

  const wrapperBtn = document.createElement("div");
  wrapperBtn.classList.add("todo-stats__header-wrapperBtn");

  themeBtn = document.createElement("button");
  themeBtn.classList.add("todo-stats__header-themeBtn");
  themeBtn.type = "button";
  themeBtn.textContent = ui.theme === "light" ? "☀️" : "🌙";

  clearBtn = document.createElement("button");
  clearBtn.classList.add("todo-stats__header-clear");
  clearBtn.type = "button";
  clearBtn.textContent = "🧽";

  const wrapper = document.createElement("div");
  wrapper.classList.add("todo-stats__wrapper");

  const allTasks = state.tasks.length;
  const activeTasks = state.tasks.filter((t) => !t.completed).length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;

  const statsData = [
    { label: "All", count: allTasks },
    { label: "Active", count: activeTasks },
    { label: "Completed", count: completedTasks },
  ];

  statsData.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("todo-stats__card");

    const title = document.createElement("span");
    title.textContent = item.label;

    const count = document.createElement("span");
    count.textContent = item.count;

    statsCounters.push(count);

    card.append(title, count);
    wrapper.append(card);
  });

  wrapperBtn.append(themeBtn, clearBtn);
  statsHeader.append(title, wrapperBtn);
  stats.append(statsHeader, wrapper);
  root.prepend(stats);
}

function updateStats() {
  if (statsCounters.length === 0) return;

  const allTasks = state.tasks.length;
  const activeTasks = state.tasks.filter((t) => !t.completed).length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;

  const values = [allTasks, activeTasks, completedTasks];
  statsCounters.forEach((el, idx) => (el.textContent = values[idx]));
}

export function renderFilterTasks() {
  const filterStatus = ["all", "active", "completed"];

  filterSection = document.createElement("section");
  filterSection.classList.add("todo-filter");

  filterStatus.forEach((element) => {
    const filterButton = document.createElement("button");
    filterButton.classList.add("todo-filter__btn");
    filterButton.type = "button";
    filterButton.textContent = element;
    filterButton.dataset.filter = element;

    if (ui.filtered === element) {
      filterButton.classList.add("active-filter");
    }

    filterSection.append(filterButton);
  });

  root.append(filterSection);
}

export function renderTodoList() {
  list = document.createElement("ul");
  list.classList.add("todo-list");

  root.append(list);
}

function createTodoItem(todo) {
  const { id, title, completed, editing } = todo;

  const item = document.createElement("li");
  item.classList.add("todo-list__item");
  item.dataset.id = id;

  const description = document.createElement("span");
  description.classList.add("todo-list__item-description");
  description.textContent = title;

  if (editing) description.contentEditable = true;

  const checkbox = document.createElement("input");
  checkbox.classList.add("todo-list__item-checkbox");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  if (completed) item.classList.add("completed");

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("todo-list__item-remove");
  deleteBtn.type = "button";
  deleteBtn.textContent = "🗑️";

  item.append(description, checkbox, deleteBtn);
  return item;
}

export function renderInfo() {
  if (!info) {
    info = document.createElement("div");
    info.classList.add("todo-info");

    const text = document.createElement("span");
    info.append(text);
    informationCounterTasks = text;
    list.insertAdjacentElement("afterend", info);
  }
  const activeCount = state.tasks.filter((t) => !t.completed).length;
  const totalCount = state.tasks.length;

  if (totalCount === 0) {
    informationCounterTasks.textContent = "Zero tasks — take a deep breath 🚀";
  } else if (activeCount === 0) {
    informationCounterTasks.textContent = "Perfect! You're unstoppable ✨";
  } else {
    informationCounterTasks.textContent = "You still have things to conquer 💪";
  }
}

export function render() {
  let activeTasks = state.tasks;
  list.innerHTML = "";

  if (ui.filtered === "active") {
    activeTasks = activeTasks.filter((t) => !t.completed);
  } else if (ui.filtered === "completed") {
    activeTasks = activeTasks.filter((t) => t.completed);
  }

  activeTasks.forEach((todo) => {
    const item = createTodoItem(todo);
    list.append(item);
  });

  renderInfo();
  updateStats();
}

export function applyTheme(theme) {
  const rootEl = document.documentElement;
  if (theme === "dark") {
    rootEl.classList.add("dark");
    return;
  }
  rootEl.classList.remove("dark");
}
