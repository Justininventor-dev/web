(function(){







  // state
  const state = { name:'', age:'', country:'', goal:'', count:1, domains:[''], desc:[''] };





// --- Configuración personalizada ---
const CONFIG = {
  footerText: () => {
    const name = state.name || 'INVENTOR';
    const age = state.age ? state.age + ' años' : 'edad no definida';
    const country = state.country || 'país no definido';
    return `Nombre: ${name} | Edad: ${age} | País: ${country}`;
  },
  watermarkText: "📩 Envía esta imagen a \"Genioinventor\" en Discord"
};







  // --- QS / QSA / SHOW seguros (patch) ---
  const qs = s => { try { return document.querySelector(s); } catch(e) { console.warn('qs selector inválido:', s, e); return null; } };
  const qsa = s => { try { return Array.from(document.querySelectorAll(s)); } catch(e) { console.warn('qsa selector inválido:', s, e); return []; } };

  // show seguro: no lanza si el id no existe
  const show = id => {
    try {
      const steps = qsa('.step');
      if (steps && steps.length) steps.forEach(el => el.classList.add('hidden'));
      const target = qs(id);
      if (target) {
        target.classList.remove('hidden');
        if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.warn('show(): elemento no encontrado ->', id);
        const first = qsa('.step')[0];
        if (first) first.classList.remove('hidden');
      }
    } catch (err) {
      console.error('Error en show():', err);
    }
  };

  // particles background (small floating emojis) for the UI (DOM)
  function createParticles(){
    const container = document.getElementById('particles');
    if(!container) return;
    container.innerHTML = '';
    const emojis = ['✨','🚀','⚡','🌟','🔥','💫'];
    for(let i=0;i<26;i++){
      const el = document.createElement('div');
      el.className = 'pitem';
      el.style.left = (Math.random()*100) + '%';
      el.style.top = (Math.random()*100) + '%';
      el.style.fontSize = (8 + Math.random()*36) + 'px';
      el.style.opacity = (0.06 + Math.random()*0.28).toFixed(2);
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      container.appendChild(el);
    }
  }
  createParticles();

  // animate particles via CSS (add styles dynamically)
  const style = document.createElement('style');
  style.innerHTML = `
  .pitem{position:fixed;pointer-events:none;transform:translateY(0);animation:floaty 9s linear infinite}
  @keyframes floaty{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-18px) rotate(90deg)}100%{transform:translateY(0) rotate(180deg)}}
  `;
  document.head.appendChild(style);

  // intro auto -> name after short delay (seguro)
  show('#intro');
  setTimeout(()=> show('#step-name'), 1200);

// --- Name step (binding seguro) ---
const inputName = qs('#input-name');
const btnNameNext = qs('#btn-name-next');

if (inputName && btnNameNext) {
  inputName.addEventListener('input', e => {
    // solo letras, números, espacios y acentos
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '').slice(0, 50);
    e.target.value = cleaned;
    state.name = cleaned.trim();
    btnNameNext.disabled = !state.name.length;
  });

  btnNameNext.addEventListener('click', () => show('#step-age'));
} else {
  console.warn('inputName o btnNameNext no encontrados. Verifica los IDs.');
}

// --- Age step ---
if (qs('#btn-age-back')) qs('#btn-age-back').addEventListener('click', ()=> show('#step-name'));

if (qs('#btn-age-next')) {
  qs('#btn-age-next').addEventListener('click', ()=> {
    let val = qs('#input-age') ? qs('#input-age').value.trim() : '';
    let num = parseInt(val, 10);

    if (isNaN(num) || num < 1 || num > 100) {
      alert("Edad inválida. Debe estar entre 1 y 100.");
      return;
    }
    state.age = String(num);
    show('#step-country');
  });
}

// --- Country step ---
if (qs('#btn-country-back')) qs('#btn-country-back').addEventListener('click', ()=> show('#step-age'));

if (qs('#btn-country-next')) {
  qs('#btn-country-next').addEventListener('click', ()=> {
    let val = qs('#input-country') ? qs('#input-country').value.trim() : '';
    state.country = val.replace(/[^a-zA-Z áéíóúÁÉÍÓÚñÑ]/g, '').slice(0, 50);
    show('#step-goal');
  });
}

// --- Goal step ---
if (qs('#btn-goal-back')) qs('#btn-goal-back').addEventListener('click', ()=> show('#step-country'));

if (qs('#btn-goal-next')) {
  qs('#btn-goal-next').addEventListener('click', ()=> {
    let val = qs('#input-goal') ? qs('#input-goal').value.trim() : '';
    state.goal = val.replace(/[^a-zA-Z0-9 .,;:!?áéíóúÁÉÍÓÚñÑ]/g, '').slice(0, 300);
    show('#step-count');
  });
}

// --- Count buttons ---
qsa('.count-btn').forEach(btn => 
  btn.addEventListener('click', ()=> {
    qsa('.count-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.count = Number(btn.dataset.count);
  })
);

if (qs('#btn-count-back')) qs('#btn-count-back').addEventListener('click', ()=> show('#step-goal'));

if (qs('#btn-count-next')) {
  qs('#btn-count-next').addEventListener('click', ()=> {
    state.domains = Array(state.count).fill('').map((_,i)=> state.domains[i] || '');
    state.desc    = Array(state.count).fill('').map((_,i)=> state.desc[i] || '');
    renderDomainInputs();
    show('#step-domains');
  });
}

// --- Domains UI + Validación ---
const domainsContainer = qs('#domains-container');
const btnDomainsNext   = qs('#btn-domains-next');

function renderDomainInputs() {
  if (domainsContainer) domainsContainer.innerHTML = '';
  for (let i = 0; i < state.count; i++) {
    const row = document.createElement('div');
    row.className = 'dom-row';

    const pre = document.createElement('div');
    pre.className = 'prefix';
    pre.textContent = 'https://';

    const input = document.createElement('input');
    input.placeholder = 'nombredelapp';
    input.value = state.domains[i] || '';
    input.maxLength = 37; // límite de 37

    input.addEventListener('input', e => {
      const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      e.target.value = cleaned;
      state.domains[i] = cleaned;
      checkDomainsValid();
    });

    const suf = document.createElement('div');
    suf.className = 'suffix';
    suf.textContent = '.netlify.app';

    row.appendChild(pre);
    row.appendChild(input);
    row.appendChild(suf);
    domainsContainer && domainsContainer.appendChild(row);
  }
  checkDomainsValid();
}

function checkDomainsValid() {
  const ok = state.domains
    .slice(0, state.count)
    .every(d => !!d && /^[a-z0-9-]+$/.test(d) && d.length <= 37);

  if (btnDomainsNext) btnDomainsNext.disabled = !ok;
}

if (qs('#btn-domains-back')) 
  qs('#btn-domains-back').addEventListener('click', ()=> show('#step-count'));

if (btnDomainsNext) 
  btnDomainsNext.addEventListener('click', ()=> { 
    renderDescInputs(); 
    show('#step-desc'); 
  });

// --- Descriptions UI ---
const descContainer = qs('#desc-container');

function renderDescInputs() {
  if (descContainer) descContainer.innerHTML = '';
  for (let i=0; i<state.count; i++) {
    const box = document.createElement('div');

    const title = document.createElement('p');
    title.className = 'muted';
    title.textContent = 'Site: ' + 
      (state.domains[i] ? 'https://' + state.domains[i] + '.netlify.app' : '(sin definir)');

    const ta = document.createElement('textarea');
    ta.placeholder = `Para qué servirá ${state.domains[i] || 'este sitio'}...`;
    ta.value = state.desc[i] || '';
    ta.maxLength = 1200;

    ta.addEventListener('input', e => {
      // elimina cualquier HTML inyectado
      const clean = e.target.value.replace(/<[^>]*>?/gm, '').slice(0, 1200);
      e.target.value = clean;
      state.desc[i] = clean;
    });

    box.appendChild(title);
    box.appendChild(ta);
    descContainer && descContainer.appendChild(box);
  }
}

if (qs('#btn-desc-back')) qs('#btn-desc-back').addEventListener('click', ()=> show('#step-domains'));
if (qs('#btn-desc-next')) qs('#btn-desc-next').addEventListener('click', ()=> { 
  populateSummary(); 
  show('#step-final'); 
  triggerConfetti(); 
});







  // Final summary render
  const finalTitle = qs('#final-title'), summaryBox = qs('#summary');
  function populateSummary(){ if (finalTitle) finalTitle.textContent = '¡TODO LISTO, ' + (state.name ? state.name.toUpperCase() : 'INVENTOR') + '! 💥'; if (summaryBox) summaryBox.innerHTML=''; const info=document.createElement('div'); info.style.display='flex'; info.style.justifyContent='space-between'; info.style.gap='12px'; const left=document.createElement('div'); left.innerHTML = `<p><strong>Usuario:</strong> ${state.name}</p>` + (state.age? `<p><strong>Edad:</strong> ${state.age} años</p>`:'') + (state.country? `<p><strong>País:</strong> ${state.country}</p>`:''); const right=document.createElement('div'); right.innerHTML = `<p><strong>Objetivo:</strong> ${state.goal || ''}</p><p><strong>Sitios:</strong> ${state.count}</p>`; info.appendChild(left); info.appendChild(right); summaryBox && summaryBox.appendChild(info); for(let i=0;i<state.count;i++){ const d=document.createElement('div'); d.style.marginTop='8px'; d.style.padding='10px'; d.style.borderRadius='10px'; d.style.background='linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'; const title=document.createElement('div'); title.style.color='#7dd3fc'; title.style.fontWeight='800'; title.textContent = 'https://' + (state.domains[i] || '(sin definir)') + '.netlify.app'; d.appendChild(title); if(state.desc[i]){ const p=document.createElement('div'); p.style.marginTop='6px'; p.style.color='rgba(255,255,255,0.95)'; p.style.fontSize='13px'; p.textContent = state.desc[i]; d.appendChild(p); } summaryBox && summaryBox.appendChild(d); } }

  // Confetti (simple canvas) — triggered on final
  const confettiCanvas = qs('#confetti-canvas') || (() => {
    const c = document.createElement('canvas'); c.id = 'confetti-canvas'; c.style.position='fixed'; c.style.left=0; c.style.top=0; c.style.pointerEvents='none'; c.style.zIndex=9999; document.body.appendChild(c); return c;
  })();
  function resizeConfettiFull(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; confettiCanvas.style.width = window.innerWidth+'px'; confettiCanvas.style.height = window.innerHeight+'px'; }
  resizeConfettiFull();
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  function spawnConfetti(){ const colors = ['#f97316','#f43f5e','#06b6d4','#8b5cf6','#f59e0b','#34d399']; for(let i=0;i<80;i++){ confettiPieces.push({x:Math.random()*confettiCanvas.width,y:-Math.random()*500+confettiCanvas.height*0.05,r:3+Math.random()*6,c:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,velY:2+Math.random()*6,velX:(Math.random()-0.5)*6}); } }
  function updateConfetti(){ confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); for(let p of confettiPieces){ p.x += p.velX; p.y += p.velY; p.rot += p.velX; confettiCtx.save(); confettiCtx.translate(p.x,p.y); confettiCtx.rotate(p.rot*Math.PI/180); confettiCtx.fillStyle = p.c; confettiCtx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6); confettiCtx.restore(); } confettiPieces = confettiPieces.filter(p=>p.y < confettiCanvas.height + 50); }
  let confettiInterval = null;
  function triggerConfetti(){ spawnConfetti(); if(confettiInterval) clearInterval(confettiInterval); confettiInterval = setInterval(()=>{ updateConfetti(); if(confettiPieces.length===0){ clearInterval(confettiInterval); confettiInterval = null; } }, 16); }

  // --- Helpers used in canvas export ---
  // improved wrapText with optional maxLines
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines){
    if (typeof maxLines === 'undefined') maxLines = Infinity;
    const words = String(text).split(' ');
    let line=''; let curY=y; let lines=0;
    for(let n=0;n<words.length;n++){
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if(testWidth > maxWidth && n>0){
        lines++;
        if(lines > maxLines){
          // truncate previous line with ellipsis
          let trimmed = line.trim(); const ell='…';
          while(trimmed.length && ctx.measureText(trimmed + ell).width > maxWidth) trimmed = trimmed.slice(0,-1);
          ctx.fillText(trimmed + ell, x, curY);
          return curY + lineHeight;
        }
        ctx.fillText(line.trim(), x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if(line){
      lines++;
      if(lines > maxLines){
        let trimmed = line.trim(); const ell='…';
        while(trimmed.length && ctx.measureText(trimmed + ell).width > maxWidth) trimmed = trimmed.slice(0,-1);
        ctx.fillText(trimmed + ell, x, curY);
        return curY + lineHeight;
      }
      ctx.fillText(line.trim(), x, curY);
    }
    return curY + lineHeight;
  }

  // rounded rectangle path
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  // generate a subtle noise pattern on an offscreen canvas and return as pattern
  function makeNoisePattern(scale=1, opacity=0.04){
    const size = 256;
    const oc = document.createElement('canvas');
    oc.width = size; oc.height = size;
    const octx = oc.getContext('2d');
    const img = octx.createImageData(0,0,size,size); // safe fallback if createImageData signature varies
    try { img.data; } catch(e) { /* ignore */ }
    // fallback simple noise
    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        const v = Math.floor(Math.random()*255);
        octx.fillStyle = `rgba(${v},${v},${v},${(opacity*Math.random()).toFixed(2)})`;
        octx.fillRect(i,j,1,1);
      }
    }
    return octx.createPattern(oc,'repeat');
  }

  // draw emoji "stamps" across the canvas for the exported image (decorative)
  function drawEmojiStamps(ctx,width,height,isMobile){
    const emojis = ['✨','🚀','⚡','🌟'];
    const count = isMobile? 6:12;
    ctx.save();
    for(let i=0;i<count;i++){
      const ex = Math.random()* (width - 120) + 60;
      const ey = Math.random()* (height - 160) + 60;
      const fs = (isMobile? 22:34) * (0.6 + Math.random()*1.1);
      ctx.font = `bold ${fs}px Arial`;
      ctx.globalAlpha = 0.12 + Math.random()*0.25;
      ctx.fillText(emojis[Math.floor(Math.random()*emojis.length)], ex, ey);
    }
    ctx.restore();
  }

 
























































































































































  // --- Reemplazo: Generación de imagen (fija, no cambia por dispositivo) ---
(function(){
  const LOGICAL_WIDTH = 1400;
  const LOGICAL_HEIGHT = 820;
  const MIME = 'image/png';
  const FILE_PREFIX = 'DEV-Web';

  function ensureCanvas(id = 'hidden-canvas') {
    let c = document.getElementById(id);
    if (!c) {
      c = document.createElement('canvas');
      c.id = id;
      c.style.display = 'none';
      document.body.appendChild(c);
    }
    return c;
  }

  // Truncamiento simple por si hay que cortar con "..."
  function truncateTextToWidth(ctx, text, maxWidth) {
    if (!text) return '';
    if (ctx.measureText(text).width <= maxWidth) return text;
    let lo = 0, hi = text.length, best = '';
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const cand = text.slice(0, mid) + '...';
      if (ctx.measureText(cand).width <= maxWidth) { best = cand; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    return best || (text.slice(0, 8) + '...');
  }

  // Parte una palabra sin espacios en trozos que quepan en maxWidth
  function breakLongWord(ctx, word, maxWidth) {
    const parts = [];
    let i = 0;
    while (i < word.length) {
      let lo = 1, hi = word.length - i, best = 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const sub = word.slice(i, i + mid);
        if (ctx.measureText(sub).width <= maxWidth) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      parts.push(word.slice(i, i + best));
      i += best;
    }
    return parts;
  }

  // Devuelve las líneas que se van a dibujar (sin dibujar)
  function makeLines(ctx, text, maxWidth, maxLines = Infinity) {
    const words = (text || '').split(' ').flatMap(w =>
      ctx.measureText(w).width > maxWidth ? breakLongWord(ctx, w, maxWidth) : [w]
    );

    const lines = [];
    let line = '';

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const test = line ? (line + ' ' + w) : w;

      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        // ¿Estamos en la última línea disponible?
        if (lines.length + 1 === maxLines) {
          const rest = (line ? line + ' ' : '') + w + ' ' + words.slice(i + 1).join(' ');
          lines.push(truncateTextToWidth(ctx, rest, maxWidth));
          return lines;
        }
        lines.push(line);
        line = w;
      }
    }

    if (line) {
      if (lines.length + 1 > maxLines) {
        lines[lines.length - 1] = truncateTextToWidth(ctx, line, maxWidth);
      } else {
        lines.push(line);
      }
    }
    return lines;
  }

  // Dibuja las líneas y devuelve la Y (baseline) de la última línea
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const lines = makeLines(ctx, text, maxWidth, maxLines);
    let curY = y;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, curY);
      if (i < lines.length - 1) curY += lineHeight;
    }
    return curY; // baseline de la última línea dibujada
  }

  const btnDownload = qs('#btn-download');
  if (!btnDownload) return;

  btnDownload.addEventListener('click', () => {
    if (!state || !state.name || !state.name.trim()){
      alert('Agrega tu nombre antes de generar.'); show('#step-name'); return;
    }

    btnDownload.disabled = true;
    btnDownload.classList.add('loading');

    try {
      const canvas = ensureCanvas('hidden-canvas');
      const dpr = window.devicePixelRatio || 1;
      const width = LOGICAL_WIDTH;
      let height = LOGICAL_HEIGHT;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      let ctx = canvas.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);

      // BACKGROUND
      const g = ctx.createLinearGradient(0,0,width,height);
      g.addColorStop(0,'#041526'); g.addColorStop(0.35,'#023e6b'); g.addColorStop(0.68,'#0ea5e9'); g.addColorStop(1,'#f97316');
      ctx.fillStyle = g; ctx.fillRect(0,0,width,height);

      const radial = ctx.createRadialGradient(width*0.7, height*0.2, 40, width*0.7, height*0.2, Math.max(width,height));
      radial.addColorStop(0, 'rgba(255,255,255,0.06)');
      radial.addColorStop(0.15, 'rgba(255,255,255,0.03)');
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial; ctx.fillRect(0,0,width,height);

      try { ctx.globalAlpha = 1.0; ctx.fillStyle = makeNoisePattern(1, 0.06); ctx.fillRect(0,0,width,height); } catch(e) {}
      ctx.fillStyle = 'rgba(0,0,0,0)';

      // PANEL
      const pad = 40;
      ctx.save(); ctx.shadowColor = 'rgba(2,6,23,0.6)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(8,20,30,0.42)';
      roundRect(ctx,pad,pad,width-pad*2,height-pad*2,26); ctx.fill(); ctx.restore();
      ctx.save(); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      roundRect(ctx,pad,pad,width-pad*2,height-pad*2,26); ctx.stroke(); ctx.restore();

      const ribbonH = 84;
      ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.03)';
      roundRect(ctx,pad,pad,width-pad*2,ribbonH,18); ctx.fill(); ctx.restore();






// TITLE  
ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 48px Arial';
ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 6;
ctx.fillText('🚀  PROYECTO ÉPICO  🚀', width/2, pad + 56); ctx.shadowBlur = 0;
ctx.save(); ctx.font = '44px Arial'; ctx.globalAlpha = 0.95; ctx.fillText('✨', width - pad - 36, pad + 44); ctx.restore();

drawEmojiStamps(ctx,width,height,false);

// LAYOUT
const leftX = pad + 28;
const leftW = Math.floor((width - pad*2) * 0.52);
const rightX = leftX + leftW + 36;
const rightW = width - rightX - pad - 18;
let curY = pad + ribbonH + 18;
const lineH = 26;

ctx.textAlign = 'left';
ctx.fillStyle = 'rgba(255,255,255,0.95)';


//pegar 














// Dominios
ctx.font = 'bold 18px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.95)';
ctx.fillText('DOMINIOS:', leftX, curY);
curY += lineH;

// Limitamos a 3 webs (primeras 3)
const rawDomainCount = Math.max(0, Number(state.count) || (state.domains && state.domains.length) || 0);
const domainCount = Math.min(3, rawDomainCount);

// Calculamos espacio disponible para que las 3 tarjetas no se solapen
const bottomMargin = 24; // margen inferior fijo
const availableStartY = curY;
const availableHeight = (height - pad - bottomMargin) - availableStartY;
const cardGap = 12; // espacio entre tarjetas

// Aumentamos la altura de las tarjetas para dar más espacio a la descripción
let cardH = domainCount > 0
  ? Math.floor((availableHeight - (domainCount - 1) * cardGap) / domainCount)
  : 120; // Aumentamos la altura base aún más

// Ajustamos los límites para dar más espacio a la descripción
if (cardH > 180) cardH = 180; // Aumentamos el máximo
if (cardH < 100) cardH = 100;   // Aumentamos el mínimo

// usamos ctx.font y demás como siempre
ctx.font = '16px Arial';

for (let i = 0; i < domainCount; i++) {
  const domain = state.domains && state.domains[i] ? state.domains[i] : '(sin-definir)';
  const normalizedDomain = domain.replace(/^https?:\/\//i,'').replace(/\/+$/,'');
  
  
// Mostrar el dominio completo con https:// y .netlify.app
const displayText = 'https://' + normalizedDomain + '.netlify.app';
  const cardX = leftX;
  const cardW = leftW - 12;

  // Dibujamos tarjeta centrada en la altura de cardH
  ctx.save();
  const cardGrad = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
  cardGrad.addColorStop(0, 'rgba(255,255,255,0.02)');
  cardGrad.addColorStop(1, 'rgba(255,255,255,0.01)');
  ctx.fillStyle = cardGrad;
  // Ajusto un poco la y para que la tarjeta "respire" verticalmente dentro de cardH
  roundRect(ctx, cardX, curY - 8, cardW, cardH, 12);
  ctx.fill();
  ctx.restore();

  // icono del dominio y texto a la misma altura
  ctx.font = '20px Arial'; ctx.fillStyle = '#7dd3fc';
  ctx.fillText('🌐', cardX + 12, curY + 24); // Ajustamos la posición vertical del emoji

  // Dominio completo al lado del emoji (misma altura)
  ctx.font = 'bold 15px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.95)';
  const insideTop = curY + 8;
  
  // Dibujamos el dominio completo al lado del emoji
  // Si es muy largo, lo partimos en varias líneas
  const domainLines = makeLines(ctx, displayText, cardW - 64, 2); // Máximo 2 líneas para el dominio
  let domainY = curY + 20; // Misma altura que el emoji
  
  for (let j = 0; j < domainLines.length; j++) {
    ctx.fillText(domainLines[j], cardX + 44, domainY);
    domainY += 18; // Espaciado entre líneas del dominio
  }
  
  // Espacio después del dominio para la descripción
  let afterUrlY = domainY + 12;

  // Descripción (si existe) — ahora tenemos más espacio
  if (state.desc && state.desc[i]) {
    ctx.font = '14px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.92)';
    const insideBottom = curY + cardH - 10;
    const remainingHeight = insideBottom - afterUrlY;
    
    // Calculamos cuántas líneas caben
    const descLineHeight = 20;
    const maxDescLines = Math.max(1, Math.floor(remainingHeight / descLineHeight));
    
    // Dibujamos la descripción completa con el máximo de líneas posibles
    const endY = wrapText(ctx, state.desc[i], cardX + 44, afterUrlY, cardW - 56, descLineHeight, maxDescLines);
    
    // colocamos curY justo después de la tarjeta
    const usedInCard = Math.max(endY - curY, cardH);
    curY = curY + usedInCard + cardGap - 8;
  } else {
    // no hay descripción: avanzamos curY manteniendo altura de tarjeta
    curY = curY + cardH + cardGap - 8;
  }
}

// Si había más de 3 dominios, mostramos aviso (sin tapar nada)
if (rawDomainCount > 3) {
  ctx.font = '15px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('Mostrando las primeras 3 webs de ' + rawDomainCount + '.', leftX + 8, curY + 6);
  curY += lineH;
}






      // Resumen (derecha)
      ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.02)';
      roundRect(ctx, rightX, pad + ribbonH + 8, rightW, 120, 12); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
      roundRect(ctx, rightX, pad + ribbonH + 8, rightW, 120, 12); ctx.stroke();
      ctx.restore();

      const infoStartY = pad + ribbonH + 36;
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.font = 'bold 16px Arial';
      ctx.fillText('Resumen', rightX + 18, infoStartY - 6);
      ctx.font = '15px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.90)';
      const goalShort = state.goal ? (state.goal.length > 50 ? state.goal.slice(0,50) + '...' : state.goal) : '(no definido)';
      ctx.fillText('Objetivo: ' + goalShort, rightX + 18, infoStartY + 18);
      ctx.fillText('Sitios: ' + domainCount, rightX + 18, infoStartY + 44);

     // Footer & watermark
ctx.textAlign = 'center'; 
ctx.font = 'bold 15px Arial'; 
ctx.fillStyle = 'rgba(255,255,255,0.95)';
ctx.fillText(CONFIG.watermarkText, width/2, height - 46);

// Footer dinámico
ctx.textAlign = 'left'; 
ctx.font = '13px Arial'; 
ctx.fillStyle = 'rgba(255,255,255,0.55)';

// Aquí llamamos la función para que se rellene automáticamente
ctx.fillText(CONFIG.footerText(), pad + 24, height - 24);


      // Export
      canvas.toBlob((blob) => {
        if (!blob) { alert('Error al crear la imagen.'); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = (state.name ? state.name.replace(/[^a-z0-9]/gi,'') : 'proyecto') || 'proyecto';
        a.download = FILE_PREFIX + '-' + safeName + '.png';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof triggerConfetti === 'function') triggerConfetti();
      }, MIME, 0.95);

    } catch (err) {
      console.error('Error generando imagen:', err);
      alert('Ocurrió un error al generar la imagen. Revisa la consola.');
    } finally {
      btnDownload.disabled = false;
      btnDownload.classList.remove('loading');
    }
  });
})();














































































  })();

  // copy summary text
  if (qs('#btn-copy')) qs('#btn-copy').addEventListener('click', ()=> {
    let summary = '🚀 PROYECTO ÉPICO 🚀\n\nUsuario: ' + state.name + '\n'; if(state.age) summary += 'Edad: ' + state.age + ' años\n'; if(state.country) summary += 'País: ' + state.country + '\n'; if(state.goal) summary += 'Objetivo: ' + state.goal + '\n'; summary += 'Sitios: ' + state.count + '\n\nDOMINIOS:\n'; for(let i=0;i<state.count;i++){ summary += 'https://' + (state.domains[i] || '(sin definir)') + '.netlify.app\n'; if(state.desc[i]) summary += 'Descripción: ' + state.desc[i] + '\n'; } navigator.clipboard.writeText(summary).then(()=> alert('Resumen copiado al portapapeles.'), ()=> alert('No se pudo copiar al portapapeles.'));
  });

  // Reset
  if (qs('#btn-reset')) qs('#btn-reset').addEventListener('click', ()=> {
    state.name=''; state.age=''; state.country=''; state.goal=''; state.count=1; state.domains=['']; state.desc=[''];
    if (inputName) inputName.value=''; if (qs('#input-age')) qs('#input-age').value=''; if (qs('#input-country')) qs('#input-country').value=''; if (qs('#input-goal')) qs('#input-goal').value='';
    qsa('.count-btn').forEach(b=>b.classList.remove('active')); if (qsa('.count-btn')[0]) qsa('.count-btn')[0].classList.add('active'); show('#step-name');
  });

  // small UX: enable/disable next name button on load
  if (btnNameNext) btnNameNext.disabled = true;
  if (inputName) inputName.addEventListener('input', ()=>{ if (btnNameNext) btnNameNext.disabled = !inputName.value.trim(); });

  // resize confetti canvas on resize
  window.addEventListener('resize', ()=>{ resizeConfettiFull(); });


