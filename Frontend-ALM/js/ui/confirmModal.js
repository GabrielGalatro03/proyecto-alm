function createConfirmModal({ modal, messageNode, acceptButton, cancelButton }) {
  let resolver = null;

  function close(confirmed) {
    modal.classList.add("hidden");

    if (resolver) {
      resolver(confirmed);
      resolver = null;
    }
  }

  function ask(message) {
    messageNode.textContent = message;
    modal.classList.remove("hidden");

    return new Promise((resolve) => {
      resolver = resolve;
      acceptButton.focus();
    });
  }

  acceptButton.addEventListener("click", () => close(true));
  cancelButton.addEventListener("click", () => close(false));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      close(false);
    }
  });

  return {
    ask,
    close
  };
}

export {
  createConfirmModal
};
