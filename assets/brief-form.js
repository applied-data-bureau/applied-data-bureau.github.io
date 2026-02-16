"use strict";

(function () {
  var form = document.querySelector("[data-brief-form]");
  if (!form) {
    return;
  }

  var contactInput = form.querySelector('input[name="contact"]');
  var taskInput = form.querySelector('textarea[name="task"]');
  var startedAtInput = form.querySelector('input[name="form_started_at"]');
  var statusBox = form.querySelector(".brief-form-status");
  var submitButton = form.querySelector('button[type="submit"]');
  var defaultButtonLabel = submitButton ? submitButton.getAttribute("data-submit-label") : "";
  var loadingButtonLabel = submitButton ? submitButton.getAttribute("data-submit-loading") : "";
  var fallbackEndpoint = form.getAttribute("data-endpoint-fallback");

  if (!contactInput || !taskInput || !statusBox || !submitButton) {
    return;
  }

  function updateStartedAt() {
    if (startedAtInput) {
      startedAtInput.value = String(Date.now());
    }
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

  function validateField(input) {
    var value = input.value ? input.value.trim() : "";
    var min = Number(input.getAttribute("minlength")) || 0;
    var max = Number(input.getAttribute("maxlength")) || Number.MAX_SAFE_INTEGER;
    var isValid = value.length >= min && value.length <= max;

    if (!isValid) {
      input.classList.add("is-invalid");
    }

    return isValid;
  }

  contactInput.addEventListener("input", function () {
    clearInvalidState(contactInput);
  });

  taskInput.addEventListener("input", function () {
    clearInvalidState(taskInput);
  });

  updateStartedAt();

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideStatus();

    var isContactValid = validateField(contactInput);
    var isTaskValid = validateField(taskInput);
    if (!isContactValid || !isTaskValid) {
      showStatus("is-error", statusBox.getAttribute("data-validation-error"));
      return;
    }

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

          if (!response.ok) {
            lastErrorMessage = payload && typeof payload.error === "string"
              ? payload.error
              : statusBox.getAttribute("data-server-error");
            continue;
          }

          showStatus("is-success", statusBox.getAttribute("data-success"));
          form.reset();
          updateStartedAt();
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
