import { initApp } from "./app.js";

const app = {
  async init() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.ui.isFormOpen) {
        this.ui.isFormOpen = false;
        this.updateFormVisibility();
        this.isOpenFormBtn.focus();
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", initApp);
