import { saveTasks } from "./api.js";
import { state, ui } from "./state.js";

let root = null;
let overlay = null;
let form = null;
let input = null;
let button = null;
let isOpenFormBtn = null;
let stats = null;
let list = null;
let info = null;
let informationCounterTasks = null;

const statsCounters = [];

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

  const removeCompletedTasks = document.createElement("button");
  removeCompletedTasks.classList.add("todo-stats__header-clear");
  removeCompletedTasks.type = "button";
  removeCompletedTasks.textContent = "clear ✔️";
  removeCompletedTasks.addEventListener("click", () => clearCompletedTasks());

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

  statsHeader.append(title, removeCompletedTasks);
  stats.append(statsHeader, wrapper);
  root.prepend(stats);
}

function clearCompletedTasks() {
  state.tasks = state.tasks.filter((t) => !t.completed);
  render();
  saveTasks(state.tasks, ui.filtered);
}

function updateStats() {
  if (statsCounters) return;

  const allTasks = state.tasks.length;
  const activeTasks = state.tasks.filter((t) => !t.completed).length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;

  const values = [allTasks, activeTasks, completedTasks];
  statsCounters.forEach((el, idx) => (el.textContent = values[idx]));
}

export function renderFilterTasks() {
  const filterStatus = ["all", "active", "completed"];

  const filterTask = document.createElement("section");
  filterTask.classList.add("todo-filter");

  filterStatus.forEach((element) => {
    const filterButton = document.createElement("button");
    filterButton.classList.add("todo-filter__btn");
    filterButton.textContent = element;
    filterButton.dataset.filter = element;

    if (ui.filtered === element) {
      filterButton.classList.add("active-filter");
    }

    filterButton.addEventListener("click", () => {
      const buttons = document.querySelectorAll(".todo-filter__btn");
      buttons.forEach((el) => el.classList.remove("active-filter"));
      filterButton.classList.add("active-filter");

      ui.filtered = element;
      render();
      saveTasks(state.tasks, ui.filtered);
    });

    filterTask.append(filterButton);
  });
  root.append(filterTask);
}

export function renderTodoList() {
  list = document.createElement("ul");
  list.classList.add("todo-list");

  list.addEventListener("click", (event) => {
    if (event.target.classList.contains("todo-list__item-checkbox")) {
      const item = event.target.closest("li");
      if (!item) return;

      const id = item.dataset.id;
      const todo = state.tasks.find((task) => task.id === id);
      todo.completed = !todo.completed;
      render();
      saveTasks(state.tasks, ui.filtered);
    }

    if (event.target.classList.contains("todo-list__item-remove")) {
      const item = event.target.closest("li");
      if (!item) return;

      const id = item.dataset.id;
      item.classList.add("todo-list__item-removing");

      item.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "opacity") return;

        state.tasks = state.tasks.filter((task) => task.id !== id);
        render();
        saveTasks(state.tasks, ui.filtered);
      });
    }
  });

  list.addEventListener("dblclick", (event) => {
    if (event.target.classList.contains("todo-list__item-description")) {
      const item = event.target.closest("li");

      if (!item) return;

      const id = item.dataset.id;
      const task = state.tasks.find((t) => t.id === id);
      task.editing = true;
      render();

      const li = list.querySelector(`[data-id="${id}"]`);
      const span = li.querySelector(".todo-list__item-description");
      span.focus();
    }
  });

  list.addEventListener("keydown", (event) => {
    const isEnter = event.key === "Enter";
    const isDescription = event.target.classList.contains(
      "todo-list__item-description"
    );

    if (!isEnter || !isDescription) return;

    const item = event.target.closest("li");
    if (!item) return;

    const id = item.dataset.id;
    const task = state.tasks.find((t) => t.id === id);

    if (!task.editing) return;
    event.preventDefault();

    const newValue = event.target.textContent.trim();

    if (newValue.length === 0) {
      task.editing = false;
      render();
    } else {
      task.title = newValue;
      task.editing = false;
      render();
      saveTasks(state.tasks, ui.filtered);
    }
  });

  root.append(list);
}

export function renderInfo() {
  if (!info) {
    const info = document.createElement("div");
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
    // const item = createTodoItem(todo);
    // list.append(item);
  });

  // renderInfo();
  updateStats();
}
