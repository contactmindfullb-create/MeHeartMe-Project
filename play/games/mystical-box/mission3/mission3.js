
import {
  completeMission,
  isMissionCompleted,
  isMissionUnlocked
} from "../progress.js";

const MISSION_ID = "mission-3";

const screens = [
  "locked", "intro", "choose", "challenge",
  "reveal", "victory", "chest", "cliffhanger"
];

const $ = (id) => document.getElementById(id);

let hero = null;
let challengeIndex = 0;
let challengesSolved = false;

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
    $(name).classList.toggle("hidden", name !== id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderChallenge() {
  const challenge = challenges[hero][challengeIndex];

  $("challengeTitle").textContent = challenge.title;
  $("challengeStory").textContent = challenge.story;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("answers").replaceChildren();

  challenge.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = answer;
    button.addEventListener("click", () => checkAnswer(index));
    $("answers").appendChild(button);
  });

  showScreen("challenge");
}

function checkAnswer(answerIndex) {
  const challenge = challenges[hero][challengeIndex];

  if (answerIndex !== challenge.correct) {
    $("feedback").textContent = "Not quite. Look for the safest or most balanced choice.";
    $("feedback").className = "feedback error";
    return;
  }

  $("feedback").textContent = challenge.success;
  $("feedback").className = "feedback success";

  $("answers").querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

  const next = document.createElement("button");
  next.textContent = "Continue →";
  next.addEventListener("click", () => {
    challengeIndex += 1;

    if (challengeIndex < challenges[hero].length) {
      renderChallenge();
    } else {
      challengesSolved = true;
      showScreen("reveal");
    }
  });

  $("answers").appendChild(next);
}

function chooseHero(selectedHero) {
  hero = selectedHero;
  challengeIndex = 0;
  challengesSolved = false;
  renderChallenge();
}

function openMysticalBox() {
  if (!challengesSolved || !isMissionUnlocked(MISSION_ID)) {
    $("rewardMessage").textContent =
      "Complete your mission before collecting the reward.";
    return;
  }

  if (isMissionCompleted(MISSION_ID)) {
    $("rewardMessage").textContent =
      "Unity Sigil ○ already collected. Your progress is safe!";
    $("cliffhangerBtn").classList.remove("hidden");
    return;
  }

  const success = completeMission(MISSION_ID);

  if (!success) {
    $("rewardMessage").textContent =
      "The reward could not be saved. Please try again.";
    return;
  }

  $("rewardMessage").textContent =
    "Unity Sigil ○ collected! Mission 4 is now unlocked.";
  $("openChestBtn").disabled = true;
  $("cliffhangerBtn").classList.remove("hidden");
}

$("startBtn").addEventListener("click", () => showScreen("choose"));
$("oliviaBtn").addEventListener("click", () => chooseHero("olivia"));
$("trevorBtn").addEventListener("click", () => chooseHero("trevor"));

$("victoryBtn").addEventListener("click", () => showScreen("victory"));
$("chestBtn").addEventListener("click", () => showScreen("chest"));
$("openChestBtn").addEventListener("click", openMysticalBox);

$("cliffhangerBtn").addEventListener("click", () => {
  showScreen("cliffhanger");
});

if (!isMissionUnlocked(MISSION_ID)) {
  showScreen("locked");
} else {
  showScreen("intro");
}
