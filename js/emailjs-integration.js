// Implementação completa do EmailJS para formulários da Kolibra Solutions
document.addEventListener('DOMContentLoaded', function() {
    // Carregar o script do EmailJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = function() {
        // Inicializar EmailJS com a chave pública real
        emailjs.init("Dn5Wy_Nh9Tn-Gg_Vc");
        
        // Verificar se estamos em uma página com formulário
        const forms = document.querySelectorAll('form');
        
        if (forms.length > 0) {
            forms.forEach(form => {
                // Verificar se o formulário usa FormSubmit.co ou php/enviar.php
                if ((form.action && form.action.includes('formsubmit.co')) || 
                    (form.action && form.action.includes('php/enviar.php'))) {
                    
                    // Identificar qual formulário é para personalizar o template
                    let templateId = "template_kolibra_default";
                    let serviceId = "service_kolibra";
                    // E-mail do destinatário - direto para o e-mail do usuário
                    let toEmail = "kolibrasolutions@gmail.com";
                    
                    // Verificar se é o formulário "Potencialize seu Negócio"
                    if (form.id === "problemsForm" || 
                        (form.querySelector('h1') && form.querySelector('h1').textContent.includes("Potencialize"))) {
                        templateId = "template_kolibra_potencialize";
                        // Adicionar classe para identificação
                        form.classList.add('potencialize-form');
                    } else if (form.id === "quoteForm" || form.classList.contains('quote-form')) {
                        templateId = "template_kolibra_orcamento";
                        // Adicionar classe para identificação
                        form.classList.add('orcamento-form');
                    } else if (form.id === "orderForm") {
                        templateId = "template_kolibra_pedido";
                        // Adicionar classe para identificação
                        form.classList.add('pedido-form');
                    }
                    
                    // Substituir a ação do formulário
                    form.setAttribute('data-original-action', form.action);
                    form.action = "javascript:void(0);";
                    
                    // Adicionar evento de envio
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        // Mostrar indicador de carregamento
                        const submitBtn = form.querySelector('button[type="submit"]');
                        const originalText = submitBtn ? submitBtn.textContent : "Enviar";
                        if (submitBtn) {
                            submitBtn.disabled = true;
                            submitBtn.textContent = "Enviando...";
                        }
                        
                        // Criar objeto com os dados do formulário
                        const formData = {};
                        const formElements = Array.from(form.elements);
                        
                        formElements.forEach(element => {
                            if (element.name && element.name !== "" && element.name.charAt(0) !== '_') {
                                if (element.type === 'checkbox') {
                                    if (element.checked) {
                                        if (formData[element.name]) {
                                            if (Array.isArray(formData[element.name])) {
                                                formData[element.name].push(element.value);
                                            } else {
                                                formData[element.name] = [formData[element.name], element.value];
                                            }
                                        } else {
                                            formData[element.name] = element.value;
                                        }
                                    }
                                } else if (element.type === 'radio') {
                                    if (element.checked) {
                                        formData[element.name] = element.value;
                                    }
                                } else if (element.name) {
                                    formData[element.name] = element.value;
                                }
                            }
                        });
                        
                        // Adicionar informações adicionais
                        formData.form_name = form.id || "Formulário do site";
                        formData.page_url = window.location.href;
                        formData.date_time = new Date().toLocaleString();
                        formData.to_email = toEmail; // Adicionar e-mail do destinatário
                        
                        // Adicionar nome do formulário para identificação no e-mail
                        if (form.id === "problemsForm") {
                            formData.form_title = "Formulário Potencialize seu Negócio";
                        } else if (form.id === "quoteForm") {
                            formData.form_title = "Formulário de Orçamento";
                        } else if (form.id === "orderForm") {
                            formData.form_title = "Formulário de Pedido";
                        } else {
                            formData.form_title = "Formulário do site Kolibra Solutions";
                        }
                        
                        // Enviar e-mail usando EmailJS
                        emailjs.send(serviceId, templateId, formData)
                            .then(function(response) {
                                console.log('E-mail enviado com sucesso!', response);
                                
                                // Redirecionar para página de agradecimento
                                let redirectUrl = "obrigado.html";
                                const nextField = form.querySelector('input[name="_next"]');
                                if (nextField && nextField.value) {
                                    redirectUrl = nextField.value;
                                }
                                
                                window.location.href = redirectUrl;
                            })
                            .catch(function(error) {
                                console.error('Erro ao enviar e-mail:', error);
                                
                                // Restaurar botão
                                if (submitBtn) {
                                    submitBtn.disabled = false;
                                    submitBtn.textContent = originalText;
                                }
                                
                                // Mostrar mensagem de erro
                                alert("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde ou entre em contato diretamente pelo e-mail kolibrasolutions@gmail.com");
                            });
                    });
                    
                    // Adicionar validação de formulário
                    form.addEventListener('submit', function(e) {
                        // Verificar campos obrigatórios
                        const requiredFields = form.querySelectorAll('[required]');
                        let isValid = true;
                        
                        requiredFields.forEach(field => {
                            if (!field.value.trim()) {
                                isValid = false;
                                field.classList.add('invalid');
                                
                                // Adicionar estilo para campos inválidos se não existir
                                if (!document.getElementById('validation-styles')) {
                                    const style = document.createElement('style');
                                    style.id = 'validation-styles';
                                    style.textContent = `
                                        .invalid {
                                            border-color: #ff3860 !important;
                                            box-shadow: 0 0 0 2px rgba(255, 56, 96, 0.1) !important;
                                        }
                                    `;
                                    document.head.appendChild(style);
                                }
                            } else {
                                field.classList.remove('invalid');
                            }
                        });
                        
                        if (!isValid) {
                            e.preventDefault();
                            alert('Por favor, preencha todos os campos obrigatórios.');
                            return false;
                        }
                    });
                }
            });
        }
    };
});
