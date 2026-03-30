function createNavigationView({ menuConsult, menuAdd, menuDelete, consultView, addView, deleteView, onViewChange }) {
  function setActiveView(view) {
    const showConsult = view === "consult";
    const showAdd = view === "add";
    const showDelete = view === "delete";

    consultView.classList.toggle("hidden", !showConsult);
    addView.classList.toggle("hidden", !showAdd);
    deleteView.classList.toggle("hidden", !showDelete);

    menuConsult.classList.toggle("active", showConsult);
    menuAdd.classList.toggle("active", showAdd);
    menuDelete.classList.toggle("active", showDelete);

    onViewChange(view);
  }

  menuConsult.addEventListener("click", () => setActiveView("consult"));
  menuAdd.addEventListener("click", () => setActiveView("add"));
  menuDelete.addEventListener("click", () => setActiveView("delete"));

  return {
    setActiveView
  };
}

export {
  createNavigationView
};
