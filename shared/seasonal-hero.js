
/* MeHeartMe Seasonal Hero — Color Engine v1.0 */

(function () {
  "use strict";

  const config = window.MeHeartMeSeasonConfig;
  if (!config || !Array.isArray(config.stages)) return;

  const root = document.documentElement;

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

if (!stage) {
  root.removeAttribute("data-me-season");
  return;
}
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
