Tasky
Tasky is a modern, responsive task and team management web application built with vanilla HTML, CSS, and modular JavaScript. It is designed to deliver a fast, organized, and intuitive workflow without relying on heavy external frameworks.

Key Features
Kanban Boards — Visual task organization and seamless status management.

Multi-Member Assignment — Assign one or multiple team members to any task.

Day Scheduling — Organize daily workflows by day and priority.

Calendar View — Get a clear overview of deadlines and scheduled tasks in a calendar layout.

Real-Time Search & Filtering — Instantly search and filter tasks by team member, status, or other criteria.

Responsive Design — Optimized for both desktop screens and smaller viewports/devices.  


Tech StackComponentDescriptionHTML5Semantic application structure and foundation for boards and modalsCSS3Modern styling, responsive layouts, and smooth transitionsJavaScript (ES Modules)Modular architecture separating data, team members, modals, and task logicProject Structure

Tasky/
├── index.html
├── style.css
└── js/
    ├── app.js
    ├── data.js
    ├── members.js
    ├── modal.js
    └── task.js

    index.html — Main page structure.

style.css — Visual styling, themes, and responsive layout rules.

js/data.js — Initial and persistent application data management.

js/members.js — Team member data, assignment, and filtering logic.

js/task.js — Task creation, updates, and status handling.

js/modal.js — Modal window controls and form handling.

js/app.js — Application initialization and event coordination.

Running Locally

Clone the repository or download the project files to your computer.

Open the project folder in Visual Studio Code.

Launch the application using Live Server (since the project uses ES Modules, running it via a local HTTP server avoids CORS/module restrictions).
