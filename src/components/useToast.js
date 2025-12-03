export function useToast() {
  const root = document.getElementById("toast-root");

  function showToast(message, type = "info") {
    if (!root) return;

    const color =
      type === "error"
        ? "alert-error"
        : type === "success"
        ? "alert-success"
        : type === "warning"
        ? "alert-warning"
        : "alert-info";

    const el = document.createElement("div");
    el.className = `alert ${color} shadow-lg`;
    el.innerHTML = `<span>${message}</span>`;

    root.appendChild(el);

    // 自动消失
    setTimeout(() => {
      el.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => root.removeChild(el), 500);
    }, 2000);
  }

  return {
    info: (msg) => showToast(msg, "info"),
    success: (msg) => showToast(msg, "success"),
    warning: (msg) => showToast(msg, "warning"),
    error: (msg) => showToast(msg, "error"),
  };
}
