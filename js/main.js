/* main.js - presentation-ready helpers: loader, mobile menu, demo auth, image reveal, navbar scroll */
document.addEventListener('DOMContentLoaded', () => {
  // Loader fade
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Mobile menu
  const menuBtn = document.querySelector('.menu-toggle');
  let mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) {
    mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="jaipur.html">Jaipur</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="login.html">Login</a>
    `;
    document.body.appendChild(mobileNav);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Header scrolled style
  const header = document.querySelector('.header');
  const checkHeader = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  checkHeader();
  window.addEventListener('scroll', checkHeader);

  // Reveal images when intersecting
  const imgs = document.querySelectorAll('.card img, .team-member img');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {rootMargin: '0px 0px -80px 0px', threshold: 0.15});
    imgs.forEach(i => io.observe(i));
  } else {
    imgs.forEach(i => i.classList.add('visible'));
  }

  // Scroll-down arrow click (if present)
  const sd = document.querySelector('.scroll-down');
  if (sd) {
    sd.addEventListener('click', (e) => {
      window.scrollTo({top: window.innerHeight * 0.9, behavior: 'smooth'});
    });
  }

  /* ------------- Demo auth (localStorage) ------------- */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const name = (fd.get('name') || '').trim();
      const email = (fd.get('email') || '').toLowerCase().trim();
      const password = fd.get('password') || '';
      if (!name || !email || password.length < 6) { alert('Complete form: name, email and password ≥6 chars'); return; }
      const users = JSON.parse(localStorage.getItem('jj_users') || '[]');
      if (users.some(u => u.email === email)) { alert('Email already registered (demo).'); return; }
      users.push({ name, email, password });
      localStorage.setItem('jj_users', JSON.stringify(users));
      alert('Registered (demo). You can login now.');
      window.location.href = 'login.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = (fd.get('email') || '').toLowerCase().trim();
      const password = fd.get('password') || '';
      const users = JSON.parse(localStorage.getItem('jj_users') || '[]');
      const u = users.find(x => x.email === email && x.password === password);
      if (u) {
        localStorage.setItem('jj_session', JSON.stringify({ email: u.email, name: u.name }));
        alert('Login successful (demo).');
        window.location.href = 'index.html';
      } else {
        alert('Invalid credentials (demo).');
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const data = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), at: new Date().toISOString() };
      const messages = JSON.parse(localStorage.getItem('jj_messages') || '[]');
      messages.push(data);
      localStorage.setItem('jj_messages', JSON.stringify(messages));
      alert('Message recorded (demo). Thanks!');
      contactForm.reset();
    });
  }
});
