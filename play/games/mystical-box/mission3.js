
import {
  completeMission,
  isMissionCompleted,
  isMissionUnlocked
} from "./progress.js";

const MISSION_ID = "mission-3";

const screens = [
  "m3Intro",
  "m3Choose",
  "m3Challenge",
  "m3Reveal",
  "m3Victory",
  "m3Chest",
  "m3Cliffhanger"
];

const $ = (id) => document.getElementById(id);

let hero = null;
let challengeIndex = 0;
let challengesSolved = false;
let initialized = false;

const challenges = {
  olivia: [
    {
      title: "The Missing Recipe",
      story: "In Crystal Palm Kitchen, the recipe tiles read △ ○ △ ?. Which shape completes the pattern?",
      answers: ["△ Triangle", "○ Circle", "□ Square"],
      correct: 1,
      success: "The pattern is restored! Three runaway bowls stop spinning."
    },
    {
      title: "The Feast Portions",
      story: "On Floating Spice Bridge, the recipe needs two triangle peppers for every one circle fruit. You have six peppers. How many fruits are needed?",
      answers: ["2 fruits", "3 fruits", "6 fruits"],
      correct: 1,
      success: "The ingredients return to their baskets. Olivia hears the island drums moving in rhythm."
    }
  ],
  trevor: [
    {
      title: "The Rescue Route",
      story: "A serving cart blocks the bridge. Three citizens are stranded. What's the safest rescue plan?",
      answers: [
        "Jump onto the cart and hope it stops.",
        "Ask cooks to secure the bridge while guiding citizens across.",
        "Wait for the cart to disappear."
      ],
      correct: 1,
      success: "The bridge is secured and the citizens are safe!"
    },
    {
      title: "The Rhythm of Unity",
      story: "The runaway utensils stumble whenever the islanders work together. What should Trevor do?",
      answers: [
        "Have everyone work alone as fast as possible.",
        "Shout louder than the mysterious voice.",
        "Give each group a task and coordinate to the same drumbeat."
      ],
      correct: 2,
      success: "The islanders move together. The utensils begin to slow!"
    }
  ]
};

function showScreen(id) {
  screens.forEach((name) => {
    const screen = $(name);
    if (screen) {
      screen.classList.toggle("hidden", name !== id);
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderChallenge() {
  const challenge = challenges[hero][challengeIndex];

  $("m3ChallengeTitle").textContent = challenge.title;
  $("m3ChallengeStory").textContent = challenge.story;

  const feedback = $("m3ChallengeFeedback");
  feedback.textContent = "";
  feedback.className = "feedback";

  const answers = $("m3ChallengeAnswers");
  answers.replaceChildren();

  challenge.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = answer;

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    answers.appendChild(button);
  });

  showScreen("m3Challenge");
}

function checkAnswer(answerIndex) {
  const challenge = challenges[hero][challengeIndex];
  const feedback = $("m3ChallengeFeedback");
  const answers = $("m3ChallengeAnswers");

  if (answerIndex !== challenge.correct) {
    feedback.textContent =
      "Not quite. Look for the safest or most balanced choice.";
    feedback.className = "feedback error";
    return;
  }

  feedback.textContent = challenge.success;
  feedback.className = "feedback success";

  answers.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

  const next = document.createElement("button");
  next.className = "primary-button";
  next.type = "button";
  next.textContent = "Continue →";

  next.addEventListener("click", () => {
    challengeIndex += 1;

    if (challengeIndex < challenges[hero].length) {
      renderChallenge();
    } else {
      challengesSolved = true;
      showScreen("m3Reveal");
    }
  });

  answers.appendChild(next);
}

function chooseHero(selectedHero) {
  if (!isMissionUnlocked(MISSION_ID)) return;

  hero = selectedHero;
  challengeIndex = 0;
  challengesSolved = false;

  $("m3CharacterLabel").textContent =
    selectedHero === "olivia"
      ? "OLIVIA · RECIPE DETECTIVE"
      : "TREVOR · ISLAND PROTECTOR";

  renderChallenge();
}

function openMysticalBox() {
  const message = $("m3RewardMessage");
  const rewards = $("m3ChestRewards");

  if (!challengesSolved || !isMissionUnlocked(MISSION_ID)) {
    message.textContent =
      "Complete your mission before collecting the reward.";
    return;
  }

  if (!isMissionCompleted(MISSION_ID)) {
    const success = completeMission(MISSION_ID);

    if (!success) {
      message.textContent =
        "The reward could not be saved. Please try again.";
      return;
    }
  }

  message.textContent =
    "Unity Sigil ○ collected! Mission 4 is now unlocked.";

  rewards.classList.remove("hidden");
  $("m3OpenChestBtn").disabled = true;
}

export function initMission3() {
  if (initialized) return;

  const panel = $("mission3Panel");
  if (!panel) return;

  initialized = true;

  $("m3StartBtn").addEventListener("click", () => {
    showScreen("m3Choose");
  });

  $("m3OliviaBtn").addEventListener("click", () => {
    chooseHero("olivia");
  });

  $("m3TrevorBtn").addEventListener("click", () => {
    chooseHero("trevor");
  });

  $("m3VictoryBtn").addEventListener("click", () => {
    if (challengesSolved) {
      showScreen("m3Victory");
    }
  });

  $("m3ChestBtn").addEventListener("click", () => {
    if (challengesSolved) {
      showScreen("m3Chest");
    }
  });

  $("m3OpenChestBtn").addEventListener(
    "click",
    openMysticalBox
  );

  $("m3CliffhangerBtn").addEventListener("click", () => {
    if (isMissionCompleted(MISSION_ID)) {
      showScreen("m3Cliffhanger");
    }
  });

  // Event Board and mission-selection navigation
  // will be connected through the existing game.js.
}

export function startMission3() {
  if (!isMissionUnlocked(MISSION_ID)) {
    return false;
  }

  initMission3();

  const panel = $("mission3Panel");
  if (!panel) return false;

  panel.hidden = false;

  hero = null;
  challengeIndex = 0;
  challengesSolved = false;

  $("m3ChestRewards").classList.add("hidden");
  $("m3OpenChestBtn").disabled = false;
  $("m3RewardMessage").textContent = "";

  showScreen("m3Intro");

  return true;
}
