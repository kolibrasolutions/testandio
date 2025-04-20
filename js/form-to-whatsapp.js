/**
 * Script para redirecionar todos os formulários para o WhatsApp
 * Implementa a funcionalidade de envio para WhatsApp em todos os formulários do site
 * e impede o envio por e-mail
 */
document.addEventListener('DOMContentLoaded', function() {
    // Remove todos os event listeners existentes dos formulários
    function removeAllEventListeners(element) {
        // Cria um clone do elemento sem os event listeners
        const clone = element.cloneNode(true);
        // Substitui o elemento original pelo clone
        element.parentNode.replaceChild(clone, element);
        return clone;
    }
    
    // Procura por todos os formulários na página
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(originalForm) {
        // Remove todos os event listeners existentes
        const form = removeAllEventListeners(originalForm);
        
        // Marca o formulário como configurado para WhatsApp
        form.setAttribute('data-whatsapp-enabled', 'true');
        
        // Adiciona um evento de submit para cada formulário
        form.addEventListener('submit', function(e) {
            // Previne o comportamento padrão de envio do formulário
            e.preventDefault();
            
            try {
                // Coleta todos os campos do formulário
                const formData = new FormData(form);
                let formFields = {};
                
                // Converte os dados do formulário para um objeto
                for (let [key, value] of formData.entries()) {
                    formFields[key] = value;
                }
                
                // Formata a mensagem para o WhatsApp
                let whatsappMessage = `*Formulário - Kolibra Solutions*\n\n`;
                
                // Adiciona o título do formulário, se disponível
                const formTitle = document.querySelector('h1, h2, h3')?.textContent || 'Contato';
                whatsappMessage += `*Formulário:* ${formTitle}\n\n`;
                
                // Adiciona cada campo do formulário à mensagem
                for (let key in formFields) {
                    if (formFields[key] && formFields[key].trim() !== '') {
                        // Formata o nome do campo para exibição (capitaliza primeira letra e substitui underscores por espaços)
                        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                        whatsappMessage += `*${fieldName}:* ${formFields[key]}\n`;
                    }
                }
                
                // Adiciona mensagem padrão de solicitação
                whatsappMessage += `\nOlá, enviei o formulário acima através do site e gostaria de mais informações.`;
                
                // Codifica a mensagem para URL (limitando o tamanho para evitar problemas)
                const maxLength = 1000; // WhatsApp tem limite de caracteres na URL
                let encodedMessage = encodeURIComponent(whatsappMessage);
                
                if (encodedMessage.length > maxLength) {
                    // Se a mensagem for muito longa, simplifica
                    const shortMessage = `*Formulário - Kolibra Solutions*\n\n` +
                        `*Formulário:* ${formTitle}\n\n` +
                        `Olá, preenchi um formulário no site e gostaria de mais informações.`;
                    
                    encodedMessage = encodeURIComponent(shortMessage);
                }
                
                // Número de WhatsApp da Kolibra Solutions
                const whatsappNumber = '5535999796570';
                
                // Método 1: Usando window.open (mais compatível com bloqueadores de pop-up)
                const whatsappWindow = window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
                
                // Método 2: Fallback para window.location se window.open falhar
                if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                }
                
                return true;
            } catch (error) {
                // Em caso de erro, oferece link direto para WhatsApp
                console.error("Erro ao processar dados do formulário:", error);
                alert("Ocorreu um erro ao processar seu formulário. Clique em OK para entrar em contato direto pelo WhatsApp.");
                window.location.href = "https://wa.me/5535999796570";
                return false;
            }
        });
    });
});
