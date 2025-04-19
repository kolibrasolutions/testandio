// Animações avançadas e efeitos visuais
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação para elementos com classe .typing-effect
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 100);
    });
    
    // Contador para números (usado em estatísticas)
    const counterElements = document.querySelectorAll('.counter');
    
    const startCounter = function() {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const step = target / (duration / 20); // Atualiza a cada 20ms
            
            let current = 0;
            const counterInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        });
    };
    
    // Iniciar contador quando os elementos estiverem visíveis
    const observerCounter = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter();
                observerCounter.disconnect();
            }
        });
    });
    
    if (counterElements.length > 0) {
        observerCounter.observe(counterElements[0]);
    }
    
    // Parallax effect para backgrounds
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Efeito de revelação para textos
    const revealElements = document.querySelectorAll('.reveal-text');
    
    revealElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        element.classList.add('active');
    });
    
    // Efeito de hover 3D para cards
    const cards3D = document.querySelectorAll('.card-3d');
    
    cards3D.forEach(card => {
        card.addEventListener('mousemove', e => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calcular rotação baseada na posição do mouse
            const rotateY = mouseX / 10;
            const rotateX = -mouseY / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Efeito de scroll horizontal para galerias
    const horizontalScrolls = document.querySelectorAll('.horizontal-scroll');
    
    horizontalScrolls.forEach(container => {
        container.addEventListener('wheel', e => {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        });
    });
    
    // Lazy loading para imagens
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    lazyLoadObserver.unobserve(img);
                }
            }
        });
    });
    
    lazyImages.forEach(image => {
        lazyLoadObserver.observe(image);
    });
    
    // Efeito de filtro para galerias
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Obter categoria do filtro
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar itens
            filterItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});
