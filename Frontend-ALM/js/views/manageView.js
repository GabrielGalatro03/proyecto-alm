import { setMessage } from "../ui/messages.js";
import { createSuggestionsController } from "../ui/suggestions.js";

function createManageView({
  addProductForm,
  addProductNameInput,
  addProductPriceInput,
  addResult,
  deleteProductForm,
  deleteProductNameInput,
  deleteResult,
  deleteSuggestionsPanel,
  deleteSuggestionsList,
  createProduct,
  deleteProduct,
  fetchSuggestions,
  confirmModal
}) {
  const deleteSuggestions = createSuggestionsController({
    input: deleteProductNameInput,
    panel: deleteSuggestionsPanel,
    list: deleteSuggestionsList,
    fetchItems: fetchSuggestions,
    onPick: () => {}
  });

  addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = addProductNameInput.value.trim();
    const price = Number(addProductPriceInput.value);

    if (!name) {
      setMessage(addResult, "Ingresa un nombre de producto", "error");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setMessage(addResult, "Ingresa un precio valido mayor o igual a 0", "error");
      return;
    }

    setMessage(addResult, "Agregando producto...");

    try {
      const created = await createProduct(name, price);
      setMessage(addResult, `Producto agregado: ${created.name} con precio $${created.price} ${created.currency}`, "ok");
      addProductForm.reset();
    } catch (error) {
      setMessage(addResult, error.message, "error");
    }
  });

  deleteProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = deleteProductNameInput.value.trim();
    if (!name) {
      setMessage(deleteResult, "Ingresa un nombre de producto", "error");
      return;
    }

    const confirmDelete = await confirmModal.ask(`Seguro que deseas eliminar ${name}?`);
    if (!confirmDelete) {
      setMessage(deleteResult, "Eliminacion cancelada", "ok");
      return;
    }

    setMessage(deleteResult, "Eliminando producto...");

    try {
      const deleted = await deleteProduct(name);
      setMessage(deleteResult, `${deleted.message}: ${deleted.product.name}`, "ok");
      deleteProductForm.reset();
    } catch (error) {
      setMessage(deleteResult, error.message, "error");
    }
  });

  return {
    hideTransientUi() {
      deleteSuggestions.hide();
    }
  };
}

export {
  createManageView
};
