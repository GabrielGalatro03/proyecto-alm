import { fetchPrice, fetchSuggestions, updatePrice, createProduct, deleteProduct, login, logout, me } from "./js/api.js";
import { createConfirmModal } from "./js/ui/confirmModal.js";
import { createNavigationView } from "./js/views/navigationView.js";
import { createConsultView } from "./js/views/consultView.js";
import { createManageView } from "./js/views/manageView.js";
import { setMessage } from "./js/ui/messages.js";

const authGate = document.getElementById("auth-gate");
const appShell = document.querySelector(".app-shell");
const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const loginResult = document.getElementById("login-result");
const logoutButton = document.getElementById("logout-btn");

const confirmModal = createConfirmModal({
  modal: document.getElementById("confirm-modal"),
  messageNode: document.getElementById("confirm-message"),
  acceptButton: document.getElementById("confirm-accept"),
  cancelButton: document.getElementById("confirm-cancel")
});

const consultView = createConsultView({
  form: document.getElementById("price-form"),
  input: document.getElementById("product-name"),
  result: document.getElementById("result"),
  suggestionsPanel: document.getElementById("suggestions-panel"),
  suggestionsList: document.getElementById("suggestions-list"),
  updateFlow: document.getElementById("update-flow"),
  updatePriceForm: document.getElementById("update-price-form"),
  newPriceInput: document.getElementById("new-price"),
  yesButton: document.getElementById("confirm-update-yes"),
  noButton: document.getElementById("confirm-update-no"),
  fetchPrice,
  updatePrice,
  fetchSuggestions
});

const manageView = createManageView({
  addProductForm: document.getElementById("add-product-form"),
  addProductNameInput: document.getElementById("add-product-name"),
  addProductPriceInput: document.getElementById("add-product-price"),
  addResult: document.getElementById("add-result"),
  deleteProductForm: document.getElementById("delete-product-form"),
  deleteProductNameInput: document.getElementById("delete-product-name"),
  deleteResult: document.getElementById("delete-result"),
  deleteSuggestionsPanel: document.getElementById("delete-suggestions-panel"),
  deleteSuggestionsList: document.getElementById("delete-suggestions-list"),
  createProduct,
  deleteProduct,
  fetchSuggestions,
  confirmModal
});

const navigation = createNavigationView({
  menuConsult: document.getElementById("menu-consult"),
  menuAdd: document.getElementById("menu-add"),
  menuDelete: document.getElementById("menu-delete"),
  consultView: document.getElementById("consult-view"),
  addView: document.getElementById("add-view"),
  deleteView: document.getElementById("delete-view"),
  onViewChange() {
    consultView.hideTransientUi();
    manageView.hideTransientUi();
  }
});

function setAuthenticatedUi(isAuthenticated) {
  authGate.classList.toggle("hidden", isAuthenticated);
  appShell.classList.toggle("hidden", !isAuthenticated);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    setMessage(loginResult, "Completa usuario y contrasena", "error");
    return;
  }

  setMessage(loginResult, "Ingresando...");

  try {
    await login(username, password);
    loginForm.reset();
    setMessage(loginResult, "", null);
    setAuthenticatedUi(true);
    navigation.setActiveView("consult");
  } catch (error) {
    setMessage(loginResult, error.message, "error");
  }
});

logoutButton.addEventListener("click", async () => {
  await logout();
  setAuthenticatedUi(false);
});

async function bootstrap() {
  try {
    await me();
    setAuthenticatedUi(true);
    navigation.setActiveView("consult");
  } catch (_error) {
    setAuthenticatedUi(false);
  }
}

bootstrap();
