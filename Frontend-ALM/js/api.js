const API_BASE_URL =
  window.location.origin && window.location.origin !== "null"
    ? window.location.origin
    : "http://localhost:3000";

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error inesperado en la API");
  }

  return data;
}

function fetchPrice(productName) {
  return requestJson(`${API_BASE_URL}/api/products/price?name=${encodeURIComponent(productName)}`);
}

function fetchSuggestions(text, limit = 8) {
  return requestJson(
    `${API_BASE_URL}/api/products/suggest?query=${encodeURIComponent(text)}&limit=${encodeURIComponent(limit)}`
  ).then((data) => data.suggestions || []);
}

function updatePrice(name, price) {
  return requestJson(`${API_BASE_URL}/api/products/price`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, price })
  });
}

function createProduct(name, price) {
  return requestJson(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, price })
  });
}

function deleteProduct(name) {
  return requestJson(`${API_BASE_URL}/api/products?name=${encodeURIComponent(name)}`, {
    method: "DELETE"
  });
}

function login(username, password) {
  return requestJson(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
}

function logout() {
  return requestJson(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST"
  });
}

function me() {
  return requestJson(`${API_BASE_URL}/api/auth/me`);
}

export {
  fetchPrice,
  fetchSuggestions,
  updatePrice,
  createProduct,
  deleteProduct,
  login,
  logout,
  me
};
