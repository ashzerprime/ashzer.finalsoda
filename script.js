/*
  Script pour le site "Soda inutile — mais satisfaisant"
  --------------------------------------------------------
  Fonctions principales :
  - Remplit la bouteille au survol / toucher / appui clavier
  - Vide la bouteille quand on arrête de la toucher
  - Fait apparaître des bulles animées pendant le remplissage
*/

const bottle = document.getElementById('bottle');
const wrap = document.getElementById('bottleWrap');
const liquidGroup = document.getElementById('liquidGroup');
const bubblesContainer = document.getElementById('bubbles');

let filling = false;
let bubbleInterval = null;

/* Fonction qui applique la variable CSS --fill à la translation de l’eau dans le SVG */
function applyFillVar() {
  const cs = getComputedStyle(bottle);
  const raw = cs.getPropertyValue('--fill').trim() || '100%';
  const pct = parseFloat(raw.replace('%', ''));
  // Déplace le liquide verticalement en fonction du pourcentage
  liquidGroup.style.transform = `translateY(${pct}%)`;
}

/* Création d’une bulle animée */
function spawnBubble() {
  const b = document.createElement('div');
  b.className = 'bubble';

  // Position horizontale et taille aléatoires
  const left = 10 + Math.random() * 80;
  const size = 6 + Math.random() * 18;
  b.style.left = left + '%';
  b.style.width = size + 'px';
  b.style.height = size + 'px';

  // Durée d'animation variable
  const dur = 2200 + Math.random() * 1600;
  b.style.animationDuration = dur + 'ms';
  b.style.background = 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.05) 80%)';
  b.style.opacity = 0.95;

  bubblesContainer.appendChild(b);

  // Suppression de la bulle après animation
  setTimeout(() => b.remove(), dur + 50);
}

/* Lance la génération de bulles */
function startBubbles() {
  if (bubbleInterval) return;
  bubbleInterval = setInterval(() => {
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) spawnBubble();
  }, 300);
}

/* Arrête les bulles */
function stopBubbles() {
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }
  setTimeout(() => {
    bubblesContainer.querySelectorAll('.bubble').forEach((b) => b.remove());
  }, 400);
}

/* Définit si la bouteille est remplie ou non */
function setFilled(state) {
  filling = !!state;
  if (filling) {
    bottle.classList.add('filled');
    bottle.style.setProperty('--fill', '0%');
    bottle.setAttribute('aria-pressed', 'true');
    startBubbles();
  } else {
    bottle.classList.remove('filled');
    bottle.style.setProperty('--fill', '100%');
    bottle.setAttribute('aria-pressed', 'false');
    stopBubbles();
  }
  applyFillVar();
}

/* Initialisation */
setFilled(false);

/* ----- Événements utilisateur ----- */

// Souris
wrap.addEventListener('mouseenter', () => setFilled(true));
wrap.addEventListener('mouseleave', () => setFilled(false));

// Écran tactile
wrap.addEventListener('touchstart', (e) => {
  e.preventDefault();
  setFilled(true);
}, { passive: false });

wrap.addEventListener('touchend', () => setFilled(false));
wrap.addEventListener('touchcancel', () => setFilled(false));

// Clavier (Espace ou Entrée)
wrap.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    setFilled(true);
  }
});

wrap.addEventListener('keyup', (e) => {
  if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    setFilled(false);
  }
});

// Observe les changements de style pour synchroniser le SVG
const observer = new MutationObserver(applyFillVar);
observer.observe(bottle, { attributes: true, attributeFilter: ['style'] });

// Synchronisation initiale
applyFillVar();
