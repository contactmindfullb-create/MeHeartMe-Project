/* ==========================================
   MISSION 2 — THE MYSTERY OF POLYGON KEEP
   Add BELOW initializeGame();
   ========================================== */

import {
  completeMission,
  isMissionCompleted,
  isMissionUnlocked
} from "./progress.js";

const panels = {
  adventure: document.getElementById("adventurePanel"),
  journal: document.getElementById("journalPanel"),
  events: document.getElementById("eventsPanel")
};

const stages = {
  intro: document.getElementById("stageIntro")
};

function showPanel(name) {
  document.getElementById("mission2Root")
    .classList.add("hidden");

  document.getElementById("nav" +
    name.charAt(0).toUpperCase() +
    name.slice(1)
  ).click();
}

function showStage(name) {
  if (name === "intro") {
    document.querySelectorAll(
      "#adventurePanel > [id^='stage']"
    ).forEach(stage => {
      stage.classList.toggle(
        "hidden",
        stage.id !== "stageIntro"
      );
    });
  }
}

const M2_ASSETS = "./assets/";

const M2_IMAGES = {
  start: "M2start.PNG",
  shadow: "M2shadow.PNG",
  victory: "M2victory.PNG",
  box: "M2victory-box.PNG",
  cliffhanger: "M2cliffhanger.PNG"
};

const M2_STORY = {
  title: "The Mystery of Polygon Keep",
  lesson: "Courage is choosing to act despite fear.",
  reward: "Courage Sigil",
  event: "Medieval Trick or Treat — October 24"
};

const M2_PUZZLES = {
  olivia: [
    {
      title: "The Heraldic Shield",
      story:
        "Olivia discovers three symbols carved into " +
        "the castle's ancient shields. A triangle " +
        "marks courage, a circle marks unity, and " +
        "a square marks protection. Which symbol " +
        "belongs to the Courage Knight?",
      answers: [
        "○ Circle",
        "△ Triangle",
        "□ Square"
      ],
      correct: 1,
      success:
        "The triangle glows! A hidden mechanism " +
        "clicks behind the shield."
    },
    {
      title: "The Knight's Challenge",
      story:
        "Olivia discovers that the enchanted armor " +
        "responds whenever someone issues a formal " +
        "knightly challenge. How can she safely " +
        "draw the mysterious knight away from " +
        "the castle gate?",
      answers: [
        "Run toward the moving armor",
        "Hide every shield",
        "Issue a formal challenge"
      ],
      correct: 2,
      success:
        "The armor turns toward Olivia's challenge. " +
        "The trapped citizens have a chance to escape!"
    }
  ],

  trevor: [
    {
      title: "The Marching Armor",
      story:
        "Empty suits of armor march across the " +
        "drawbridge. Trevor spots frightened shape " +
        "citizens trapped behind a fallen banner. " +
        "What should he do first?",
      answers: [
        "Protect the citizens and guide them to safety",
        "Challenge every suit of armor",
        "Race toward the Great Hall alone"
      ],
      correct: 0,
      success:
        "Trevor guides the citizens behind a stone " +
        "barrier. Their safety comes first."
    },
    {
      title: "The Courageous Choice",
      story:
        "A thunderous voice demands a duel. " +
        "Trevor notices that the mysterious knight " +
        "startles at every clang and creak. " +
        "How should Trevor respond?",
      answers: [
        "Laugh at the knight's fear",
        "Offer a challenge of courage without fighting",
        "Attack the armor"
      ],
      correct: 1,
      success:
        "Trevor proposes a challenge of courage. " +
        "The mysterious knight accepts!"
    }
  ]
};

let m2Hero = null;
let m2PuzzleIndex = 0;
let m2AnswerLocked = false;
let m2RevealStarted = false;

const m2Root = document.createElement("section");
m2Root.id = "mission2Root";
m2Root.className = "game-panel hidden";

m2Root.innerHTML = `
  <div class="eyebrow">MISSION 02 · COURAGE △</div>

  <h2>The Mystery of Polygon Keep</h2>

  <div id="m2Content"></div>
`;

document.querySelector(".game-shell")
  .insertBefore(
    m2Root,
    document.getElementById("journalPanel")
  );

const m2Content = document.getElementById("m2Content");

