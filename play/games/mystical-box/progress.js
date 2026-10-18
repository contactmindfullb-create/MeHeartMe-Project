
/*
 * THE MYSTICAL BOX
 * Player Progress System
 *
 * Saves achievements in the player's browser.
 * No accounts or database required.
 */

const STORAGE_KEY = "meheartme-mystical-box-progress-v1";

// Default progress for a new player
function defaultProgress() {
  return {
    completedMissions: [],
    collectedSigils: [],
    earnedBadges: []
  };
}

// Load saved player progress
export function getProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultProgress();
    }

    const data = JSON.parse(saved);

    return {
      completedMissions: Array.isArray(data.completedMissions)
        ? data.completedMissions
        : [],

      collectedSigils: Array.isArray(data.collectedSigils)
        ? data.collectedSigils
        : [],

      earnedBadges: Array.isArray(data.earnedBadges)
        ? data.earnedBadges
        : []
    };
  } catch (error) {
    console.warn("Unable to load game progress:", error);
    return defaultProgress();
  }
}

// Save player progress
export function saveProgress(progress) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );

    window.dispatchEvent(
      new Event("mystical-box-progress-updated")
    );

    return true;
  } catch (error) {
    console.warn("Unable to save game progress:", error);
    return false;
  }
}

// Check whether a mission is completed
export function isMissionCompleted(missionId) {
  return getProgress().completedMissions.includes(missionId);
}

// Check whether a sigil has been collected
export function hasSigil(sigilId) {
  return getProgress().collectedSigils.includes(sigilId);
}

// Complete Mission 1 and award its rewards
export function completeMissionOne() {
  const progress = getProgress();

  if (!progress.completedMissions.includes("mission-1")) {
    progress.completedMissions.push("mission-1");
  }

  if (!progress.collectedSigils.includes("perception")) {
    progress.collectedSigils.push("perception");
  }

  if (!progress.earnedBadges.includes("mirror-maze-restorer")) {
    progress.earnedBadges.push("mirror-maze-restorer");
  }

  return saveProgress(progress);
}


/*
 * MISSIONS 2–5
 * Sequential Unlocking and Rewards
 *
 * Mission 1 remains unchanged.
 * Reward identifiers are provisional.
 */

const missionRewards = {
  "mission-2": {
    sigil: "courage",
    badge: "castle-restorer"
  },
  "mission-3": {
    sigil: "patience",
    badge: "cauldron-restorer"
  },
  "mission-4": {
    sigil: "balance",
    badge: "festival-restorer"
  },
  "mission-5": {
    sigil: "compassion",
    badge: "harvest-restorer"
  }
};

// Check whether a mission can be entered.
export function isMissionUnlocked(missionId) {
  const match = /^mission-([1-5])$/.exec(missionId);

  if (!match) {
    return false;
  }

  const missionNumber = Number(match[1]);

  if (missionNumber === 1) {
    return true;
  }

  const previousMission = `mission-${missionNumber - 1}`;

  const requiredSigil =
    missionNumber === 2
      ? "perception"
      : missionRewards[previousMission]?.sigil;

  return (
    isMissionCompleted(previousMission) &&
    hasSigil(requiredSigil)
  );
}

// Award a newly completed mission's rewards.
// Call only after the final challenge and
// Mystical Box opening.
export function completeMission(missionId) {
  const reward = missionRewards[missionId];

  // Mission 1 keeps its original completion function.
  if (!reward || !isMissionUnlocked(missionId)) {
    return false;
  }

  const progress = getProgress();

  // Never award the same mission twice.
  if (progress.completedMissions.includes(missionId)) {
    return false;
  }

  const updatedProgress = {
    ...progress,

    completedMissions: [
      ...new Set([
        ...progress.completedMissions,
        missionId
      ])
    ],

    collectedSigils: [
      ...new Set([
        ...progress.collectedSigils,
        reward.sigil
      ])
    ],

    earnedBadges: [
      ...new Set([
        ...progress.earnedBadges,
        reward.badge
      ])
    ]
  };

  return saveProgress(updatedProgress);
}
