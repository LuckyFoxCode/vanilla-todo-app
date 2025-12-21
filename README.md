# 📝 Vanilla Todo App

A learning Todo application built with pure JavaScript (no frameworks).
The project is focused on understanding core frontend concepts: DOM, state management, rendering logic, and application architecture.

👉 Live demo: https://luckyfoxcode.github.io/vanila-todo-app/

---

## 🎯 Project Goal

This project was created to:

- Practice **vanilla JavaScript**
- Understand how frontend applications work without frameworks
- Learn:
  - application state management
  - UI rendering logic
  - event delegation
  - working with `localStorage`
- Build a solid foundation before moving to **TypeScript** and **Vue**

---

## ⚙️ Features

- ➕ Add new tasks
- ✅ Mark tasks as completed
- 🗑️ Delete tasks with animation
- ✏️ Edit tasks (double click)
- 🔎 Filters: All / Active / Completed
- 💾 Persistent state via `localStorage`
- 📊 Task statistics
- ⌨️ Keyboard support (Enter / Escape)

---

## 🧠 Architecture

The application follows a simple but powerful principle:

> **State → Render → UI**

- All data is stored in a central state
- UI is fully re-rendered via a single `render()` function
- Minimal direct DOM manipulation
- Event delegation is used instead of multiple listeners

This approach keeps the code predictable and easier to scale.

---

## 🗂️ Project Structure

```text
/js
├── main.js # application initialization and core logic
├── api.js # fake API layer (localStorage)
/css
└── styles.css
index.html
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/LuckyFoxCode/vanila-todos.git
cd vanila-todo-app
```

Open index.html using Live Server or any local web server.
