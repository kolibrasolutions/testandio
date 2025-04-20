// Script para incluir o remove-waves.js em todas as páginas
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o script remove-waves.js dinamicamente
    const script = document.createElement('script');
    script.src = 'js/remove-waves.js';
    document.body.appendChild(script);
});
