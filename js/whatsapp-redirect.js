// Script para redirecionamento para WhatsApp - versão simplificada e robusta
document.addEventListener('DOMContentLoaded', function() {
    // Botão de WhatsApp
    const whatsappButton = document.getElementById('whatsappButton');
    const contactForm = document.getElementById('planBuilderForm');
    
    // Mostrar formulário quando clicar no botão WhatsApp
    if (whatsappButton && contactForm) {
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verifica se há um plano selecionado
            if (!window.selectedPlan) {
                alert('Por favor, selecione um plano base antes de continuar.');
                return;
            }
            
            // Mostra o formulário
            contactForm.style.display = 'block';
            
            // Rola até o formulário
            contactForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                // Coleta os dados básicos do formulário
                const name = document.getElementById('name').value || '';
                const email = document.getElementById('email').value || '';
                const phone = document.getElementById('phone').value || '';
                const company = document.getElementById('company').value || 'Não informado';
                const message = document.getElementById('message').value || '';
                
                // Coleta dados do plano e serviços com verificações de segurança
                let planName = 'Plano não selecionado';
                let servicesList = 'Nenhum serviço adicional';
                let totalPrice = 'Valor não disponível';
                let paymentMethod = 'Não especificado';
                let supportPeriod = '';
                
                // Verifica se os objetos e elementos existem antes de acessá-los
                if (window.selectedPlan && window.selectedPlan.name) {
                    planName = window.selectedPlan.name;
                }
                
                if (window.selectedServices && Array.isArray(window.selectedServices) && window.selectedServices.length > 0) {
                    const serviceNames = [];
                    for (let i = 0; i < window.selectedServices.length; i++) {
                        if (window.selectedServices[i] && window.selectedServices[i].name) {
                            serviceNames.push(window.selectedServices[i].name);
                        }
                    }
                    if (serviceNames.length > 0) {
                        servicesList = serviceNames.join(', ');
                    }
                }
                
                const totalPriceElement = document.getElementById('totalPrice');
                if (totalPriceElement) {
                    totalPrice = totalPriceElement.textContent;
                }
                
                const paymentMethodElement = document.querySelector('input[name="payment_method"]:checked');
                if (paymentMethodElement) {
                    paymentMethod = paymentMethodElement.value;
                }
                
                // Verifica se há serviços de suporte selecionados
                let hasSupportService = false;
                if (window.selectedServices && Array.isArray(window.selectedServices)) {
                    for (let i = 0; i < window.selectedServices.length; i++) {
                        if (window.selectedServices[i] && window.selectedServices[i].isSupport) {
                            hasSupportService = true;
                            break;
                        }
                    }
                }
                
                if (hasSupportService) {
                    const supportPeriodElement = document.querySelector('input[name="support_period"]:checked');
                    if (supportPeriodElement) {
                        const periodValue = supportPeriodElement.value;
                        if (periodValue === 'monthly') {
                            supportPeriod = 'Mensal';
                        } else if (periodValue === 'quarterly') {
                            supportPeriod = 'Trimestral';
                        } else if (periodValue === 'yearly') {
                            supportPeriod = 'Anual';
                        }
                    }
                }
                
                // Formata a mensagem para o WhatsApp
                let whatsappMessage = `*Solicitação de Orçamento - Kolibra Solutions*\n\n`;
                whatsappMessage += `*Nome:* ${name}\n`;
                whatsappMessage += `*Email:* ${email}\n`;
                whatsappMessage += `*Telefone:* ${phone}\n`;
                whatsappMessage += `*Empresa:* ${company}\n\n`;
                whatsappMessage += `*Plano Base:* ${planName}\n`;
                whatsappMessage += `*Serviços Adicionais:* ${servicesList}\n`;
                whatsappMessage += `*Forma de Pagamento:* ${paymentMethod}\n`;
                
                if (supportPeriod) {
                    whatsappMessage += `*Periodicidade do Suporte:* ${supportPeriod}\n`;
                }
                
                whatsappMessage += `*Valor Total:* ${totalPrice}\n\n`;
                
                if (message) {
                    whatsappMessage += `*Mensagem Adicional:*\n${message}\n\n`;
                }
                
                whatsappMessage += `Aguardo retorno. Obrigado!`;
                
                // Codifica a mensagem para URL (limitando o tamanho para evitar problemas)
                const maxLength = 1000; // WhatsApp tem limite de caracteres na URL
                let encodedMessage = encodeURIComponent(whatsappMessage);
                
                if (encodedMessage.length > maxLength) {
                    // Se a mensagem for muito longa, simplifica
                    const shortMessage = `*Orçamento Kolibra Solutions*\n\n` +
                        `*Nome:* ${name}\n` +
                        `*Email:* ${email}\n` +
                        `*Telefone:* ${phone}\n` +
                        `*Plano:* ${planName}\n` +
                        `*Valor Total:* ${totalPrice}`;
                    
                    encodedMessage = encodeURIComponent(shortMessage);
                }
                
                // Método 1: Usando window.open (mais compatível com bloqueadores de pop-up)
                const whatsappWindow = window.open(`https://wa.me/5535999796570?text=${encodedMessage}`, '_blank');
                
                // Método 2: Fallback para window.location se window.open falhar
                if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
                    window.location.href = `https://wa.me/5535999796570?text=${encodedMessage}`;
                }
                
                // Limpa o formulário
                contactForm.reset();
                
                // Oculta o formulário após envio bem-sucedido
                setTimeout(function() {
                    contactForm.style.display = 'none';
                }, 1000);
                
                return true;
            } catch (error) {
                // Em caso de erro, oferece link direto para WhatsApp
                console.error("Erro ao processar formulário:", error);
                alert("Ocorreu um erro ao processar seu pedido. Clique em OK para entrar em contato direto pelo WhatsApp.");
                window.location.href = "https://wa.me/5535999796570";
                return false;
            }
        });
    }
});
