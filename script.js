/* ============================================================
   DENISE DE PAULA — Main Script
   ============================================================ */

// ── Header scroll effect ────────────────────────────────────
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.style.borderBottomColor = y > 60
      ? 'rgba(184,150,90,.35)'
      : 'rgba(184,150,90,.2)';
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
});

// ── Mobile nav ──────────────────────────────────────────────
function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Intersection observer — fade-up ────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ── Gallery tabs ────────────────────────────────────────────
function switchTab(btn, panelId) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.gallery-panel').forEach(p => p.style.display = 'none');
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.style.display = 'block';
    panel.querySelectorAll('.fade-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => io.observe(el), 20);
    });
  }
}

// ── Testimonials carousel ───────────────────────────────────
let testimonialIdx = 0;

function getVisible() {
  return window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
}

function updateCarousel() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const cardPct = 100 / vis;
  const maxIdx = Math.max(0, cards.length - vis);
  testimonialIdx = Math.min(testimonialIdx, maxIdx);
  cards.forEach(c => {
    c.style.width = cardPct + '%';
    c.style.minWidth = cardPct + '%';
  });
  track.style.transform = `translateX(-${cardPct * testimonialIdx}%)`;
}

function nextTestimonial() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const maxIdx = cards.length - vis;
  testimonialIdx = testimonialIdx >= maxIdx ? 0 : testimonialIdx + 1;
  updateCarousel();
}

function prevTestimonial() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const maxIdx = cards.length - vis;
  testimonialIdx = testimonialIdx <= 0 ? maxIdx : testimonialIdx - 1;
  updateCarousel();
}

// Auto-advance
let autoPlay = setInterval(nextTestimonial, 5500);
document.getElementById('testimonialsTrack')?.addEventListener('mouseenter', () => clearInterval(autoPlay));
document.getElementById('testimonialsTrack')?.addEventListener('mouseleave', () => {
  autoPlay = setInterval(nextTestimonial, 5500);
});

window.addEventListener('resize', updateCarousel);
updateCarousel();

// ── Load testimonials from admin ────────────────────────────
function loadTestimonials() {
  try {
    const cfg = JSON.parse(localStorage.getItem('dp_config') || '{}');
    const saved = cfg.testimonials || [];
    if (!saved.length) return;
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    track.innerHTML = saved.map(t => `
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <div class="author-avatar">${(t.name || 'A').charAt(0).toUpperCase()}</div>
          <div>
            <div class="author-name">${t.name || ''}</div>
            <div class="author-city">${t.city || ''}</div>
          </div>
        </div>
      </div>
    `).join('');
    testimonialIdx = 0;
    updateCarousel();
  } catch(e) {}
}

// ── Form submissions ────────────────────────────────────────
function submitHeroForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]')?.value || '';
  const phone = form.querySelector('input[type="tel"]')?.value || '';
  const service = form.querySelector('select')?.value || '';
  const msg = encodeURIComponent(
    `Olá Denise! Me chamo ${name}.\nTenho interesse em: ${service}.\nMeu WhatsApp: ${phone}\n\nGostaria de agendar uma avaliação gratuita.`
  );
  window.open(`https://wa.me/5541974016961?text=${msg}`, '_blank');
}

function submitMainForm(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, select, textarea');
  let name = '', phone = '', service = '', message = '';
  inputs.forEach(inp => {
    if (inp.type === 'text' && !name) name = inp.value;
    if (inp.type === 'tel') phone = inp.value;
    if (inp.tagName === 'SELECT') service = inp.value;
    if (inp.tagName === 'TEXTAREA') message = inp.value;
  });
  const msg = encodeURIComponent(
    `Olá Denise!\n\nSou ${name}.\nInteresse: ${service || 'Geral'}\nTelefone: ${phone}\n\n${message}`
  );
  window.open(`https://wa.me/5541974016961?text=${msg}`, '_blank');
}

// ── Site images (managed via admin, stored in localStorage) ─
let vitrinePhotos = [];
let lbIndex = 0;

// Fotos padrão (as do repositório)
const DEFAULT_VITRINE = [
  { url: 'fotos/micropigmentacao.sobrancelha.jpg',   caption: 'Sobrancelhas' },
  { url: 'fotos/micropigmentacao.sobrancelha.1.jpg', caption: 'Sobrancelhas' },
  { url: 'fotos/micropigmentacao.labios_.jpg',       caption: 'Lábios' },
  { url: 'fotos/micropigmentacao.labios.2.jpg',      caption: 'Lábios' },
  { url: 'fotos/micropigmentacaoavaliacao.jpg',      caption: 'Avaliação' },
  { url: 'fotos/micropigmentacao.correcao.jpg',      caption: 'Correção' },
];

