/**
 * Script para desativar o envio de formulários por e-mail
 * Este script é carregado antes de qualquer outro script de formulário
 * para garantir que os formulários redirecionem exclusivamente para o WhatsApp
 */
document.addEventListener('DOMContentLoaded', function() {
    // Desativa o carregamento do EmailJS
    const emailjsScripts = document.querySelectorAll('script[src*="emailjs"]');
    emailjsScripts.forEach(script => {
        script.setAttribute('data-disabled', 'true');
        script.setAttribute('src', '');
    });
    
    // Sobrescreve a função emailjs global se ela existir
    if (window.emailjs) {
        window.emailjs_original = window.emailjs;
        window.emailjs = {
            init: function() { console.log('EmailJS desativado'); return Promise.resolve(); },
            send: function() { console.log('Envio de e-mail desativado'); return Promise.resolve(); }
        };
    }
    
    // Previne o carregamento futuro do EmailJS
    const originalCreateElement = document.createElement;
    document.createElement = function(tag) {
        const element = originalCreateElement.call(document, tag);
        if (tag.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && value && value.includes('emailjs')) {
                    console.log('Bloqueando carregamento de script EmailJS');
                    return originalSetAttribute.call(this, 'data-disabled-src', value);
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        return element;
    };
});
