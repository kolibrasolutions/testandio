// Função para corrigir problemas de formulários
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma página com formulário
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            // Verificar se o formulário usa FormSubmit.co
            if (form.action && form.action.includes('formsubmit.co')) {
                // Adicionar campo _captcha para evitar spam
                if (!form.querySelector('input[name="_captcha"]')) {
                    const captchaField = document.createElement('input');
                    captchaField.type = 'hidden';
                    captchaField.name = '_captcha';
                    captchaField.value = 'false';
                    form.appendChild(captchaField);
                }
                
                // Adicionar campo _autoresponse para confirmação automática
                if (!form.querySelector('input[name="_autoresponse"]')) {
                    const autoResponseField = document.createElement('input');
                    autoResponseField.type = 'hidden';
                    autoResponseField.name = '_autoresponse';
                    autoResponseField.value = 'Obrigado por entrar em contato com a Kolibra Solutions! Recebemos sua mensagem e retornaremos em breve.';
                    form.appendChild(autoResponseField);
                }
                
                // Garantir que o campo _next esteja correto
                const nextField = form.querySelector('input[name="_next"]');
                if (nextField) {
                    // Atualizar para URL absoluta se necessário
                    if (!nextField.value.startsWith('http')) {
                        nextField.value = 'https://kolibrasolutions.vercel.app/obrigado.html';
                    }
                } else {
                    // Adicionar campo _next se não existir
                    const newNextField = document.createElement('input');
                    newNextField.type = 'hidden';
                    newNextField.name = '_next';
                    newNextField.value = 'https://kolibrasolutions.vercel.app/obrigado.html';
                    form.appendChild(newNextField);
                }
                
                // Adicionar campo _template para usar template padrão do FormSubmit
                if (!form.querySelector('input[name="_template"]')) {
                    const templateField = document.createElement('input');
                    templateField.type = 'hidden';
                    templateField.name = '_template';
                    templateField.value = 'table';
                    form.appendChild(templateField);
                }
                
                // Adicionar campo _replyto para garantir que o e-mail de resposta seja configurado corretamente
                const emailField = form.querySelector('input[type="email"]');
                if (emailField && !form.querySelector('input[name="_replyto"]')) {
                    const replyToField = document.createElement('input');
                    replyToField.type = 'hidden';
                    replyToField.name = '_replyto';
                    // Usar o ID do campo de e-mail para vincular dinamicamente
                    const emailId = emailField.id;
                    
                    // Adicionar um ouvinte para atualizar o campo _replyto quando o e-mail for preenchido
                    emailField.addEventListener('input', function() {
                        replyToField.value = this.value;
                    });
                    
                    form.appendChild(replyToField);
                }
                
                // Corrigir problemas com arrays em checkboxes
                const checkboxArrays = form.querySelectorAll('input[type="checkbox"][name$="[]"]');
                if (checkboxArrays.length > 0) {
                    checkboxArrays.forEach(checkbox => {
                        // Remover os colchetes do nome para evitar problemas com o FormSubmit
                        const originalName = checkbox.name;
                        const newName = originalName.replace('[]', '');
                        checkbox.name = newName;
                    });
                }
                
                // Adicionar validação de formulário antes do envio
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
                    
                    // Adicionar todos os valores de checkbox como uma string única
                    const checkboxGroups = {};
                    form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                        if (!checkboxGroups[checkbox.name]) {
                            checkboxGroups[checkbox.name] = [];
                        }
                        checkboxGroups[checkbox.name].push(checkbox.value);
                    });
                    
                    // Criar campos ocultos para cada grupo de checkboxes
                    for (const [name, values] of Object.entries(checkboxGroups)) {
                        // Verificar se já existe um campo oculto para este grupo
                        const existingField = form.querySelector(`input[type="hidden"][name="${name}_values"]`);
                        if (existingField) {
                            existingField.value = values.join(', ');
                        } else {
                            const hiddenField = document.createElement('input');
                            hiddenField.type = 'hidden';
                            hiddenField.name = `${name}_values`;
                            hiddenField.value = values.join(', ');
                            form.appendChild(hiddenField);
                        }
                    }
                    
                    // Adicionar um campo com todas as informações do formulário em formato legível
                    const formSummary = document.createElement('input');
                    formSummary.type = 'hidden';
                    formSummary.name = 'form_summary';
                    
                    let summaryText = 'Resumo do formulário:\n\n';
                    
                    // Coletar todos os campos visíveis com seus rótulos
                    form.querySelectorAll('.form-group').forEach(group => {
                        const label = group.querySelector('label');
                        if (label) {
                            const labelText = label.textContent.trim();
                            const inputField = group.querySelector('input, select, textarea');
                            
                            if (inputField) {
                                let value = '';
                                
                                if (inputField.type === 'checkbox' || inputField.type === 'radio') {
                                    // Para checkbox e radio, verificar se está marcado
                                    const checkedItems = group.querySelectorAll('input:checked');
                                    const values = Array.from(checkedItems).map(item => item.value);
                                    value = values.join(', ');
                                } else {
                                    value = inputField.value;
                                }
                                
                                if (value) {
                                    summaryText += `${labelText}: ${value}\n`;
                                }
                            }
                        }
                    });
                    
                    formSummary.value = summaryText;
                    form.appendChild(formSummary);
                });
            }
        });
    }
});
