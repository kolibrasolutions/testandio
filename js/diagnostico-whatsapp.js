document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('diagnosticForm');
    const sections = document.querySelectorAll('.section');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    
    // Variável global para armazenar problemas selecionados
    window.selectedProblems = [];
    
    // Mostrar uma seção específica
    function showSection(sectionNumber) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`section${sectionNumber}`).classList.add('active');
        
        // Atualizar a barra de progresso
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = (sectionNumber / sections.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
        
        // Rolar para o topo do formulário
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    // SOLUÇÃO RADICAL: Interceptar diretamente os checkboxes para capturar seleções
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Capturar todos os checkboxes selecionados
            captureSelectedProblems();
        });
    });
    
    // Função para capturar problemas selecionados
    function captureSelectedProblems() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        
        // Limpar array global
        window.selectedProblems = [];
        
        // Adicionar cada problema selecionado ao array global
        checkboxes.forEach((checkbox, index) => {
            const label = checkbox.nextElementSibling.textContent.trim();
            const value = checkbox.value;
            
            window.selectedProblems.push({
                index: index + 1,
                label: label,
                value: value
            });
        });
        
        console.log('Problemas capturados diretamente:', window.selectedProblems.length);
        
        // Salvar no localStorage também como backup
        if (window.selectedProblems.length > 0) {
            localStorage.setItem('selected_problems_direct', JSON.stringify(window.selectedProblems));
        }
    }
    
    // Botões de próximo
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = parseInt(this.getAttribute('data-next'));
            
            // Validar campos da seção atual antes de avançar
            const currentSection = parseInt(this.closest('.section').id.replace('section', ''));
            
            // Se estiver na seção 2 (problemas), capturar problemas selecionados
            if (currentSection === 2) {
                captureSelectedProblems();
                
                // Gerar itens de prioridade
                generatePriorityItems();
            }
            
            // Se estiver na seção 3 (priorização), gerar resumo
            if (currentSection === 3) {
                generateSummary();
            }
            
            // Mostrar próxima seção
            showSection(nextSection);
        });
    });
    
    // Botões de anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = parseInt(this.getAttribute('data-prev'));
            showSection(prevSection);
        });
    });
    
    // Gerar itens de prioridade
    function generatePriorityItems() {
        const priorityContainer = document.getElementById('priorityContainer');
        
        // Limpar o container
        priorityContainer.innerHTML = '';
        
        // Verificar se há problemas selecionados
        if (window.selectedProblems.length === 0) {
            priorityContainer.innerHTML = `
                <div class="text-center py-4">
                    <p>Selecione pelo menos um problema na etapa anterior.</p>
                </div>
            `;
            return;
        }
        
        // Criar um item para cada problema selecionado
        window.selectedProblems.forEach(problem => {
            const priorityItem = document.createElement('div');
            priorityItem.className = 'priority-item';
            
            // Recuperar prioridade salva, se existir
            const savedPriority = localStorage.getItem(`priority_${problem.value}`) || 'medium';
            
            priorityItem.innerHTML = `
                <div class="problem-item">
                    <div>
                        <h4>${problem.label}</h4>
                    </div>
                    <div>
                        <select class="form-select priority-select" id="priority_${problem.value}" data-problem="${problem.value}">
                            <option value="high" ${savedPriority === 'high' ? 'selected' : ''}>Alta Prioridade</option>
                            <option value="medium" ${savedPriority === 'medium' ? 'selected' : ''}>Média Prioridade</option>
                            <option value="low" ${savedPriority === 'low' ? 'selected' : ''}>Baixa Prioridade</option>
                        </select>
                    </div>
                </div>
            `;
            
            priorityContainer.appendChild(priorityItem);
        });
        
        // Adicionar event listeners para os selects de prioridade
        const prioritySelects = document.querySelectorAll('.priority-select');
        prioritySelects.forEach(select => {
            select.addEventListener('change', function() {
                const problemValue = this.getAttribute('data-problem');
                const priority = this.value;
                
                // Salvar a prioridade no localStorage
                localStorage.setItem(`priority_${problemValue}`, priority);
            });
        });
    }
    
    // Gerar resumo
    function generateSummary() {
        // Preencher informações da empresa e contato
        document.getElementById('summary_business').textContent = document.getElementById('businessName').value;
        document.getElementById('summary_contact').textContent = document.getElementById('contactName').value;
        
        // Preencher problemas prioritários
        const summaryProblems = document.getElementById('summary_problems');
        summaryProblems.innerHTML = '';
        
        // Usar a variável global para os problemas
        window.selectedProblems.forEach(problem => {
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
            
            const li = document.createElement('li');
            li.innerHTML = `${problem.label} - <span class="badge bg-${priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success'}">${priorityText}</span>`;
            summaryProblems.appendChild(li);
        });
    }
    
    // NOVA SOLUÇÃO: Adicionar botão para copiar mensagem e link para WhatsApp
    // Adicionar elementos de UI para a nova solução
    function addWhatsAppUI() {
        // Verificar se o formulário existe
        if (!form) return;
        
        // Verificar se o botão de envio existe
        const submitButton = document.getElementById('submitDiagnostico');
        if (!submitButton) return;
        
        // Substituir o botão de envio por um container com os novos botões
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'whatsapp-buttons';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        
        // Botão para copiar a mensagem
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'btn btn-primary';
        copyButton.id = 'copyMessageButton';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar Mensagem';
        
        // Botão para abrir o WhatsApp
        const whatsappButton = document.createElement('a');
        whatsappButton.href = `https://api.whatsapp.com/send?phone=5535999796570`;
        whatsappButton.className = 'btn btn-success';
        whatsappButton.id = 'openWhatsAppButton';
        whatsappButton.target = '_blank';
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i> Abrir WhatsApp';
        
        // Adicionar os botões ao container
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(whatsappButton);
        
        // Substituir o botão de envio pelo container
        submitButton.parentNode.replaceChild(buttonContainer, submitButton);
        
        // Adicionar event listener para o botão de copiar
        copyButton.addEventListener('click', function() {
            // Capturar problemas selecionados novamente para garantir
            captureSelectedProblems();
            
            // Formatar a mensagem para o WhatsApp
            const message = formatWhatsAppMessage(true); // true para obter a mensagem decodificada
            
            // Copiar a mensagem para a área de transferência
            copyToClipboard(message);
            
            // Mostrar feedback ao usuário
            alert('Mensagem copiada para a área de transferência! Agora clique em "Abrir WhatsApp" e cole a mensagem.');
        });
    }
    
    // Função para copiar texto para a área de transferência
    function copyToClipboard(text) {
        // Criar um elemento temporário
        const tempElement = document.createElement('textarea');
        tempElement.value = text;
        tempElement.setAttribute('readonly', '');
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);
        
        // Selecionar o texto
        tempElement.select();
        tempElement.setSelectionRange(0, 99999);
        
        // Copiar o texto
        document.execCommand('copy');
        
        // Remover o elemento temporário
        document.body.removeChild(tempElement);
    }
    
    // Configurar o formulário para enviar para WhatsApp
    if (form) {
        // Adicionar os novos botões
        addWhatsAppUI();
        
        // Manter o event listener original para compatibilidade
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Capturar problemas selecionados novamente para garantir
            captureSelectedProblems();
            
            // Formatar a mensagem para o WhatsApp
            const whatsappMessage = formatWhatsAppMessage();
            
            // Redirecionar para o WhatsApp
            redirectToWhatsApp(whatsappMessage);
        });
    }
    
    // Formatar a mensagem para o WhatsApp - ABORDAGEM DIRETA
    function formatWhatsAppMessage(decode = false) {
        console.log('Formatando mensagem com abordagem direta');
        
        let message = `*DIAGNÓSTICO DE PROBLEMAS - KOLIBRA SOLUTIONS*\n\n`;
        
        // Informações da empresa
        message += `*Informações da Empresa:*\n`;
        message += `Nome: ${document.getElementById('businessName').value}\n`;
        message += `Tipo: ${document.getElementById('businessType').value}\n`;
        message += `Tamanho: ${document.getElementById('businessSize').value}\n`;
        message += `Tempo de Existência: ${document.getElementById('businessTime').value}\n`;
        message += `Localização: ${document.getElementById('businessLocation').value}\n\n`;
        
        // Informações de contato
        message += `*Informações de Contato:*\n`;
        message += `Nome: ${document.getElementById('contactName').value}\n`;
        message += `E-mail: ${document.getElementById('contactEmail').value}\n`;
        message += `Telefone: ${document.getElementById('contactPhone').value}\n`;
        message += `Contato Preferido: ${document.getElementById('preferredContact').value}\n\n`;
        
        // Descrição do negócio
        message += `*Descrição do Negócio:*\n${document.getElementById('businessDescription').value}\n\n`;
        
        // Problemas e prioridades - ABORDAGEM DIRETA
        message += `*Problemas Prioritários:*\n`;
        
        // Verificar diretamente os checkboxes selecionados
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="problems[]"]:checked');
        
        if (checkboxes && checkboxes.length > 0) {
            console.log('Checkboxes selecionados no momento do envio:', checkboxes.length);
            
            checkboxes.forEach((checkbox, index) => {
                const label = checkbox.nextElementSibling.textContent.trim();
                const value = checkbox.value;
                
                // Recuperar a prioridade do localStorage
                const priority = localStorage.getItem(`priority_${value}`) || 'medium';
                let priorityText = '';
                
                if (priority === 'high') {
                    priorityText = 'Alta Prioridade';
                } else if (priority === 'low') {
                    priorityText = 'Baixa Prioridade';
                } else {
                    priorityText = 'Média Prioridade';
                }
                
                message += `${index + 1}. ${label} - ${priorityText}\n`;
            });
        } 
        // Verificar a variável global como backup
        else if (window.selectedProblems && window.selectedProblems.length > 0) {
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
        // Verificar localStorage como último recurso
        else {
            const savedProblems = localStorage.getItem('selected_problems_direct');
            if (savedProblems) {
                try {
                    const problems = JSON.parse(savedProblems);
                    console.log('Problemas recuperados do localStorage direto:', problems.length);
                    
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
                    console.error('Erro ao recuperar problemas do localStorage direto:', e);
                    message += `Nenhum problema selecionado.\n`;
                }
            } else {
                message += `Nenhum problema selecionado.\n`;
            }
        }
        
        message += `\n`;
        
        // Outros problemas
        const otherProblems = document.getElementById('otherProblems').value;
        if (otherProblems) {
            message += `*Outros Problemas:*\n${otherProblems}\n\n`;
        }
        
        message += `Enviado via Formulário de Diagnóstico - KOLIBRA SOLUTIONS`;
        
        console.log('Mensagem formatada com abordagem direta:', message);
        
        // Retornar a mensagem decodificada ou codificada conforme solicitado
        return decode ? message : encodeURIComponent(message);
    }
    
    // Redirecionar para o WhatsApp
    function redirectToWhatsApp(message) {
        // Número de telefone para onde a mensagem será enviada (formato internacional)
        const phoneNumber = '5535999796570';
        
        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        
        // Redirecionar para o WhatsApp
        window.location.href = whatsappURL;
    }
    
    // Inicializar o formulário
    showSection(1);
});
