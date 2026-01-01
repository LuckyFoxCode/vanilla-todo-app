import { state, ui } from "./state.js";

export function bindThemeToggle(themeBtn, { applyTheme, saveTheme }) {
  themeBtn.addEventListener("click", () => {
    const theme = ui.theme;

    if (theme === "dark") {
      ui.theme = "light";
      saveTheme(ui.theme);
      applyTheme(ui.theme);
      themeBtn.textContent = "☀️";
      return;
    }
    ui.theme = "dark";
    saveTheme(ui.theme);
    applyTheme(ui.theme);
    themeBtn.textContent = "🌙";
  });
}

export function bindClearCompleted(clearBtn, { render, saveTasks }) {
  clearBtn.addEventListener("click", () => {
    state.tasks = state.tasks.filter((t) => !t.completed);
    render();
    saveTasks(state.tasks, ui.filtered);
  });
}

export function bindEscapeForm(isOpenFormBtn, { updateFormVisibility }) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && ui.isFormOpen) {
      ui.isFormOpen = false;
      updateFormVisibility();
      isOpenFormBtn.focus();
    }
  });
}

export function bindFilters(filterSection, { render, saveTasks }) {
  if (!filterSection) return;

  filterSection.addEventListener("click", (event) => {
    const btn = event.target.closest(".todo-filter__btn");

    if (!btn || !filterSection.contains(btn)) return;

    const btns = filterSection.querySelectorAll(".todo-filter__btn");
    btns.forEach((el) => el.classList.remove("active-filter"));

    btn.classList.add("active-filter");
    ui.filtered = btn.dataset.filter;

    render();
    saveTasks(state.tasks, ui.filtered);
  });
}

export function bindTaskActions(list, { render, saveTasks }) {
  list.addEventListener("click", (event) => {
    if (event.target.classList.contains("todo-list__item-checkbox")) {
      const item = event.target.closest("li");
      if (!item) return;

      const id = item.dataset.id;
      const todo = state.tasks.find((task) => task.id === id);

      if (!todo) return;
      todo.completed = event.target.checked;
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
}

export function bindTaskEditing(list, { render, saveTasks }) {
  list.addEventListener("dblclick", (event) => {
    if (event.target.classList.contains("todo-list__item-description")) {
      const item = event.target.closest("li");

      if (!item) return;

      const id = item.dataset.id;
      const task = state.tasks.find((t) => t.id === id);

      if (!task) return;
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

    if (!task) return;
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
}

export function handleAddTodoSubmit(
  form,
  input,
  isOpenFormBtn,
  { render, saveTasks, updateFormVisibility }
) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim()) {
      const newTodo = {
        id: crypto.randomUUID(),
        title: input.value,
        completed: false,
        editing: false,
      };

      state.tasks.push(newTodo);
      render();
      saveTasks(state.tasks, ui.filtered);

      input.value = "";
      ui.isFormOpen = false;
      updateFormVisibility();
      isOpenFormBtn.focus();
    }
  });
}
