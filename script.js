// Segnala che il JS è attivo: solo allora le animazioni fade-in nascondono
// il contenuto. Senza JS (o se qualcosa va storto) il testo resta visibile.
document.documentElement.classList.add('js');

/* ------------------------------------------------------------------ *
 * Navbar e footer condivisi (SORGENTE UNICA).
 * Sono qui come stringhe e iniettati via JavaScript: così si modificano
 * in un solo punto e funzionano sia su GitHub Pages sia aprendo i file
 * in locale col doppio-click (niente fetch, che il browser blocca su file://).
 * Per cambiare un link o un recapito, modifica SOLO qui sotto.
 * ------------------------------------------------------------------ */
const SITE_NAVBAR = `
<nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item title is-4 has-text-white mb-0" href="index.html">
        E. Ruzziconi
      </a>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item" href="index.html#home">Home</a>
        <a class="navbar-item" href="index.html#chi-sono">Chi sono</a>
        <a class="navbar-item" href="index.html#passioni">Passioni</a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">Materie</a>
          <div class="navbar-dropdown">
            <a class="navbar-item" href="materia-informatica.html">Informatica</a>
            <a class="navbar-item" href="materia-sistemi-reti.html">Sistemi e Reti</a>
            <a class="navbar-item" href="materia-tpsit.html">TPSIT</a>
            <a class="navbar-item" href="materia-gpoi.html">GPOI</a>
            <a class="navbar-item" href="materia-matematica.html">Matematica</a>
            <a class="navbar-item" href="materia-ia.html">Intelligenza Artificiale</a>
            <a class="navbar-item" href="materia-italiano.html">Italiano</a>
            <a class="navbar-item" href="materia-storia.html">Storia</a>
            <a class="navbar-item" href="materia-inglese.html">Inglese</a>
            <a class="navbar-item" href="materia-scienze-motorie.html">Scienze Motorie</a>
            <a class="navbar-item" href="materia-religione.html">Religione</a>
          </div>
        </div>

        <a class="navbar-item" href="FSL.html">FSL (EX-PCTO)</a>
        <a class="navbar-item" href="educazione-civica.html">Educazione Civica</a>
      </div>
    </div>
  </div>
</nav>`;

const SITE_FOOTER = `
<footer class="footer has-background-dark has-text-white mt-6">
  <div class="content has-text-centered">
    <p>
      <strong>Emanuele Ruzziconi</strong><br>
      IIS Marconi Pieralisi di Jesi - Indirizzo Informatica e Telecomunicazioni
    </p>
    <div class="is-flex is-justify-content-center" style="gap: 1.5rem; flex-wrap: wrap;">
      <a href="mailto:emanueleruzziconi1@gmail.com" class="has-text-info">emanueleruzziconi1@gmail.com</a>
      <a href="tel:3347134379" class="has-text-info">3347134379</a>
      <p>Via V. de grandis, 2 - Ostra (AN)</p>
    </div>
    <div class="is-flex is-justify-content-center mt-3" style="gap: 1.5rem;">
      <a href="https://github.com/Manux17" class="has-text-white" target="_blank">GitHub</a>
      <a href="https://instagram.com/manu_ruzzi_" class="has-text-white" target="_blank">Instagram</a>
    </div>
  </div>
</footer>`;

// Sostituisce il segnaposto (#site-navbar / #site-footer) col markup condiviso.
function injectPartial(id, html) {
  const mount = document.getElementById(id);
  if (mount && html) mount.outerHTML = html;
}

// Logica della navbar: va eseguita DOPO l'iniezione (gli elementi non
// esistono finché il markup non è stato inserito).
function initNavbar() {
  // Evidenzia la voce corrispondente alla pagina corrente
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-item[href]').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('is-active');
    }
  });

  // Apertura/chiusura del menu su mobile (burger)
  document.querySelectorAll('.navbar-burger').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.target);
      el.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
    });
  });

  // Apertura del dropdown "Materie" al tap su mobile
  document.querySelectorAll('.navbar-item.has-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', () => {
      if (window.innerWidth <= 1023) dropdown.classList.toggle('is-active');
    });
  });
}

// Animazioni di entrata. Il contenuto resta comunque sempre visibile grazie
// ai fallback qui sotto, anche se l'IntersectionObserver non scatta.
function initFadeIn() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.15 });

  const animated = document.querySelectorAll('.fade-in-up');
  animated.forEach(el => observer.observe(el));

  const revealIfVisible = () => {
    animated.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
    });
  };
  window.addEventListener('load', revealIfVisible);
  revealIfVisible();
  // Rete di sicurezza: dopo un breve ritardo rivela tutto ciò che è rimasto.
  setTimeout(() => animated.forEach(el => el.classList.add('is-visible')), 800);
}

document.addEventListener('DOMContentLoaded', () => {
  injectPartial('site-navbar', SITE_NAVBAR);
  injectPartial('site-footer', SITE_FOOTER);
  initNavbar();
  initFadeIn();
});
