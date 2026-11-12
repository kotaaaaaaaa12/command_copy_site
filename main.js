const state = { sets: [], query: "" };

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const toastEl = document.getElementById("toast");
const searchEl = document.getElementById("search");

async function load() {
  const res = await fetch("sets.json");
  state.sets = await res.json();
  render();
}

function stepText(step, idx) {
  let text = `(${idx})${step.desc}`;
  if (step.note) text += `\n※${step.note}`;
  text += `\n${step.cmd}`;
  return text;
}

function sectionText(section, idx) {
  const steps = section.steps.map((s, i) => stepText(s, i + 1)).join("\n\n");
  return `[${idx}]${section.title}\n\n${steps}`;
}

function setText(set) {
  return set.sections.map((s, i) => sectionText(s, i + 1)).join("\n\n\n");
}

function copy(text) {
  navigator.clipboard.writeText(text).then(() => {
    toastEl.textContent = "コピーしました: " + (text.length > 40 ? text.slice(0, 40) + "…" : text);
    toastEl.classList.remove("hidden");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.add("hidden"), 1800);
  });
}

function matches(set) {
  const q = state.query.toLowerCase();
  if (!q) return true;
  if (set.title.toLowerCase().includes(q)) return true;
  return set.sections.some(
    (sec) =>
      sec.title.toLowerCase().includes(q) ||
      sec.steps.some(
        (s) =>
          s.desc.toLowerCase().includes(q) ||
          (s.note && s.note.toLowerCase().includes(q)) ||
          s.cmd.toLowerCase().includes(q)
      )
  );
}

function render() {
  const sets = state.sets.filter(matches);
  listEl.innerHTML = "";
  emptyEl.classList.toggle("hidden", sets.length > 0);

  for (const set of sets) {
    const setEl = document.createElement("section");
    setEl.className = "set";

    const head = document.createElement("div");
    head.className = "set-head";

    const title = document.createElement("h2");
    title.textContent = set.title;

    const allBtn = document.createElement("button");
    allBtn.className = "copy-all-btn";
    allBtn.textContent = "全コピー";
    allBtn.addEventListener("click", () => copy(setText(set)));

    head.append(title, allBtn);
    setEl.appendChild(head);

    for (const sec of set.sections) {
      const secEl = document.createElement("div");
      secEl.className = "section";

      const secTitle = document.createElement("h3");
      secTitle.textContent = sec.title;
      secEl.appendChild(secTitle);

      sec.steps.forEach((step, i) => {
        const stepEl = document.createElement("div");
        stepEl.className = "step";
        stepEl.setAttribute("role", "button");
        stepEl.tabIndex = 0;
        stepEl.title = "クリックでコピー";

        const num = document.createElement("span");
        num.className = "step-num";
        num.textContent = `(${i + 1})`;

        const label = document.createElement("span");
        label.className = "step-desc";
        label.textContent = step.desc;

        stepEl.append(num, label);
        secEl.appendChild(stepEl);

        if (step.note) {
          const note = document.createElement("p");
          note.className = "step-note";
          note.textContent = "※ " + step.note;
          secEl.appendChild(note);
        }

        const code = document.createElement("code");
        code.textContent = step.cmd;
        code.setAttribute("role", "button");
        code.tabIndex = 0;
        code.title = "クリックでコピー";
        secEl.appendChild(code);

        const handler = (e) => {
          e.stopPropagation();
          copy(step.cmd);
        };
        stepEl.addEventListener("click", handler);
        stepEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handler(e);
          }
        });
        code.addEventListener("click", handler);
        code.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handler(e);
          }
        });
      });

      setEl.appendChild(secEl);
    }

    listEl.appendChild(setEl);
  }
}

searchEl.addEventListener("input", () => {
  state.query = searchEl.value.trim();
  render();
});

load();
