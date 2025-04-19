// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Animação de elementos ao scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };
    
    // Executar animação inicial e adicionar evento de scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Efeito de partículas
    const createParticle = function() {
        const particles = document.getElementById('particles');
        if (!particles) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posição aleatória
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        
        // Tamanho aleatório
        const size = Math.random() * 5 + 1;
        
        // Estilo
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Adicionar ao container
        particles.appendChild(particle);
        
        // Animação
        const duration = Math.random() * 10 + 5;
        
        particle.style.animation = `float ${duration}s linear infinite`;
        
        // Remover após um tempo
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };
    
    // Criar partículas iniciais
    for (let i = 0; i < 30; i++) {
        createParticle();
    }
    
    // Criar novas partículas periodicamente
    setInterval(createParticle, 1000);
    
    // Smooth Scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar classe active ao link do menu correspondente à seção visível
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
