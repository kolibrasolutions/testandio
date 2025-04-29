// Variáveis globais
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.dot');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const newsletterForm = document.querySelector('.newsletter-form');

// Função para inicializar todas as funcionalidades
function initApp() {
    initHeaderScroll();
    initMobileMenu();
    initProductFilter();
    initTestimonialSlider();
    initSmoothScroll();
    initNewsletterForm();
    initAnimations();
}

// Efeito de scroll no cabeçalho
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Menu mobile
function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && menu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}

// Filtro de produtos
function initProductFilter() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Obter categoria do filtro
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar produtos
            productCards.forEach(card => {
                if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Slider de depoimentos
function initTestimonialSlider() {
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;
    
    // Função para mostrar slide específico
    function showSlide(index) {
        // Esconder todos os slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remover active de todos os dots
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide atual
        testimonialSlides[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        
        // Atualizar índice atual
        currentSlide = index;
    }
    
    // Evento para botão próximo
    testimonialNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });
    
    // Evento para botão anterior
    testimonialPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });
    
    // Evento para dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto play do slider (a cada 5 segundos)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 5000);
}

// Scroll suave para links de âncora
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Formulário de newsletter
function initNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Simulação de envio bem-sucedido
                emailInput.value = '';
                showNotification('Obrigado por se inscrever! Em breve você receberá nossas novidades.', 'success');
            } else {
                showNotification('Por favor, insira um e-mail válido.', 'error');
            }
        });
    }
}

// Validação de e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notificação
function showNotification(message, type) {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Animações ao scroll
function initAnimations() {
    // Elementos que serão animados
    const animatedElements = document.querySelectorAll('.highlight-item, .product-card, .quality-item, .about-content, .contact-item');
    
    // Função para verificar se elemento está visível
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Função para animar elementos visíveis
    function animateOnScroll() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicializar elementos com opacidade 0
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Adicionar evento de scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Verificar elementos visíveis no carregamento da página
    window.addEventListener('load', animateOnScroll);
}

// Inicializar todas as funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);

// Adicionar estilos CSS para notificações
(function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.success {
            background-color: #4caf50;
        }
        
        .notification.error {
            background-color: #f44336;
        }
    `;
    document.head.appendChild(style);
})();


// Slideshow Principal
function initMainSlideshow() {
    const slides = document.querySelectorAll("#inicio .slide");
    // Check if slides exist before proceeding
    if (!slides || slides.length === 0) {
        console.log("Slideshow elements not found.");
        return; 
    }
    const dots = document.querySelectorAll(".slideshow-dots .dot");
    const prevBtn = document.querySelector(".slideshow-controls .prev");
    const nextBtn = document.querySelector(".slideshow-controls .next");
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        // Validate index
        if (index < 0 || index >= totalSlides) {
            console.error("Invalid slide index:", index);
            return;
        }
        // Hide all slides
        slides.forEach(slide => slide.classList.remove("active"));
        // Deactivate all dots
        dots.forEach(dot => dot.classList.remove("active"));

        // Show the target slide and activate its dot
        slides[index].classList.add("active");
        if (dots[index]) { // Check if dot exists
           dots[index].classList.add("active");
        }
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
            stopSlideShow(); // Stop auto-play on manual control
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            stopSlideShow(); // Stop auto-play on manual control
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            stopSlideShow(); // Stop auto-play on manual control
        });
    });
    
    // Start slideshow
    showSlide(0); // Show the first slide initially
    startSlideShow();
}

