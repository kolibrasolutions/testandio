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
            
            // Envia o email usando EmailJS
            emailjs.send('service_kolibra', 'template_orcamento', {
                from_name: formData.name,
                from_email: formData.email,
                from_phone: formData.phone,
                company: formData.company,
                message: formData.message,
                plan: formData.plan,
                services: formData.services,
                total: formData.total,
                payment_method: formData.paymentMethod,
                support_period: formData.supportPeriod || 'N/A'
            })
            .then(function(response) {
                console.log('Email enviado com sucesso!', response);
                
                // Oculta o formulário
                planBuilderForm.style.display = 'none';
                
                // Mostra o modal de sucesso
                document.getElementById('successModal').classList.add('active');
                
                // Limpa o formulário
                planBuilderForm.reset();
            })
            .catch(function(error) {
                console.error('Erro ao enviar email:', error);
                alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp (35) 99979-6570.');
            });
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
