
// Slideshow Principal
function initMainSlideshow() {
    const slides = document.querySelectorAll("#inicio .slide");
    const dots = document.querySelectorAll(".slideshow-dots .dot");
    const prevBtn = document.querySelector(".slideshow-controls .prev");
    const nextBtn = document.querySelector(".slideshow-controls .next");
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove("active"));
        // Deactivate all dots
        dots.forEach(dot => dot.classList.remove("active"));

        // Show the target slide and activate its dot
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlideIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % totalSlides;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    function startSlideShow() {
        stopSlideShow(); // Clear existing interval first
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Event listeners for controls
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            stopSlideShow(); // Optional: Stop auto-play on manual control
            // startSlideShow(); // Optional: Restart auto-play after manual control
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            stopSlideShow(); // Optional: Stop auto-play on manual control
            // startSlideShow(); // Optional: Restart auto-play after manual control
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            stopSlideShow(); // Optional: Stop auto-play on manual control
            // startSlideShow(); // Optional: Restart auto-play after manual control
        });
    });
    
    // Start slideshow
    showSlide(0); // Show the first slide initially
    startSlideShow();
}

// Modify initApp to include the new slideshow function
function initApp() {
    initHeaderScroll();
    initMobileMenu();
    initMainSlideshow(); // Add this line
    initProductFilter();
    initTestimonialSlider();
    initSmoothScroll();
    initNewsletterForm();
    initAnimations();
}

// Remove the old initApp definition if it exists elsewhere or ensure this is the only one.
// The previous file_read showed the initApp function, so we need to replace it.
// However, the file_write tool with append=True cannot replace existing content.
// A better approach is to read the file, modify the content in memory, and overwrite the file.
// Or, use file_str_replace to replace the old initApp with the new one.

// Let's use file_str_replace to update initApp.

