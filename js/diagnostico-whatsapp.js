document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    const sections = document.querySelectorAll('.section');
    const progressBar = document.querySelector('.progress-bar');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const sectionSteps = document.querySelectorAll('.section-step');
    
    // Função para mostrar uma seção específica
    function showSection(sectionNumber) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`section${sectionNumber}`).classList.add('active');
        
        // Atualizar barra de progresso
        const progress = (sectionNumber / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        
        // Atualizar indicador de seção
        sectionSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepNumber === sectionNumber) {
                step.classList.add('active');
            } else if (stepNumber < sectionNumber) {
                step.classList.add('completed');
            }
        });
        
        // Rolar para o topo do formulário
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Variável global para armazenar os problemas selecionados
    window.selectedProblems = [];
    
    // Botões de próximo
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = parseInt(this.getAttribute('data-next'));
            
            // Validar campos da seção atual antes de avançar
            const currentSection = parseInt(this.closest('.section').id.replace('section', ''));
            if (validateSection(currentSection)) {
                
                // Se estiver na seção 2 (problemas), salvar problemas selecionados e gerar itens de prioridade
                if (currentSection === 2) {
                    // Salvar problemas selecionados no localStorage e na variável global
                    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
                    let problems = [];
                    
                    // Limpar a variável global
                    window.selectedProblems = [];
                    
                    checkboxes.forEach((checkbox, index) => {
                        const label = checkbox.nextElementSibling.textContent.trim();
                        const value = checkbox.value;
                        const problem = {
                            index: index + 1,
                            label: label,
                            value: value
                        };
                        
                        problems.push(problem);
                        
                        // Adicionar à variável global
                        window.selectedProblems.push(problem);
                    });
                    
                    // Salvar no localStorage para recuperação futura
                    if (problems.length > 0) {
                        localStorage.setItem('selected_problems', JSON.stringify(problems));
                        console.log('Problemas salvos no localStorage e variável global:', problems.length);
                        
                        // Salvar também em um campo oculto no formulário
                        const hiddenField = document.getElementById('hidden_problems') || document.createElement('input');
                        hiddenField.type = 'hidden';
                        hiddenField.id = 'hidden_problems';
                        hiddenField.name = 'hidden_problems';
                        hiddenField.value = JSON.stringify(problems);
                        
                        const form = document.getElementById('diagnosticForm');
                        if (form && !document.getElementById('hidden_problems')) {
                            form.appendChild(hiddenField);
                        }
                    }
                    
                    // Gerar itens de prioridade
                    generatePriorityItems();
                }
                
                // Se estiver na seção 3 (priorização), gerar resumo
                if (currentSection === 3) {
                    generateSummary();
                }
                
                // Pequeno atraso para garantir que o DOM seja atualizado
                setTimeout(() => {
                    showSection(nextSection);
                    
                    // Se estiver indo para a seção 3 (priorização), verificar se os itens foram gerados
                    if (nextSection === 3) {
                        const priorityContainer = document.getElementById('priorityContainer');
                        if (priorityContainer && priorityContainer.children.length <= 1) {
                            console.log('Forçando regeneração dos itens de prioridade');
                            generatePriorityItems();
                        }
                    }
                }, 100);
            }
        });
    });
    
    // Botões de anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = parseInt(this.getAttribute('data-prev'));
            showSection(prevSection);
        });
    });
    
    // Validação de seções
    function validateSection(sectionNumber) {
        const section = document.getElementById(`section${sectionNumber}`);
        const requiredFields = section.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        // Validações específicas por seção
        if (sectionNumber === 2) {
            const selectedProblems = section.querySelectorAll('input[type="checkbox"]:checked');
            if (selectedProblems.length === 0) {
                alert('Selecione pelo menos um problema para continuar.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Gerar itens de prioridade com base nos problemas selecionados
    function generatePriorityItems() {
        const priorityContainer = document.getElementById('priorityContainer');
        
        // Forçar uma nova busca por checkboxes marcados
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        console.log('Problemas selecionados:', checkboxes.length);
        
        // Verificação mais robusta para problemas selecionados
        if (!checkboxes || checkboxes.length === 0) {
            console.log('Nenhum problema selecionado, verificando localStorage');
            
            // Tentar recuperar problemas do localStorage como fallback
            const savedProblems = localStorage.getItem('selected_problems');
            if (savedProblems) {
                try {
                    const problems = JSON.parse(savedProblems);
                    if (problems && problems.length > 0) {
                        console.log('Problemas recuperados do localStorage:', problems.length);
                        renderPriorityItems(problems);
                        return;
                    }
                } catch (e) {
                    console.error('Erro ao recuperar problemas do localStorage:', e);
                }
            }
            
            // Se não encontrar problemas no localStorage, mostrar mensagem
            priorityContainer.innerHTML = `
                <div class="text-center py-4">
                    <p>Selecione pelo menos um problema na etapa anterior.</p>
                </div>
            `;
            return;
        }
        
        // Limpar o container
        priorityContainer.innerHTML = '';
        
        // Criar um array para armazenar os problemas
        let problems = [];
        
        // Coletar todos os problemas selecionados
        checkboxes.forEach((checkbox, index) => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            problems.push({
                index: index + 1,
                label: label,
                value: value
            });
        });
        
        // Salvar problemas no localStorage para recuperação futura
        localStorage.setItem('selected_problems', JSON.stringify(problems));
        
        // Renderizar os itens de prioridade
        renderPriorityItems(problems);
    }
    
    // Função auxiliar para renderizar os itens de prioridade
    function renderPriorityItems(problems) {
        const priorityContainer = document.getElementById('priorityContainer');
        priorityContainer.innerHTML = '';
        
        // Adicionar cada problema ao container
        problems.forEach((problem, index) => {
            const problemItem = document.createElement('div');
            problemItem.className = 'problem-item';
            
            // Garantir que o problema tenha um índice
            if (!problem.index) {
                problem.index = index + 1;
            }
            
            // Recuperar a prioridade salva anteriormente ou usar o valor padrão
            const savedPriority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
            
            problemItem.innerHTML = `
                <div>
                    <strong>${problem.index}. ${problem.label}</strong>
                </div>
                <div>
                    <select class="form-select priority-select" name="priority_${problem.value}" id="priority_${problem.value}">
                        <option value="high" ${savedPriority === 'high' ? 'selected' : ''}>Alta Prioridade</option>
                        <option value="medium" ${savedPriority === 'medium' ? 'selected' : ''}>Média Prioridade</option>
                        <option value="low" ${savedPriority === 'low' ? 'selected' : ''}>Baixa Prioridade</option>
                    </select>
                </div>
            `;
            
            priorityContainer.appendChild(problemItem);
        });
        
        // Adicionar evento de mudança para cada select de prioridade
        document.querySelectorAll('.priority-select').forEach(select => {
            select.addEventListener('change', function() {
                console.log('Prioridade alterada:', this.id, this.value);
                // Armazenar a prioridade selecionada
                localStorage.setItem(this.id, this.value);
            });
        });
    }
    
    // Gerar resumo do diagnóstico
    function generateSummary() {
        const summaryBusiness = document.getElementById('summary_business');
        const summaryContact = document.getElementById('summary_contact');
        const summaryProblems = document.getElementById('summary_problems');
        
        // Preencher informações da empresa
        const businessName = document.getElementById('businessName').value;
        const businessType = document.getElementById('businessType').value;
        summaryBusiness.textContent = `${businessName} (${businessType})`;
        
        // Preencher informações de contato
        const contactName = document.getElementById('contactName').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactPhone = document.getElementById('contactPhone').value;
        summaryContact.textContent = `${contactName} - ${contactEmail} - ${contactPhone}`;
        
        // Preencher problemas prioritários
        summaryProblems.innerHTML = '';
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            
            // Verificar primeiro no localStorage para garantir que estamos usando o valor mais atualizado
            let priority = localStorage.getItem(`priority_${value}`);
            let priorityText = '';
            
            // Se não encontrar no localStorage, tentar obter do select
            if (!priority && document.getElementById(`priority_${value}`)) {
                const prioritySelect = document.getElementById(`priority_${value}`);
                priority = prioritySelect.value;
                priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;
            } else {
                // Determinar o texto da prioridade com base no valor
                if (priority === 'high') {
                    priorityText = 'Alta Prioridade';
                } else if (priority === 'low') {
                    priorityText = 'Baixa Prioridade';
                } else {
                    // Valor padrão é médio
                    priority = 'medium';
                    priorityText = 'Média Prioridade';
                }
            }
            
            const li = document.createElement('li');
            li.innerHTML = `${label} - <span class="badge bg-${priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success'}">${priorityText}</span>`;
            summaryProblems.appendChild(li);
        });
    }
    
    // Configurar o formulário para enviar para WhatsApp
    const form = document.getElementById('diagnosticForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar o formulário
            if (!validateForm()) {
                return false;
            }
            
            // Verificar diretamente os checkboxes antes do envio
            const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
            if (checkboxes && checkboxes.length > 0) {
                console.log('Checkboxes selecionados no momento do envio:', checkboxes.length);
                
                // Atualizar a variável global
                window.selectedProblems = [];
                
                checkboxes.forEach((checkbox, index) => {
                    const label = checkbox.nextElementSibling.textContent.trim();
                    const value = checkbox.value;
                    window.selectedProblems.push({
                        index: index + 1,
                        label: label,
                        value: value
                    });
                });
                
                // Atualizar o campo oculto
                const hiddenField = document.getElementById('hidden_problems') || document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.id = 'hidden_problems';
                hiddenField.name = 'hidden_problems';
                hiddenField.value = JSON.stringify(window.selectedProblems);
                
                if (!document.getElementById('hidden_problems')) {
                    form.appendChild(hiddenField);
                }
                
                console.log('Problemas atualizados no momento do envio:', window.selectedProblems.length);
            }
            
            // Verificar se há problemas selecionados no localStorage
            const savedProblems = localStorage.getItem('selected_problems');
            console.log('Problemas salvos no localStorage antes do envio:', savedProblems);
            
            // Obter os dados do formulário
            const formData = getFormData();
            
            // Verificação adicional para garantir que os problemas sejam incluídos
            if (formData.problems.length === 0 && window.selectedProblems && window.selectedProblems.length > 0) {
                console.log('Usando problemas da variável global para o envio:', window.selectedProblems.length);
                
                // Adicionar problemas da variável global ao formData
                window.selectedProblems.forEach(problem => {
                    formData.problems.push(problem);
                    
                    // Recuperar a prioridade do localStorage
                    const priority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
                    let priorityText = '';
                    
                    if (priority === 'high') {
                        priorityText = 'Alta Prioridade';
                    } else if (priority === 'low') {
                        priorityText = 'Baixa Prioridade';
                    } else {
                        priorityText = 'Média Prioridade';
                    }
                    
                    formData.priorities.push({
                        problem: problem.label,
                        priority: priority,
                        priorityText: priorityText
                    });
                });
            }
            
            console.log('Dados do formulário para envio:', JSON.stringify(formData));
            
            // Formatar a mensagem para o WhatsApp
            const whatsappMessage = formatWhatsAppMessage(formData);
            
            // Redirecionar para o WhatsApp
            redirectToWhatsApp(whatsappMessage);
        });
    }
    
    // Validar o formulário completo
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
        
        return isValid;
    }
    
    // Obter os dados do formulário
    function getFormData() {
        const formData = {
            businessName: document.getElementById('businessName').value,
            businessType: document.getElementById('businessType').value,
            businessSize: document.getElementById('businessSize').value,
            businessTime: document.getElementById('businessTime').value,
            contactName: document.getElementById('contactName').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            businessLocation: document.getElementById('businessLocation').value,
            businessDescription: document.getElementById('businessDescription').value,
            problems: [],
            otherProblems: document.getElementById('otherProblems').value,
            priorities: [],
            preferredContact: document.getElementById('preferredContact').value
        };
        
        // Obter problemas selecionados
        const problemCheckboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        problemCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            formData.problems.push({
                label: label,
                value: value
            });
        });
        
        // Obter prioridades
        formData.problems.forEach(problem => {
            // Verificar primeiro no localStorage para garantir que estamos usando o valor mais atualizado
            let priority = localStorage.getItem(`priority_${problem.value}`);
            let priorityText = '';
            
            // Se não encontrar no localStorage, tentar obter do select
            if (!priority && document.getElementById(`priority_${problem.value}`)) {
                const prioritySelect = document.getElementById(`priority_${problem.value}`);
                priority = prioritySelect.value;
                priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;
            } else {
                // Determinar o texto da prioridade com base no valor
                if (priority === 'high') {
                    priorityText = 'Alta Prioridade';
                } else if (priority === 'low') {
                    priorityText = 'Baixa Prioridade';
                } else {
                    // Valor padrão é médio
                    priority = 'medium';
                    priorityText = 'Média Prioridade';
                }
            }
            
            formData.priorities.push({
                problem: problem.label,
                priority: priority,
                priorityText: priorityText
            });
        });
        
        return formData;
    }
    
    // Formatar a mensagem para o WhatsApp
    function formatWhatsAppMessage(data) {
        console.log('Formatando mensagem para WhatsApp com dados:', JSON.stringify(data));
        
        let message = `*DIAGNÓSTICO DE PROBLEMAS - KOLIBRA SOLUTIONS*\n\n`;
        
        // Informações da empresa
        message += `*Informações da Empresa:*\n`;
        message += `Nome: ${data.businessName}\n`;
        message += `Tipo: ${data.businessType}\n`;
        message += `Tamanho: ${data.businessSize}\n`;
        message += `Tempo de Existência: ${data.businessTime}\n`;
        message += `Localização: ${data.businessLocation}\n\n`;
        
        // Informações de contato
        message += `*Informações de Contato:*\n`;
        message += `Nome: ${data.contactName}\n`;
        message += `E-mail: ${data.contactEmail}\n`;
        message += `Telefone: ${data.contactPhone}\n`;
        message += `Contato Preferido: ${data.preferredContact}\n\n`;
        
        // Descrição do negócio
        message += `*Descrição do Negócio:*\n${data.businessDescription}\n\n`;
        
        // Problemas e prioridades
        message += `*Problemas Prioritários:*\n`;
        
        // Verificar a variável global primeiro (abordagem mais direta)
        if (window.selectedProblems && window.selectedProblems.length > 0) {
            console.log('Usando problemas da variável global:', window.selectedProblems.length);
            
            window.selectedProblems.forEach((problem, index) => {
                // Recuperar a prioridade do localStorage
                const priority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
                let priorityText = '';
                
                if (priority === 'high') {
                    priorityText = 'Alta Prioridade';
                } else if (priority === 'low') {
                    priorityText = 'Baixa Prioridade';
                } else {
                    priorityText = 'Média Prioridade';
                }
                
                message += `${index + 1}. ${problem.label} - ${priorityText}\n`;
            });
        }
        // Verificar campo oculto no formulário
        else if (document.getElementById('hidden_problems')) {
            try {
                const hiddenProblems = JSON.parse(document.getElementById('hidden_problems').value);
                console.log('Usando problemas do campo oculto:', hiddenProblems.length);
                
                if (hiddenProblems && hiddenProblems.length > 0) {
                    hiddenProblems.forEach((problem, index) => {
                        // Recuperar a prioridade do localStorage
                        const priority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
                        let priorityText = '';
                        
                        if (priority === 'high') {
                            priorityText = 'Alta Prioridade';
                        } else if (priority === 'low') {
                            priorityText = 'Baixa Prioridade';
                        } else {
                            priorityText = 'Média Prioridade';
                        }
                        
                        message += `${index + 1}. ${problem.label} - ${priorityText}\n`;
                    });
                } else {
                    message += `Nenhum problema selecionado.\n`;
                }
            } catch (e) {
                console.error('Erro ao recuperar problemas do campo oculto:', e);
                message += `Nenhum problema selecionado.\n`;
            }
        }
        // Verificar se há problemas nas prioridades já coletadas
        else if (data.priorities.length > 0) {
            console.log('Usando prioridades já coletadas:', data.priorities.length);
            
            // Usar as prioridades já coletadas
            data.priorities.forEach((item, index) => {
                message += `${index + 1}. ${item.problem} - ${item.priorityText}\n`;
            });
        }
        // Verificar localStorage como último recurso
        else {
            console.log('Verificando localStorage como último recurso');
            
            // Tentar recuperar problemas do localStorage
            const savedProblems = localStorage.getItem('selected_problems');
            if (savedProblems) {
                try {
                    const problems = JSON.parse(savedProblems);
                    console.log('Problemas recuperados do localStorage:', problems.length);
                    
                    if (problems && problems.length > 0) {
                        problems.forEach((problem, index) => {
                            // Recuperar a prioridade do localStorage
                            const priority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
                            let priorityText = '';
                            
                            if (priority === 'high') {
                                priorityText = 'Alta Prioridade';
                            } else if (priority === 'low') {
                                priorityText = 'Baixa Prioridade';
                            } else {
                                priorityText = 'Média Prioridade';
                            }
                            
                            message += `${index + 1}. ${problem.label} - ${priorityText}\n`;
                        });
                    } else {
                        message += `Nenhum problema selecionado.\n`;
                    }
                } catch (e) {
                    console.error('Erro ao recuperar problemas do localStorage:', e);
                    message += `Nenhum problema selecionado.\n`;
                }
            } else {
                // Último recurso: verificar checkboxes diretamente
                const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
                if (checkboxes && checkboxes.length > 0) {
                    console.log('Verificando checkboxes diretamente:', checkboxes.length);
                    
                    checkboxes.forEach((checkbox, index) => {
                        const label = checkbox.nextElementSibling.textContent.trim();
                        const value = checkbox.value;
                        
                        // Prioridade padrão
                        message += `${index + 1}. ${label} - Média Prioridade\n`;
                    });
                } else {
                    message += `Nenhum problema selecionado.\n`;
                }
            }
        }
        
        message += `\n`;
        
        // Outros problemas
        if (data.otherProblems) {
            message += `*Outros Problemas:*\n${data.otherProblems}\n\n`;
        }
        
        message += `Enviado via Formulário de Diagnóstico - KOLIBRA SOLUTIONS`;
        
        console.log('Mensagem formatada:', message);
        return encodeURIComponent(message);
    }
    
    // Redirecionar para o WhatsApp
    function redirectToWhatsApp(message) {
        // Número de telefone para onde a mensagem será enviada (formato internacional)
        const phoneNumber = '5535999796570'; // Número atualizado conforme solicitado
        
        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        
        // Redirecionar para o WhatsApp
        window.location.href = whatsappURL;
    }
});