function m2Image(filename, description) {
  const image = document.createElement("img");

  image.src = M2_ASSETS + filename;
  image.alt = description;
  image.loading = "eager";

  image.style.display = "block";
  image.style.width = "100%";
  image.style.height = "auto";
  image.style.objectFit = "contain";
  image.style.borderRadius = "16px";
  image.style.margin = "18px 0";

  return image;
}

function m2Text(content) {
  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  return paragraph;
}

function m2Heading(content) {
  const heading = document.createElement("h3");
  heading.textContent = content;
  return heading;
}

function m2Button(label, callback) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "primary-button";
  button.textContent = label;

  button.addEventListener("click", callback);

  return button;
}

function m2Clear() {
  m2Content.replaceChildren();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function m2Show() {
  if (!isMissionUnlocked("mission-2")) {
    window.alert(
      "Complete Mission 1 and collect the " +
      "Perception Sigil to unlock Polygon Keep."
    );
    return;
  }

  Object.values(panels).forEach(panel => {
    panel.classList.add("hidden");
  });

  m2Root.classList.remove("hidden");
m2Opening();
}

function m2Hide() {
  m2Root.classList.add("hidden");
  showPanel("adventure");
  showStage("intro");
}

function m2Opening() {
  m2Clear();

  m2Content.append(
    m2Image(
      M2_IMAGES.start,
      "The medieval tournament at Polygon Keep " +
      "is interrupted by marching armor."
    ),

    m2Heading("The Castle That Marches"),

    m2Text(
      "The kingdom of Polygon Keep is preparing " +
      "for its grand medieval tournament."
    ),

    m2Text(
      "Suddenly, empty armored boots stomp " +
      "across the drawbridge. Shields spin, " +
      "gates slam, and the castle begins " +
      "to tremble."
    ),

    m2Text(
      "A thunderous voice echoes through " +
      "the stone corridors:"
    ),

    m2Text(
      "“BEHOLD THE GREATEST KNIGHT " +
      "IN EVERY KINGDOM!”"
    ),

    m2Text(
      "Olivia and Trevor exchange a glance. " +
      "Something mysterious has taken " +
      "control of the guardian armor."
    ),

    m2Button(
      "Choose Your Path →",
      m2ChooseHero
    )
  );
}

function m2ChooseHero() {
  m2Clear();

  const chooseScreen =
    document.getElementById("stageM2Choose");

  // Move the existing portrait cards into
  // Mission 2's visible content panel.
  m2Content.appendChild(chooseScreen);

  chooseScreen.classList.remove("hidden");

  chooseScreen.querySelectorAll("[data-hero]")
    .forEach(button => {
      button.onclick = () => {
        chooseScreen.classList.add("hidden");
        m2BeginPath(button.dataset.hero);
      };
    });
}

function m2BeginPath(hero) {
  m2Hero = hero;
  m2PuzzleIndex = 0;
  m2AnswerLocked = false;
  m2RevealStarted = false;

  m2RenderPuzzle();
}

function m2RenderPuzzle() {
  const puzzle = M2_PUZZLES[m2Hero][m2PuzzleIndex];

  if (!puzzle) {
    m2ShadowScene();
    return;
  }

  m2AnswerLocked = false;
  m2Clear();

  const label = m2Hero === "olivia"
    ? "OLIVIA · INVESTIGATOR"
    : "TREVOR · PROTECTOR";

  const feedback = document.createElement("p");
  feedback.className = "feedback";
  feedback.setAttribute("role", "status");

  m2Content.append(
    m2Text(label),
    m2Heading(puzzle.title),
    m2Text(puzzle.story)
  );

  puzzle.answers.forEach((answer, index) => {
    const button = m2Button(answer, () => {
      if (m2AnswerLocked) return;

      if (index !== puzzle.correct) {
        feedback.textContent =
          "Not quite! Study the clues and try again.";
        return;
      }

      m2AnswerLocked = true;

      feedback.textContent = puzzle.success;

      m2Content.querySelectorAll("button")
        .forEach(item => {
          item.disabled = true;
        });

      m2Content.appendChild(
        m2Button(
          "Continue the Adventure →",
          () => {
            m2PuzzleIndex++;
            m2RenderPuzzle();
          }
        )
      );
    });

    m2Content.appendChild(button);
  });

  m2Content.appendChild(feedback);
}

function m2ShadowScene() {
  m2Clear();

  m2Content.append(
    m2Heading("The Knight Behind the Gate"),

    m2Image(
      M2_IMAGES.shadow,
      "A towering armored silhouette stands " +
      "inside Polygon Keep's Great Hall."
    ),

    m2Text(
      "The castle doors swing open."
    ),

    m2Text(
      "A towering armored knight rises " +
      "before Olivia and Trevor."
    ),

    m2Text(
      "“BEHOLD MY TERRIFYING—”"
    ),

    m2Text(
      "CLINK!"
    ),

    m2Text(
      "“WAIT! WHAT'S THAT NOISE?!”"
    ),

    m2Text(
      "The enormous knight freezes. " +
      "Something inside the armor " +
      "is trembling."
    ),

    m2Button(
      "Reveal the Mysterious Knight →",
      m2VictoryReveal
    )
  );
}

function m2VictoryReveal() {
  if (m2RevealStarted) return;
  m2RevealStarted = true;

  m2Clear();

  const image = m2Image(
    M2_IMAGES.victory,
    "Clank, the Armor Haunter, emerges " +
    "from his enchanted armor."
  );

  image.style.opacity = "0";
  image.style.transition = "opacity 2.5s ease";

  m2Content.append(
    m2Heading("The Knight Who Feared Everything"),
    image
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      image.style.opacity = "1";
    });
  });

  m2Content.append(
    m2Text(
      "With a tremendous crash, the armor " +
      "falls apart."
    ),

    m2Text(
      "A small violet-blue ghost floats " +
      "out, wearing an oversized knight's visor."
    ),

    m2Text(
      "“I am CLANK! The greatest knight " +
      "who ever—EEP! What was that?!”"
    ),

    m2Text(
      "Olivia and Trevor realize that " +
      "the mighty Armor Haunter is " +
      "frightened of almost everything."
    ),

    m2Button(
      "The Final Challenge →",
      m2FinalChallenge
    )
  );
}

