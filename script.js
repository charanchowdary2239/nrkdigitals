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
  const backToTopBtn = document.getElementById('backToTopBtn');
  const statCounts = document.querySelectorAll('.stat-count');
  const statsSection = document.getElementById('statsSection');
  const contactForm = document.getElementById('agencyContactForm');
  const formStatusAlert = document.getElementById('formStatusAlert');
  const serviceDropdown = document.getElementById('serviceSelection');
  const serviceLearnMoreLinks = document.querySelectorAll('[data-select-service]');
  
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
     2. STICKY NAVIGATION EFFECT & SCROLL STATE
     ================================================== */
  const handleScrollEffects = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky Nav Glass Opacity & Glow
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to Top Button Visibility
    if (scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active Navigation Highlighting based on scroll position
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Initial check

  /* ==================================================
     3. MOBILE NAVIGATION DRAWER
     ================================================== */
  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    mobileToggle.classList.add('active');
    mobileDrawer.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    mobileDrawer.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
    if (mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
      if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    }
  });

  /* ==================================================
     4. SMOOTH SCROLLING WITH OFFSET
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
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 5;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==================================================
     5. ACTIVE NAV LINK ON SCROLL
     ================================================== */
  const sections = document.querySelectorAll('section[id], body#top');
  function updateActiveNavLink() {
    const scrollPosition = (window.scrollY || window.pageYOffset) + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
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
  }

  /* ==================================================
     6. SCROLL REVEAL (IntersectionObserver)
     ================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==================================================
     7. ANIMATED STATISTICS COUNTERS
     ================================================== */
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    statCounts.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
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
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback
    animateCounters();
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
     9. CONTACT FORM VALIDATION & WHATSAPP REDIRECTION
     ================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error states
      clearFormErrors();

      // Retrieve values
      const fullName = document.getElementById('fullName').value.trim();
      const emailAddress = document.getElementById('emailAddress').value.trim();
      const phoneNumber = document.getElementById('phoneNumber').value.trim();
      const selectedService = serviceDropdown ? serviceDropdown.value : '';
      const projectDetails = document.getElementById('projectDetails').value.trim();

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

      // 3. Validate Phone Number (must have at least 7 digits)
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

      // If valid, format WhatsApp message and redirect
      if (isValid) {
        const whatsappMessage = 
`Hi NRK Digitals,

Name: ${fullName}
Email: ${emailAddress}
Phone: ${phoneNumber}
Service: ${selectedService}

Project Details:
${projectDetails}

I would like to discuss my project.`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/919493909696?text=${encodedMessage}`;

        // Show success alert in UI
        formStatusAlert.className = 'form-status-alert alert-success';
        formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Opening WhatsApp to start your project discussion with our team...';
        formStatusAlert.style.display = 'block';

        // Reset the form
        contactForm.reset();

        // Redirect / Open WhatsApp
        setTimeout(() => {
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 500);
      }
    });
  }

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
    }
  }

  // Clear individual field errors on input
  const formInputs = contactForm ? contactForm.querySelectorAll('.form-control') : [];
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

    modalTitle.textContent = title || 'Project Details';
    modalCategory.textContent = category || 'Portfolio';
    modalDescription.textContent = desc || 'Creative work designed and developed by NRK Digitals.';
    modalImage.src = imgUrl || '';
    modalImage.alt = `${title} Preview`;

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
      const currentCat = modalCategory.textContent.toLowerCase();
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
