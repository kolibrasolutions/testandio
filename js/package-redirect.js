// Script para salvar dados do pacote e redirecionar para página de formulário
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.getElementById('whatsappButton');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verifica se há um plano selecionado
            if (!window.selectedPlan) {
                alert('Por favor, selecione um plano base antes de continuar.');
                return;
            }
            
            try {
                // Coleta os dados do pacote selecionado
                const planData = {
                    planName: window.selectedPlan ? window.selectedPlan.name : 'Nenhum plano selecionado',
                    planPrice: window.selectedPlan ? window.selectedPlan.price : 0,
                    services: window.selectedServices && Array.isArray(window.selectedServices) ? 
                        window.selectedServices.map(service => service.name).join(', ') : 
                        'Nenhum serviço selecionado',
                    totalPrice: document.getElementById('totalPrice') ? 
                        document.getElementById('totalPrice').textContent : 
                        'Valor não disponível'
                };
                
                // Verifica se há forma de pagamento selecionada
                const paymentMethodElement = document.querySelector('input[name="payment_method"]:checked');
                if (paymentMethodElement) {
                    planData.paymentMethod = paymentMethodElement.value;
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
                            planData.supportPeriod = 'Mensal';
                        } else if (periodValue === 'quarterly') {
                            planData.supportPeriod = 'Trimestral';
                        } else if (periodValue === 'yearly') {
                            planData.supportPeriod = 'Anual';
                        }
                    }
                }
                
                // Salva os dados no localStorage para recuperar na página de formulário
                localStorage.setItem('selectedPlanData', JSON.stringify(planData));
                
                // Redireciona para a página de formulário
                window.location.href = 'formulario-orcamento.html';
                
            } catch (error) {
                console.error("Erro ao processar dados do pacote:", error);
                alert("Ocorreu um erro ao processar seu pedido. Tente novamente ou entre em contato diretamente pelo WhatsApp (35) 99979-6570.");
            }
        });
    }
});
