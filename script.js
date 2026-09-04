/**
 * ==================================================
 * NRK DIGITALS - CLIENT SCRIPT
 * Creative Digital Agency
 * Pure Vanilla JavaScript (ES6+)
 * ==================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==================================================
     1. DOM SELECTORS
     ================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], body#top');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const statCounts = document.querySelectorAll('.stat-count');
  const statsSection = document.getElementById('statsSection');
  const contactForm = document.getElementById('agencyContactForm');
  const formStatusAlert = document.getElementById('formStatusAlert');
  const serviceDropdown = document.getElementById('serviceSelection');
  const submitBtn = document.getElementById('submitBtn');
  const serviceLearnMoreLinks = document.querySelectorAll('[data-select-service]');
  const revealElements = document.querySelectorAll('.reveal');
  
  // Modal Selectors
  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalInquireBtn = document.getElementById('modalInquireBtn');
  const portfolioButtons = document.querySelectorAll('.btn-portfolio');

  /* ==================================================
     2. ACTIVE NAV LINK HIGHLIGHTING
     ================================================== */
  const updateActiveNavLink = () => {
    const scrollPosition = (window.scrollY || window.pageYOffset) + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop || 0;
      const sectionHeight = section.offsetHeight || 0;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}` || (sectionId === 'top' && href === '#top')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  /* ==================================================
     3. STICKY NAVIGATION EFFECT & SCROLL STATE
     ================================================== */
  const handleScrollEffects = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky Nav Glass Opacity & Glow
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to Top Button Visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Navigation Highlighting
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Initial check

  /* ==================================================
     4. MOBILE NAVIGATION DRAWER
     ================================================== */
  const closeMobileMenu = () => {
    if (mobileToggle && mobileDrawer) {
      mobileToggle.classList.remove('active');
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  const openMobileMenu = () => {
    if (mobileToggle && mobileDrawer) {
      mobileToggle.classList.add('active');
      mobileDrawer.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  const toggleMobileMenu = () => {
    if (!mobileDrawer) return;
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile drawer when clicking any link inside it
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile drawer if clicked outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && (!mobileToggle || !mobileToggle.contains(e.target))) {
        closeMobileMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
      if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    }
  });

  /* ==================================================
     5. SMOOTH SCROLLING WITH OFFSET
     ================================================== */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = siteHeader ? siteHeader.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + (window.pageYOffset || window.scrollY) - headerOffset + 5;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==================================================
     6. SCROLL REVEAL (IntersectionObserver + Immediate Check)
     ================================================== */
  const triggerElementReveal = (el) => {
    el.classList.add('revealed');
  };

  // Immediate check for any elements already visible on load
  const checkInitialReveals = () => {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight + 100) {
        triggerElementReveal(el);
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerElementReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((el) => triggerElementReveal(el));
  }

  // Enable progressive enhancement class
  document.documentElement.classList.add('js-ready');

  // Run immediate viewport check
  checkInitialReveals();

  // Safety fallback: ensure all reveal elements are visible after 200ms
  setTimeout(() => {
    revealElements.forEach((el) => triggerElementReveal(el));
  }, 200);

  /* ==================================================
     7. ANIMATED STATISTICS COUNTERS
     ================================================== */
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    statCounts.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      if (!target) return;
      const duration = 1800; // Animation duration in ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out quadratic calculation for smooth deceleration
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeOutQuad * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback
    setTimeout(animateCounters, 800);
  }

  /* ==================================================
     8. SERVICE "LEARN MORE" AUTO-SELECT IN FORM
     ================================================== */
  serviceLearnMoreLinks.forEach((link) => {
    link.addEventListener('click', function () {
      const selectedServiceName = this.getAttribute('data-select-service');
      if (selectedServiceName && serviceDropdown) {
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value === selectedServiceName) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  /* ==================================================
     9. FORMSPREE AJAX FORM SUBMISSION & VALIDATION
     ================================================== */
  function showFieldError(inputId, errorId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (inputElement) {
      inputElement.classList.add('input-error');
      inputElement.focus();
    }
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  function clearFormErrors() {
    if (!contactForm) return;
    const errorInputs = contactForm.querySelectorAll('.input-error');
    errorInputs.forEach((el) => el.classList.remove('input-error'));

    const errorMsgs = contactForm.querySelectorAll('.field-error-msg');
    errorMsgs.forEach((el) => {
      el.textContent = '';
      el.style.display = 'none';
    });

    if (formStatusAlert) {
      formStatusAlert.style.display = 'none';
      formStatusAlert.textContent = '';
      formStatusAlert.className = 'form-status-alert';
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous error states
      clearFormErrors();

      // Retrieve values
      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const emailAddress = (document.getElementById('emailAddress')?.value || '').trim();
      const phoneNumber = (document.getElementById('phoneNumber')?.value || '').trim();
      const selectedService = serviceDropdown ? serviceDropdown.value : '';
      const projectDetails = (document.getElementById('projectDetails')?.value || '').trim();

      // Validation flags
      let isValid = true;

      // 1. Validate Full Name
      if (!fullName || fullName.length < 2) {
        showFieldError('fullName', 'nameError', 'Please enter your full name (at least 2 characters).');
        isValid = false;
      }

      // 2. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailAddress || !emailRegex.test(emailAddress)) {
        showFieldError('emailAddress', 'emailError', 'Please enter a valid email address.');
        isValid = false;
      }

      // 3. Validate Phone Number
      const phoneDigits = phoneNumber.replace(/\D/g, '');
      if (!phoneNumber || phoneDigits.length < 7) {
        showFieldError('phoneNumber', 'phoneError', 'Please enter a valid phone number (at least 7 digits).');
        isValid = false;
      }

      // 4. Validate Service Selection
      if (!selectedService) {
        showFieldError('serviceSelection', 'serviceError', 'Please select a service for your project.');
        isValid = false;
      }

      // 5. Validate Project Details
      if (!projectDetails || projectDetails.length < 8) {
        showFieldError('projectDetails', 'messageError', 'Please provide some details about your project (at least 8 characters).');
        isValid = false;
      }

      if (!isValid) return;

      // UI Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (formStatusAlert) {
            formStatusAlert.className = 'form-status-alert alert-success';
            formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your project enquiry has been sent to NRK Digitals successfully. We will get back to you shortly.';
            formStatusAlert.style.display = 'block';
          }
          contactForm.reset();
        } else {
          const data = await response.json();
          let errorMsg = 'Oops! There was a problem submitting your form. Please try again.';
          if (data && data.errors && data.errors.length > 0) {
            errorMsg = data.errors.map(err => err.message).join(', ');
          }
          if (formStatusAlert) {
            formStatusAlert.className = 'form-status-alert alert-error';
            formStatusAlert.style.background = 'rgba(255, 95, 86, 0.15)';
            formStatusAlert.style.border = '1px solid rgba(255, 95, 86, 0.4)';
            formStatusAlert.style.color = '#FF5F56';
            formStatusAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}`;
            formStatusAlert.style.display = 'block';
          }
        }
      } catch (err) {
        if (formStatusAlert) {
          formStatusAlert.className = 'form-status-alert alert-error';
          formStatusAlert.style.background = 'rgba(255, 95, 86, 0.15)';
          formStatusAlert.style.border = '1px solid rgba(255, 95, 86, 0.4)';
          formStatusAlert.style.color = '#FF5F56';
          formStatusAlert.innerHTML = '<i class="fa-solid fa-wifi"></i> Network error. Please check your connection or contact us via WhatsApp.';
          formStatusAlert.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send Enquiry';
        }
      }
    });

    // Clear individual field errors on input
    const formInputs = contactForm.querySelectorAll('.form-control');
    formInputs.forEach((input) => {
      input.addEventListener('input', function () {
        this.classList.remove('input-error');
        const errorMsg = this.closest('.form-group')?.querySelector('.field-error-msg');
        if (errorMsg) {
          errorMsg.textContent = '';
          errorMsg.style.display = 'none';
        }
      });
    });
  }

  /* ==================================================
     10. BACK TO TOP BUTTON
     ================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==================================================
     11. PORTFOLIO LIGHTBOX / MODAL
     ================================================== */
  const openProjectModal = (title, category, desc, imgUrl) => {
    if (!projectModal) return;

    if (modalTitle) modalTitle.textContent = title || 'Project Details';
    if (modalCategory) modalCategory.textContent = category || 'Portfolio';
    if (modalDescription) modalDescription.textContent = desc || 'Creative work designed and developed by NRK Digitals.';
    if (modalImage) {
      modalImage.src = imgUrl || '';
      modalImage.alt = `${title} Preview`;
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;

    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  portfolioButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-project-title');
      const cat = btn.getAttribute('data-project-cat');
      const desc = btn.getAttribute('data-project-desc');
      const img = btn.getAttribute('data-project-img');
      openProjectModal(title, cat, desc, img);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // Modal CTA: Pre-selects service and scrolls to contact
  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      const currentCat = modalCategory ? modalCategory.textContent.toLowerCase() : '';
      closeProjectModal();

      if (serviceDropdown) {
        if (currentCat.includes('web')) {
          serviceDropdown.value = 'Website Development';
        } else if (currentCat.includes('ai video')) {
          serviceDropdown.value = 'AI Video Creation';
        } else if (currentCat.includes('campaign')) {
          serviceDropdown.value = 'Campaign Video';
        } else if (currentCat.includes('publicity')) {
          serviceDropdown.value = 'Publicity Video';
        } else if (currentCat.includes('social')) {
          serviceDropdown.value = 'Social Media Management';
        }
      }
    });
  }

});
