const state = {
  commands: [],
  query: "",
  category: "all",
};

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const toastEl = document.getElementById("toast");
const searchEl = document.getElementById("search");
const categoriesEl = document.getElementById("categories");

const CATEGORY_LABELS = {
  all: "すべて",
  git: "Git",
  linux: "Linux",
  node: "Node.js",
  python: "Python",
  docker: "Docker",
};

async function load() {
  const res = await fetch("commands.json");
  state.commands = await res.json();
  const cats = ["all", ...new Set(state.commands.map((c) => c.category))];
  renderCategories(cats);
  render();
}

function renderCategories(cats) {
  categoriesEl.innerHTML = "";
  for (const cat of cats) {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (cat === state.category ? " active" : "");
    btn.textContent = CATEGORY_LABELS[cat] || cat;
    btn.addEventListener("click", () => {
      state.category = cat;
      updateCategoryButtons();
      render();
    });
    categoriesEl.appendChild(btn);
  }
}

function updateCategoryButtons() {
  [...categoriesEl.children].forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === (CATEGORY_LABELS[state.category] || state.category));
  });
}

function filtered() {
  const q = state.query.toLowerCase();
  return state.commands.filter((c) => {
    const matchCat = state.category === "all" || c.category === state.category;
    const matchQuery =
      !q ||
      c.cmd.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
}

function render() {
  const items = filtered();
  listEl.innerHTML = "";
  emptyEl.classList.toggle("hidden", items.length > 0);

  for (const item of items) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("role", "button");
    card.tabIndex = 0;

    const cat = document.createElement("span");
    cat.className = "cat-badge";
    cat.textContent = CATEGORY_LABELS[item.category] || item.category;

    const code = document.createElement("code");
    code.textContent = item.cmd;

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = item.desc;

    card.append(code, cat, desc);
    card.addEventListener("click", () => copy(item.cmd));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copy(item.cmd);
      }
    });
    listEl.appendChild(card);
  }
}

function copy(text) {
  navigator.clipboard.writeText(text).then(() => {
    toastEl.textContent = "コピーしました: " + text;
    toastEl.classList.remove("hidden");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.add("hidden"), 1800);
  });
}

searchEl.addEventListener("input", () => {
  state.query = searchEl.value.trim();
  render();
});

load();
