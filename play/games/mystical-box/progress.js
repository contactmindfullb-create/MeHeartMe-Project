
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
