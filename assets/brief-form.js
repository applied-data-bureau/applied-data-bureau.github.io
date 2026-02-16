"use strict";

(function () {
  var form = document.querySelector("[data-brief-form]");
  if (!form) {
    return;
  }

  var contactInput = form.querySelector('input[name="contact"]');
  var taskInput = form.querySelector('textarea[name="task"]');
  var statusBox = form.querySelector(".brief-form-status");
  var submitButton = form.querySelector('button[type="submit"]');
  var defaultButtonLabel = submitButton ? submitButton.getAttribute("data-submit-label") : "";
  var loadingButtonLabel = submitButton ? submitButton.getAttribute("data-submit-loading") : "";
  var fallbackEndpoint = form.getAttribute("data-endpoint-fallback");

  if (!contactInput || !taskInput || !statusBox || !submitButton) {
    return;
  }

  function clearInvalidState(input) {
    input.classList.remove("is-invalid");
  }

  function showStatus(type, message) {
    if (!statusBox) {
      return;
    }

    statusBox.classList.remove("is-success", "is-error", "is-loading");
    statusBox.classList.add(type);
    statusBox.textContent = message;
    statusBox.hidden = false;
  }

  function hideStatus() {
    if (!statusBox) {
      return;
    }
    statusBox.hidden = true;
    statusBox.textContent = "";
    statusBox.classList.remove("is-success", "is-error", "is-loading");
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) {
      return;
    }
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? loadingButtonLabel : defaultButtonLabel;
  }

  function normalizeServerError(message) {
    if (!message || typeof message !== "string") {
      return statusBox.getAttribute("data-server-error");
    }

    if (message === "Contact is invalid.") {
      return statusBox.getAttribute("data-contact-error") || statusBox.getAttribute("data-validation-error");
    }
    if (message === "Task description is invalid.") {
      return statusBox.getAttribute("data-task-error") || statusBox.getAttribute("data-validation-error");
    }
    if (message === "Invalid form data.") {
      return statusBox.getAttribute("data-invalid-form-error") || statusBox.getAttribute("data-validation-error");
    }

    return message;
  }

  contactInput.addEventListener("input", function () {
    clearInvalidState(contactInput);
  });

  taskInput.addEventListener("input", function () {
    clearInvalidState(taskInput);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideStatus();

    var formData = new FormData(form);
    setSubmitting(true);
    showStatus("is-loading", statusBox.getAttribute("data-sending"));

    var endpoints = [form.action];
    if (fallbackEndpoint && fallbackEndpoint !== form.action) {
      endpoints.push(fallbackEndpoint);
    }

    var lastErrorMessage = statusBox.getAttribute("data-network-error");

    try {
      for (var i = 0; i < endpoints.length; i += 1) {
        var endpoint = endpoints[i];

        try {
          var response = await fetch(endpoint, {
            method: "POST",
            body: formData
          });

          var payload = null;
          try {
            payload = await response.json();
          } catch (jsonError) {
            payload = null;
          }

          if (!response.ok || (payload && payload.ok === false)) {
            lastErrorMessage = normalizeServerError(payload && payload.error);
            continue;
          }

          showStatus("is-success", statusBox.getAttribute("data-success"));
          form.reset();
          return;
        } catch (fetchError) {
          lastErrorMessage = statusBox.getAttribute("data-network-error");
        }
      }

      showStatus("is-error", lastErrorMessage);
    } finally {
      setSubmitting(false);
    }
  });
})();
