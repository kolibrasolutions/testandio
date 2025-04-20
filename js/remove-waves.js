// Script para remover as faixas brancas onduladas das páginas secundárias no modo mobile
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se não estamos na página inicial
    const paginaAtual = window.location.pathname.split('/').pop();
    
    if (paginaAtual !== 'index.html' && paginaAtual !== '') {
        // Cria um estilo para ocultar as faixas onduladas em dispositivos móveis
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .hero-curve, 
                svg[class*="hero-curve"], 
                svg[class*="wave"],
                .wave-divider,
                [class*="wave-divider"],
                [class*="wave-separator"] {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Também remove diretamente qualquer elemento SVG com classe hero-curve que possa existir
        const waveElements = document.querySelectorAll('.hero-curve, svg[class*="hero-curve"], svg[class*="wave"], .wave-divider, [class*="wave-divider"], [class*="wave-separator"]');
        waveElements.forEach(element => {
            if (window.innerWidth <= 768) {
                element.style.display = 'none';
            }
        });
    }
});
