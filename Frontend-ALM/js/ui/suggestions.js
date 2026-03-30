function createSuggestionsController({ input, panel, list, fetchItems, onPick }) {
  let timeoutId = null;
  let items = [];
  let selectedIndex = -1;

  function hide() {
    panel.classList.add("hidden");
    items = [];
    selectedIndex = -1;
  }

  function pick(value) {
    input.value = value;
    onPick(value);
    hide();
  }

  function highlightSelected() {
    const buttons = list.querySelectorAll(".suggestion-item");

    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        button.classList.add("selected");
        button.scrollIntoView({ block: "nearest" });
      } else {
        button.classList.remove("selected");
      }
    });
  }

  function render(nextItems) {
    items = nextItems;
    selectedIndex = -1;
    list.innerHTML = "";

    if (nextItems.length === 0) {
      hide();
      return;
    }

    for (const item of nextItems) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-item";
      button.textContent = item;
      button.addEventListener("click", () => pick(item));
      li.appendChild(button);
      list.appendChild(li);
    }

    panel.classList.remove("hidden");
  }

  input.addEventListener("input", () => {
    const text = input.value.trim();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (text.length < 2) {
      hide();
      return;
    }

    timeoutId = setTimeout(async () => {
      try {
        render(await fetchItems(text));
      } catch (_error) {
        hide();
      }
    }, 180);
  });

  input.addEventListener("keydown", (event) => {
    if (items.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      highlightSelected();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
      highlightSelected();
    }

    if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      pick(items[selectedIndex]);
    }

    if (event.key === "Escape") {
      hide();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".input-wrap")) {
      hide();
    }
  });

  return {
    hide
  };
}

export {
  createSuggestionsController
};
