(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".main-menu");

  if (!toggle || !menu) {
    return;
  }

  var media = window.matchMedia("(max-width: 767px)");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function toggleMenu() {
    if (menu.classList.contains("is-open")) {
      closeMenu();
      return;
    }
    openMenu();
  }

  function syncWithViewport() {
    if (!media.matches) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", toggleMenu);

  menu.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (link && media.matches) {
      closeMenu();
    }
  });

  window.addEventListener("resize", syncWithViewport);
  syncWithViewport();
})();
