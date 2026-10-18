
/*
 * THE MYSTICAL BOX
 * Mission 1 — The Majestic Mirror Maze
 */


import {
  getProgress,
  isMissionCompleted,
  completeMissionOne,
  isMissionUnlocked
} from "./progress.js";

import {
  events
} from "../../../shared/mystical-events.js";

// ----------------------------------
// GAME ELEMENTS
// ----------------------------------

const panels = {
  adventure: document.getElementById("adventurePanel"),
  journal: document.getElementById("journalPanel"),
  events: document.getElementById("eventsPanel")
};


const stages = {
  intro: document.getElementById("stageIntro"),
  choose: document.getElementById("stageChoose"),
  challenge: document.getElementById("stageChallenge"),
  victory: document.getElementById("stageVictory"),
  chest: document.getElementById("stageChest"),
  epilogue: document.getElementById("stageEpilogue")
};


const challengeTitle =
  document.getElementById("challengeTitle");

const challengeStory =
  document.getElementById("challengeStory");

const challengeAnswers =
  document.getElementById("challengeAnswers");

const challengeFeedback =
  document.getElementById("challengeFeedback");

const characterLabel =
  document.getElementById("characterLabel");

let selectedHero = null;
let currentPuzzle = 0;
let puzzleLocked = false;

// ----------------------------------
// SCREEN NAVIGATION
// ----------------------------------

function showPanel(name) {
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle("hidden", key !== name);
  });

  if (name === "journal") {
    renderJournal();
  }

  if (name === "events") {
    renderEventBoard();
  }
}

function showStage(name) {
  Object.entries(stages).forEach(([key, stage]) => {
    stage.classList.toggle("hidden", key !== name);
  });
}

document.getElementById("navAdventure")
  .addEventListener("click", () => {
    showPanel("adventure");
  });

document.getElementById("navJournal")
  .addEventListener("click", () => {
    showPanel("journal");
  });

document.getElementById("navEvents")
  .addEventListener("click", () => {
    showPanel("events");
  });

// ----------------------------------
// MISSION START
// ----------------------------------

document.getElementById("beginMission")
  .addEventListener("click", () => {
    showStage("choose");
  });

document.querySelectorAll("[data-hero]")
  .forEach(button => {
    button.addEventListener("click", () => {
      selectedHero = button.dataset.hero;
      currentPuzzle = 0;
      puzzleLocked = false;
      renderPuzzle();
      showStage("challenge");
    });
  });

// ----------------------------------
// CHARACTER PATHS
// ----------------------------------

const puzzles = {
  olivia: [
    {
      title: "The Missing Reflection",
      story:
        "Olivia kneels beside a cracked violet mirror. " +
        "Three glowing shapes repeat across its surface: " +
        "triangle, circle, square, triangle, circle... " +
        "A trapped citizen whispers, 'Finish the pattern.'",
      answers: [
        "◇ Diamond",
        "□ Square",
        "○ Circle"
      ],
      correct: 1,
      success:
        "The square locks into place. A hidden doorway " +
        "opens behind the mirror."
    },
    {
      title: "The False Reflection",
      story:
        "Inside a hall of silver arches, three doors " +
        "show different reflections. One reflects " +
        "Olivia exactly. Another moves before she does. " +
        "The last shows a crown she never wore. " +
        "Which reflection can she trust?",
      answers: [
        "The reflection that moves before Olivia",
        "The reflection wearing the crown",
        "The reflection that matches Olivia"
      ],
      correct: 2,
      success:
        "The true reflection ripples. The trapped " +
        "citizens step through to freedom."
    }
  ],

  trevor: [
    {
      title: "The Voice Behind the Glass",
      story:
        "Trevor enters a corridor of blue glass. " +
        "Three reflections call for help. " +
        "One repeats his words. One asks him to " +
        "leave everyone behind. The third points " +
        "toward a frightened shape citizen. " +
        "Who needs Trevor's attention?",
      answers: [
        "The reflection repeating his words",
        "The reflection demanding he leave",
        "The frightened shape citizen"
      ],
      correct: 2,
      success:
        "Trevor reaches toward the citizen. " +
        "A protective circle of light appears."
    },
{
  title: "The Mirror That Cannot Lie",
  story:
    "A golden doorway appears in the corridor. " +
    "A mysterious voice whispers, " +
    "'Take the shortcut and escape.' " +
    "Behind Trevor, the trapped citizens begin " +
    "fading into the glass. What should he do?",


      answers: [
        "Take the crown and escape alone",
        "Stay and help the citizens",
        "Break every mirror without looking"
      ],
      correct: 1,
      success:
        "Trevor chooses the citizens. His courage " +
        "breaks Mirra's spell."
    }
  ]
};

