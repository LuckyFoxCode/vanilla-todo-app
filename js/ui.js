import { ui } from "./state.js";

let root = null;
let overlay = null;
let form = null;
let input = null;
let button = null;
let isOpenFormBtn = null;

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
