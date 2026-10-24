/* MeHeartMe | Age-Adaptive Reading Levels v1.0
   Adds optional language scaling to main and Play pages.
   Current website wording is retained as the 10+ baseline.
   Does not alter externally hosted WordPress game content.
*/
(() => {
  const STORAGE_KEY = 'meheartme-reading-level';
  const levels = ['4-6', '7-9', '10+'];
  const isPlay = /\/play\/?(?:index\.html)?$/.test(location.pathname);
  const entries = isPlay ? [
    ['.play-hero h1', ['PICK YOUR GAME!', 'CHOOSE YOUR ADVENTURE']],
    ['.play-hero p', ['Pick a game. Have fun!', 'Explore new worlds, follow clues, and solve mysteries!']],
    ['.game-card:nth-child(1) .game-tag', ['START HERE!', 'NEW TO THE MISSION?']],
    ['.game-card:nth-child(1) p', ['Follow the clues. Find out how the story began!', 'Follow strange signals and solve clues to learn how the adventure began.']],
    ['.game-card:nth-child(1) .game-button', ['PLAY PORTAL PROTOCOL →', 'START PORTAL PROTOCOL →']],
    ['.game-card:nth-child(2) .game-tag', ['MORE GHOSTLY FUN!', 'THE NEXT ADVENTURE']],
    ['.game-card:nth-child(2) p', ['Meet Olivia and Trevor! Pick a twin. Solve the maze. Find magic shapes!', 'Meet Olivia and Trevor in Shape Land. Choose your twin, solve the mirror maze, and collect magical symbols.']],
    ['.game-card:nth-child(2) .game-button', ['LET’S PLAY →', 'CHOOSE YOUR PATH →']],
    ['.library-footer', ['More games are coming!', 'More adventures are coming soon.']]
  ] : [
    ['.welcome h2', ['COME PLAY WITH US!', 'COME EXPLORE WITH US!']],
    ['.welcome p', ['Watch stories. Play games. Find fun surprises!', 'Explore stories, games, events, and fun experiences with your family.']],
    ['.event-message h2', ['A GHOSTLY ADVENTURE!', 'A GHOSTLY ADVENTURE AWAITS!']],
    ['.event-message p', ['Ready for ghostly fun? Go to Watch to see our event!', 'Join the Majestic Ghostly adventure. Go to Watch to see the event announcement!']],
    ['.event-button[href="events/majestic-ghostly/"]', ['SEE THE EVENT', 'EXPLORE THE EVENT']],
    ['.signal-tracker h2', ['GHOST NEWS', 'LATEST GHOSTLY SIGNALS']],
    ['.transmission-button', ['SEE WHAT’S NEW →', 'SEE LATEST NEWS →']]
  ];

  function start() {
    // Capture existing 10+ copy before making any changes.
    const nodes = entries.map(([selector, alternatives]) => {
      const node = document.querySelector(selector);
      return node ? { node, alternatives, original: node.textContent } : null;
    }).filter(Boolean);

    const panel = document.createElement('div');
    panel.className = 'me-reading-panel';
    panel.innerHTML = `<label for="me-reading-level">Reading level</label>
      <select id="me-reading-level" aria-label="Choose reading level">
        <option value="4-6">Ages 4–6</option>
        <option value="7-9">Ages 7–9</option>
        <option value="10+">Ages 10+ (Original)</option>
      </select>`;
    const css = document.createElement('style');
    css.textContent = `.me-reading-panel{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;margin:12px auto 24px;padding:12px;border:2px solid #efa94a;border-radius:12px;background:#24152f;color:#fff;width:min(92%,550px);font:700 16px Arial,sans-serif}.me-reading-panel select{background:#fff;color:#24152f;border:2px solid #efa94a;border-radius:8px;padding:12px;font:inherit;min-height:44px;max-width:100%}.me-reading-panel select:focus-visible{outline:3px solid #ffd83d;outline-offset:2px}`;
    document.head.appendChild(css);
    const anchor = document.querySelector(isPlay ? '.play-hero' : '.welcome');
    if (!anchor) return;
    anchor.parentNode.insertBefore(panel, anchor);
    const select = panel.querySelector('select');
    let value = '10+';
    try { const saved = localStorage.getItem(STORAGE_KEY); if (levels.includes(saved)) value = saved; } catch (_) {}
    function apply(next) {
      const index = levels.indexOf(next);
      if (index === -1) return;
      select.value = next;
      nodes.forEach(({node, alternatives, original}) => {
        node.textContent = index === 2 ? original : alternatives[index];
      });
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
    }
    select.addEventListener('change', () => apply(select.value));
    apply(value);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