// ----------------------------------
// PUZZLE ENGINE
// ----------------------------------

function renderPuzzle() {
  const puzzle = puzzles[selectedHero][currentPuzzle];

if (!puzzle) {
  const reveal = document.getElementById("mirraReveal");

  if (reveal) {
    reveal.classList.remove("is-revealed");
  }

  showStage("victory");

  if (reveal) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reveal.classList.add("is-revealed");
      });
    });
  }

  return;
}

  puzzleLocked = false;

  const heroName =
    selectedHero === "olivia" ? "OLIVIA" : "TREVOR";

  characterLabel.textContent =
    `${heroName} · CHALLENGE ${currentPuzzle + 1}`;

  challengeTitle.textContent = puzzle.title;
  challengeStory.textContent = puzzle.story;
  challengeFeedback.textContent = "";

  challengeAnswers.replaceChildren();

  puzzle.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    challengeAnswers.appendChild(button);
  });
}

function checkAnswer(answerIndex) {
  if (puzzleLocked) {
    return;
  }

  const puzzle = puzzles[selectedHero][currentPuzzle];

  if (answerIndex !== puzzle.correct) {
    challengeFeedback.textContent =
      "The mirror flickers. Look again!";
    return;
  }

  puzzleLocked = true;

  challengeFeedback.textContent = puzzle.success;

  challengeAnswers.querySelectorAll("button")
    .forEach(button => {
      button.disabled = true;
    });

  const continueButton = document.createElement("button");

  continueButton.className = "primary-button";
  continueButton.type = "button";
  continueButton.textContent = "Continue the Adventure →";

  continueButton.addEventListener("click", () => {
    currentPuzzle += 1;
    renderPuzzle();
  });

  challengeAnswers.appendChild(continueButton);
}

// ----------------------------------
// KEEPER'S CHEST
// ----------------------------------

document.getElementById("showChest")
  .addEventListener("click", () => {
    showStage("chest");
  });

document.getElementById("openChest")
  .addEventListener("click", () => {
    // One completion action saves the
    // mission, sigil, and badge together.
    const saved = completeMissionOne();

    if (!saved) {
      window.alert(
        "Your browser could not save your achievement. " +
        "Please check browser storage and try again."
      );
      return;
    }

    document.getElementById("chestRewards")
      .classList.remove("hidden");

    document.getElementById("openChest")
      .classList.add("hidden");
  });

document.getElementById("viewUnlockedEvent")
  .addEventListener("click", () => {
    showPanel("events");
  });

  
/* ----------------------------------
 * THE FIRST WHISPER
 * Mission 1 Cinematic Epilogue
 * ---------------------------------- */

