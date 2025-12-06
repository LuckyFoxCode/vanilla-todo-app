"use strict";

const app = {
  state: {
    tasks: [],
  },
  init() {
    this.renderApp();
    this.renderTodoForm();
    this.renderTodoList();
    this.handleAddTodoSubmit();
    this.render();
  },
  renderApp() {
    const root = document.createElement("div");
    root.classList.add("todo");

    this.root = root;
    document.body.appendChild(root);
  },
  renderTodoForm() {
    const { root } = this;

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

    this.form = form;
    this.input = input;
    this.button = button;

    form.append(input, button);
    root.appendChild(form);
  },
  renderTodoList() {
    const list = document.createElement("ul");
    const { form } = this;
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
    form.insertAdjacentElement("afterend", list);
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

        console.log("---State---", this.state);

        input.value = "";
        input.focus();
      }
    });
  },
  render() {
    const { list, state } = this;

    list.innerHTML = "";
    state.tasks.forEach((todo) => {
      const item = this.createTodoItem(todo);
      list.append(item);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