function m2FinalChallenge() {
  m2Clear();

  m2Content.append(
    m2Heading("A Knight's True Courage"),

    m2Text(
      "Suddenly, the enchanted castle gate " +
      "breaks loose!"
    ),

    m2Text(
      "Several shape citizens are trapped " +
      "beneath its falling shadow."
    ),

    m2Text(
      "Clank trembles. The crashing gate " +
      "terrifies him."
    ),

    m2Text(
      "“I can't! I'm afraid!”"
    ),

    m2Heading("What should the heroes tell Clank?")
  );

  const choices = [
    {
      text: "A real knight never feels afraid.",
      correct: false
    },
    {
      text:
        "Being brave means helping even " +
        "when you're afraid.",
      correct: true
    },
    {
      text: "Run away before the gate falls.",
      correct: false
    }
  ];

  const feedback = m2Text("");

  choices.forEach(choice => {
    m2Content.appendChild(
      m2Button(choice.text, () => {
        if (!choice.correct) {
          feedback.textContent =
            "Try again. Courage doesn't mean " +
            "pretending fear isn't real.";
          return;
        }

        m2Content.querySelectorAll("button")
          .forEach(button => {
            button.disabled = true;
          });

        feedback.textContent =
          "Clank takes one trembling breath " +
          "and rushes forward. He catches " +
          "the falling gate with the guardian " +
          "armor and saves the citizens!";

        m2Content.appendChild(
          m2Button(
            "Celebrate Polygon Keep's Restoration →",
            m2Restoration
          )
        );
      })
    );
  });

  m2Content.appendChild(feedback);
}

function m2Restoration() {
  m2Clear();

  m2Content.append(
    m2Heading("Polygon Keep Is Restored!"),

    m2Text(
      "The castle's enchanted defenses " +
      "settle. The drawbridge opens, " +
      "and the tournament banners " +
      "rise once more."
    ),

    m2Text(
      "Clank looks at the rescued citizens."
    ),

    m2Text(
      "“I was terrified,” he admits. " +
      "“But I helped anyway!”"
    ),

    m2Text(
      "Olivia and Trevor smile. " +
      "Clank has finally become " +
      "the knight he always wanted to be."
    ),

    m2Text(
      "The people of Polygon Keep " +
      "welcome Clank as their new " +
      "friendly guardian."
    ),

    m2Text(
      "Deep beneath the Great Hall, " +
      "a familiar treasure begins to glow..."
    ),

    m2Button(
      "Discover The Mystical Box →",
      m2Chest
    )
  );
}