const epilogueScenes = [
  {
    image: "M1epilogue-00.PNG",
    alt: "Olivia and Trevor meet the ShapeScientist.",
    text:
      "The ShapeScientist welcomed Olivia and Trevor " +
      "into his extraordinary laboratory.\n\n" +
      "He dreamed of creating geometric assistants " +
      "to help repair the damaged gateways.\n\n" +
      "“Perhaps the answer to getting you home " +
      "is a shape we haven't discovered yet!”"
  },
  {
    image: "M1epilogue-01.jpg",
    alt: "A mysterious visitor watches the laboratory.",
    text:
      "High above the laboratory, an unexpected " +
      "visitor watched the crystal machinery.\n\n" +
      "The Scientist was too busy working to notice."
  },
  {
    image: "M1epilogue-02.jpg",
    alt: "A secret exchange takes place.",
    text:
      "In a hidden corner, a smoky figure " +
      "offered the little apparition something strange.\n\n" +
      "A tiny fragment shimmered between them."
  },
  {
    image: "M1epilogue-03.jpg",
    alt: "The apparition approaches the machinery.",
    text:
      "The little apparition accepted the fragment.\n\n" +
      "Then it slipped quietly toward " +
      "the Scientist's newest invention."
  },
  {
    image: "M1epilogue-07.PNG",
    alt: "The apparition carries the fragment toward the crystal core.",
    text:
      "The crystal core glowed ahead.\n\n" +
      "The Scientist continued his work, " +
      "unaware of the visitor moving nearby."
  },
  {
    image: "M1epilogue-04.jpg",
    alt: "The invention core is secretly altered.",
    text:
      "The apparition slipped the fragment " +
      "into the invention core.\n\n" +
      "A thread of grey smoke disappeared " +
      "inside the violet crystal.\n\n" +
      "Its light flickered once."
  },
  {
    image: "M1epilogue-05.jpg",
    alt: "The first geometric assistant awakens.",
    text:
      "The ShapeScientist activated his first " +
      "experimental shape assistant.\n\n" +
      "“Wonderful! With enough helpers, " +
      "we might restore every gateway!”"
  },
  {
    image: "M1epilogue-06.jpg",
    alt: "The Scientist admires his new shape assistant.",
    text:
      "The little assistant smiled brightly.\n\n" +
      "The Scientist smiled back, unaware.\n\n" +
      "But deep inside the invention core, " +
      "something had already begun to grow."
  }
];

let epilogueSceneIndex = 0;

const epilogueImage =
  document.getElementById("epilogueImage");

const epilogueNarration =
  document.getElementById("epilogueNarration");

const epilogueCounter =
  document.getElementById("epilogueCounter");

const epilogueNext =
  document.getElementById("epilogueNext");

const epilogueEnding =
  document.getElementById("epilogueEnding");

function renderEpilogueScene() {
  const scene = epilogueScenes[epilogueSceneIndex];

  epilogueImage.src = "./assets/" + scene.image;
  epilogueImage.alt = scene.alt;

  epilogueNarration.textContent = scene.text;

  epilogueCounter.textContent =
    `STILL ${epilogueSceneIndex + 1} OF ${epilogueScenes.length}`;

  const finalScene =
    epilogueSceneIndex === epilogueScenes.length - 1;

  epilogueNext.textContent =
    finalScene ? "Finish the Story →" : "Next →";

  epilogueNext.classList.remove("hidden");
  epilogueEnding.classList.add("hidden");
}

function openEpilogue() {
  if (!isMissionUnlocked("mission-2")) {
    return;
  }

  epilogueSceneIndex = 0;
  renderEpilogueScene();

  showPanel("adventure");
  showStage("epilogue");
}

epilogueNext.addEventListener("click", () => {
  if (epilogueSceneIndex < epilogueScenes.length - 1) {
    epilogueSceneIndex += 1;
    renderEpilogueScene();
    return;
  }

  epilogueNext.classList.add("hidden");
  epilogueEnding.classList.remove("hidden");
});

document.getElementById("epilogueContinue")
  .addEventListener("click", () => {
    const status = document.getElementById(
      "epilogueContinueStatus"
    );

    status.textContent = isMissionUnlocked("mission-2")
      ? "Polygon Keep is unlocked! " +
        "Clank's adventure is coming next."
      : "Collect the Perception Sigil " +
        "to unlock Mission 2.";
  });

// Add access after the Mystical Box reward.
const epilogueRewardButton =
  document.createElement("button");

epilogueRewardButton.type = "button";
epilogueRewardButton.className = "primary-button";
epilogueRewardButton.textContent =
  "Read The First Whisper →";

epilogueRewardButton.addEventListener(
  "click",
  openEpilogue
);

document.getElementById("chestRewards")
  .appendChild(epilogueRewardButton);

// Returning players can read the epilogue
// without replaying Mission 1.
if (isMissionUnlocked("mission-2")) {
  const returnButton =
    document.createElement("button");

  returnButton.type = "button";
  returnButton.className = "primary-button";
  returnButton.textContent =
    "Read The First Whisper →";

  returnButton.addEventListener(
    "click",
    openEpilogue
  );

  stages.intro.appendChild(returnButton);
}

// ----------------------------------
// MISSION JOURNAL
// ----------------------------------

