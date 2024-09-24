document.addEventListener("DOMContentLoaded", function () {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0,
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener("click", function () {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

// initialize default value
function getTheme() {
  return localStorage.getItem("theme") ? localStorage.getItem("theme") : null;
}

function setTheme(style) {
  document.documentElement.setAttribute("data-theme", style);
  localStorage.setItem("theme", style);
}

function init() {
  // initialize default value
  const theme = getTheme();

  if (theme === null) {
    if (!document.documentElement.getAttribute("data-theme")) {
      setTheme("dark");
    } else {
      setTheme(document.documentElement.getAttribute("data-theme"));
    }
  } else {
    // load a stored theme
    if (theme === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }
}

// switch themes
function switchTheme() {
  const theme = getTheme();
  if (theme === "light") {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const themeSwitcher = document.querySelector(".theme-switch");
    themeSwitcher.addEventListener("click", switchTheme, false);
  },
  false,
);

init();
