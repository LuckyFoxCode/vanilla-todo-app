# 📝 Vanilla Todo App

A learning Todo application built with pure JavaScript (no frameworks).
The project is focused on understanding core frontend concepts: DOM, state management, rendering logic, and application architecture.

The application evolves step by step following a structured roadmap — from basic DOM manipulation to UI state, persistence, and theming.

[👉 Live demo](https://luckyfoxcode.github.io/vanilla-todo-app/)

---

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🎯 Project Goal

This project was created to:

- Practice **vanilla JavaScript** without frameworks
- Understand how frontend applications work under the hood
- Learn:
  - application state management
  - UI rendering logic
  - event delegation
  - working with `localStorage`
  - UI state (filters, theme)
- Build a solid foundation before moving to **TypeScript** and **Vue**

---

## ⚙️ Features

- ➕ Add new tasks
- ✅ Mark tasks as completed
- 🗑️ Delete tasks with animation
- ✏️ Edit tasks (double click)
- 🔎 Filters: All / Active / Completed
- 💾 Persistent state via `localStorage`
- 🌗 Dark / Light theme
- 💾 Theme persistence via `localStorage`
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

In addition to task data, the app also manages **UI state** (filters, theme).
Side effects such as DOM updates and `localStorage` access are separated from core logic, keeping the code predictable and easier to scale.

---

## 🗂️ Project Structure

```text
/js
├── main.js      # application entry point & initialization
├── state.js     # application state
├── ui.js        # UI rendering and DOM updates
├── handlers.js  # event handlers
├── api.js       # persistence layer (localStorage)
/css
├── base.css     # CSS variables and themes
└── styles.css   # layout and components
index.html
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/LuckyFoxCode/vanilla-todo-app.git
cd vanilla-todo-app
```

Open `index.html` using Live Server or any local web server.