function renderJournal() {
  const progress = getProgress();
  const journal = document.getElementById("journalContent");

  journal.replaceChildren();

  const completed =
    progress.completedMissions.includes("mission-1");

  const heading = document.createElement("h3");
  heading.textContent = completed
    ? "◇ The Perception Sigil"
    : "◇ Perception Sigil — Not Yet Collected";

  const description = document.createElement("p");
  description.textContent = completed
    ? "The Majestic Mirror Maze has been restored. " +
      "You earned the Mirror of True Seeing " +
      "and the Mirror Maze Restorer badge."
    : "Enter the Majestic Mirror Maze and open " +
      "the Keeper's Chest to earn your first sigil.";

  journal.append(heading, description);

  if (completed) {
    const badge = document.createElement("p");
    badge.className = "success";
    badge.textContent = "🏅 Mirror Maze Restorer";
    journal.appendChild(badge);
  }
}

// ----------------------------------
// EVENT BOARD
// ----------------------------------

function hasPassed(dateString) {
  if (!dateString) {
    return false;
  }

  const timestamp = Date.parse(dateString);

  return Number.isFinite(timestamp) &&
    Date.now() >= timestamp;
}

function addEventLine(container, label, value) {
  const line = document.createElement("p");

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  line.appendChild(strong);
  line.appendChild(
    document.createTextNode(value || "To be announced")
  );

  container.appendChild(line);
}

function renderEventBoard() {
  const board = document.getElementById("eventBoardContent");

  board.replaceChildren();

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.textContent =
      "New community experiences are coming soon.";
    board.appendChild(empty);
    return;
  }

  events.forEach(event => {
    const missionUnlocked =
      isMissionCompleted(event.missionId);

    const publiclyRevealed =
      hasPassed(event.publicRevealAt);

    const archived =
      hasPassed(event.eventEndsAt);

    const showDetails =
      missionUnlocked || publiclyRevealed;

    const card = document.createElement("article");
    card.className = "event-card";

    const status = document.createElement("div");
    status.className = "status-label";

    status.textContent = archived
      ? "EVENT ARCHIVE"
      : missionUnlocked
        ? "MISSION DISCOVERY UNLOCKED"
        : publiclyRevealed
          ? "PUBLIC ANNOUNCEMENT"
          : "MYSTERY EVENT";

    const title = document.createElement("h3");

    title.textContent = showDetails
      ? event.name
      : "A New Experience Is Approaching...";

    card.append(status, title);

    if (showDetails) {
      addEventLine(card, "Date", event.date);
      addEventLine(card, "Location", event.location);
    } else {
      const teaser = document.createElement("p");
      teaser.textContent =
        "Complete the connected mission to " +
        "discover event details before the " +
        "public announcement.";
      card.appendChild(teaser);
    }

    if (missionUnlocked) {
      addEventLine(
        card,
        "Mission Giveaway Password",
        event.giveawayPassword
      );
    }

   
    // RSVP reminder and button for Majestic events.
    // Available regardless of mission completion
    // or public announcement status.
    if (event.rsvpUrl) {
      const reminder = document.createElement("p");

      reminder.textContent =
        event.rsvpReminder ||
        "Reminder: RSVP to participate in the giveaway.";

      card.appendChild(reminder);

      const rsvpButton = document.createElement("a");

      rsvpButton.href = event.rsvpUrl;
      rsvpButton.textContent = "RSVP for the Giveaway →";
      rsvpButton.target = "_blank";
      rsvpButton.rel = "noopener noreferrer";

      rsvpButton.className = "primary-button";

      rsvpButton.style.display = "inline-block";
      rsvpButton.style.textDecoration = "none";
      rsvpButton.style.textAlign = "center";

      card.appendChild(rsvpButton);
    }


    if (archived) {
      const archiveNote = document.createElement("p");

      archiveNote.textContent =
        "This event has concluded. " +
        "Your mission achievements remain saved.";

      card.appendChild(archiveNote);
    }

    board.appendChild(card);
  });
}

// ----------------------------------
// RETURNING PLAYER
// ----------------------------------

function initializeGame() {
  showPanel("adventure");

  if (isMissionCompleted("mission-1")) {
    const message = document.createElement("p");

    message.className = "success";
    message.textContent =
      "◇ Perception Sigil already collected! " +
      "You can replay this mission anytime.";

    stages.intro.prepend(message);
  }
}

initializeGame();

    