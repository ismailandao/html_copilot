(function () {
  function getEls() {
    return {
      button: document.getElementById('menu-toggle'),
      nav: document.querySelector('nav[role="navigation"]'),
      menu: document.getElementById('primary-navigation'),
    };
  }

  function setOpen(open, els) {
    const { button, nav, menu } = els;
    if (!button || !nav || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
  }

  // Example: toggleMenu()
  window.toggleMenu = function toggleMenu() {
    const els = getEls();
    const { button } = els;
    if (!button) return;
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen, els);
  };

  // Copilot: initialize menu toggle + smooth scrolling for in-page links
  document.addEventListener('DOMContentLoaded', () => {
    const els = getEls();

    // Initialize hamburger menu (closed) and bind click handler
    if (els.button) {
      setOpen(false, els);
      els.button.addEventListener('click', window.toggleMenu);
    }

    // Smooth scroll for navigation links that reference sections on this page
    // - Prevent default jump
    // - Scroll smoothly
    // - Update URL hash
    // - Move focus to target for accessibility
    const navLinks = document.querySelectorAll('nav[role="navigation"] a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        // Smooth scroll (fallback to instant if smooth not supported)
        try {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {
          target.scrollIntoView();
        }

        // Update URL hash without triggering an additional jump
        history.pushState(null, '', hash);

        // Move focus to the section for screen reader and keyboard users
        const hadTabIndex = target.hasAttribute('tabindex');
        if (!hadTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabIndex) {
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }

        // Close mobile menu after navigation
        if (els.button) setOpen(false, els);
      });
    });
  });

  // Copilot: project category filtering
  // Example usage: filterProjects('web') or filterProjects('all')
  function filterProjects(category = 'all') {
    const cat = String(category).toLowerCase();
    const cards = document.querySelectorAll('#projects .project');
    const buttons = document.querySelectorAll('.project-filters .filter-btn');

    cards.forEach((card) => {
      const tokens = (card.getAttribute('data-category') || '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const match = cat === 'all' || tokens.includes(cat);
      card.hidden = !match; // hides from layout and a11y tree
    });

    // Update button states
    buttons.forEach((btn) => {
      const isActive = (btn.dataset.filter || 'all').toLowerCase() === cat;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.classList.toggle('is-active', isActive);
    });
  }

  // Wire up filter buttons (delegated)
  document.addEventListener('DOMContentLoaded', () => {
    const filterBar = document.querySelector('.project-filters');
    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterProjects(btn.dataset.filter || 'all');
      });
    }
  });

  // Expose example function globally if needed
  window.filterProjects = filterProjects;

  // Lightbox: build elements once
  function buildLightbox() {
    let root = document.getElementById('lightbox');
    if (!root) {
      root = document.createElement('div');
      root.id = 'lightbox';
      root.className = 'lightbox';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('hidden', '');
      root.innerHTML = `
        <div class="lightbox__backdrop" data-close></div>
        <div class="lightbox__dialog" role="document">
          <button type="button" class="lightbox__close" aria-label="Close image" data-close>&times;</button>
          <figure class="lightbox__figure">
            <img id="lightbox-image" alt="">
            <figcaption id="lightbox-caption" class="visually-hidden"></figcaption>
          </figure>
        </div>
      `;
      document.body.appendChild(root);
    }
    return {
      root,
      img: root.querySelector('#lightbox-image'),
      caption: root.querySelector('#lightbox-caption'),
      closeBtn: root.querySelector('.lightbox__close'),
    };
  }

  let lbEls;
  let lastFocus = null;

  // Open the lightbox with given source/alt/caption
  function openLightbox(src, alt = '', captionText = '') {
    lbEls = lbEls || buildLightbox();
    lbEls.img.src = src;
    lbEls.img.alt = alt || '';
    if (captionText) {
      lbEls.caption.textContent = captionText;
      lbEls.caption.classList.remove('visually-hidden');
    } else {
      lbEls.caption.textContent = '';
      lbEls.caption.classList.add('visually-hidden');
    }

    lastFocus = document.activeElement;
    lbEls.root.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
    lbEls.closeBtn.focus();

    // Close handlers
    lbEls.root.addEventListener('click', onLightboxClick);
    document.addEventListener('keydown', onLightboxKeydown);
  }

  // Close the lightbox and restore focus
  function closeLightbox() {
    if (!lbEls) return;
    lbEls.root.setAttribute('hidden', '');
    document.body.classList.remove('no-scroll');
    lbEls.root.removeEventListener('click', onLightboxClick);
    document.removeEventListener('keydown', onLightboxKeydown);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onLightboxClick(e) {
    if (e.target.matches('[data-close]')) closeLightbox();
  }
  function onLightboxKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  // Public API example
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

  // Initialize: bind click on project images
  document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('#projects .project figure img');
    projectImages.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const fig = img.closest('figure');
        const caption = fig ? (fig.querySelector('figcaption')?.textContent || '') : '';
        openLightbox(img.currentSrc || img.src, img.alt || '', caption);
      });
    });
  });

  // Copilot: contact form validation with real-time feedback
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact .contact-form');
    if (!form) return;

    const nameEl = form.querySelector('#contact-name');
    const emailEl = form.querySelector('#contact-email');
    const messageEl = form.querySelector('#contact-message');

    const errors = {
      name: document.getElementById('contact-name-error'),
      email: document.getElementById('contact-email-error'),
      message: document.getElementById('contact-message-error'),
    };

    const setFieldError = (el, errorEl, msg) => {
      if (!el || !errorEl) return;
      el.setCustomValidity(msg || '');
      if (msg) {
        el.setAttribute('aria-invalid', 'true');
        errorEl.textContent = msg;
        errorEl.hidden = false;
      } else {
        el.removeAttribute('aria-invalid');
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    };

    const validators = {
      name: () => (!nameEl.value.trim() ? 'Please enter your name.' : ''),
      email: () => {
        if (!emailEl.value.trim()) return 'Please enter your email address.';
        if (emailEl.validity.typeMismatch) return 'Please enter a valid email address.';
        return '';
      },
      message: () => (!messageEl.value.trim() ? 'Please enter your message.' : ''),
    };

    const validateField = (field) => {
      switch (field) {
        case 'name': setFieldError(nameEl, errors.name, validators.name()); break;
        case 'email': setFieldError(emailEl, errors.email, validators.email()); break;
        case 'message': setFieldError(messageEl, errors.message, validators.message()); break;
      }
    };

    // Real-time feedback on input and on blur
    nameEl && ['input', 'blur'].forEach(evt => nameEl.addEventListener(evt, () => validateField('name')));
    emailEl && ['input', 'blur'].forEach(evt => emailEl.addEventListener(evt, () => validateField('email')));
    messageEl && ['input', 'blur'].forEach(evt => messageEl.addEventListener(evt, () => validateField('message')));

    form.addEventListener('submit', (e) => {
      validateField('name');
      validateField('email');
      validateField('message');

      const firstInvalid =
        (nameEl && nameEl.validationMessage && nameEl) ||
        (emailEl && emailEl.validationMessage && emailEl) ||
        (messageEl && messageEl.validationMessage && messageEl) || null;

      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.focus();
      }
    });
  });
})();