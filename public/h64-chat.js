/* Highway 64 Truck & Trailer Repair — site chat widget.
   Loaded on every page of highway64semitruckservice.com via the
   "Head & Footer Code" plugin. Talks to /api/h64-assistant.

   No lead capture and no SMS by design (Weston, 2026-09-16): the only
   call to action is the shop phone number. */
(function () {
  'use strict';
  if (window.__h64ChatLoaded) return;
  window.__h64ChatLoaded = true;

  // Must be the canonical www host: the apex issues a 307, and a redirect on a
  // CORS preflight is fatal ("Redirect is not allowed for a preflight request").
  var API = 'https://www.blacktopdigital.ai/api/h64-assistant';
  var PHONE = '479-668-3107';
  var TEL = 'tel:4796683107';
  var BLUE = '#4DA6FF';
  var MAX_TURNS = 20;
  var GREETING = 'Ask us anything about truck or trailer repair — hours, what we work on, or where we run service. Broken down right now? Call ' + PHONE + '.';

  /* Styling mirrors the Black Top Digital widget (components/ChatWidget.tsx) —
     rounded pill bar, soft expanding pulse, floating rounded dialog — in the
     Highway 64 blue instead of purple. */
  var css = [
    '#h64chat,#h64chat *{box-sizing:border-box;margin:0;padding:0}',
    '#h64chat{font-family:Arial,Helvetica,sans-serif}',
    '@keyframes h64pulse{',
    '0%{box-shadow:0 0 0 0 rgba(77,166,255,.6),0 8px 30px rgba(0,0,0,.6)}',
    '70%{box-shadow:0 0 0 18px rgba(77,166,255,0),0 8px 30px rgba(0,0,0,.6)}',
    '100%{box-shadow:0 0 0 0 rgba(77,166,255,0),0 8px 30px rgba(0,0,0,.6)}}',
    '@keyframes h64blink{0%,80%,100%{opacity:.25}40%{opacity:1}}',
    /* bottom pill bar */
    '#h64chat-bar{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);',
    'z-index:2147483000;width:min(440px,calc(100vw - 32px));height:64px;border-radius:999px;border:none;',
    'background:' + BLUE + ';color:#06121f;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.7rem;',
    'font-family:"Arial Black",Arial,sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:.08em;text-transform:uppercase;',
    'animation:h64pulse 2s infinite}',
    '#h64chat-bar:hover{background:#6fb8ff}',
    '#h64chat-bar span{font-family:Arial,Helvetica,sans-serif;font-weight:600;font-size:.9rem;letter-spacing:0;',
    'text-transform:none;color:rgba(6,18,31,.72)}',
    '@media(max-width:430px){#h64chat-bar{font-size:.95rem;gap:.5rem}#h64chat-bar span{font-size:.8rem}}',
    '@media(prefers-reduced-motion:reduce){#h64chat-bar{animation:none;box-shadow:0 8px 30px rgba(0,0,0,.6)}}',
    /* floating dialog */
    '#h64chat-wrap{position:fixed;left:0;right:0;top:0;height:100%;z-index:2147483001;display:none;',
    'align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.75)}',
    '#h64chat-wrap.open{display:flex}',
    '#h64chat-panel{width:min(520px,100%);height:min(640px,100%);background:#0a0a0a;border:1px solid #333;',
    'border-radius:14px;display:flex;flex-direction:column;overflow:hidden}',
    '@media(max-width:600px){#h64chat-wrap{padding:10px}#h64chat-panel{height:min(540px,100%)}}',
    '#h64chat-head{display:flex;align-items:center;gap:12px;padding:.85rem 1rem;border-bottom:1px solid #222;flex:0 0 auto}',
    '@media(max-width:600px){#h64chat-head{padding:.7rem .9rem}}',
    '#h64chat-head b{font-family:"Arial Black",Arial,sans-serif;color:#fff;font-size:13px;text-transform:uppercase;',
    'letter-spacing:.5px;line-height:1.3;flex:1;min-width:0}',
    '#h64chat-head small{display:block;color:#9a9a9a;font-family:Arial,Helvetica,sans-serif;font-size:11px;',
    'font-weight:400;letter-spacing:0;text-transform:none;margin-top:2px}',
    '#h64chat-call{background:' + BLUE + ';color:#06121f;text-decoration:none;font-family:"Arial Black",Arial,sans-serif;',
    'font-size:12px;padding:9px 14px;border-radius:999px;white-space:nowrap;letter-spacing:.5px}',
    '#h64chat-x{background:none;border:none;color:#888;font-size:26px;line-height:1;cursor:pointer;padding:0 2px}',
    '#h64chat-x:hover{color:#fff}',
    '#h64chat-log{flex:1 1 auto;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.7rem;',
    '-webkit-overflow-scrolling:touch}',
    '.h64msg{max-width:85%;padding:.7rem .9rem;border-radius:12px;font-size:.95rem;line-height:1.55;',
    'white-space:pre-wrap;word-wrap:break-word}',
    '.h64msg.bot{background:#161616;color:#e8e8e8;align-self:flex-start}',
    '.h64msg.me{background:' + BLUE + ';color:#06121f;align-self:flex-end;font-weight:600}',
    '.h64msg.err{background:#2a1414;color:#ffb3b3;align-self:flex-start}',
    '.h64msg a{color:inherit;font-weight:700}',
    '#h64chat-dots{align-self:flex-start;display:none;gap:5px;padding:.85rem .9rem;background:#161616;border-radius:12px}',
    '#h64chat-dots.on{display:flex}',
    '#h64chat-dots i{width:7px;height:7px;background:#777;border-radius:50%;animation:h64blink 1.3s infinite}',
    '#h64chat-dots i:nth-child(2){animation-delay:.18s}#h64chat-dots i:nth-child(3){animation-delay:.36s}',
    '#h64chat-foot{flex:0 0 auto;border-top:1px solid #222;padding:.85rem;display:flex;gap:.5rem}',
    '#h64chat-in{flex:1;background:#000;border:1px solid #333;border-radius:8px;color:#fff;padding:.8rem .9rem;',
    'font-family:Arial,Helvetica,sans-serif;font-size:1rem;outline:none;min-width:0}',
    '#h64chat-in:focus{border-color:' + BLUE + '}',
    '#h64chat-send{background:' + BLUE + ';color:#06121f;border:none;border-radius:8px;padding:0 1.2rem;cursor:pointer;',
    'font-family:"Arial Black",Arial,sans-serif;font-size:.9rem;font-weight:800}',
    '#h64chat-send:disabled{opacity:.6;cursor:wait}'
  ].join('');

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  var style = el('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = el('div', { id: 'h64chat' });
  root.innerHTML =
    '<button id="h64chat-bar" type="button" aria-label="Chat now">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
      'Chat Now<span>&middot; Ask us anything</span></button>' +
    '<div id="h64chat-wrap" role="dialog" aria-modal="true" aria-label="Chat with Highway 64 Truck &amp; Trailer Repair">' +
      '<div id="h64chat-panel">' +
        '<div id="h64chat-head">' +
          '<b>Highway 64 Truck &amp; Trailer<small>Open 24/7 &middot; Van Buren, AR</small></b>' +
          '<a id="h64chat-call" href="' + TEL + '">Call ' + PHONE + '</a>' +
          '<button id="h64chat-x" type="button" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<div id="h64chat-log"><div id="h64chat-dots"><i></i><i></i><i></i></div></div>' +
        '<form id="h64chat-foot">' +
          '<input id="h64chat-in" type="text" autocomplete="off" placeholder="Type your question..." maxlength="600" aria-label="Your message">' +
          '<button id="h64chat-send" type="submit">Send</button>' +
        '</form>' +
      '</div></div>';
  document.body.appendChild(root);

  var bar = root.querySelector('#h64chat-bar');
  var wrap = root.querySelector('#h64chat-wrap');
  var panel = root.querySelector('#h64chat-panel');
  var log = root.querySelector('#h64chat-log');
  var dots = root.querySelector('#h64chat-dots');
  var form = root.querySelector('#h64chat-foot');
  var input = root.querySelector('#h64chat-in');
  var send = root.querySelector('#h64chat-send');

  var history = [];
  var busy = false;
  var greeted = false;

  // Keep the fixed bar from sitting on top of the page footer.
  document.body.style.paddingBottom = '86px';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Make the phone number tappable wherever the bot writes it.
  function linkPhone(s) {
    return s.replace(/479[-.\s]?668[-.\s]?3107/g, '<a href="' + TEL + '">' + PHONE + '</a>');
  }

  function add(text, cls) {
    var n = el('div', { class: 'h64msg ' + cls });
    n.innerHTML = linkPhone(esc(text));
    log.insertBefore(n, dots);
    log.scrollTop = log.scrollHeight;
    return n;
  }

  function thinking(on) {
    dots.className = on ? 'on' : '';
    busy = on;
    send.disabled = on;
    if (on) log.scrollTop = log.scrollHeight;
  }

  function open() {
    wrap.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    if (!greeted) { greeted = true; add(GREETING, 'bot'); }
    fit();
    if (window.matchMedia('(pointer:fine)').matches) input.focus();
  }

  function close() {
    wrap.classList.remove('open');
    document.documentElement.style.overflow = '';
  }

  // On phones the on-screen keyboard shrinks the visual viewport; size the
  // panel to it so the header doesn't get pushed off the top of the screen.
  function fit() {
    var vv = window.visualViewport;
    if (!vv || !wrap.classList.contains('open')) return;
    wrap.style.height = Math.round(vv.height) + 'px';
    wrap.style.top = Math.round(vv.offsetTop) + 'px';
  }

  async function ask(text) {
    history.push({ role: 'user', content: text });
    thinking(true);
    try {
      var res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      var data = await res.json().catch(function () { return {}; });
      thinking(false);
      var reply = data && data.reply;
      if (reply) {
        add(reply, 'bot');
        if (data.ok) history.push({ role: 'assistant', content: reply });
        else history.pop();
      } else {
        history.pop();
        add('Something went wrong on our end. Call us at ' + PHONE + ' — we answer 24/7.', 'err');
      }
    } catch (e) {
      thinking(false);
      history.pop();
      add('Couldn’t connect. Call us at ' + PHONE + ' — we answer 24/7.', 'err');
    }
  }

  bar.addEventListener('click', open);
  root.querySelector('#h64chat-x').addEventListener('click', close);
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && wrap.classList.contains('open')) close();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit);
    window.visualViewport.addEventListener('scroll', fit);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    if (history.filter(function (m) { return m.role === 'user'; }).length >= MAX_TURNS) {
      add('Let’s get you to a real person — call ' + PHONE + ', day or night.', 'bot');
      input.value = '';
      return;
    }
    input.value = '';
    add(text, 'me');
    ask(text);
  });
})();
