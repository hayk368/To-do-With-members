const db = [
  { id: 1, name: "Աննա", role: "Developer", location: "todo" },
  { id: 2, name: "Արամ", role: "Designer", location: "todo" },
  { id: 3, name: "Նարեկ", role: "Project Manager", location: "todo" },
  { id: 4, name: "Գոռ", role: "QA Engineer", location: "tomo1" },
  { id: 5, name: "Լիլիթ", role: "Frontend Dev", location: "tomo1" },
  { id: 6, name: "Դավիթ", role: "Backend Dev", location: "tomo1" },
  { id: 7, name: "Մարիամ", role: "UI/UX Designer", location: "tomo2" },
  { id: 8, name: "Էրիկ", role: "DevOps Engineer", location: "tomo2" },
  { id: 9, name: "Սոնա", role: "Product Owner", location: "tomo2" }
];

const sm = localStorage.getItem("mb_data");
export const b = sm ? JSON.parse(sm) : db;

export function saveMembers() {
  localStorage.setItem("mb_data", JSON.stringify(b));
}