const da = [
  { id: 1, title: "User flow", description: "Lorem ipsum dolor sit amet.", memberIds: [1, 2], day: 2, category: "Design" },
  { id: 2, title: "Website Design", description: "Lorem ipsum dolor sit amet.", memberIds: [2], day: 5, category: "Design" },
  { id: 3, title: "Frontend Logic", description: "Lorem ipsum dolor sit amet.", memberIds: [3, 4], day: 8, category: "Programming" },
  { id: 4, title: "API Integration", description: "Connect frontend with REST API.", memberIds: [4, 5, 6], day: 12, category: "Programming" },
  { id: 5, title: "Testing & QA", description: "Run unit tests and check bugs.", memberIds: [7], day: 23, category: "QA" },
  { id: 6, title: "Team Meeting", description: "Weekly sync for everyone.", memberIds: "all", day: 15, category: "QA" }
];

const sd = localStorage.getItem("tk_data");
export const a = sd ? JSON.parse(sd) : da;

export function saveTasks() {
  localStorage.setItem("tk_data", JSON.stringify(a));
}