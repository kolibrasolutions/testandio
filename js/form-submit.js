// Script para envio direto de mensagens do construtor de pacotes
document.addEventListener('DOMContentLoaded', function() {
    const planBuilderForm = document.getElementById('planBuilderForm');
    
    if (planBuilderForm) {
        planBuilderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value || 'Não informado',
                message: document.getElementById('message').value || 'Não informado',
                plan: window.selectedPlan ? window.selectedPlan.name : 'Nenhum plano selecionado',
                services: window.selectedServices.map(service => service.name).join(', ') || 'Nenhum serviço selecionado',
                total: document.getElementById('totalPrice').textContent,
                paymentMethod: document.querySelector('input[name="payment_method"]:checked').value
            };
            
            // Se houver serviços de suporte, adiciona a periodicidade
            if (window.selectedServices.some(service => service.isSupport)) {
                const supportPeriodValue = document.querySelector('input[name="support_period"]:checked').value;
                let supportPeriodText = 'Mensal';
                
                if (supportPeriodValue === 'quarterly') {
                    supportPeriodText = 'Trimestral';
                } else if (supportPeriodValue === 'yearly') {
                    supportPeriodText = 'Anual';
                }
                
                formData.supportPeriod = supportPeriodText;
            }
            
            // Mostrar indicador de carregamento
            const submitBtn = planBuilderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : "Enviar";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Enviando...";
            }
            
            // Removido envio por email conforme solicitado
            console.log('Envio por email removido, redirecionando para WhatsApp');
            
            // Formatar mensagem para WhatsApp
            let message = `*ORÇAMENTO - KOLIBRA SOLUTIONS*\n\n`;
            message += `*Nome:* ${formData.name}\n`;
            message += `*Email:* ${formData.email}\n`;
            message += `*Telefone:* ${formData.phone}\n`;
            message += `*Empresa:* ${formData.company}\n`;
            message += `*Plano:* ${formData.plan}\n`;
            message += `*Serviços:* ${formData.services}\n`;
            message += `*Total:* ${formData.total}\n`;
            message += `*Forma de Pagamento:* ${formData.paymentMethod}\n`;
            
            if (formData.supportPeriod) {
                message += `*Periodicidade de Suporte:* ${formData.supportPeriod}\n`;
            }
            
            if (formData.message) {
                message += `\n*Mensagem:*\n${formData.message}\n`;
            }
            
            // Número de telefone para onde a mensagem será enviada (formato internacional)
            const phoneNumber = '5535999796570'; // Número da Kolibra
            
            // URL do WhatsApp
            const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            
            // Oculta o formulário
            planBuilderForm.style.display = 'none';
            
            // Mostra o modal de sucesso
            document.getElementById('successModal').classList.add('active');
            
            // Limpa o formulário
            planBuilderForm.reset();
            
            // Abre o WhatsApp em uma nova aba
            window.open(whatsappURL, '_blank');
        });
    }
    
    // Fechar modal
    const closeModalButton = document.getElementById('closeModal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            document.getElementById('successModal').classList.remove('active');
        });
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        const successModal = document.getElementById('successModal');
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
});
