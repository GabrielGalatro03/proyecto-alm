function setMessage(target, message, type) {
  target.textContent = message;
  target.classList.remove("ok", "error");

  if (type) {
    target.classList.add(type);
  }
}

export {
  setMessage
};
