document.addEventListener('DOMContentLoaded', function() {
    // Slideshow
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    const prevButton = document.querySelector('.slideshow-controls .prev');
    const nextButton = document.querySelector('.slideshow-controls .next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        if (!slides.length || !dots.length) return; // Check if elements exist
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        if (!slides.length) return; // Don't start if no slides
        stopSlideShow(); // Clear any existing interval
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Initialize Slideshow only if elements exist
    if (slides.length > 0 && dots.length > 0 && prevButton && nextButton) {
        // Event Listeners for controls
        prevButton.addEventListener('click', () => {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });

        nextButton.addEventListener('click', () => {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });

        // Initial setup
        showSlide(0); // Show the first slide initially
        startSlideShow(); // Start the automatic slideshow
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    // Check if the link is an internal anchor link
                    if (link.getAttribute('href').startsWith('#')) {
                        menu.classList.remove('active');
                    }
                    // Add logic here if you have non-anchor links that should also close the menu
                }
            });
        });

        // Close menu if clicking outside of it
        document.addEventListener('click', (event) => {
            const isClickInsideNav = menu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    }

    // Fade-in effect on scroll
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observerOptions = {
            root: null, // relative to document viewport 
            rootMargin: '0px',
            threshold: 0.1 // trigger when 10% of the element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

        fadeInElements.forEach(el => {
            // Add the fade-in class to elements that should have the effect
            // Example: Add 'fade-in' class to sections or specific elements in HTML
            // For now, let's assume sections and highlight items should fade in
            // You might need to manually add the 'fade-in' class to desired HTML elements
            intersectionObserver.observe(el);
        });
    }

    // Add 'fade-in' class dynamically to sections and highlight items for the effect
    // This is a simple way to apply it without modifying HTML, but modifying HTML is cleaner
    document.querySelectorAll('section, .highlight-item, .product-card').forEach(el => {
        // Avoid adding to the very first section (slideshow) if desired
        if (!el.closest('.slideshow')) { 
            el.classList.add('fade-in');
        }
    });
    // Re-run observer setup after dynamically adding classes
    const updatedFadeInElements = document.querySelectorAll('.fade-in');
     if (updatedFadeInElements.length > 0) {
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
        updatedFadeInElements.forEach(el => intersectionObserver.observe(el));
    }

    // Product Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Show/hide products based on filter
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'todos' || category === filter) {
                        card.style.display = 'flex'; // Use flex as set in CSS
                        // Re-apply fade-in animation if needed, though it might look odd on filter
                        // card.classList.remove('visible'); 
                        // void card.offsetWidth; // Trigger reflow
                        // card.classList.add('visible');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Quantity Selector Logic
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('input[type="number"]');
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 99;

        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value);
            if (currentValue > min) {
                input.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value);
            if (currentValue < max) {
                input.value = currentValue + 1;
            }
        });

        // Prevent non-numeric input and enforce min/max on input change
        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < min) {
                input.value = min;
            } else if (value > max) {
                input.value = max;
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's not just a placeholder '#' link
            if (href.length > 1) {
                 e.preventDefault();
                 const targetElement = document.querySelector(href);
                 if (targetElement) {
                     // Calculate position considering fixed header height
                     const headerOffset = document.querySelector('.header')?.offsetHeight || 70; // Adjust if header height changes
                     const elementPosition = targetElement.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                     window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth"
                     });
                 }
            }
        });
    });

});

