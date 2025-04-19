// Script para redirecionamento para WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const planBuilderForm = document.getElementById('planBuilderForm');
    
    if (planBuilderForm) {
        planBuilderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const company = document.getElementById('company').value || 'Não informado';
            const message = document.getElementById('message').value || 'Não informado';
            const plan = window.selectedPlan ? window.selectedPlan.name : 'Nenhum plano selecionado';
            const services = window.selectedServices.map(service => service.name).join(', ') || 'Nenhum serviço selecionado';
            const total = document.getElementById('totalPrice').textContent;
            const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
            
            // Se houver serviços de suporte, adiciona a periodicidade
            let supportPeriod = 'N/A';
            if (window.selectedServices.some(service => service.isSupport)) {
                const supportPeriodValue = document.querySelector('input[name="support_period"]:checked').value;
                
                if (supportPeriodValue === 'monthly') {
                    supportPeriod = 'Mensal';
                } else if (supportPeriodValue === 'quarterly') {
                    supportPeriod = 'Trimestral';
                } else if (supportPeriodValue === 'yearly') {
                    supportPeriod = 'Anual';
                }
            }
            
            // Formata a mensagem para o WhatsApp
            let whatsappMessage = `*Solicitação de Orçamento - Kolibra Solutions*\n\n`;
            whatsappMessage += `*Nome:* ${name}\n`;
            whatsappMessage += `*Email:* ${email}\n`;
            whatsappMessage += `*Telefone:* ${phone}\n`;
            whatsappMessage += `*Empresa:* ${company}\n\n`;
            whatsappMessage += `*Plano Base:* ${plan}\n`;
            whatsappMessage += `*Serviços Adicionais:* ${services}\n`;
            whatsappMessage += `*Forma de Pagamento:* ${paymentMethod}\n`;
            
            if (supportPeriod !== 'N/A') {
                whatsappMessage += `*Periodicidade do Suporte:* ${supportPeriod}\n`;
            }
            
            whatsappMessage += `*Valor Total:* ${total}\n\n`;
            
            if (message !== 'Não informado') {
                whatsappMessage += `*Mensagem Adicional:*\n${message}\n\n`;
            }
            
            whatsappMessage += `Aguardo retorno. Obrigado!`;
            
            // Codifica a mensagem para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Redireciona para o WhatsApp
            window.location.href = `https://wa.me/5535999796570?text=${encodedMessage}`;
        });
    }
});
