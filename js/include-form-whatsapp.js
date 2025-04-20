/**
 * Script para incluir o form-to-whatsapp.js em todas as páginas
 * Este script é carregado através do menu-padronizado.js que já está presente em todas as páginas
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há formulários na página
    if (document.querySelector('form')) {
        // Adiciona o script form-to-whatsapp.js dinamicamente
        const script = document.createElement('script');
        script.src = 'js/form-to-whatsapp.js';
        document.body.appendChild(script);
    }
});
