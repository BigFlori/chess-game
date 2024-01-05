const createAlert = (message, type) => {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("alert-" + type);
  alert.classList.add("alert-dismissible");
  alert.classList.add("fade");
  alert.classList.add("show");
  alert.classList.add("mt-4");
  alert.setAttribute("role", "alert");
  alert.innerHTML = message;
  const button = document.createElement("button");
  button.classList.add("btn-close");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-dismiss", "alert");
  button.setAttribute("aria-label", "Close");
  alert.appendChild(button);
  return alert;
};
