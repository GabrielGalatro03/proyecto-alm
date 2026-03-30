import { setMessage } from "../ui/messages.js";
import { createSuggestionsController } from "../ui/suggestions.js";

function createConsultView({
  form,
  input,
  result,
  suggestionsPanel,
  suggestionsList,
  updateFlow,
  updatePriceForm,
  newPriceInput,
  yesButton,
  noButton,
  fetchPrice,
  updatePrice,
  fetchSuggestions
}) {
  let currentProductName = "";

  const suggestions = createSuggestionsController({
    input,
    panel: suggestionsPanel,
    list: suggestionsList,
    fetchItems: fetchSuggestions,
    onPick: () => {}
  });

  function hideUpdateFlow() {
    updateFlow.classList.add("hidden");
    updatePriceForm.classList.add("hidden");
    newPriceInput.value = "";
  }

  function showUpdateFlow(productName) {
    currentProductName = productName;
    updateFlow.classList.remove("hidden");
    updatePriceForm.classList.add("hidden");
    newPriceInput.value = "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const productName = input.value.trim();
    if (!productName) {
      setMessage(result, "Ingresa un nombre de producto", "error");
      return;
    }

    setMessage(result, "Buscando precio...");
    hideUpdateFlow();

    try {
      const data = await fetchPrice(productName);
      setMessage(result, `El precio de ${data.name} es $${data.price} ${data.currency}`, "ok");
      showUpdateFlow(data.name);
    } catch (error) {
      setMessage(result, error.message, "error");
      hideUpdateFlow();
    }
  });

  yesButton.addEventListener("click", () => {
    if (!currentProductName) {
      return;
    }

    updatePriceForm.classList.remove("hidden");
    newPriceInput.focus();
  });

  noButton.addEventListener("click", () => {
    hideUpdateFlow();
  });

  updatePriceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nextPrice = Number(newPriceInput.value);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      setMessage(result, "Ingresa un precio valido mayor o igual a 0", "error");
      return;
    }

    try {
      const updated = await updatePrice(currentProductName, nextPrice);
      setMessage(result, `Precio actualizado: ${updated.name} ahora vale $${updated.price} ${updated.currency}`, "ok");
      hideUpdateFlow();
    } catch (error) {
      setMessage(result, error.message, "error");
    }
  });

  return {
    hideTransientUi() {
      suggestions.hide();
    }
  };
}

export {
  createConsultView
};
