/* MeHeartMe Portal Pursuit - optional reading levels and click-to-read speech.
   Include AFTER the existing inline game script, just before </body>. */
(()=>{
  'use strict';
  const app=document.getElementById('app');
  if(!app) return;
  const levels=['4-6','7-9','10+'];
  const key='meheartme-reading-level';
  let level='4-6';
  try { const x=localStorage.getItem(key); if(levels.includes(x))level=x; }catch(_){}
  const style=document.createElement('style');
  style.textContent=`.readerbar{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:0 auto 14px;padding:12px;border:1px solid #ad915e;border-radius:12px;background:#151f37;color:#f9f5ec}.readerbar label{font-size:.9rem}.readerbar select{background:#fff;color:#15223a;border:2px solid #bb9956;border-radius:7px;padding:9px;min-height:44px;font:inherit}.readerbar button{cursor:pointer;min-height:44px;padding:9px 12px;border:1px solid #e4bb6b;border-radius:9px;background:transparent;color:#f2cf8a;font:inherit;font-weight:700}.readerbar button:disabled{opacity:.5}.readerbar button:focus-visible,.readerbar select:focus-visible{outline:3px solid #b7f4ff;outline-offset:3px}.readerbar .readerstatus{font-size:.82rem;color:#b7f4ff}`;
  document.head.appendChild(style);
  const bar=document.createElement('div');bar.className='readerbar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Reading and listening tools');
  bar.innerHTML=`<label for="reading-level">Reading level (optional)</label><select id="reading-level"><option value="4-6">Ages 4â6</option><option value="7-9">Ages 7â9</option><option value="10+">Ages 10+</option></select><button type="button" id="reader-play" aria-label="Read this game screen aloud">ð Read to Me</button><button type="button" id="reader-stop" disabled>â  Stop</button><span class="readerstatus" id="reader-status" role="status" aria-live="polite"></span>`;
  app.before(bar);
  const selector=bar.querySelector('#reading-level'), play=bar.querySelector('#reader-play'), stop=bar.querySelector('#reader-stop'),status=bar.querySelector('#reader-status');selector.value=level;
  // Text versions in order: 4â6, 7â9, 10+. Legal/giveaway language intentionally excluded.
  const copy={
    'The ghosts won the first round...':['The ghosts made a mess!', 'The ghosts made a mess at the festival!', 'The ghosts won the first round...'],
    'The medieval festival base is in chaos. The Overseer needs your help to find four pranksters, question them about Olivia and Trevor, and send them home through the portal.':['Oh no! Four ghosts made a mess. Find them! Ask about Olivia and Trevor. Help the ghosts go home.', 'Four ghosts have disrupted the festival. Find them and ask what they know about Olivia and Trevor before sending them home.', 'The medieval festival base is in chaos. The Overseer needs your help to find four pranksters, question them about Olivia and Trevor, and send them home through the portal.'],
    'Begin ghost hunt':['Find the ghosts!', 'Start the ghost hunt', 'Begin ghost hunt'],
    'Mission 1 Â· Haunted Courtyard':['Mission 1 Â· Find the Ghosts', 'Mission 1 Â· Haunted Courtyard', 'Mission 1 Â· Haunted Courtyard'],
    'Find the four glowing ghosts and complete their capture challenges.':['Find four glowing ghosts. Tap one to play!', 'Find the four glowing ghosts and solve a challenge for each one.', 'Find the four glowing ghosts and complete their capture challenges.'],
    'Bring suspects to interrogation':['Ask the ghosts questions', 'Question the ghosts', 'Bring suspects to interrogation'],
    'Mission 2 Â· Royal Interrogation':['Mission 2 Â· Ask Questions', 'Mission 2 Â· Question the Ghosts', 'Mission 2 Â· Royal Interrogation'],
    'Choose what the Overseer should ask. Each question unlocks a testimony.':['Pick a ghost. Listen to what it says!', 'Choose questions for the Overseer. Every answer reveals part of the story.', 'Choose what the Overseer should ask. Each question unlocks a testimony.'],
    'Escort ghosts to the portal':['Take the ghosts home', 'Lead the ghosts to the portal', 'Escort ghosts to the portal'],
    'Mission 3 Â· Return to the Portal':['Mission 3 Â· Send Them Home', 'Mission 3 Â· Return to the Portal', 'Mission 3 Â· Return to the Portal'],
    'Activate all four seals to send the mischievous ghosts back to their realm.':['Tap each ghost to send it home.', 'Activate four magic seals to send the ghosts back to their world.', 'Activate all four seals to send the mischievous ghosts back to their realm.'],
    'All four ghosts returned!':['The ghosts are home!', 'All four ghosts have returned!', 'All four ghosts returned!'],
    'Claim mission completion':['Finish the mission', 'Complete the mission', 'Claim mission completion'],
    'How do you steady the tent?':['How can you stop the tent from falling?', 'How can you make the tent stay in place?', 'How do you steady the tent?'],
    'Which package belongs to the festival supply team?':['Which box is for the festival?', 'Which package belongs to the festival team?', 'Which package belongs to the festival supply team?'],
    'The lantern flashed MOON - STAR - CROWN. What is the middle symbol?':['Look: MOON - STAR - CROWN. Which one is in the middle?', 'The lantern flashes MOON - STAR - CROWN. Which symbol comes second?', 'The lantern flashed MOON - STAR - CROWN. What is the middle symbol?'],
    'What can open a locked door without a key?':['What magic can open a locked door?', 'What could unlock a door without a key?', 'What can open a locked door without a key?'],
    'Secure the ropes to the ground':['Tie the ropes to the ground', 'Secure the ropes to the ground', 'Secure the ropes to the ground'],
    'The crate marked with a glowing star':['The box with the glowing star', 'The crate with a glowing star', 'The crate marked with a glowing star'],
    'A secret spell':['A magic spell', 'A secret spell', 'A secret spell'],
    'Not quite. Try another answer.':['Try again!', 'Not quite. Try another answer.', 'Not quite. Try another answer.'],
    'Tap a ghost to begin.':['Tap a ghost!', 'Tap a ghost to begin.', 'Tap a ghost to begin.'],
    'The truth, please. Preferably before the castle flies away.':['Tell me the truth! Before the castle flies away!', 'Please tell the truth before the castle flies away!', 'The truth, please. Preferably before the castle flies away.'],
    'Four ghosts. One ruined base. Explain yourselves.':['Four ghosts! What happened?', 'Four ghosts and a ruined festival. Explain what happened.', 'Four ghosts. One ruined base. Explain yourselves.'],
  };
  const originals=new WeakMap();
  function simplify(){
    const walker=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let n;
    while((n=walker.nextNode())){
      if(n.parentElement?.closest('a,label,.warning,.success'))continue;
      const original=originals.has(n)?originals.get(n):n.nodeValue;
      if(!originals.has(n))originals.set(n,original);
      const val=original.trim(),options=copy[val];
      const next=options?options[levels.indexOf(level)]:original;
      if(n.nodeValue!==next)n.nodeValue=next;
    }
  }
  function stopSpeech(){if('speechSynthesis'in window)window.speechSynthesis.cancel();play.disabled=false;stop.disabled=true;status.textContent='';}
  function voiceFor(role){
    const vs=window.speechSynthesis.getVoices().filter(v=>/^en([_-]|$)/i.test(v.lang));
    if(!vs.length)return null;
    const p=role==='overseer'?vs.find(v=>/samantha|zira|victoria|karen|female/i.test(v.name)):role==='ghost'?vs.find(v=>/daniel|alex|david|fred|male/i.test(v.name)):null;
    return p||vs[role==='ghost'&&vs.length>1?1:0];
  }
  function readScreen(){
    if(!('speechSynthesis'in window)){status.textContent='Speech is not supported on this device.';return;}
    stopSpeech();
    const chunks=[];
    app.querySelectorAll('h1,h2,p,.speech,button[data-act],.status').forEach(el=>{
      if(el.closest('.warning,.success,a')||el.closest('.speech')&&!el.classList.contains('speech'))return;
      if(el.matches('button')&&(el.classList.contains('ghost')||el.disabled))return;
      const txt=el.textContent.trim();if(!txt)return;
      const speaker=el.classList.contains('speech')?(el.querySelector('strong')?.textContent||''):'';
      chunks.push({txt,role:/OVERSEER/i.test(speaker)?'overseer':/SUSPECT|SIR |LADY |WHISPER/i.test(speaker)?'ghost':'narrator'});
    });
    if(!chunks.length){status.textContent='No reading text on this screen.';return;}
    let index=0;play.disabled=true;stop.disabled=false;status.textContent='Reading aloud';
    const sayNext=()=>{
      if(!stop.disabled&&index<chunks.length){const item=chunks[index++];const u=new SpeechSynthesisUtterance(item.txt);u.lang='en-US';u.rate=level==='4-6'?.85:level==='7-9'?.93:1;u.pitch=item.role==='ghost'?.88:item.role==='overseer'?1.12:1;
        const v=voiceFor(item.role);if(v)u.voice=v;u.onend=sayNext;u.onerror=stopSpeech;window.speechSynthesis.speak(u);
      }else stopSpeech();
    };sayNext();
  }
  selector.addEventListener('change',()=>{if(!levels.includes(selector.value))return;level=selector.value;try{localStorage.setItem(key,level);}catch(_){}stopSpeech();simplify();});
  play.addEventListener('click',readScreen);stop.addEventListener('click',stopSpeech);
  // The game's controls() replaces the active stage. Wrap it to reapply each new screen.
  if(typeof window.controls==='function'){
    const originalControls=window.controls;
    window.controls=function(html){stopSpeech();originalControls(html);simplify();};
  }
  simplify();
})();