function loadSiteImages() {
  try {
    const cfg = JSON.parse(localStorage.getItem('dp_config') || '{}');

    // Hero background image
    const heroBg = document.getElementById('heroBgImg');
    if (heroBg && cfg.heroImage) {
      heroBg.style.backgroundImage = `url('${cfg.heroImage}')`;
      heroBg.style.backgroundSize = 'cover';
      heroBg.style.backgroundPosition = 'center top';
      heroBg.style.opacity = '0.55';
    }

    // Logo do site
    const logoText = document.getElementById('logoIconText');
    const logoImg  = document.getElementById('logoIconImg');
    if (logoImg && cfg.logoImage) {
      logoImg.src = cfg.logoImage;
      logoImg.style.display = 'block';
      if (logoText) logoText.style.display = 'none';
    }

    // Foto da Denise no hero (desktop + mobile)
    const photoImg   = document.getElementById('heroPhotoImg');
    const photoPlch  = document.getElementById('heroPhotoPlaceholder');
    const photoMobile = document.getElementById('heroPhotoMobile');
    if (cfg.denisePhoto) {
      if (photoImg)   { photoImg.src = cfg.denisePhoto; photoImg.style.display = 'block'; }
      if (photoPlch)  { photoPlch.style.display = 'none'; }
      if (photoMobile){ photoMobile.src = cfg.denisePhoto; }
    }

    // Vitrine: usa fotos do admin se existirem, senão usa padrão
    const savedPhotos = cfg.vitrinePhotos || [];
    vitrinePhotos = savedPhotos.length > 0 ? savedPhotos : DEFAULT_VITRINE;

    // Se admin configurou fotos, re-renderiza o grid
    if (savedPhotos.length > 0) {
      const grid = document.getElementById('vitrineGrid');
      if (!grid) return;
      grid.innerHTML = vitrinePhotos.map((p, i) => `
        <div class="vitrine-item fade-up" onclick="openLightbox(${i})" style="transition-delay:${(i % 4) * 0.06}s">
          <img src="${p.url}" alt="${p.caption || 'Resultado Denise de Paula'}" loading="lazy">
          <div class="vitrine-overlay">
            <span class="vitrine-caption">${p.caption || ''}</span>
          </div>
        </div>
      `).join('');
      grid.querySelectorAll('.fade-up').forEach(el => io.observe(el));
    } else {
      vitrinePhotos = DEFAULT_VITRINE;
    }

    // Galeria Antes/Depois — carrega do admin se existirem
    ['sobrancelhas', 'labios', 'olhos'].forEach(cat => {
      const photos = cfg['galeria_' + cat] || [];
      if (!photos.length) return;
      const grid = document.getElementById(cat + '-grid');
      if (!grid) return;
      grid.innerHTML = photos.map((p, i) => `
        <div class="gallery-item fade-up" style="transition-delay:${i * 0.05}s">
          <img src="${p.url}" alt="${p.caption || ''}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">
          <div class="gallery-caption">${p.caption || ''}</div>
        </div>
      `).join('');
      grid.querySelectorAll('.fade-up').forEach(el => io.observe(el));
    });

  } catch(e) {
    vitrinePhotos = DEFAULT_VITRINE;
  }
}

// Lightbox
function openLightbox(idx) {
  if (!vitrinePhotos.length) return;
  lbIndex = idx;
  const lb = document.getElementById('vitrineL');
  if (!lb) return;
  renderLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('vitrineL');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
function lbPrev() { lbIndex = (lbIndex - 1 + vitrinePhotos.length) % vitrinePhotos.length; renderLightbox(); }
function lbNext() { lbIndex = (lbIndex + 1) % vitrinePhotos.length; renderLightbox(); }
function renderLightbox() {
  const p = vitrinePhotos[lbIndex];
  if (!p) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  if (img) img.src = p.url;
  if (cap) cap.textContent = p.caption || '';
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('vitrineL');
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'Escape')     closeLightbox();
});

// Init on load
loadSiteImages();
loadTestimonials();

// ── Smooth scroll for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
