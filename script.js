document.addEventListener('DOMContentLoaded', () => {

  // Highlight active navbar item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navbarItems = document.querySelectorAll('.navbar-item[href]');
  
  navbarItems.forEach(item => {
    const href = item.getAttribute('href');
    // Match the current page with the href
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('is-active');
    }
  });

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });

  // Mobile dropdown toggle fix
  const $dropdowns = document.querySelectorAll('.navbar-item.has-dropdown');
  $dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 1023) {
        dropdown.classList.toggle('is-active');
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in-up');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});
