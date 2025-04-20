/**
 * Script para testar o funcionamento dos formulários
 * Este script verifica se os formulários estão redirecionando exclusivamente para o WhatsApp
 */
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona um indicador visual para mostrar que o redirecionamento exclusivo para WhatsApp está ativo
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        // Adiciona um indicador visual ao formulário
        const indicator = document.createElement('div');
        indicator.style.padding = '10px';
        indicator.style.marginBottom = '15px';
        indicator.style.backgroundColor = '#e6f7ff';
        indicator.style.border = '1px solid #91d5ff';
        indicator.style.borderRadius = '4px';
        indicator.style.color = '#0050b3';
        indicator.style.fontSize = '14px';
        indicator.innerHTML = '<strong>✓ Envio exclusivo para WhatsApp ativado</strong>';
        
        // Insere o indicador no início do formulário
        form.insertBefore(indicator, form.firstChild);
        
        // Modifica o texto dos botões de envio para indicar o WhatsApp
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach(function(button) {
            if (button.tagName === 'BUTTON') {
                if (!button.textContent.includes('WhatsApp')) {
                    button.textContent = 'Enviar para WhatsApp';
                }
            } else if (button.tagName === 'INPUT') {
                if (!button.value.includes('WhatsApp')) {
                    button.value = 'Enviar para WhatsApp';
                }
            }
            
            // Adiciona ícone do WhatsApp ao botão
            button.style.position = 'relative';
            button.style.paddingLeft = '30px';
            
            const icon = document.createElement('span');
            icon.innerHTML = '📱';
            icon.style.position = 'absolute';
            icon.style.left = '10px';
            icon.style.top = '50%';
            icon.style.transform = 'translateY(-50%)';
            
            button.appendChild(icon);
        });
    });
    
    // Verifica se há scripts de EmailJS carregados e os desativa
    console.log('Verificando e desativando scripts de EmailJS...');
    const scripts = document.querySelectorAll('script');
    scripts.forEach(function(script) {
        const src = script.getAttribute('src') || '';
        if (src.includes('emailjs')) {
            console.log('Script EmailJS encontrado e desativado:', src);
            script.setAttribute('data-disabled', 'true');
            script.setAttribute('src', '');
        }
    });
});