function m2Chest() {
  m2Clear();

  m2Content.append(
    m2Heading("The Mystical Box"),

    m2Text(
      "The magical treasure chest returns, " +
      "surrounded by the colors " +
      "of Polygon Keep."
    ),

    m2Text(
      "Inside waits the reward " +
      "for true courage."
    )
  );

  const chestButton = document.createElement("button");

  chestButton.type = "button";
  chestButton.className = "treasure-chest";
  chestButton.setAttribute(
    "aria-label",
    "Open the Mission 2 Mystical Box"
  );

  chestButton.appendChild(
    m2Image(
      M2_IMAGES.box,
      "The Mystical Box containing " +
      "a glowing multicolored gemstone."
    )
  );

  chestButton.addEventListener("click", () => {
    if (isMissionCompleted("mission-2")) {
      m2Reward(true);
      return;
    }

    const saved = completeMission("mission-2");

    if (!saved) {
      window.alert(
        "Your Courage Sigil could not be saved. " +
        "Please check your browser storage."
      );
      return;
    }

    m2Reward(false);
  });

  m2Content.appendChild(chestButton);
}

function m2Reward(alreadyCollected) {
  m2Clear();

  m2Content.append(
    m2Heading("△ Courage Sigil Collected!"),

    m2Image(
      M2_IMAGES.box,
      "The Mystical Box reveals its magical treasure."
    ),

    m2Text(
      alreadyCollected
        ? "Your Courage Sigil is already " +
          "recorded in the Mission Journal."
        : "Your Courage Sigil has been collected!"
    ),

    m2Text(
      "Special Artifact: The Guardian's Crest"
    ),

    m2Text(M2_STORY.lesson),

    m2Text(
      "🏅 Badge Earned: Castle Restorer"
    ),

    m2Text(
      "Your achievement has been saved " +
      "to your adventure progress."
    ),

    m2Button(
      "View Your Event Discovery →",
      () => {
        m2Root.classList.add("hidden");
        showPanel("events");
      }
    ),

    m2Button(
      "Discover the Castle's Final Secret →",
      m2Cliffhanger
    )
  );
}

function m2Cliffhanger() {
  m2Clear();

  m2Content.append(
    m2Heading("A Secret Beneath the Armor"),

    m2Image(
      M2_IMAGES.cliffhanger,
      "A mysterious shape assistant emerges " +
      "from the discarded armor."
    ),

    m2Text(
      "As the celebration begins, " +
      "something stirs inside " +
      "the abandoned armor."
    ),

    m2Text(
      "A tiny shape assistant crawls " +
      "through a hidden hollow compartment."
    ),

    m2Text(
      "On its surface glimmers " +
      "a familiar insignia."
    ),

    m2Text(
      "The ShapeScientist's insignia."
    ),

    m2Text(
      "But the Scientist never designed " +
      "his assistants to hide inside armor..."
    ),

    m2Text(
      "Far away, in the laboratory, " +
      "the invention core flickers."
    ),

    m2Text(
      "Something has been changing " +
      "the Scientist's creations."
    ),

    m2Button(
      "Return to the Adventure →",
      m2Hide
    )
  );
}

/* ------------------------------------------
   MISSION 2 ENTRY BUTTON
   Appears after Mission 1 is completed.
   ------------------------------------------ */

function m2AddEntryButton() {
  if (
    !isMissionUnlocked("mission-2") ||
    document.getElementById("enterMission2")
  ) {
    return;
  }

  const button = m2Button(
    "Enter Mission 2 — Polygon Keep →",
    m2Show
  );

  button.id = "enterMission2";

  stages.intro.appendChild(button);
}

m2AddEntryButton();

window.addEventListener(
  "mystical-box-progress-updated",
  m2AddEntryButton
);

/* Make Mission 2 accessible when returning
   from the Event Board or Mission Journal. */

["navAdventure", "navJournal", "navEvents"]
  .forEach(id => {
    document.getElementById(id)
      .addEventListener("click", () => {
        m2Root.classList.add("hidden");
      });
  });

document.getElementById("epilogueContinue")
  .addEventListener("click", () => {
    if (isMissionUnlocked("mission-2")) {
      m2Show();
    }
  });
