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
      input.classList.add("todo-form__input--error");
    });
    input.addEventListener("input", () => {
      input.classList.remove("todo-form__input--error");
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

    this.list = list;

    form.insertAdjacentElement("afterend", list);
  },
  createTodoItem(todo) {
    const { title, completed } = todo;

    const item = document.createElement("li");
    item.classList.add("todo-list__item");

    const description = document.createElement("span");
    description.classList.add("todo-list__item-description");
    description.textContent = title;

    const checkbox = document.createElement("input");
    checkbox.classList.add("todo-list__item-checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
    });

    item.append(description, checkbox);
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
