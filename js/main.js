"use strict";

const app = {
  state: {
    tasks: [],
  },
  ui: {
    isFormOpen: false,
  },
  init() {
    this.renderApp();
    this.renderTodoForm();
    this.renderStats();
    this.renderTodoList();
    this.handleAddTodoSubmit();
    this.renderInfo();
    this.render();
    this.renderAddButton();
    this.updateFormVisibility();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.ui.isFormOpen) {
        this.ui.isFormOpen = false;
        this.updateFormVisibility();
        this.isOpenFormBtn.focus();
      }
    });
  },
  renderApp() {
    const root = document.createElement("div");
    root.classList.add("todo");

    this.root = root;
    document.body.appendChild(root);
  },
  renderTodoForm() {
    const { root } = this;

    const overlay = document.createElement("div");
    overlay.classList.add("todo-form-overlay");
    overlay.classList.add("todo-form-overlay--hidden");

    const form = document.createElement("form");
    form.classList.add("todo-form");

    const input = document.createElement("input");
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

    const button = document.createElement("button");
    button.type = "submit";
    button.classList.add("todo-form__button");
    button.textContent = "Add";

    this.formOverlay = overlay;
    this.form = form;
    this.input = input;
    this.button = button;

    overlay.append(form);
    form.append(input, button);
    root.appendChild(overlay);
  },
  updateFormVisibility() {
    const { isFormOpen } = this.ui;
    const { formOverlay } = this;

    if (!formOverlay) return;
    formOverlay.classList.toggle("todo-form-overlay--hidden", !isFormOpen);
  },
  renderAddButton() {
    const { root } = this;
    const isOpenFormBtn = document.createElement("button");
    isOpenFormBtn.classList.add("todo-add-btn");
    isOpenFormBtn.textContent = "+";

    isOpenFormBtn.addEventListener("click", () => {
      this.ui.isFormOpen = true;
      this.updateFormVisibility();
      this.input.focus();
    });

    this.isOpenFormBtn = isOpenFormBtn;
    root.append(isOpenFormBtn);
  },
  renderStats() {
    const { tasks } = this.state;

    const stats = document.createElement("section");
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

    removeCompletedTasks.addEventListener("click", () => this.clearCompleted());

    const wrapper = document.createElement("div");
    wrapper.classList.add("todo-stats__wrapper");

    this.statsCounters = [];

    const all = tasks.length;
    const active = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;

    const statsData = [
      { label: "All", count: all },
      { label: "Active", count: active },
      { label: "Completed", count: completed },
    ];

    statsData.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("todo-stats__card");

      const title = document.createElement("span");
      title.textContent = item.label;

      const count = document.createElement("span");
      count.textContent = item.count;

      this.statsCounters.push(count);

      card.append(title, count);
      wrapper.append(card);
    });

    this.stats = stats;
    this.removeCompletedTasks = removeCompletedTasks;

    statsHeader.append(title, removeCompletedTasks);
    stats.append(statsHeader, wrapper);
    this.root.prepend(stats);
  },
  updateStats() {
    const { tasks } = this.state;
    if (!this.statsCounters) return;

    const all = tasks.length;
    const active = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;

    const values = [all, active, completed];

    this.statsCounters.forEach((el, idx) => (el.textContent = values[idx]));
  },
  clearCompleted() {
    this.state.tasks = this.state.tasks.filter((t) => !t.completed);
    this.render();
  },
  renderTodoList() {
    const list = document.createElement("ul");
    const { root } = this;
    list.classList.add("todo-list");

    list.addEventListener("click", (event) => {
      if (event.target.classList.contains("todo-list__item-checkbox")) {
        const item = event.target.closest("li");
        if (!item) return;

        const id = item.dataset.id;
        const todo = this.state.tasks.find((task) => task.id === id);
        todo.completed = !todo.completed;
        this.render();
      }

      if (event.target.classList.contains("todo-list__item-remove")) {
        const item = event.target.closest("li");
        if (!item) return;

        const id = item.dataset.id;
        this.state.tasks = this.state.tasks.filter((task) => task.id !== id);
        this.render();
      }
    });

    this.list = list;
    root.append(list);
  },
  createTodoItem(todo) {
    const { id, title, completed } = todo;

    const item = document.createElement("li");
    item.classList.add("todo-list__item");
    item.dataset.id = id;

    const description = document.createElement("span");
    description.classList.add("todo-list__item-description");
    description.textContent = title;

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
  },
  handleAddTodoSubmit() {
    const { form, input } = this;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (input.value.trim()) {
        const newTodo = {
          id: crypto.randomUUID(),
          title: input.value,
          completed: false,
        };

        this.state.tasks.push(newTodo);
        this.render();

        input.value = "";
        this.ui.isFormOpen = false;
        this.updateFormVisibility();
        this.isOpenFormBtn.focus();
      }
    });
  },
  renderInfo() {
    const { list } = this;
    const { tasks } = this.state;

    if (!this.info) {
      const info = document.createElement("div");
      info.classList.add("todo-info");

      const text = document.createElement("span");
      info.append(text);

      this.info = info;
      this.counterText = text;

      list.insertAdjacentElement("afterend", info);
    }

    const activeCount = tasks.filter((t) => !t.completed).length;
    const totalCount = tasks.length;

    if (totalCount === 0) {
      this.counterText.textContent = "Zero tasks — take a deep breath 🚀";
    } else if (activeCount === 0) {
      this.counterText.textContent = "Perfect! You're unstoppable ✨";
    } else {
      this.counterText.textContent = "You still have things to conquer 💪";
    }
  },
  render() {
    const { list, state } = this;

    list.innerHTML = "";
    state.tasks.forEach((todo) => {
      const item = this.createTodoItem(todo);
      list.append(item);
    });

    this.renderInfo();
    this.updateStats();
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
