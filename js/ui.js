let root = null;

export function renderApp() {
  root = document.createElement("div");
  root.classList.add("todo");

  document.body.appendChild(root);
}

export function getRoot() {
  return root;
}
