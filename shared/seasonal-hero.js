
/* MeHeartMe Seasonal Hero — Color Engine v1.0 */

(function () {
  "use strict";

  const config = window.MeHeartMeSeasonConfig;
  if (!config || !Array.isArray(config.stages)) return;

  const root = document.documentElement;
  
/* Seasonal background and overlay renderer */

const heroImage = document.querySelector(".event-banner");
let heroOverlay = null;
let imageVersion = 0;

if (heroImage) {
  const heroWrapper = document.createElement("div");
  heroWrapper.className = "seasonal-visual";

  heroImage.parentNode.insertBefore(heroWrapper, heroImage);
  heroWrapper.appendChild(heroImage);

  heroOverlay = document.createElement("img");
  heroOverlay.className = "seasonal-overlay";
  heroOverlay.alt = "";
  heroOverlay.setAttribute("aria-hidden", "true");
  heroOverlay.hidden = true;

  heroWrapper.appendChild(heroOverlay);
}

const defaultHeroImage = heroImage
  ? heroImage.getAttribute("src")
  : "";

function loadSeasonalImages(stage) {
  if (!heroImage) return;

  const version = ++imageVersion;
  const background = stage?.image || defaultHeroImage;
  const overlayPath = stage?.overlay;

  // Apply background only after successful loading.
  const backgroundTest = new Image();

  backgroundTest.onload = function () {
    if (version === imageVersion) {
      heroImage.src = background;
    }
  };

  backgroundTest.onerror = function () {
    if (version === imageVersion) {
      heroImage.src = defaultHeroImage;
    }
  };

  backgroundTest.src = background;

  // Reset the previous overlay.
  heroOverlay.hidden = true;
  heroOverlay.removeAttribute("src");

  if (!overlayPath) return;

  // Show decoration only after successful loading.
  const overlayTest = new Image();

  overlayTest.onload = function () {
    if (version === imageVersion) {
      heroOverlay.src = overlayPath;
      heroOverlay.hidden = false;
    }
  };

  overlayTest.src = overlayPath;
}


  const cssVariables = {
    night: "--event-night",
    panel: "--event-purple",
    gold: "--event-gold",
    button: "--event-orange",
    buttonText: "--season-button-text",
    text: "--season-text"
  };

  const defaults = {};

  Object.values(cssVariables).forEach(function (variable) {
    defaults[variable] = root.style.getPropertyValue(variable);
  });

  function getDate() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    parts.forEach(function (part) {
      values[part.type] = part.value;
    });

    return (
      values.year + "-" +
      values.month + "-" +
      values.day
    );
  }

  function applySeason() {
    const today = getDate();
    
const countdown =
  document.getElementById("countdown-container");

function updateCountdownDecoration(stage) {
  if (!countdown) return;

  // Decorations stop when the Christmas event arrives.
  // The countdown itself remains unchanged.
  const eventHasStarted = today >= "2026-12-19";

  if (
    !stage ||
    !stage.decoration ||
    eventHasStarted
  ) {
    countdown.removeAttribute("data-decoration");
    return;
  }

  countdown.setAttribute(
    "data-decoration",
    stage.decoration
  );
}

    const stage = config.stages.find(function (item) {
      return today >= item.start && today < item.end;
    });

    Object.values(cssVariables).forEach(function (variable) {
      root.style.removeProperty(variable);
    });

    updateCountdownDecoration(stage);
loadSeasonalImages(stage);

if (!stage) {
  root.removeAttribute("data-me-season");
  return;
}


    Object.entries(cssVariables).forEach(function (entry) {
      const color = stage.colors[entry[0]];

      if (color) {
        root.style.setProperty(entry[1], color);
      }
    });

    root.setAttribute("data-me-season", stage.name);
  }

  applySeason();

  // Recheck periodically if a visitor leaves the page open.
  setInterval(applySeason, 60 * 60 * 1000);

  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) applySeason();
    }
  );
})();
