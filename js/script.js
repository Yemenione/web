// ======================
// Language Switcher
// ======================

// Get current language from localStorage or default to Arabic
let currentLang = localStorage.getItem('language') || 'ar';

// Apply language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    updateActiveLanguageButton();
});

// Language switcher buttons
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        setLanguage(lang);
        localStorage.setItem('language', lang);
        updateActiveLanguageButton();
    });
});

function setLanguage(lang) {
    currentLang = lang;

    // Update HTML lang and dir attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update elements with HTML content (like <br> tags)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Update document title
    const titles = {
        ar: 'مطعم سقطري - باريس',
        fr: 'Restaurant Soqotri - Paris',
        en: 'Soqotri Restaurant - Paris'
    };
    document.title = titles[lang];

    // Update meta description
    const descriptions = {
        ar: 'مطعم سقطري - أصالة المطبخ اليمني السقطري في قلب باريس',
        fr: 'Restaurant Soqotri - L\'authenticité de la cuisine yéménite soqotri au cœur de Paris',
        en: 'Soqotri Restaurant - Authentic Yemeni Soqotri cuisine in the heart of Paris'
    };
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', descriptions[lang]);
    }

    // Adjust modal position for RTL/LTR
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        if (lang === 'ar') {
            modalClose.style.left = '30px';
            modalClose.style.right = 'auto';
        } else {
            modalClose.style.right = '30px';
            modalClose.style.left = 'auto';
        }
    }
}

function updateActiveLanguageButton() {
    langButtons.forEach(button => {
        if (button.getAttribute('data-lang') === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// ======================
// Navigation
// ======================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function activateNavLink() {
    let current = '';
    const scrollPosition = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ======================
// Menu Filtering
// ======================

const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        // Filter menu items with animation
        menuItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Initialize menu items animation
menuItems.forEach(item => {
    item.style.transition = 'all 0.3s ease';
});

// ======================
// Gallery Modal
// ======================

const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems);

// Open modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openModal();
    });
});

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateModalImage();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateModalImage() {
    const currentItem = galleryImages[currentImageIndex];
    const svg = currentItem.querySelector('svg').cloneNode(true);
    svg.setAttribute('width', '800');
    svg.setAttribute('height', '800');
    modalImage.innerHTML = '';
    modalImage.appendChild(svg);
}

// Close modal
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Navigation in modal
modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
});

modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateModalImage();
    }
});

// ======================
// Contact Form
// ======================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.guests) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
        showMessage('يرجى إدخال رقم هاتف صحيح', 'error');
        return;
    }

    // Date validation (must be today or future)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showMessage('يرجى اختيار تاريخ اليوم أو تاريخ مستقبلي', 'error');
        return;
    }

    // Simulate form submission
    showMessage('جاري إرسال الحجز...', 'success');

    setTimeout(() => {
        showMessage(`شكراً ${formData.name}! تم استلام طلب حجزك بنجاح. سنتصل بك قريباً على ${formData.phone} لتأكيد الحجز.`, 'success');
        contactForm.reset();

        // Log form data (in a real application, this would be sent to a server)
        console.log('Booking Details:', formData);
    }, 1500);
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide message after 5 seconds for error, keep success visible
    if (type === 'error') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ======================
// Scroll Animations
// ======================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.menu-item, .gallery-item, .info-card, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ======================
// Set minimum date for booking
// ======================

const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// ======================
// Prevent form resubmission on page reload
// ======================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ======================
// Loading animation
// ======================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ======================
// Console message
// ======================

console.log('%c🌴 مطعم سقطري - Soqotri Restaurant 🌴', 'color: #2c5f2d; font-size: 20px; font-weight: bold;');
console.log('%cمرحباً بك في موقع مطعم سقطري!', 'color: #d4af37; font-size: 14px;');
console.log('Website developed with ❤️');
