// Segnala che il JS è attivo: solo allora le animazioni fade-in nascondono
// il contenuto. Senza JS (o se qualcosa va storto) il testo resta visibile.
document.documentElement.classList.add('js');

// Carica un frammento condiviso (partials/) e lo inietta al posto del segnaposto.
function loadPartial(id, url) {
  const mount = document.getElementById(id);
  if (!mount) return Promise.resolve();
  return fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.text();
    })
    // Sorgente fidata: file statico dello stesso sito (nessun input utente),
    // quindi l'assegnazione di outerHTML qui non comporta rischi XSS.
    .then(html => { mount.outerHTML = html; })
    .catch(err => console.error('Impossibile caricare', url, err));
}

// Logica della navbar: va eseguita DOPO l'iniezione (gli elementi non
// esistono finché il partial non è stato inserito).
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
  Promise.all([
    loadPartial('site-navbar', 'partials/navbar.html'),
    loadPartial('site-footer', 'partials/footer.html')
  ]).then(initNavbar);

  initFadeIn();
});
