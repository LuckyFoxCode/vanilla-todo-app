"use strict";

const app = {
  state: [],
  init() {
    this.renderTodoForm();
    this.renderTodoList();
    this.addTodoTask();
  },
  renderTodoForm() {
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
    document.body.appendChild(form);
  },
  renderTodoList() {
    const list = document.createElement("ul");
    const { form } = this;
    list.classList.add("todo-list");

    this.list = list;

    form.insertAdjacentElement("afterend", list);
  },
  renderTodoItem(todo) {
    const { list } = this;
    const { title, completed } = todo;

    const item = document.createElement("li");
    item.classList.add("todo-list__item");

    const description = document.createElement("span");
    description.classList.add("todo-list__item-description");
    description.textContent = title;

    const checkbox = document.createElement("input");
    checkbox.classList.add("todo-list__checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
    });

    item.append(description, checkbox);
    list.appendChild(item);
  },
  addTodoTask() {
    const { form, input } = this;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (input.value.trim()) {
        const newTodo = {
          id: crypto.randomUUID(),
          title: input.value,
          completed: false,
        };

        this.state.push(newTodo);
        this.renderTodoItem(newTodo);

        console.log("---State---", this.state);

        input.value = "";
        input.focus();
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
